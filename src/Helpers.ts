import { Address, OrderLine as KlarnaOrderLine, OrderType  } from "@agoransson/klarna-payments"
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
    city: address?.city,
    country: address?.countryCode,
    email: undefined,
    family_name: undefined,
    given_name: address?.fullName,
    organization_name: address?.company,
    phone: address?.phoneNumber,
    postal_code: address?.postalCode,
    region: address?.province,
    street_address: address?.streetLine1,
    street_address2: address?.streetLine2,
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
            image_url: line?.productVariant?.featuredAsset?.preview,
            merchant_data: line?.order?.code,
            name: line?.productVariant?.name,
            product_identifiers: undefined,
            product_url: undefined,
            quantity: line?.quantity,
            reference: line?.productVariant.sku,
            tax_rate: convertToKlarnaTaxRate(line?.taxRate),
            total_amount: line?.linePriceWithTax,
            total_discount_amount: 0,
            total_tax_amount: line?.lineTax,
            type: OrderType.PHYSICAL,
            unit_price: line?.unitPriceWithTax,
        }
    ));

    const shipping_lines: KlarnaOrderLine[] = shippingLines.map((line) => (
        {
            image_url: undefined,
            merchant_data: line?.shippingMethodId.toLocaleString(),
            name: line?.shippingMethod?.name,
            product_identifiers: undefined,
            product_url: undefined,
            quantity: 1,
            reference: undefined,
            tax_rate: convertToKlarnaTaxRate(line?.taxRate),
            total_amount: line?.priceWithTax,
            total_discount_amount: 0,
            total_tax_amount: line?.priceWithTax - line?.price,
            type: OrderType.SHIPPING_FEE,
            unit_price: line?.priceWithTax,
        }
    ));

    return [...order_lines, ...shipping_lines];
}

/**
 * Convert to a taxrate representation acceptable by Klarna, with two implicit decimals.
 * I.e. 19% will be 1900.
 * 
 * @param taxRate The taxrate (in percent, without decimals).
 * @returns The klarna taxrate - with two implicit decimals.
 */
export const convertToKlarnaTaxRate = (taxRate: number) => (
    taxRate * 100
)
