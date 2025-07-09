export interface Cliente {
  clienteId: number;
  nombre: string;
  apellidos: string;
  direccion: string;
  email: string;
  fechaCreacion: Date;
  activo: boolean;
}

export interface ClienteCreate {
  nombre: string;
  apellidos: string;
  direccion: string;
  email: string;
  password: string;
}

export interface ClienteUpdate {
  nombre: string;
  apellidos: string;
  direccion: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  cliente: Cliente;
  expiresAt: Date;
}
