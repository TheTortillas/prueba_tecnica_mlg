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
import { ClienteService } from '../../services/cliente.service';
import {
  Cliente,
  ClienteCreate,
  ClienteUpdate,
} from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center">
              <h1 class="text-3xl font-bold text-gray-900">
                Gestión de Clientes
              </h1>
              <div class="flex gap-2">
                <button
                  (click)="showCreateForm = !showCreateForm"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {{ showCreateForm ? 'Cancelar' : 'Nuevo Cliente' }}
                </button>
                <button
                  routerLink="/dashboard"
                  class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </button>
              </div>
            </div>

            <!-- Search -->
            <div class="mt-4">
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="filterClientes()"
                placeholder="Buscar clientes por nombre, apellidos o email..."
                class="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <!-- Create/Edit Form -->
        <div
          *ngIf="showCreateForm || editingCliente"
          class="bg-white shadow rounded-lg mb-6"
        >
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              {{ editingCliente ? 'Editar Cliente' : 'Nuevo Cliente' }}
            </h2>

            <form
              [formGroup]="clienteForm"
              (ngSubmit)="onSubmit()"
              class="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label
                  for="nombre"
                  class="block text-sm font-medium text-gray-700"
                  >Nombre</label
                >
                <input
                  type="text"
                  id="nombre"
                  formControlName="nombre"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nombre del cliente"
                />
                <div
                  *ngIf="
                    clienteForm.get('nombre')?.invalid &&
                    clienteForm.get('nombre')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Nombre es requerido
                </div>
              </div>

              <div>
                <label
                  for="apellidos"
                  class="block text-sm font-medium text-gray-700"
                  >Apellidos</label
                >
                <input
                  type="text"
                  id="apellidos"
                  formControlName="apellidos"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Apellidos del cliente"
                />
                <div
                  *ngIf="
                    clienteForm.get('apellidos')?.invalid &&
                    clienteForm.get('apellidos')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Apellidos son requeridos
                </div>
              </div>

              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                  >Email</label
                >
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="email@ejemplo.com"
                />
                <div
                  *ngIf="
                    clienteForm.get('email')?.invalid &&
                    clienteForm.get('email')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Email válido es requerido
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
                  placeholder="Dirección del cliente"
                />
                <div
                  *ngIf="
                    clienteForm.get('direccion')?.invalid &&
                    clienteForm.get('direccion')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Dirección es requerida
                </div>
              </div>

              <div *ngIf="!editingCliente">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                  >Contraseña</label
                >
                <input
                  type="password"
                  id="password"
                  formControlName="password"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Contraseña"
                />
                <div
                  *ngIf="
                    clienteForm.get('password')?.invalid &&
                    clienteForm.get('password')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Contraseña debe tener al menos 6 caracteres
                </div>
              </div>

              <div class="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  [disabled]="clienteForm.invalid || loading"
                  class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md"
                >
                  {{ editingCliente ? 'Actualizar' : 'Crear' }}
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

        <!-- Clientes Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              Lista de Clientes
            </h2>

            <!-- Empty State -->
            <div
              *ngIf="!loading && filteredClientes.length === 0 && !searchTerm"
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                ></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                No hay clientes
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Comienza creando el primer cliente.
              </p>
            </div>

            <!-- No Search Results -->
            <div
              *ngIf="!loading && filteredClientes.length === 0 && searchTerm"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                No se encontraron clientes
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                No hay clientes que coincidan con "{{ searchTerm }}"
              </p>
            </div>

            <!-- Table -->
            <div *ngIf="filteredClientes.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Cliente
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Dirección
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Estado
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Fecha Registro
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let cliente of filteredClientes">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div
                            class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center"
                          >
                            <span class="text-sm font-medium text-white">
                              {{
                                getInitials(cliente.nombre, cliente.apellidos)
                              }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ cliente.nombre }} {{ cliente.apellidos }}
                          </div>
                          <div class="text-sm text-gray-500">
                            ID: {{ cliente.clienteId }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ cliente.email }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      <div class="max-w-xs truncate">
                        {{ cliente.direccion }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        [class]="
                          cliente.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        "
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ cliente.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ cliente.fechaCreacion | date : 'short' }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                    >
                      <div class="flex justify-end gap-2">
                        <button
                          (click)="editCliente(cliente)"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                        <button
                          (click)="deleteCliente(cliente.clienteId)"
                          class="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  clienteForm: FormGroup;
  showCreateForm = false;
  editingCliente: Cliente | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';

  constructor(private clienteService: ClienteService, private fb: FormBuilder) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading = true;
    this.errorMessage = '';

    this.clienteService.getAll().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.filteredClientes = [...this.clientes];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los clientes';
        this.loading = false;
        console.error('Error:', error);
      },
    });
  }

  filterClientes(): void {
    if (!this.searchTerm.trim()) {
      this.filteredClientes = [...this.clientes];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredClientes = this.clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(term) ||
          cliente.apellidos.toLowerCase().includes(term) ||
          cliente.email.toLowerCase().includes(term)
      );
    }
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.editingCliente) {
        // Update (sin password)
        const updateData: ClienteUpdate = {
          nombre: this.clienteForm.value.nombre,
          apellidos: this.clienteForm.value.apellidos,
          email: this.clienteForm.value.email,
          direccion: this.clienteForm.value.direccion,
        };

        this.clienteService
          .update(this.editingCliente.clienteId, updateData)
          .subscribe({
            next: (cliente) => {
              this.successMessage = 'Cliente actualizado exitosamente';
              this.loadClientes();
              this.cancelEdit();
              this.loading = false;
            },
            error: (error) => {
              this.errorMessage = 'Error al actualizar el cliente';
              this.loading = false;
              console.error('Error:', error);
            },
          });
      } else {
        // Create
        this.clienteService.create(this.clienteForm.value).subscribe({
          next: (cliente) => {
            this.successMessage = 'Cliente creado exitosamente';
            this.loadClientes();
            this.cancelEdit();
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Error al crear el cliente';
            this.loading = false;
            console.error('Error:', error);
          },
        });
      }
    }
  }

  editCliente(cliente: Cliente): void {
    this.editingCliente = cliente;
    this.showCreateForm = true;

    // Remove password validation for editing
    this.clienteForm.get('password')?.clearValidators();
    this.clienteForm.get('password')?.updateValueAndValidity();

    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      email: cliente.email,
      direccion: cliente.direccion,
    });
  }

  cancelEdit(): void {
    this.editingCliente = null;
    this.showCreateForm = false;
    this.clienteForm.reset();

    // Restore password validation for creating
    this.clienteForm
      .get('password')
      ?.setValidators([Validators.required, Validators.minLength(6)]);
    this.clienteForm.get('password')?.updateValueAndValidity();
  }

  deleteCliente(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      this.loading = true;
      this.clienteService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Cliente eliminado exitosamente';
          this.loadClientes();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el cliente';
          this.loading = false;
          console.error('Error:', error);
        },
      });
    }
  }

  getInitials(nombre: string, apellidos: string): string {
    return (nombre.charAt(0) + apellidos.charAt(0)).toUpperCase();
  }
}
