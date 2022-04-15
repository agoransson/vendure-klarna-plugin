import { Address, OrderLine as KlarnaOrderLine } from "@agoransson/klarna-payments";
import { OrderAddress } from "@vendure/common/lib/generated-types";
import { OrderLine, ShippingLine } from "@vendure/core";
/**
 * Convert Vendure OrderAddress to Klarna Address.
 *
 * @param address The Vendure OrderAddress to convert to Klarna accepted Address.
 * @returns The Klarna Address type.
 */
export declare const convertToKlarnaAddress: (address: OrderAddress) => Address;
/**
 * Converts Vendure OrderLines and ShippingLines to Klarna OrderLine.
 *
 * @param orderLines The Vendure OrderLines to convert.
 * @param shippingLines The Vendure ShippingLines to convert.
 * @returns Klarna OrderLine, consisting of Vendure OrderLines and Vendure ShippingLines.
 */
export declare const generateOrderLines: (orderLines: OrderLine[], shippingLines: ShippingLine[]) => KlarnaOrderLine[];
/**
 * Convert to a taxrate representation acceptable by Klarna, with two implicit decimals.
 * I.e. 19% will be 1900.
 *
 * @param taxRate The taxrate (in percent, without decimals).
 * @returns The klarna taxrate - with two implicit decimals.
 */
export declare const convertToKlarnaTaxRate: (taxRate: number) => number;
