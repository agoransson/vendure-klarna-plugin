import { ConfigArgValues } from '@vendure/core/dist/common/configurable-operation';
import { klarnaPaymentMethodHandler } from './klarnaPaymentMethodHandler';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type PaymentMethodArgsHash = ConfigArgValues<typeof klarnaPaymentMethodHandler['args']>;
