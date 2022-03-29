import { PaymentMethodArgsHash } from "./types";
import { Payments } from '@agoransson/klarna-payments';
import { getRegion } from "@agoransson/klarna-payments/dist/utils";
import { Logger } from "@vendure/core";

export function getGateway(args: PaymentMethodArgsHash) {

    Logger.debug('getGateway', JSON.stringify(args, null, 2));

    const live = args.isLive && typeof args.isLive === "boolean" ? args.isLive : false;
    const region = args.region && typeof args.region === "string" ? getRegion(args.region) : undefined;
    const username = args.username && typeof args.username === "string" ? args.username : undefined;
    const password = args.password && typeof args.password === "string" ? args.password : undefined;

    return new Payments({
        config: {
            isLive: live,
            region: region,
            username: username,
            password: password,
        }
    });
}
