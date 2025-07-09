import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  CarritoItem,
  Carrito,
  CompraResponse,
  ClienteArticulo,
} from '../models/carrito.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private baseUrl = `${environment.apiUrl}/carrito`;
  private clienteArticuloUrl = `${environment.apiUrl}/clientearticulo`;

  private carritoSubject = new BehaviorSubject<CarritoItem[]>([]);
  public carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    // Cargar carrito desde localStorage al inicializar
    this.loadCarritoFromStorage();
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private loadCarritoFromStorage(): void {
    const carritoData = localStorage.getItem('carrito');
    if (carritoData) {
      const carrito = JSON.parse(carritoData);
      this.carritoSubject.next(carrito);
    }
  }

  private saveCarritoToStorage(carrito: CarritoItem[]): void {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  // Gestión local del carrito
  addToCarrito(articuloId: number, cantidad: number = 1): void {
    const currentCarrito = this.carritoSubject.value;
    const existingItem = currentCarrito.find(
      (item) => item.articuloId === articuloId
    );

    if (existingItem) {
      existingItem.cantidad += cantidad;
    } else {
      currentCarrito.push({ articuloId, cantidad });
    }

    this.carritoSubject.next([...currentCarrito]);
    this.saveCarritoToStorage(currentCarrito);
  }

  removeFromCarrito(articuloId: number): void {
    const currentCarrito = this.carritoSubject.value.filter(
      (item) => item.articuloId !== articuloId
    );
    this.carritoSubject.next(currentCarrito);
    this.saveCarritoToStorage(currentCarrito);
  }

  updateQuantity(articuloId: number, cantidad: number): void {
    const currentCarrito = this.carritoSubject.value;
    const item = currentCarrito.find((item) => item.articuloId === articuloId);

    if (item) {
      if (cantidad <= 0) {
        this.removeFromCarrito(articuloId);
      } else {
        item.cantidad = cantidad;
        this.carritoSubject.next([...currentCarrito]);
        this.saveCarritoToStorage(currentCarrito);
      }
    }
  }

  clearCarrito(): void {
    this.carritoSubject.next([]);
    localStorage.removeItem('carrito');
  }

  getCarritoItems(): CarritoItem[] {
    return this.carritoSubject.value;
  }

  getItemCount(): number {
    return this.carritoSubject.value.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  }

  // Llamadas al backend
  procesarCompra(): Observable<CompraResponse> {
    const clienteId = this.authService.getCurrentUser()?.clienteId;
    if (!clienteId) {
      throw new Error('Usuario no autenticado');
    }

    const carrito: Carrito = {
      items: this.carritoSubject.value,
    };

    return this.http.post<CompraResponse>(`${this.baseUrl}/procesar`, carrito, {
      headers: this.getHeaders(),
    });
  }

  // Historial de compras
  getComprasCliente(clienteId: number): Observable<ClienteArticulo[]> {
    return this.http.get<ClienteArticulo[]>(
      `${this.clienteArticuloUrl}/cliente/${clienteId}`,
      { headers: this.getHeaders() }
    );
  }

  getMisCompras(): Observable<ClienteArticulo[]> {
    const clienteId = this.authService.getCurrentUser()?.clienteId;
    if (!clienteId) {
      throw new Error('Usuario no autenticado');
    }
    return this.getComprasCliente(clienteId);
  }
}
