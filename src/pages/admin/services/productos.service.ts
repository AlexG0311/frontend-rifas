import type  { ApiResponse } from "../types/api.type"
import type  { productospayload } from "../types/productos.type"
import type { productosGetpayload } from "../types/productos.type"

export const CreateProductos = async (data: productospayload): Promise<productospayload> => {

const res = await fetch(`${API_URL}/productos/`,
    {
        credentials: "include",
        method: "POST",
        headers:{
            "Content-Type":"Application/json"
        },
        body: JSON.stringify(data)
    })

const respuesta: ApiResponse<productospayload> = await res.json();

return respuesta.data

}

export const GetProductos = async () => {

const res = await fetch(`${API_URL}/productos/`,
    {
        credentials: "include",
        method: "GET",
    })
const respuesta: ApiResponse<productosGetpayload> = await res.json();

return respuesta.data
}


export const UpdateProductos = async (uuid_publica:string, data:productospayload) => {

const res = await fetch(`${API_URL}/productos/${uuid_publica}`,
    {
        credentials: "include",
        method: "PATCH",
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    })
const respuesta: ApiResponse<productosGetpayload> = await res.json();
return respuesta.data
}


export const DeteleProductos = async (uuid_publica:string) => {

const res = await fetch(`${API_URL}/productos/${uuid_publica}`,
    {
        credentials: "include",
        method: "DELETE",
  
    })

const respuesta: ApiResponse<productosGetpayload> = await res.json();
return respuesta.data
}