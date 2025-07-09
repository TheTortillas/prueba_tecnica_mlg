import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ArticuloService } from '../../services/articulo.service';
import { CarritoItem } from '../../models/carrito.model';
import { Articulo } from '../../models/articulo.model';

interface CarritoItemDetalle extends CarritoItem {
  articulo?: Articulo;
  subtotal: number;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center">
              <h1 class="text-3xl font-bold text-gray-900">
                Carrito de Compras
              </h1>
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

        <!-- Success Message -->
        <div
          *ngIf="successMessage"
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
        >
          {{ successMessage }}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Carrito Items -->
          <div class="lg:col-span-2">
            <div class="bg-white shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">
                  Artículos en el carrito
                </h2>

                <!-- Empty Cart -->
                <div
                  *ngIf="carritoItems.length === 0 && !loading"
                  class="text-center py-8"
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 4M7 13L5.9 17M7 13h10M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4"
                    ></path>
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">
                    Tu carrito está vacío
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Comienza agregando algunos productos.
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

                <!-- Cart Items -->
                <div *ngIf="carritoItems.length > 0" class="space-y-4">
                  <div
                    *ngFor="let item of carritoItems"
                    class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <!-- Product Image -->
                    <div class="flex-shrink-0 w-20 h-20">
                      <img
                        [src]="
                          item.articulo?.imagen ||
                          'assets/placeholder-product.svg'
                        "
                        [alt]="item.articulo?.descripcion || 'Producto'"
                        class="w-full h-full object-cover rounded-md"
                        (error)="onImageError($event)"
                      />
                    </div>

                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-900 truncate">
                        {{
                          item.articulo?.descripcion || 'Producto no encontrado'
                        }}
                      </div>
                      <div class="text-sm text-gray-500">
                        Código: {{ item.articulo?.codigo }}
                      </div>
                      <div class="text-sm font-medium text-gray-900">
                        \${{ item.articulo?.precio | number : '1.2-2' }} c/u
                      </div>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="flex items-center space-x-2">
                      <button
                        (click)="decreaseQuantity(item.articuloId)"
                        class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm"
                        [disabled]="item.cantidad <= 1"
                      >
                        -
                      </button>
                      <span class="px-3 py-1 bg-gray-100 rounded text-sm">
                        {{ item.cantidad }}
                      </span>
                      <button
                        (click)="increaseQuantity(item.articuloId)"
                        class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm"
                        [disabled]="
                          item.cantidad >= (item.articulo?.stock || 0)
                        "
                      >
                        +
                      </button>
                    </div>

                    <!-- Subtotal -->
                    <div class="text-right">
                      <div class="text-sm font-medium text-gray-900">
                        \${{ item.subtotal | number : '1.2-2' }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ item.cantidad }} × \${{
                          item.articulo?.precio | number : '1.2-2'
                        }}
                      </div>
                    </div>

                    <!-- Remove Button -->
                    <div>
                      <button
                        (click)="removeItem(item.articuloId)"
                        class="text-red-600 hover:text-red-800"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">
                  Resumen del pedido
                </h2>

                <div class="space-y-4">
                  <!-- Items Count -->
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600"
                      >Artículos ({{ totalItems }})</span
                    >
                    <span class="font-medium"
                      >\${{ subtotal | number : '1.2-2' }}</span
                    >
                  </div>

                  <!-- Shipping -->
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Envío</span>
                    <span class="font-medium">Gratis</span>
                  </div>

                  <!-- Tax -->
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">IVA (16%)</span>
                    <span class="font-medium"
                      >\${{ tax | number : '1.2-2' }}</span
                    >
                  </div>

                  <hr class="border-gray-200" />

                  <!-- Total -->
                  <div class="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>\${{ total | number : '1.2-2' }}</span>
                  </div>

                  <!-- Checkout Button -->
                  <button
                    (click)="procesarCompra()"
                    [disabled]="carritoItems.length === 0 || processingOrder"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition duration-200"
                  >
                    <span
                      *ngIf="processingOrder"
                      class="flex items-center justify-center"
                    >
                      <svg
                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Procesando...
                    </span>
                    <span *ngIf="!processingOrder"> Proceder al Pago </span>
                  </button>

                  <!-- Clear Cart -->
                  <button
                    (click)="clearCart()"
                    [disabled]="carritoItems.length === 0"
                    class="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition duration-200"
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CarritoComponent implements OnInit {
  carritoItems: CarritoItemDetalle[] = [];
  loading = false;
  processingOrder = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private carritoService: CarritoService,
    private articuloService: ArticuloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCarritoItems();

    // Suscribirse a cambios en el carrito
    this.carritoService.carrito$.subscribe(() => {
      this.loadCarritoItems();
    });
  }

  loadCarritoItems(): void {
    this.loading = true;
    this.errorMessage = '';

    const carritoItems = this.carritoService.getCarritoItems();

    if (carritoItems.length === 0) {
      this.carritoItems = [];
      this.loading = false;
      return;
    }

    // Cargar detalles de cada artículo
    const promises = carritoItems.map((item) =>
      this.articuloService.getById(item.articuloId).toPromise()
    );

    Promise.all(promises)
      .then((articulos) => {
        this.carritoItems = carritoItems.map((item, index) => ({
          ...item,
          articulo: articulos[index],
          subtotal: (articulos[index]?.precio || 0) * item.cantidad,
        }));
        this.loading = false;
      })
      .catch((error) => {
        this.errorMessage = 'Error al cargar los detalles de los productos';
        this.loading = false;
        console.error('Error:', error);
      });
  }

  increaseQuantity(articuloId: number): void {
    const item = this.carritoItems.find((i) => i.articuloId === articuloId);
    if (item && item.articulo && item.cantidad < item.articulo.stock) {
      this.carritoService.updateQuantity(articuloId, item.cantidad + 1);
    }
  }

  decreaseQuantity(articuloId: number): void {
    const item = this.carritoItems.find((i) => i.articuloId === articuloId);
    if (item && item.cantidad > 1) {
      this.carritoService.updateQuantity(articuloId, item.cantidad - 1);
    }
  }

  removeItem(articuloId: number): void {
    this.carritoService.removeFromCarrito(articuloId);
    this.successMessage = 'Producto eliminado del carrito';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.carritoService.clearCarrito();
      this.successMessage = 'Carrito vaciado';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }

  procesarCompra(): void {
    if (this.carritoItems.length === 0) {
      this.errorMessage = 'No hay productos en el carrito';
      return;
    }

    this.processingOrder = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.carritoService.procesarCompra().subscribe({
      next: (response) => {
        this.processingOrder = false;
        if (response.exito) {
          this.successMessage = `¡Compra realizada exitosamente! Total: $${response.totalGeneral.toFixed(
            2
          )}`;
          this.carritoService.clearCarrito();

          // Redirigir a mis compras después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/mis-compras']);
          }, 3000);
        } else {
          this.errorMessage = response.mensaje;
        }
      },
      error: (error) => {
        this.processingOrder = false;
        this.errorMessage =
          error.error?.message || 'Error al procesar la compra';
        console.error('Error:', error);
      },
    });
  }

  get totalItems(): number {
    return this.carritoItems.reduce((total, item) => total + item.cantidad, 0);
  }

  get subtotal(): number {
    return this.carritoItems.reduce((total, item) => total + item.subtotal, 0);
  }

  get tax(): number {
    return this.subtotal * 0.16; // 16% IVA
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/placeholder-product.svg';
  }
}
