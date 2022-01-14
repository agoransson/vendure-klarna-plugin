"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.klarnaPaymentMethodHandler = void 0;
const core_1 = require("@vendure/core");
const klarna_payments_1 = require("@agoransson/klarna-payments");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const Common_1 = require("./Common");
const _1 = require(".");
/**
 * The handler for Klarna payments.
 */
exports.klarnaPaymentMethodHandler = new core_1.PaymentMethodHandler({
    code: 'klarna-payments-provider',
    description: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Klarna Payments Provider' }],
    args: {
        isLive: {
            type: 'boolean',
        },
        region: {
            type: 'string',
            label: [{ languageCode: generated_types_1.LanguageCode.en, value: 'klarna_region' }],
        },
        username: {
            type: 'string',
            label: [{ languageCode: generated_types_1.LanguageCode.en, value: 'klarna_username' }],
        },
        password: {
            type: 'string',
            label: [{ languageCode: generated_types_1.LanguageCode.en, value: 'klarna_password' }],
        },
    },
    // export declare type CreatePaymentFn<T extends ConfigArgs> = (ctx: RequestContext, order: Order, amount: number, args: ConfigArgValues<T>, metadata: PaymentMetadata) => CreatePaymentResult | CreatePaymentErrorResult | Promise<CreatePaymentResult | CreatePaymentErrorResult>;
    createPayment: (ctx, order, amount, args, metadata) => __awaiter(void 0, void 0, void 0, function* () {
        const gateway = (0, Common_1.getGateway)(args);
        console.log('Create payment....');
        // console.log(order)
        // console.log(amount)
        // console.log(args)
        // console.log(metadata)
        try {
            const data = {
                locale: klarna_payments_1.Locale.sv_SE,
                order_amount: order.total,
                order_lines: order.lines.map((value) => ({
                    name: value.productVariant.name,
                    quantity: value.quantity,
                    total_amount: value.linePrice,
                    unit_price: value.unitPrice
                })),
                purchase_country: order.billingAddress.countryCode,
                purchase_currency: order.currencyCode
            };
            console.log(data);
            const klarnaResponse = yield gateway.v100.sessions.createCreditSession(data);
            core_1.Logger.verbose(JSON.stringify(klarnaResponse, null, 2), _1.loggerCtx);
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
        }
        catch (error) {
            core_1.Logger.verbose(JSON.stringify(error, null, 2), _1.loggerCtx);
            return {
                amount: order.total,
                state: "Declined",
                metadata: {
                    errorMessage: error.message
                }
            };
        }
    }),
    // export declare type SettlePaymentFn<T extends ConfigArgs> = (ctx: RequestContext, order: Order, payment: Payment, args: ConfigArgValues<T>) => SettlePaymentResult | SettlePaymentErrorResult | Promise<SettlePaymentResult | SettlePaymentErrorResult>;
    settlePayment: (ctx, order, payment, args) => __awaiter(void 0, void 0, void 0, function* () {
        const gateway = (0, Common_1.getGateway)(args);
        console.log('Settle payment....');
        console.log(order);
        console.log(payment);
        console.log(args);
        try {
            const klarnaResponse = yield gateway.v100.orders.createOrder("" /* TODO: Read auth token from args? */, {
                locale: klarna_payments_1.Locale.sv_SE,
                order_amount: order.total,
                order_lines: order.lines.map((value) => ({
                    name: value.productVariant.name,
                    quantity: value.quantity,
                    total_amount: value.linePrice,
                    unit_price: value.unitPrice
                })),
                purchase_country: order.billingAddress.countryCode,
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
            }
            else {
                return {
                    success: false,
                    errorMessage: "PENDING"
                };
            }
        }
        catch (err) {
            return {
                success: false,
                errorMessage: err.message,
            };
        }
    })
});
//# sourceMappingURL=klarnaPaymentMethodHandler.js.map