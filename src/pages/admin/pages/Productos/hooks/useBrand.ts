import { useEffect, useState } from "react";
import type { marcas } from "../../../types/brand.type";
import { GetBrand } from "../../../services/marcas.service";

export const useBrand = () => {
const [brands, setBrand] = useState<marcas>([]);

useEffect(()=> {
( async () => {
    const brand = await GetBrand();
    setBrand(brand)
})();
},[])

return {brands}

}