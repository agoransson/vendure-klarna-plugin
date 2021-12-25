import { PaymentMethodArgsHash } from "./types";
import { Klarna } from '@agoransson/klarna-payments';

export function getGateway(args: PaymentMethodArgsHash) {
    return new Klarna({
        config: {
            region: args.region,
            isLive: args.isLive,
            username: args.username,
            password: args.password,
        }
    });
}
