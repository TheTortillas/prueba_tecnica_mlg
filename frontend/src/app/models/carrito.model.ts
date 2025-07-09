import { Cliente } from './cliente.model';
import { Articulo } from './articulo.model';

export interface CarritoItem {
  articuloId: number;
  cantidad: number;
}

export interface Carrito {
  items: CarritoItem[];
}

export interface CompraResponse {
  exito: boolean;
  mensaje: string;
  compras: ClienteArticulo[];
  totalGeneral: number;
}

export interface ClienteArticulo {
  clienteArticuloId: number;
  clienteId: number;
  articuloId: number;
  fecha: Date;
  cantidad: number;
  precioUnitario: number;
  total: number;
  cliente?: Cliente;
  articulo?: Articulo;
}

export interface ClienteArticuloCreate {
  clienteId: number;
  articuloId: number;
  cantidad: number;
}
