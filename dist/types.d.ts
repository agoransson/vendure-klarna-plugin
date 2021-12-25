import { ConfigArgValues } from '@vendure/core/dist/common/configurable-operation';
import { klarnaPaymentMethodHandler } from './klarnaPaymentMethodHandler';
export declare type KlarnaConfigArgs = {
    isLive: boolean;
    region: string;
    username: string;
    password: string;
};
export declare type PaymentMethodArgsHash = ConfigArgValues<typeof klarnaPaymentMethodHandler['args']>;
