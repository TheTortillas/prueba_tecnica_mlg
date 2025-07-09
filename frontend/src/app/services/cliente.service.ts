import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, ClienteCreate, ClienteUpdate } from '../models/cliente.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private baseUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.baseUrl, {
      headers: this.getHeaders(),
    });
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  create(cliente: ClienteCreate): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, cliente, {
      headers: this.getHeaders(),
    });
  }

  update(id: number, cliente: ClienteUpdate): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/${id}`, cliente, {
      headers: this.getHeaders(),
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
