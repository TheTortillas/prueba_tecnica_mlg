import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Navigation -->
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <h1 class="text-xl font-bold text-gray-800">Tienda Online</h1>
              </div>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  <a
                    routerLink="/dashboard"
                    routerLinkActive="bg-indigo-700 text-white"
                    class="text-gray-600 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    routerLink="/articulos"
                    routerLinkActive="bg-indigo-700 text-white"
                    class="text-gray-600 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Productos
                  </a>
                  <a
                    routerLink="/tiendas"
                    routerLinkActive="bg-indigo-700 text-white"
                    class="text-gray-600 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Tiendas
                  </a>
                  <a
                    routerLink="/mis-compras"
                    routerLinkActive="bg-indigo-700 text-white"
                    class="text-gray-600 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Mis Compras
                  </a>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <!-- Carrito -->
              <button
                routerLink="/carrito"
                class="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 4M7 13L5.9 17M7 13h10M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4"
                  ></path>
                </svg>
                <span
                  *ngIf="carritoCount > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ carritoCount }}
                </span>
              </button>

              <!-- User Menu -->
              <div class="relative">
                <div class="flex items-center space-x-3">
                  <span class="text-gray-700"
                    >{{ currentUser?.nombre }}
                    {{ currentUser?.apellidos }}</span
                  >
                  <button
                    (click)="logout()"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Bienvenido, {{ currentUser?.nombre }}!
            </h2>

            <!-- Quick Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-blue-50 p-6 rounded-lg">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-8 w-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Artículos en Carrito
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ carritoCount }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div class="bg-green-50 p-6 rounded-lg">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Compras Realizadas
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ totalCompras }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div class="bg-yellow-50 p-6 rounded-lg">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-8 w-8 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Tiendas Disponibles
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ totalTiendas }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                routerLink="/articulos"
                class="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition duration-200"
              >
                <svg
                  class="h-8 w-8 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
                Ver Productos
              </button>

              <button
                routerLink="/carrito"
                class="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition duration-200"
              >
                <svg
                  class="h-8 w-8 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 4M7 13L5.9 17M7 13h10M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4"
                  ></path>
                </svg>
                Ver Carrito
              </button>

              <button
                routerLink="/mis-compras"
                class="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition duration-200"
              >
                <svg
                  class="h-8 w-8 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
                Mis Compras
              </button>

              <button
                routerLink="/tiendas"
                class="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-center transition duration-200"
              >
                <svg
                  class="h-8 w-8 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
                Ver Tiendas
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  currentUser: Cliente | null = null;
  carritoCount = 0;
  totalCompras = 0;
  totalTiendas = 0;

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.carritoService.carrito$.subscribe((items) => {
      this.carritoCount = items.reduce(
        (total, item) => total + item.cantidad,
        0
      );
    });

    // Cargar estadísticas
    this.loadStats();
  }

  loadStats(): void {
    // Aquí podrías cargar las estadísticas desde el backend
    // Por simplicidad, usamos valores de ejemplo
    this.totalTiendas = 5; // Este valor lo puedes obtener del servicio de tiendas

    if (this.currentUser) {
      this.carritoService.getMisCompras().subscribe({
        next: (compras) => {
          this.totalCompras = compras.length;
        },
        error: (error) => {
          console.error('Error al cargar compras:', error);
        },
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
