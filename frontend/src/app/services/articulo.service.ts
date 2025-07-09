import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Articulo,
  ArticuloCreate,
  ArticuloUpdate,
  ArticuloTienda,
  ArticuloTiendaCreate,
} from '../models/articulo.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticuloService {
  private baseUrl = `${environment.apiUrl}/articulos`;
  private articuloTiendaUrl = `${environment.apiUrl}/articulotienda`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Artículos CRUD
  getAll(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(this.baseUrl, {
      headers: this.getHeaders(),
    });
  }

  getById(id: number): Observable<Articulo> {
    return this.http.get<Articulo>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getByCodigo(codigo: string): Observable<Articulo> {
    return this.http.get<Articulo>(`${this.baseUrl}/codigo/${codigo}`, {
      headers: this.getHeaders(),
    });
  }

  getByTienda(tiendaId: number): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(`${this.baseUrl}/tienda/${tiendaId}`, {
      headers: this.getHeaders(),
    });
  }

  create(articulo: ArticuloCreate): Observable<Articulo> {
    return this.http.post<Articulo>(this.baseUrl, articulo, {
      headers: this.getHeaders(),
    });
  }

  update(id: number, articulo: ArticuloUpdate): Observable<Articulo> {
    return this.http.put<Articulo>(`${this.baseUrl}/${id}`, articulo, {
      headers: this.getHeaders(),
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Artículo-Tienda relationship
  getAllArticuloTienda(): Observable<ArticuloTienda[]> {
    return this.http.get<ArticuloTienda[]>(this.articuloTiendaUrl, {
      headers: this.getHeaders(),
    });
  }

  getArticuloTiendaById(id: number): Observable<ArticuloTienda> {
    return this.http.get<ArticuloTienda>(`${this.articuloTiendaUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getArticuloTiendaByTienda(tiendaId: number): Observable<ArticuloTienda[]> {
    return this.http.get<ArticuloTienda[]>(
      `${this.articuloTiendaUrl}/tienda/${tiendaId}`,
      { headers: this.getHeaders() }
    );
  }

  createArticuloTienda(
    articuloTienda: ArticuloTiendaCreate
  ): Observable<ArticuloTienda> {
    return this.http.post<ArticuloTienda>(
      this.articuloTiendaUrl,
      articuloTienda,
      { headers: this.getHeaders() }
    );
  }

  deleteArticuloTienda(id: number): Observable<any> {
    return this.http.delete(`${this.articuloTiendaUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
