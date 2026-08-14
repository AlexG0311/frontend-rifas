const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export interface WidgetWompiParams {
  publicKey: string;
  currency: string;
  amountInCents: number;
  reference: string;
  signature: string;
  redirectUrl: string;
  customerData: {
    email: string;
    fullName: string;
    phoneNumber?: string;
    phoneNumberPrefix?: string;
    legalId?: string;
    legalIdType?: string;
  };
}

export async function getDatosPagoWompi(uuidCompra: string): Promise<WidgetWompiParams> {
  const res = await fetch(`${BASE_URL}/compras/${uuidCompra}/iniciar-pago`, {
    method: "GET",
    credentials: "include",
  }).catch((error) => {
    console.error("Error al solicitar datos de pago:", error);
    throw new Error("Error al preparar el pago");
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Error al preparar el pago");
  }

  const json = await res.json();
  return json.data;
}