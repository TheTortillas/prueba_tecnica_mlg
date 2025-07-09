import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { ClienteArticulo } from '../../models/carrito.model';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Mis Compras</h1>
                <p class="mt-1 text-sm text-gray-600">
                  Historial de todas tus compras realizadas
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  routerLink="/articulos"
                  class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Seguir Comprando
                </button>
                <button
                  routerLink="/dashboard"
                  class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
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
                      Total de Compras
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ compras.length }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
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
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Productos Comprados
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ totalProductos }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Total Gastado
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      \${{ totalGastado | number : '1.2-2' }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Promedio por Compra
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      \${{ promedioCompra | number : '1.2-2' }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="flex justify-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
          ></div>
        </div>

        <!-- Error Message -->
        <div
          *ngIf="errorMessage"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {{ errorMessage }}
        </div>

        <!-- Compras List -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              Historial de Compras
            </h2>

            <!-- Empty State -->
            <div
              *ngIf="!loading && compras.length === 0"
              class="text-center py-12"
            >
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
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
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                No tienes compras
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                ¡Comienza comprando algunos productos!
              </p>
              <div class="mt-6">
                <button
                  routerLink="/articulos"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Ver Productos
                </button>
              </div>
            </div>

            <!-- Compras por fecha -->
            <div *ngIf="compras.length > 0">
              <div *ngFor="let grupo of comprasGroupedByDate" class="mb-8">
                <!-- Fecha Header -->
                <div class="flex items-center mb-4">
                  <div class="flex-shrink-0">
                    <div
                      class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">
                      {{ grupo.fecha | date : 'fullDate' }}
                    </h3>
                    <p class="text-sm text-gray-500">
                      {{ grupo.compras.length }} compra{{
                        grupo.compras.length !== 1 ? 's' : ''
                      }}
                      - Total: \${{ grupo.total | number : '1.2-2' }}
                    </p>
                  </div>
                </div>

                <!-- Compras del día -->
                <div class="ml-12 space-y-4">
                  <div
                    *ngFor="let compra of grupo.compras"
                    class="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <!-- Product Image Placeholder -->
                        <div
                          class="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"
                        >
                          <img
                            [src]="
                              compra.articulo?.imagen ||
                              'assets/placeholder-product.svg'
                            "
                            [alt]="compra.articulo?.descripcion"
                            class="w-full h-full object-cover rounded-lg"
                            (error)="onImageError($event)"
                          />
                        </div>

                        <!-- Product Info -->
                        <div class="flex-1">
                          <h4 class="text-sm font-medium text-gray-900">
                            {{
                              compra.articulo?.descripcion ||
                                'Producto no disponible'
                            }}
                          </h4>
                          <p class="text-sm text-gray-500">
                            Código: {{ compra.articulo?.codigo || 'N/A' }}
                          </p>
                          <div class="flex items-center space-x-4 mt-1">
                            <span class="text-sm text-gray-600">
                              Cantidad: {{ compra.cantidad }}
                            </span>
                            <span class="text-sm text-gray-600">
                              Precio unitario: \${{
                                compra.precioUnitario | number : '1.2-2'
                              }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Purchase Details -->
                      <div class="text-right">
                        <div class="text-lg font-medium text-gray-900">
                          \${{ compra.total | number : '1.2-2' }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ compra.fecha | date : 'short' }}
                        </div>
                      </div>
                    </div>

                    <!-- Purchase ID -->
                    <div class="mt-2 pt-2 border-t border-gray-200">
                      <span class="text-xs text-gray-400"
                        >ID de compra: {{ compra.clienteArticuloId }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MisComprasComponent implements OnInit {
  compras: ClienteArticulo[] = [];
  comprasGroupedByDate: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCompras();
  }

  loadCompras(): void {
    this.loading = true;
    this.errorMessage = '';

    this.carritoService.getMisCompras().subscribe({
      next: (compras) => {
        this.compras = compras.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.groupComprasByDate();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el historial de compras';
        this.loading = false;
        console.error('Error:', error);
      },
    });
  }

  groupComprasByDate(): void {
    const grouped: { [key: string]: ClienteArticulo[] } = {};

    this.compras.forEach((compra) => {
      const fecha = new Date(compra.fecha).toDateString();
      if (!grouped[fecha]) {
        grouped[fecha] = [];
      }
      grouped[fecha].push(compra);
    });

    this.comprasGroupedByDate = Object.keys(grouped)
      .map((fecha) => ({
        fecha: new Date(fecha),
        compras: grouped[fecha],
        total: grouped[fecha].reduce((sum, compra) => sum + compra.total, 0),
      }))
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  get totalProductos(): number {
    return this.compras.reduce((total, compra) => total + compra.cantidad, 0);
  }

  get totalGastado(): number {
    return this.compras.reduce((total, compra) => total + compra.total, 0);
  }

  get promedioCompra(): number {
    if (this.compras.length === 0) return 0;
    return this.totalGastado / this.compras.length;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/placeholder-product.svg';
  }
}
