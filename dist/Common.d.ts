import { PaymentMethodArgsHash } from "./types";
import { Klarna } from '@agoransson/klarna-payments';
export declare function getGateway(args: PaymentMethodArgsHash): Klarna;
