import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            O
            <a
              routerLink="/login"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              iniciar sesión
            </a>
          </p>
        </div>

        <form
          class="mt-8 space-y-6"
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit()"
        >
          <div class="space-y-4">
            <div>
              <label
                for="nombre"
                class="block text-sm font-medium text-gray-700"
                >Nombre</label
              >
              <input
                id="nombre"
                name="nombre"
                type="text"
                formControlName="nombre"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Tu nombre"
              />
              <div
                *ngIf="
                  registerForm.get('nombre')?.invalid &&
                  registerForm.get('nombre')?.touched
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
                id="apellidos"
                name="apellidos"
                type="text"
                formControlName="apellidos"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Tus apellidos"
              />
              <div
                *ngIf="
                  registerForm.get('apellidos')?.invalid &&
                  registerForm.get('apellidos')?.touched
                "
                class="text-red-500 text-sm mt-1"
              >
                Apellidos son requeridos
              </div>
            </div>

            <div>
              <label
                for="direccion"
                class="block text-sm font-medium text-gray-700"
                >Dirección</label
              >
              <input
                id="direccion"
                name="direccion"
                type="text"
                formControlName="direccion"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Tu dirección"
              />
              <div
                *ngIf="
                  registerForm.get('direccion')?.invalid &&
                  registerForm.get('direccion')?.touched
                "
                class="text-red-500 text-sm mt-1"
              >
                Dirección es requerida
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email</label
              >
              <input
                id="email"
                name="email"
                type="email"
                formControlName="email"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="tu@email.com"
              />
              <div
                *ngIf="
                  registerForm.get('email')?.invalid &&
                  registerForm.get('email')?.touched
                "
                class="text-red-500 text-sm mt-1"
              >
                Email válido es requerido
              </div>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
                >Contraseña</label
              >
              <input
                id="password"
                name="password"
                type="password"
                formControlName="password"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Contraseña"
              />
              <div
                *ngIf="
                  registerForm.get('password')?.invalid &&
                  registerForm.get('password')?.touched
                "
                class="text-red-500 text-sm mt-1"
              >
                Contraseña debe tener al menos 6 caracteres
              </div>
            </div>
          </div>

          <div
            *ngIf="errorMessage"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          >
            {{ errorMessage }}
          </div>

          <div
            *ngIf="successMessage"
            class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
          >
            {{ successMessage }}
          </div>

          <div>
            <button
              type="submit"
              [disabled]="registerForm.invalid || loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="loading" class="mr-2">
                <svg
                  class="animate-spin h-4 w-4 text-white"
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
              </span>
              {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage =
            'Cuenta creada exitosamente. Ahora puedes iniciar sesión.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error.error?.message || 'Error al crear la cuenta';
        },
      });
    }
  }
}
