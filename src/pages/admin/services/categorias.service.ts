
import type { ApiResponse } from "../types/api.type";
import type { categoria } from "../types/categorias.type";

export const Categoritas = async () => {
    const respuesta = await fetch("http://localhost:3000/api/categorias/",{
        credentials: "include",
        method: "GET",
    })

    const res: ApiResponse<categoria> = await respuesta.json();
    return res.data
}

