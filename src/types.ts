import { ConfigArgValues } from '@vendure/core/dist/common/configurable-operation';
import { klarnaPaymentMethodHandler } from './klarnaPaymentMethodHandler';

export type KlarnaConfigArgs = {
    isLive: boolean;
    region: string;
    username: string;
    password: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type PaymentMethodArgsHash = ConfigArgValues<typeof klarnaPaymentMethodHandler['args']>;
