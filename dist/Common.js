"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGateway = void 0;
const klarna_payments_1 = require("@agoransson/klarna-payments");
function getGateway(args) {
    return new klarna_payments_1.Klarna({
        config: {
            region: args.region,
            isLive: args.isLive,
            username: args.username,
            password: args.password,
        }
    });
}
exports.getGateway = getGateway;
//# sourceMappingURL=Common.js.map