import { MercadoPagoConfig, Preference } from "mercadopago";

// Inicializamos el cliente de Mercado Pago con el Access Token
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const preference = new Preference(client);

export const mercadopagoService = {
  // ─── Crear preferencia de pago ───────────────────────────────────────────
  async createPreference(data: {
    orderId: string;
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    payer: {
      name: string;
      email: string;
    };
  }) {
    const response = await preference.create({
      // body: {
      //   external_reference: data.orderId, // ID del pedido — llega en la URL de retorno
      //   items: data.items.map((item) => ({
      //     id: data.orderId,
      //     title: item.name,
      //     quantity: item.quantity,
      //     unit_price: item.price,
      //     currency_id: "ARS",
      //   })),
      //   payer: {
      //     name: data.payer.name,
      //     email: data.payer.email,
      //   },
      //   back_urls: {
      //     success: `${process.env.FRONTEND_URL}/pago/exitoso`,
      //     failure: `${process.env.FRONTEND_URL}/pago/error`,
      //     pending: `${process.env.FRONTEND_URL}/pago/pendiente`,
      //   },
      //   auto_return: "approved",
      //   notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      // },
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
        // auto_return lo activamos cuando tengamos el backend desplegado con URL pública
        notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      },
    });

    return response;
  },
};
