export type productospayload = {
    idCategoria: number;
    idMarca: number;
    idEstadoProducto: number;
    nombre: string;
    valorComercial: number;
    descripcion?: string | null | undefined;
}


export type productosGetpayload = {
 idProducto: number;
 uuidPublico: string;
 nombre: string;
 descripcion: string | null;
 valorComercial: string;
 fecha_creacion: Date;
 fecha_actualizacion: Date | null;
 fecha_eliminacion: Date | null;
 categoria: {
 idCategoria: number;
 nombre: string;
 };
 estado: {
 idEstadoProducto: number;
 nombre: string;
 };
 marca: {
 idMarca: number;
 nombre: string;
 };
}[]

export type OneProductpayload = {
 idProducto: number;
 uuidPublico: string;
 nombre: string;
 descripcion: string | null;
 valorComercial
: string;
 fecha_creacion: Date;
 fecha_actualizacion: Date | null;
 fecha_eliminacion: Date | null;
 categoria: {
 idCategoria: number;
 nombre: string;
 };
 estado: {
 idEstadoProducto: number;
 nombre: string;
 };
 marca: {
 idMarca: number;
 nombre: string;
 };
}