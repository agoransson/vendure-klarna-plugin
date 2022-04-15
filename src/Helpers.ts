import { Address, OrderLine as KlarnaOrderLine  } from "@agoransson/klarna-payments"
import { OrderAddress} from "@vendure/common/lib/generated-types"
import { OrderLine, ShippingLine } from "@vendure/core";

/**
 * Convert Vendure OrderAddress to Klarna Address.
 * 
 * @param address The Vendure OrderAddress to convert to Klarna accepted Address.
 * @returns The Klarna Address type.
 */
export const convertToKlarnaAddress = (address: OrderAddress): Address => ({
    attention: undefined,
    city: address.city,
    country: address.countryCode,
    email: undefined,
    family_name: undefined,
    given_name: address.fullName,
    organization_name: address.company,
    phone: address.phoneNumber,
    postal_code: address.postalCode,
    region: address.province,
    street_address: address.streetLine1,
    street_address2: address.streetLine2,
    title: undefined
});

/**
 * Converts Vendure OrderLines and ShippingLines to Klarna OrderLine.
 * 
 * @param orderLines The Vendure OrderLines to convert.
 * @param shippingLines The Vendure ShippingLines to convert.
 * @returns Klarna OrderLine, consisting of Vendure OrderLines and Vendure ShippingLines.
 */
export const generateOrderLines = (orderLines: OrderLine[], shippingLines: ShippingLine[]): KlarnaOrderLine[] => {

    const order_lines: KlarnaOrderLine[] = orderLines.map((line) => (
        {
            name: line.productVariant.name,
            quantity: line.quantity,
            tax_rate: line.taxRate,
            total_amount: line.linePriceWithTax,
            total_tax_amount: line.lineTax,
            unit_price: line.unitPriceWithTax,
        }
    ));

    const shipping_lines: KlarnaOrderLine[] = shippingLines.map((line) => (
        {
            name: line.shippingMethod.name,
            quantity: 1,
            tax_rate: line.taxRate,
            total_amount: line.priceWithTax,
            total_tax_amount: line.priceWithTax,
            unit_price: line.priceWithTax,
        }
    ));

    return [...order_lines, ...shipping_lines];
}
