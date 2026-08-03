import {  useState } from "react"
import { CreateProductos } from "../../../services/productos.service"
import type { productospayload } from "../../../types/productos.type"

export const useCrearProducto = () => {
const [respuesta, setRespuesta] = useState({});

const CrearProductos = async (data:productospayload) => {
    const res = await CreateProductos(data) 
    setRespuesta(res);
}
return {CrearProductos, respuesta}

} 