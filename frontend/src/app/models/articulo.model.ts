export interface Articulo {
  articuloId: number;
  codigo: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  stock: number;
  fechaCreacion: Date;
  activo: boolean;
}

export interface ArticuloCreate {
  codigo: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  stock: number;
}

export interface ArticuloUpdate {
  codigo: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  stock: number;
}

export interface ArticuloTienda {
  articuloTiendaId: number;
  articuloId: number;
  tiendaId: number;
  fecha: Date;
  stockTienda: number;
  articulo?: Articulo;
  tienda?: any;
}

export interface ArticuloTiendaCreate {
  articuloId: number;
  tiendaId: number;
  stockTienda: number;
}
