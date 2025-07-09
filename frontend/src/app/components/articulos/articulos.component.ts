import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticuloService } from '../../services/articulo.service';
import { CarritoService } from '../../services/carrito.service';
import { Articulo } from '../../models/articulo.model';

@Component({
  selector: 'app-articulos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center">
              <h1 class="text-3xl font-bold text-gray-900">Productos</h1>
              <button
                routerLink="/dashboard"
                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Volver al Dashboard
              </button>
            </div>

            <!-- Search and Filters -->
            <div class="mt-4 flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <input
                  type="text"
                  [(ngModel)]="searchTerm"
                  (input)="filterArticulos()"
                  placeholder="Buscar productos..."
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div class="flex gap-2">
                <select
                  [(ngModel)]="selectedSort"
                  (change)="sortArticulos()"
                  class="px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Ordenar por...</option>
                  <option value="nombre">Nombre</option>
                  <option value="precio-asc">Precio (menor a mayor)</option>
                  <option value="precio-desc">Precio (mayor a menor)</option>
                </select>
                <button
                  (click)="loadArticulos()"
                  class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Actualizar
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

        <!-- Products Grid -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            *ngFor="let articulo of filteredArticulos"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <!-- Product Image -->
            <div
              class="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200"
            >
              <img
                [src]="articulo.imagen || 'assets/placeholder-product.svg'"
                [alt]="articulo.descripcion"
                class="w-full h-48 object-cover object-center group-hover:opacity-75"
                (error)="onImageError($event)"
              />
            </div>

            <!-- Product Info -->
            <div class="p-4">
              <div class="mb-2">
                <span
                  class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                >
                  {{ articulo.codigo }}
                </span>
              </div>

              <h3 class="text-lg font-medium text-gray-900 mb-2">
                {{ articulo.descripcion }}
              </h3>

              <div class="flex items-center justify-between mb-3">
                <span class="text-2xl font-bold text-gray-900">
                  \${{ articulo.precio | number : '1.2-2' }}
                </span>
                <span class="text-sm text-gray-500">
                  Stock: {{ articulo.stock }}
                </span>
              </div>

              <!-- Stock Status -->
              <div class="mb-3">
                <span
                  [class]="getStockStatusClass(articulo.stock)"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ getStockStatusText(articulo.stock) }}
                </span>
              </div>

              <!-- Quantity Selector -->
              <div class="flex items-center mb-3" *ngIf="articulo.stock > 0">
                <label class="text-sm font-medium text-gray-700 mr-2"
                  >Cantidad:</label
                >
                <div class="flex items-center">
                  <button
                    (click)="decreaseQuantity(articulo.articuloId)"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-l"
                    [disabled]="getSelectedQuantity(articulo.articuloId) <= 1"
                  >
                    -
                  </button>
                  <span class="bg-gray-100 px-3 py-1 border-t border-b">
                    {{ getSelectedQuantity(articulo.articuloId) }}
                  </span>
                  <button
                    (click)="increaseQuantity(articulo.articuloId)"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-r"
                    [disabled]="
                      getSelectedQuantity(articulo.articuloId) >= articulo.stock
                    "
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Add to Cart Button -->
              <button
                (click)="addToCarrito(articulo)"
                [disabled]="articulo.stock <= 0"
                [class]="
                  articulo.stock > 0
                    ? 'w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200'
                    : 'w-full bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-md cursor-not-allowed'
                "
              >
                {{ articulo.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          *ngIf="!loading && filteredArticulos.length === 0"
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            ></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            No hay productos
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{
              searchTerm
                ? 'No se encontraron productos con ese criterio de búsqueda.'
                : 'No hay productos disponibles en este momento.'
            }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ArticulosComponent implements OnInit {
  articulos: Articulo[] = [];
  filteredArticulos: Articulo[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  selectedSort = '';
  selectedQuantities: { [key: number]: number } = {};

  constructor(
    private articuloService: ArticuloService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.loadArticulos();
  }

  loadArticulos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.articuloService.getAll().subscribe({
      next: (articulos) => {
        this.articulos = articulos.filter((a) => a.activo);
        this.filteredArticulos = [...this.articulos];
        this.initializeQuantities();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los productos';
        this.loading = false;
        console.error('Error:', error);
      },
    });
  }

  initializeQuantities(): void {
    this.articulos.forEach((articulo) => {
      this.selectedQuantities[articulo.articuloId] = 1;
    });
  }

  filterArticulos(): void {
    if (!this.searchTerm.trim()) {
      this.filteredArticulos = [...this.articulos];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredArticulos = this.articulos.filter(
        (articulo) =>
          articulo.descripcion.toLowerCase().includes(term) ||
          articulo.codigo.toLowerCase().includes(term)
      );
    }
    this.sortArticulos();
  }

  sortArticulos(): void {
    switch (this.selectedSort) {
      case 'nombre':
        this.filteredArticulos.sort((a, b) =>
          a.descripcion.localeCompare(b.descripcion)
        );
        break;
      case 'precio-asc':
        this.filteredArticulos.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        this.filteredArticulos.sort((a, b) => b.precio - a.precio);
        break;
    }
  }

  getSelectedQuantity(articuloId: number): number {
    return this.selectedQuantities[articuloId] || 1;
  }

  increaseQuantity(articuloId: number): void {
    const articulo = this.articulos.find((a) => a.articuloId === articuloId);
    if (articulo && this.selectedQuantities[articuloId] < articulo.stock) {
      this.selectedQuantities[articuloId]++;
    }
  }

  decreaseQuantity(articuloId: number): void {
    if (this.selectedQuantities[articuloId] > 1) {
      this.selectedQuantities[articuloId]--;
    }
  }

  addToCarrito(articulo: Articulo): void {
    const cantidad = this.getSelectedQuantity(articulo.articuloId);
    this.carritoService.addToCarrito(articulo.articuloId, cantidad);

    this.successMessage = `${
      articulo.descripcion
    } agregado al carrito (${cantidad} unidad${cantidad > 1 ? 'es' : ''})`;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  getStockStatusClass(stock: number): string {
    if (stock === 0) {
      return 'bg-red-100 text-red-800';
    } else if (stock <= 5) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  }

  getStockStatusText(stock: number): string {
    if (stock === 0) {
      return 'Sin stock';
    } else if (stock <= 5) {
      return 'Pocas unidades';
    } else {
      return 'Disponible';
    }
  }

  onImageError(event: any): void {
    event.target.src = 'assets/placeholder-product.svg';
  }
}
