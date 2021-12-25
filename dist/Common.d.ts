import { PaymentMethodArgsHash } from "./types";
import { Payments } from '@agoransson/klarna-payments';
export declare function getGateway(args: PaymentMethodArgsHash): Payments;
