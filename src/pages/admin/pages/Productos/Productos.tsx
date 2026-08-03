import { useEffect, useState } from "react";
import ModalCrearProducto from "./Modal/ProductoModal";
import { GetProductos, DeteleProductos } from "../../services/productos.service";
import type  { productosGetpayload, OneProductpayload } from "../../types/productos.type";

export default function Productos() {
  const [modo, setModo] = useState<"crear" | "editar" | null>(null);
  const [productsList, setProducts] = useState<productosGetpayload>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<OneProductpayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModalClose = () => {
    setModo(null);
    setProductoSeleccionado(null);
  };

  // Función para cargar productos
  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const products = await GetProductos();
      setProducts(products);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setError("Error al cargar los productos. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (uuidPublico: string) => {
    if (!uuidPublico) return;
    
    // Confirmar antes de eliminar
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    
    try {
      await DeteleProductos(uuidPublico);
      // Recargar la lista después de eliminar
      await loadProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setError("Error al eliminar el producto. Por favor, intenta nuevamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  // Recargar productos cuando se cierra el modal (después de crear/editar)
  useEffect(() => {
    if (modo === null) {
      // Si el modal se cerró, recargar productos
      loadProducts();
    }
  }, [modo]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Agregar Productos
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingrese los detalles de su producto para agregar un nuevo producto!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button 
                onClick={() => setModo("crear")} 
                className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                disabled={isLoading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-8">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lista de Productos
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/50">
              Aquí se mostrará la lista de productos agregados.
            </p>

            {/* Mostrar error si existe */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Mostrar loading mientras carga */}
            {isLoading && (
              <div className="mt-4 flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando productos...</span>
              </div>
            )}

            {/* Mostrar mensaje si no hay productos */}
            {!isLoading && productsList.length === 0 && !error && (
              <div className="mt-4 p-8 text-center border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400">
                  No hay productos aún. ¡Agrega tu primer producto!
                </p>
              </div>
            )}

            {/* Lista de productos */}
            {!isLoading && productsList.map((product) => (
              <div key={product.idProducto} className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <h2 className="text-md font-semibold text-gray-800 dark:text-white/90">
                  {product.nombre}
                </h2>
                <p className="text-sm text-gray-500 dark:text-white/50">
                  {product.descripcion}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  Price: ${product.valorComercial}
                </p>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => handleDelete(product.uuidPublico)} 
                    disabled={isDeleting}
                    className="mt-2 inline-flex items-center justify-center gap-2 py-1 px-3 text-sm font-normal text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                        Eliminando...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>

                  <button 
                    onClick={() => {
                      setModo("editar");
                      setProductoSeleccionado(product);
                    }}
                    disabled={isLoading || isDeleting}
                    className="mt-2 inline-flex items-center justify-center gap-2 py-1 px-3 text-sm font-normal text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ModalCrearProducto
        modo={modo}
        productos={productoSeleccionado}
        onClose={handleModalClose}
        onProductoActualizado={loadProducts} // Nueva prop para recargar después de crear/editar
      />
    </div>
  );
}