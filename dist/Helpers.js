"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderLines = exports.convertToKlarnaAddress = void 0;
/**
 * Convert Vendure OrderAddress to Klarna Address.
 *
 * @param address The Vendure OrderAddress to convert to Klarna accepted Address.
 * @returns The Klarna Address type.
 */
const convertToKlarnaAddress = (address) => ({
    attention: undefined,
    city: address === null || address === void 0 ? void 0 : address.city,
    country: address === null || address === void 0 ? void 0 : address.countryCode,
    email: undefined,
    family_name: undefined,
    given_name: address === null || address === void 0 ? void 0 : address.fullName,
    organization_name: address === null || address === void 0 ? void 0 : address.company,
    phone: address === null || address === void 0 ? void 0 : address.phoneNumber,
    postal_code: address === null || address === void 0 ? void 0 : address.postalCode,
    region: address === null || address === void 0 ? void 0 : address.province,
    street_address: address === null || address === void 0 ? void 0 : address.streetLine1,
    street_address2: address === null || address === void 0 ? void 0 : address.streetLine2,
    title: undefined
});
exports.convertToKlarnaAddress = convertToKlarnaAddress;
/**
 * Converts Vendure OrderLines and ShippingLines to Klarna OrderLine.
 *
 * @param orderLines The Vendure OrderLines to convert.
 * @param shippingLines The Vendure ShippingLines to convert.
 * @returns Klarna OrderLine, consisting of Vendure OrderLines and Vendure ShippingLines.
 */
const generateOrderLines = (orderLines, shippingLines) => {
    const order_lines = orderLines.map((line) => {
        var _a;
        return ({
            name: (_a = line === null || line === void 0 ? void 0 : line.productVariant) === null || _a === void 0 ? void 0 : _a.name,
            quantity: line === null || line === void 0 ? void 0 : line.quantity,
            tax_rate: line === null || line === void 0 ? void 0 : line.taxRate,
            total_amount: line === null || line === void 0 ? void 0 : line.linePriceWithTax,
            total_tax_amount: line === null || line === void 0 ? void 0 : line.lineTax,
            unit_price: line === null || line === void 0 ? void 0 : line.unitPriceWithTax,
        });
    });
    const shipping_lines = shippingLines.map((line) => {
        var _a;
        return ({
            name: (_a = line === null || line === void 0 ? void 0 : line.shippingMethod) === null || _a === void 0 ? void 0 : _a.name,
            quantity: 1,
            tax_rate: line === null || line === void 0 ? void 0 : line.taxRate,
            total_amount: line === null || line === void 0 ? void 0 : line.priceWithTax,
            total_tax_amount: line === null || line === void 0 ? void 0 : line.priceWithTax,
            unit_price: line === null || line === void 0 ? void 0 : line.priceWithTax,
        });
    });
    return [...order_lines, ...shipping_lines];
};
exports.generateOrderLines = generateOrderLines;
//# sourceMappingURL=Helpers.js.map