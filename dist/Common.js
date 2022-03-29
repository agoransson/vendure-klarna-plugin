"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGateway = void 0;
const klarna_payments_1 = require("@agoransson/klarna-payments");
const utils_1 = require("@agoransson/klarna-payments/dist/utils");
const core_1 = require("@vendure/core");
function getGateway(args) {
    core_1.Logger.debug('getGateway', JSON.stringify(args, null, 2));
    const live = args.isLive;
    const region = (0, utils_1.getRegion)(args.region);
    const username = args.username;
    const password = args.password;
    return new klarna_payments_1.Payments({
        config: {
            isLive: live,
            region: region,
            username: username,
            password: password,
        }
    });
}
exports.getGateway = getGateway;
//# sourceMappingURL=Common.js.map