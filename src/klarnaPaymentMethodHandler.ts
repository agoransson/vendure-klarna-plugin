import { 
    PaymentMethodHandler,
    CreatePaymentResult,
    RequestContext,
    Order,
    PaymentMetadata,
    Logger,
    SettlePaymentResult,
    SettlePaymentErrorResult,
    Payment,
    Injector,
    EntityHydrator
} from '@vendure/core';
import { Locale } from '@agoransson/klarna-payments';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { PaymentMethodArgsHash } from './types';
import { getGateway } from './Common';
import { loggerCtx } from '.';
import { convertToKlarnaAddress, generateOrderLines } from './Helpers';

enum OrderState {
    Authorized = "Authorized",
    Settled = "Settled"
}

let entityHydrator: EntityHydrator;

/**
 * The handler for Klarna payments.
 */
export const klarnaPaymentMethodHandler: PaymentMethodHandler = new PaymentMethodHandler({
    code: 'klarna-payments-provider',
    description: [{ languageCode: LanguageCode.en, value: 'Klarna Payments Provider' }],
    args: {
        isLive: {
            type: 'boolean',
        },
        region: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'klarna_region' }],
        },
        username: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'klarna_username' }],
        },
        password: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'klarna_password' }],
        },
        purchase_country: {
            type: 'string',
            label: [{ languageCode: LanguageCode.en, value: 'klarna_purchase_country' }],
        },
    },

    init: (injector: Injector) => {
        entityHydrator = injector.get(EntityHydrator);
    },

    // export declare type CreatePaymentFn<T extends ConfigArgs> = (ctx: RequestContext, order: Order, amount: number, args: ConfigArgValues<T>, metadata: PaymentMetadata) => CreatePaymentResult | CreatePaymentErrorResult | Promise<CreatePaymentResult | CreatePaymentErrorResult>;

    createPayment: async (ctx: RequestContext, order: Order, amount: number, args: PaymentMethodArgsHash, metadata: PaymentMetadata): Promise<CreatePaymentResult> => {
        await entityHydrator.hydrate(ctx, order, { relations: ['shippingLines.shippingMethod']});

        const gateway = getGateway(args);

        Logger.debug('createPayment() invoked', loggerCtx);
        
        try {
            const data = {
                locale: Locale.sv_SE,

                order_amount: order.totalWithTax,
                order_tax_amount: order.totalWithTax - order.total,
                order_lines: generateOrderLines(order.lines, order.shippingLines),
                purchase_country: args.purchase_country as string,
                purchase_currency: order.currencyCode,
                billing_address: convertToKlarnaAddress(order.shippingAddress),
                shipping_address: convertToKlarnaAddress(order.shippingAddress)
            };

            Logger.debug(JSON.stringify(data, null, 2), loggerCtx);

            const klarnaResponse = await gateway.v100.sessions.createCreditSession(data);

            Logger.debug(JSON.stringify(klarnaResponse, null, 2), loggerCtx);

            return {
                amount: order.total,
                state: OrderState.Authorized,
                transactionId: klarnaResponse.session_id,
                metadata: {
                    public: {
                        clientToken: klarnaResponse.client_token,
                        payment_method_categories: klarnaResponse.payment_method_categories,
                    }
                },
            };
        } catch (error) {

            Logger.debug(JSON.stringify(error, null, 2), loggerCtx);

            return {
                amount: order.total,
                state: "Declined",
                metadata: {
                    errorMessage: error.message
                }
            };
        }
    },

    // export declare type SettlePaymentFn<T extends ConfigArgs> = (ctx: RequestContext, order: Order, payment: Payment, args: ConfigArgValues<T>) => SettlePaymentResult | SettlePaymentErrorResult | Promise<SettlePaymentResult | SettlePaymentErrorResult>;

    settlePayment: async (ctx: RequestContext, order: Order, payment: Payment, args: PaymentMethodArgsHash): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {
        const gateway = getGateway(args);

        Logger.debug('Settle payment', loggerCtx);
        Logger.debug(JSON.stringify(order, null, 2), loggerCtx);
        Logger.debug(JSON.stringify(payment, null, 2), loggerCtx);
        Logger.debug(JSON.stringify(args, null, 2), loggerCtx);

        try {
            const klarnaResponse = await gateway.v100.orders.createOrder("" /* TODO: Read auth token from args? */ , {
                locale: Locale.sv_SE,
                order_amount: order.total,
                order_lines: order.lines.map((value) => (
                    {
                        name: value.productVariant.name,
                        quantity: value.quantity,
                        total_amount: value.linePrice,
                        unit_price: value.unitPrice
                    }
                )),
                purchase_country: args.purchase_country as string,
                purchase_currency: order.currencyCode
            });

            if (klarnaResponse.fraud_status === "ACCEPTED") {
                return { 
                    success: true,
                    metadata: {
                        public: {
                            redirectUrl: klarnaResponse.redirect_url,
                            orderId: klarnaResponse.order_id
                        }
                    }
                };
            } else {
                return {
                    success: false,
                    errorMessage: "PENDING"
                };
            }
        } catch (err) {
            return {
                success: false,
                errorMessage: err.message,
            };
        }
    }
});