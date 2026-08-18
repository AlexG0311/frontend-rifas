import { useEffect, useRef, useState } from "react";
import { useCategoria } from "../hooks/useCategorias";
import { useBrand } from "../hooks/useBrand";
import type { productospayload, OneProductpayload } from "../../../types/productos.type";
import { useCrearProducto } from "../hooks/useProductos";
import { UpdateProductos } from "../../../services/productos.service";

const ProductoEstadoInicial = {
  idCategoria: 1,
  idMarca: 1,
  idEstadoProducto: 1,
  nombre: "",
  valorComercial: 0,
  descripcion: ""
};

// Añadir nueva prop onProductoActualizado
export default function ProductoModal({ 
  onClose, 
  productos, 
  modo,
  onProductoActualizado // Nueva prop
}: { 
  onClose: () => void; 
  productos: OneProductpayload | null; 
  modo: string | null;
  onProductoActualizado?: () => void; // Opcional
}) {
  const [producto, setProductos] = useState<productospayload>(ProductoEstadoInicial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { CrearProductos } = useCrearProducto();
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  const { categorias } = useCategoria();
  const { brands } = useBrand();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (modo === "crear") {
        await CrearProductos(producto);
      } else {
        if (!productos?.uuidPublico) {
          throw new Error("No se encontró el ID del producto para actualizar");
        }
        await UpdateProductos(productos.uuidPublico, producto);
      }
      
      // Cerrar modal después de éxito
      onClose();
      
      // Notificar al padre que se actualizó un producto
      if (onProductoActualizado) {
        onProductoActualizado();
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setError(error instanceof Error ? error.message : "Error al guardar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (modo === "crear") {
      setProductos(ProductoEstadoInicial);
      setError(null);
      return;
    }

    if (!productos) return;

    const productoSelect = {
      idCategoria: productos.categoria.idCategoria,
      idMarca: productos.marca.idMarca,
      idEstadoProducto: productos.estado.idEstadoProducto,
      nombre: productos.nombre,
      valorComercial: Number(productos.valorComercial),
      descripcion: productos.descripcion ?? ""
    };

    setProductos(productoSelect);
    setError(null);
  }, [productos, modo]);

  useEffect(() => {
    if (!dialogRef.current) return;
    
    if (modo !== null) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [modo]);

  if (!modo) return null;

  return (
    <dialog ref={dialogRef} onClose={onClose} className="modal fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {modo === "crear" ? "Crear producto" : "Editar producto"}
          </h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {modo === "crear" ? "Aquí podrás crear los productos" : "Edita el producto"}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="productName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nombre del producto
              </label>
              <input
                type="text"
                id="productName"
                value={producto.nombre}
                onChange={(e) => setProductos({ ...producto, nombre: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter product name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="productDescription" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Descripción del producto
              </label>
              <textarea
                value={producto.descripcion ?? ""}
                id="productDescription"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter product description"
                onChange={(e) => setProductos({ ...producto, descripcion: e.target.value })}
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="productPrice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Precio del producto
              </label>
              <input
                type="number"
                value={producto.valorComercial}
                id="productPrice"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter product price"
                onChange={(e) => {
                  setProductos({
                    ...producto,
                    valorComercial: e.target.value === "" ? 0 : Number(e.target.value)
                  });
                }}
                required
                disabled={isSubmitting}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="productCategory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Categoría del producto
              </label>
              <select
                value={producto.idCategoria}
                onChange={(e) => setProductos({ ...producto, idCategoria: parseInt(e.target.value) })}
                id="productCategory"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={isSubmitting}
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="productBrand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Marca del producto
              </label>
              <select
                value={producto.idMarca}
                onChange={(e) => setProductos({ ...producto, idMarca: parseInt(e.target.value) })}
                id="productBrand"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={isSubmitting}
              >
                {brands.map((brand) => (
                  <option key={brand.id_marca} value={brand.id_marca}>
                    {brand.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    {modo === "crear" ? "Creando..." : "Actualizando..."}
                  </>
                ) : (
                  modo === "crear" ? "Crear producto" : "Editar producto"
                )}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}