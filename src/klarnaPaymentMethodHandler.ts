import { 
    PaymentMethodHandler,
    CreatePaymentResult,
    RequestContext,
    Order,
    PaymentMetadata,
    Logger,
    SettlePaymentResult,
    SettlePaymentErrorResult,
    Payment
} from '@vendure/core';
import { Locale } from '@agoransson/klarna-payments';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { PaymentMethodArgsHash } from './types';
import { getGateway } from './Common';
/**
 * The handler for Klarna payments.
 */
export const klarnaPaymentMethodHandler = new PaymentMethodHandler({
    code: 'klarna-payments-provider',
    description: [{ languageCode: LanguageCode.en, value: 'Klarna Payments Provider' }],
    args: {        
        isLive: { type: 'boolean' },
        region: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' }
    },

    // export declare type CreatePaymentFn<T extends ConfigArgs> = (ctx: RequestContext, order: Order, amount: number, args: ConfigArgValues<T>, metadata: PaymentMetadata) => CreatePaymentResult | CreatePaymentErrorResult | Promise<CreatePaymentResult | CreatePaymentErrorResult>;

    createPayment: async (ctx: RequestContext, order: Order, amount: number, args: PaymentMethodArgsHash, metadata: PaymentMetadata): Promise<CreatePaymentResult> => {
        const gateway = getGateway(args);

        console.log('Create payment....')
        console.log(order)
        console.log(amount)
        console.log(args)
        console.log(metadata)

        try {
            const klarnaResponse = await gateway.v100.sessions.createCreditSession({
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
                purchase_country: order.billingAddress.country,
                purchase_currency: order.currencyCode
            });

            return {
                amount: order.total,
                state: args.automaticCapture ? "Settled" : "Authorized",
                transactionId: klarnaResponse.session_id,
                metadata: {
                    public: {
                        clientToken: klarnaResponse.client_token
                    }
                },
            };
        } catch (error) {
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

        console.log('Settle payment....')
        console.log(order)
        console.log(payment)
        console.log(args)

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
                purchase_country: order.billingAddress.country,
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