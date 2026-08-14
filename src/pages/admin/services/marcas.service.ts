import type { ApiResponse } from "../types/api.type";
import type  { marcas } from "../types/brand.type";

export const GetBrand = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/marcas/`,
        {
            method:"GET",
            credentials: "include"
        }
    )
    const respuesta: ApiResponse<marcas> = await res.json();
    return respuesta.data;
}