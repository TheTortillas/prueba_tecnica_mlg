export interface Tienda {
  tiendaId: number;
  sucursal: string;
  direccion: string;
  fechaCreacion: Date;
  activo: boolean;
}

export interface TiendaCreate {
  sucursal: string;
  direccion: string;
}

export interface TiendaUpdate {
  sucursal: string;
  direccion: string;
}
