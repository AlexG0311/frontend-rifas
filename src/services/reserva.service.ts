import type { ApiResponse } from "../types/api.types";
import type { NumerosReservado, CheckoutPayload } from "../types/reserva.types";

const BASE_URL = "http://localhost:3000/api";

export async function ReservarNumero(uuidRifa: string, numeros: number[], uuidCombo?: string): Promise<NumerosReservado> {
  const res = await fetch(`${BASE_URL}/rifas/${uuidRifa}/apartar`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
    numeros,
      ...(uuidCombo && { uuidCombo }), // solo incluye el campo si hay combo seleccionado
    }), // NUEVO: incluye uuidCombo en el payload
  }).catch((error) => {
    console.error("Error al enviar la solicitud de reserva:", error);
    throw new Error("Error al apartar los números");
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Error al apartar los números");
  }

  const json: ApiResponse<NumerosReservado> = await res.json();
  return json.data;
}

export async function CheckoutReserva(uuidPublicoReserva: string, payload: CheckoutPayload): Promise<any> {
  const res = await fetch(`${BASE_URL}/reservas/${uuidPublicoReserva}/checkout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Error al realizar el checkout");
  }

  const json = await res.json();
  return json.data;
}
  export function CancelarReserva( uuidPublico:string, sessionToken:string): Promise<NumerosReservado> {
      return fetch(`http://localhost:3000/api/reservas/${uuidPublico}/cancelar`,{
        method: "POST",
        credentials: "include",
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({sessionToken})            
      })
      .then((res) => {  
        if(!res.ok) throw new Error("Hubo un error");
        return res.json() as Promise<ApiResponse<NumerosReservado>>})
      .then(respuesta =>  respuesta.data )
  }

  export async function ObtenerReservaPorToken(sessionToken: string): Promise<NumerosReservado | null> {
    const res = await fetch(`http://localhost:3000/api/reservas/session/${sessionToken}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
}