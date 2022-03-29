import { PaymentMethodArgsHash } from "./types";
import { Payments } from '@agoransson/klarna-payments';
import { getRegion } from "@agoransson/klarna-payments/dist/utils";
import { Logger } from "@vendure/core";

export function getGateway(args: PaymentMethodArgsHash) {

    Logger.debug('getGateway', JSON.stringify(args, null, 2));

    const live = args.isLive as boolean;
    const region = getRegion(args.region as string);
    const username = args.username as string;
    const password = args.password as string;

    return new Payments({
        config: {
            isLive: live,
            region: region,
            username: username,
            password: password,
        }
    });
}
