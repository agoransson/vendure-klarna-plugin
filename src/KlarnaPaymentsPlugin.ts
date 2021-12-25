import { PluginCommonModule, RuntimeVendureConfig, VendurePlugin } from '@vendure/core';
import { klarnaPaymentMethodHandler } from '.';

/**
 * Klarna Payments provider for Vendure
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [],

    configuration: (config: RuntimeVendureConfig) => {
        config.paymentOptions.paymentMethodHandlers.push(klarnaPaymentMethodHandler);
        return config;
    },
})
export class KlarnaPaymentsPlugin {}