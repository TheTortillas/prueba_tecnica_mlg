import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tienda, TiendaCreate, TiendaUpdate } from '../models/tienda.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiendaService {
  private baseUrl = `${environment.apiUrl}/tiendas`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAll(): Observable<Tienda[]> {
    return this.http.get<Tienda[]>(this.baseUrl, {
      headers: this.getHeaders(),
    });
  }

  getById(id: number): Observable<Tienda> {
    return this.http.get<Tienda>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  create(tienda: TiendaCreate): Observable<Tienda> {
    return this.http.post<Tienda>(this.baseUrl, tienda, {
      headers: this.getHeaders(),
    });
  }

  update(id: number, tienda: TiendaUpdate): Observable<Tienda> {
    return this.http.put<Tienda>(`${this.baseUrl}/${id}`, tienda, {
      headers: this.getHeaders(),
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
