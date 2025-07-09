import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TiendaService } from '../../services/tienda.service';
import { ArticuloService } from '../../services/articulo.service';
import { Tienda, TiendaCreate, TiendaUpdate } from '../../models/tienda.model';
import { Articulo, ArticuloTienda } from '../../models/articulo.model';

@Component({
  selector: 'app-tiendas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center">
              <h1 class="text-3xl font-bold text-gray-900">Tiendas</h1>
              <div class="flex gap-2">
                <button
                  (click)="showCreateForm = !showCreateForm"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {{ showCreateForm ? 'Cancelar' : 'Nueva Tienda' }}
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

        <!-- Create/Edit Form -->
        <div
          *ngIf="showCreateForm || editingTienda"
          class="bg-white shadow rounded-lg mb-6"
        >
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              {{ editingTienda ? 'Editar Tienda' : 'Nueva Tienda' }}
            </h2>

            <form
              [formGroup]="tiendaForm"
              (ngSubmit)="onSubmit()"
              class="space-y-4"
            >
              <div>
                <label
                  for="sucursal"
                  class="block text-sm font-medium text-gray-700"
                  >Sucursal</label
                >
                <input
                  type="text"
                  id="sucursal"
                  formControlName="sucursal"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nombre de la sucursal"
                />
                <div
                  *ngIf="
                    tiendaForm.get('sucursal')?.invalid &&
                    tiendaForm.get('sucursal')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Sucursal es requerida
                </div>
              </div>

              <div>
                <label
                  for="direccion"
                  class="block text-sm font-medium text-gray-700"
                  >Dirección</label
                >
                <input
                  type="text"
                  id="direccion"
                  formControlName="direccion"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Dirección de la tienda"
                />
                <div
                  *ngIf="
                    tiendaForm.get('direccion')?.invalid &&
                    tiendaForm.get('direccion')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Dirección es requerida
                </div>
              </div>

              <div class="flex gap-2">
                <button
                  type="submit"
                  [disabled]="tiendaForm.invalid || loading"
                  class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md"
                >
                  {{ editingTienda ? 'Actualizar' : 'Crear' }}
                </button>
                <button
                  type="button"
                  (click)="cancelEdit()"
                  class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </form>
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

        <!-- Tiendas Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let tienda of tiendas"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <div class="p-6">
              <!-- Tienda Header -->
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ tienda.sucursal }}
                </h3>
                <span
                  [class]="
                    tienda.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ tienda.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </div>

              <!-- Tienda Info -->
              <div class="space-y-2 mb-4">
                <div class="flex items-start">
                  <svg
                    class="h-5 w-5 text-gray-400 mt-0.5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <span class="text-sm text-gray-600">{{
                    tienda.direccion
                  }}</span>
                </div>

                <div class="flex items-center">
                  <svg
                    class="h-5 w-5 text-gray-400 mr-2"
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
                  <span class="text-sm text-gray-600">
                    Productos: {{ getTiendaProductCount(tienda.tiendaId) }}
                  </span>
                </div>

                <div class="flex items-center">
                  <svg
                    class="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span class="text-sm text-gray-600">
                    Creada: {{ tienda.fechaCreacion | date : 'short' }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button
                  (click)="editTienda(tienda)"
                  class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-200"
                >
                  Editar
                </button>
                <button
                  (click)="viewTiendaProducts(tienda)"
                  class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-200"
                >
                  Ver Productos
                </button>
                <button
                  (click)="deleteTienda(tienda.tiendaId)"
                  class="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && tiendas.length === 0" class="text-center py-12">
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay tiendas</h3>
          <p class="mt-1 text-sm text-gray-500">
            Comienza creando tu primera tienda.
          </p>
          <div class="mt-6">
            <button
              (click)="showCreateForm = true"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Nueva Tienda
            </button>
          </div>
        </div>

        <!-- Products Modal/Overlay (simple version) -->
        <div
          *ngIf="selectedTienda"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          (click)="closeProductsModal()"
        >
          <div
            class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white"
            (click)="$event.stopPropagation()"
          >
            <div class="mt-3">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium text-gray-900">
                  Productos en {{ selectedTienda.sucursal }}
                </h3>
                <button
                  (click)="closeProductsModal()"
                  class="text-gray-400 hover:text-gray-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <div
                *ngIf="tiendaProducts.length === 0"
                class="text-center py-8 text-gray-500"
              >
                Esta tienda no tiene productos asignados.
              </div>

              <div
                *ngIf="tiendaProducts.length > 0"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto"
              >
                <div
                  *ngFor="let articulo of tiendaProducts"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <h4 class="font-medium text-gray-900">
                    {{ articulo.descripcion }}
                  </h4>
                  <p class="text-sm text-gray-600">
                    Código: {{ articulo.codigo }}
                  </p>
                  <p class="text-sm text-gray-600">
                    Precio: \${{ articulo.precio | number : '1.2-2' }}
                  </p>
                  <p class="text-sm text-gray-600">
                    Stock: {{ articulo.stock }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TiendasComponent implements OnInit {
  tiendas: Tienda[] = [];
  tiendaForm: FormGroup;
  showCreateForm = false;
  editingTienda: Tienda | null = null;
  selectedTienda: Tienda | null = null;
  tiendaProducts: Articulo[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  tiendaProductCounts: { [key: number]: number } = {};

  constructor(
    private tiendaService: TiendaService,
    private articuloService: ArticuloService,
    private fb: FormBuilder
  ) {
    this.tiendaForm = this.fb.group({
      sucursal: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTiendas();
  }

  loadTiendas(): void {
    this.loading = true;
    this.errorMessage = '';

    this.tiendaService.getAll().subscribe({
      next: (tiendas) => {
        this.tiendas = tiendas;
        this.loadProductCounts();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las tiendas';
        this.loading = false;
        console.error('Error:', error);
      },
    });
  }

  loadProductCounts(): void {
    // Cargar el conteo de productos para cada tienda
    this.tiendas.forEach((tienda) => {
      this.articuloService.getByTienda(tienda.tiendaId).subscribe({
        next: (productos) => {
          this.tiendaProductCounts[tienda.tiendaId] = productos.length;
        },
        error: (error) => {
          console.error(
            'Error loading product count for tienda:',
            tienda.tiendaId,
            error
          );
        },
      });
    });
  }

  onSubmit(): void {
    if (this.tiendaForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.editingTienda) {
        // Update
        this.tiendaService
          .update(this.editingTienda.tiendaId, this.tiendaForm.value)
          .subscribe({
            next: (tienda) => {
              this.successMessage = 'Tienda actualizada exitosamente';
              this.loadTiendas();
              this.cancelEdit();
              this.loading = false;
            },
            error: (error) => {
              this.errorMessage = 'Error al actualizar la tienda';
              this.loading = false;
              console.error('Error:', error);
            },
          });
      } else {
        // Create
        this.tiendaService.create(this.tiendaForm.value).subscribe({
          next: (tienda) => {
            this.successMessage = 'Tienda creada exitosamente';
            this.loadTiendas();
            this.cancelEdit();
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Error al crear la tienda';
            this.loading = false;
            console.error('Error:', error);
          },
        });
      }
    }
  }

  editTienda(tienda: Tienda): void {
    this.editingTienda = tienda;
    this.showCreateForm = true;
    this.tiendaForm.patchValue({
      sucursal: tienda.sucursal,
      direccion: tienda.direccion,
    });
  }

  cancelEdit(): void {
    this.editingTienda = null;
    this.showCreateForm = false;
    this.tiendaForm.reset();
  }

  deleteTienda(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tienda?')) {
      this.loading = true;
      this.tiendaService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Tienda eliminada exitosamente';
          this.loadTiendas();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar la tienda';
          this.loading = false;
          console.error('Error:', error);
        },
      });
    }
  }

  viewTiendaProducts(tienda: Tienda): void {
    this.selectedTienda = tienda;
    this.articuloService.getByTienda(tienda.tiendaId).subscribe({
      next: (productos) => {
        this.tiendaProducts = productos;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los productos de la tienda';
        console.error('Error:', error);
      },
    });
  }

  closeProductsModal(): void {
    this.selectedTienda = null;
    this.tiendaProducts = [];
  }

  getTiendaProductCount(tiendaId: number): number {
    return this.tiendaProductCounts[tiendaId] || 0;
  }
}
