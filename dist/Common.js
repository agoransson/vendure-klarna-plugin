"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGateway = void 0;
const klarna_payments_1 = require("@agoransson/klarna-payments");
const utils_1 = require("@agoransson/klarna-payments/dist/utils");
function getGateway(args) {
    const live = args.isLive && typeof args.isLive === "boolean" ? args.isLive : false;
    const region = args.region && typeof args.region === "string" ? (0, utils_1.getRegion)(args.region) : undefined;
    const username = args.username && typeof args.username === "string" ? args.username : undefined;
    const password = args.password && typeof args.password === "string" ? args.password : undefined;
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