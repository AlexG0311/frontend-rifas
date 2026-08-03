import { useEffect, useState } from "react";
import { Categoritas } from "../../../services/categorias.service";
import type { categoria } from "../../../types/categorias.type";

export const useCategoria = () => {
const [categorias, setCategorias] = useState<categoria>([]);

useEffect(()=> {
( async () => {
    const categorias = await Categoritas();
    setCategorias(categorias)
})();
},[])

return {categorias}

}