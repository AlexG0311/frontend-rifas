import type { ApiResponse } from "../types/api.type";
import type  { marcas } from "../types/brand.type";

export const GetBrand = async () => {
    const res = await fetch("http://localhost:3000/api/marcas/",
        {
            method:"GET",
            credentials: "include"
        }
    )
    const respuesta: ApiResponse<marcas> = await res.json();
    return respuesta.data;
}