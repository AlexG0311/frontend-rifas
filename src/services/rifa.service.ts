import type { Rifa, NumeroRifa  } from "../types/rifa.types";
import type { ApiResponse } from "../types/api.types";


const BASE_URL = "http://localhost:3000/api";

export async function getRifas(): Promise<Rifa[]> {
  const res = await fetch(`${BASE_URL}/rifas`);
 
  if (!res.ok) throw new Error("Error al obtener las rifas");

  const json: ApiResponse<Rifa[]> = await res.json();
  console.log(json.data);
  return json.data;

}

export async function getNumerosRifa(uuidRifa: string): Promise<NumeroRifa[]> {
  const res = await fetch(`${BASE_URL}/rifas/${uuidRifa}/numeros`);
  
  if (!res.ok) throw new Error("Error al obtener los números de la rifa");
  
  const json:ApiResponse<NumeroRifa[]> = await res.json()

  console.log("Numeros: " , json.data)
  return json.data;
}
                  