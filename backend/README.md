# Tienda API - Backend ASP.NET Core

Este es un proyecto de API REST desarrollado en ASP.NET Core 8.0 que implementa un sistema de tienda con autenticación JWT, carrito de compras y gestión completa de inventario.

## 🏗️ Arquitectura

El proyecto sigue una arquitectura de 4 capas:

- **Controllers**: Controladores de la API REST
- **DTOs**: Objetos de transferencia de datos
- **Interfaces**: Contratos de los repositorios y servicios
- **Repositories**: Acceso a datos mediante procedimientos almacenados

## 📋 Características

- ✅ Autenticación JWT
- ✅ CRUD completo para Clientes, Tiendas y Artículos
- ✅ Sistema de carrito de compras
- ✅ Relaciones entre entidades
- ✅ Procedimientos almacenados con transacciones
- ✅ Manejo de errores robusto
- ✅ Documentación con Swagger

## 🗄️ Base de Datos

### Tablas Principales:

- **Clientes**: Información de usuarios
- **Tiendas**: Sucursales
- **Articulos**: Productos del inventario
- **ArticuloTienda**: Relación artículo-tienda (stock por tienda)
- **ClienteArticulo**: Historial de compras/carrito

### Relaciones:

- Cliente → ClienteArticulo ← Artículo (Muchos a Muchos)
- Artículo → ArticuloTienda ← Tienda (Muchos a Muchos)

## 🚀 Configuración e Instalación

### Pre-requisitos:

- .NET 8.0 SDK
- SQL Server (LocalDB o instancia completa)
- Visual Studio 2022 o VS Code

### Pasos de instalación:

1. **Restaurar paquetes NuGet:**

   ```powershell
   dotnet restore
   ```

2. **Configurar la cadena de conexión:**
   Editar `appsettings.json` y `appsettings.Development.json` con tu cadena de conexión:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TiendaDB;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

3. **Crear la base de datos:**
   Ejecutar los scripts SQL en orden:

   - `Database/TiendaDB_Script_Part1.sql`
   - `Database/TiendaDB_Script_Part2.sql`

4. **Ejecutar la aplicación:**
   ```powershell
   dotnet run
   ```

## 📚 API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo cliente

### Clientes (Requiere autenticación)

- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/{id}` - Obtener cliente por ID
- `POST /api/clientes` - Crear nuevo cliente
- `PUT /api/clientes/{id}` - Actualizar cliente
- `DELETE /api/clientes/{id}` - Eliminar cliente

### Tiendas (Requiere autenticación)

- `GET /api/tiendas` - Obtener todas las tiendas
- `GET /api/tiendas/{id}` - Obtener tienda por ID
- `POST /api/tiendas` - Crear nueva tienda
- `PUT /api/tiendas/{id}` - Actualizar tienda
- `DELETE /api/tiendas/{id}` - Eliminar tienda

### Artículos (Requiere autenticación)

- `GET /api/articulos` - Obtener todos los artículos
- `GET /api/articulos/{id}` - Obtener artículo por ID
- `GET /api/articulos/codigo/{codigo}` - Obtener artículo por código
- `GET /api/articulos/tienda/{tiendaId}` - Obtener artículos por tienda
- `POST /api/articulos` - Crear nuevo artículo
- `PUT /api/articulos/{id}` - Actualizar artículo
- `DELETE /api/articulos/{id}` - Eliminar artículo

### Carrito (Requiere autenticación)

- `POST /api/carrito/procesar` - Procesar compra del carrito
- `GET /api/carrito/historial` - Obtener historial de compras
- `POST /api/carrito/agregar` - Agregar artículo individual

## 🔐 Autenticación JWT

### Configuración JWT:

```json
{
  "JwtSettings": {
    "SecretKey": "MiClaveSecretaSuperLargaYSegura123456789",
    "Issuer": "TiendaAPI",
    "Audience": "TiendaClients"
  }
}
```

### Uso en Swagger:

1. Registrarse o hacer login para obtener el token
2. Hacer clic en "Authorize" en Swagger UI
3. Ingresar: `Bearer {tu-token-jwt}`

## 📖 Ejemplos de Uso

### Registro de Cliente:

```json
POST /api/auth/register
{
  "nombre": "Juan",
  "apellidos": "Pérez",
  "direccion": "Calle Principal 123",
  "email": "juan@email.com",
  "password": "MiPassword123"
}
```

### Login:

```json
POST /api/auth/login
{
  "email": "juan@email.com",
  "password": "MiPassword123"
}
```

### Procesar Carrito:

```json
POST /api/carrito/procesar
{
  "items": [
    {
      "articuloId": 1,
      "cantidad": 2
    },
    {
      "articuloId": 3,
      "cantidad": 1
    }
  ]
}
```

## 🛠️ Tecnologías Utilizadas

- **ASP.NET Core 8.0** - Framework web
- **Entity Framework Core 8.0** - ORM (solo para configuración de conexión)
- **SQL Server** - Base de datos
- **JWT Bearer** - Autenticación
- **BCrypt.Net** - Hash de contraseñas
- **Swagger/OpenAPI** - Documentación de API
- **System.Data.SqlClient** - Acceso directo a datos

## 📁 Estructura del Proyecto

```
backend/
├── Controllers/          # Controladores de la API
├── DTOs/                # Objetos de transferencia de datos
├── Entities/            # Modelos de entidades
├── Interfaces/          # Contratos de repositorios y servicios
├── Repositories/        # Implementación de acceso a datos
├── Services/            # Servicios de negocio
├── Data/               # Configuración de base de datos
├── Database/           # Scripts SQL
├── Properties/         # Configuración de launch
├── appsettings.json    # Configuración de producción
└── appsettings.Development.json  # Configuración de desarrollo
```

## 🔧 Procedimientos Almacenados

Todos los procedimientos almacenados están implementados con:

- ✅ Transacciones para integridad de datos
- ✅ Manejo de errores con ROLLBACK
- ✅ Validaciones de integridad referencial
- ✅ Parámetros de salida para IDs generados

### Ejemplos de procedimientos:

- `SP_Cliente_Create` - Crear cliente con validación de email único
- `SP_Articulo_Update` - Actualizar artículo con validación de código único
- `SP_ClienteArticulo_ProcesarCompra` - Procesar compra con actualización de stock

## 🚨 Notas Importantes

1. **Seguridad**: Las contraseñas se hashean con BCrypt
2. **Stock**: Se valida disponibilidad antes de procesar compras
3. **Transacciones**: Todas las operaciones críticas usan transacciones
4. **Borrado lógico**: Los registros se marcan como inactivos en lugar de eliminarlos
5. **Validaciones**: Se validan datos tanto en la API como en la base de datos

## 📊 Datos de Prueba

El script incluye datos de prueba:

- 3 tiendas (Centro, Norte, Sur)
- 5 artículos (Laptop, Mouse, Teclado, Monitor, Audífonos)
- Stock distribuido entre tiendas

## 🐛 Troubleshooting

### Error de conexión a base de datos:

1. Verificar que SQL Server esté ejecutándose
2. Confirmar la cadena de conexión en appsettings.json
3. Ejecutar los scripts SQL en orden

### Error de autenticación:

1. Verificar que el token JWT sea válido
2. Confirmar que el token se envíe en el header Authorization
3. Formato: `Bearer {token}`

## 📝 Licencia

Este proyecto está desarrollado como parte de una prueba técnica.

---

**Desarrollado con ❤️ usando ASP.NET Core 8.0**
