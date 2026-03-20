import { MercadoPagoConfig, Preference } from "mercadopago";

export const mercadopagoService = {
  async createPreference(data: {
    orderId: string;
    items: { name: string; quantity: number; price: number }[];
    payer: { name: string; email: string };
  }) {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        external_reference: data.orderId,
        items: data.items.map((item) => ({
          id: data.orderId,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "ARS",
        })),
        payer: {
          name: data.payer.name,
          email: data.payer.email,
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pago/exitoso`,
          failure: `${process.env.FRONTEND_URL}/pago/error`,
          pending: `${process.env.FRONTEND_URL}/pago/pendiente`,
        },
        notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      },
    });

    return response;
  },
};
