import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {
  Cliente,
  ClienteCreate,
  LoginRequest,
  LoginResponse,
} from '../models/cliente.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<Cliente | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('AuthService - API URL:', this.baseUrl); // Debug log
    // Verificar si hay un token almacenado al inicializar (solo en el navegador)
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('currentUser');

      if (token && user) {
        this.tokenSubject.next(token);
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/Auth/login`, loginData)
      .pipe(
        tap((response) => {
          if (response.token && isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem(
              'currentUser',
              JSON.stringify(response.cliente)
            );
            this.tokenSubject.next(response.token);
            this.currentUserSubject.next(response.cliente);
          }
        })
      );
  }

  register(userData: ClienteCreate): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.baseUrl}/auth/register`, userData);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  getCurrentUser(): Cliente | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }
}
