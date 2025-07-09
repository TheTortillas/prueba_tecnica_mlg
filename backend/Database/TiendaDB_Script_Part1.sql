-- Script para crear la base de datos y todas las tablas con procedimientos almacenados
-- Base de datos: TiendaDB
-- Autor: Sistema Tienda API
-- Fecha: 2025-07-08

USE master;
GO

-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TiendaDB')
BEGIN
    CREATE DATABASE TiendaDB;
END
GO

USE TiendaDB;
GO

-- =============================================
-- CREAR TABLAS
-- =============================================

-- Tabla Clientes
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Clientes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Clientes](
        [ClienteId] INT IDENTITY(1,1) NOT NULL,
        [Nombre] NVARCHAR(100) NOT NULL,
        [Apellidos] NVARCHAR(100) NOT NULL,
        [Direccion] NVARCHAR(200) NOT NULL,
        [Email] NVARCHAR(100) NOT NULL UNIQUE,
        [PasswordHash] NVARCHAR(255) NOT NULL,
        [FechaCreacion] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [Activo] BIT NOT NULL DEFAULT 1,
        CONSTRAINT [PK_Clientes] PRIMARY KEY CLUSTERED ([ClienteId] ASC)
    );
    
    CREATE NONCLUSTERED INDEX [IX_Clientes_Email] ON [dbo].[Clientes] ([Email]);
END
GO

-- Tabla Tiendas
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Tiendas]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Tiendas](
        [TiendaId] INT IDENTITY(1,1) NOT NULL,
        [Sucursal] NVARCHAR(100) NOT NULL,
        [Direccion] NVARCHAR(200) NOT NULL,
        [FechaCreacion] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [Activo] BIT NOT NULL DEFAULT 1,
        CONSTRAINT [PK_Tiendas] PRIMARY KEY CLUSTERED ([TiendaId] ASC)
    );
END
GO

-- Tabla Articulos
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Articulos]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Articulos](
        [ArticuloId] INT IDENTITY(1,1) NOT NULL,
        [Codigo] NVARCHAR(50) NOT NULL UNIQUE,
        [Descripcion] NVARCHAR(200) NOT NULL,
        [Precio] DECIMAL(18,2) NOT NULL,
        [Imagen] NVARCHAR(500) NULL,
        [Stock] INT NOT NULL DEFAULT 0,
        [FechaCreacion] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [Activo] BIT NOT NULL DEFAULT 1,
        CONSTRAINT [PK_Articulos] PRIMARY KEY CLUSTERED ([ArticuloId] ASC),
        CONSTRAINT [CK_Articulos_Precio] CHECK ([Precio] >= 0),
        CONSTRAINT [CK_Articulos_Stock] CHECK ([Stock] >= 0)
    );
    
    CREATE NONCLUSTERED INDEX [IX_Articulos_Codigo] ON [dbo].[Articulos] ([Codigo]);
END
GO

-- Tabla ArticuloTienda (Relación Articulo-Tienda)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ArticuloTienda]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ArticuloTienda](
        [ArticuloTiendaId] INT IDENTITY(1,1) NOT NULL,
        [ArticuloId] INT NOT NULL,
        [TiendaId] INT NOT NULL,
        [Fecha] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [StockTienda] INT NOT NULL DEFAULT 0,
        CONSTRAINT [PK_ArticuloTienda] PRIMARY KEY CLUSTERED ([ArticuloTiendaId] ASC),
        CONSTRAINT [FK_ArticuloTienda_Articulos] FOREIGN KEY([ArticuloId]) REFERENCES [dbo].[Articulos] ([ArticuloId]) ON DELETE CASCADE,
        CONSTRAINT [FK_ArticuloTienda_Tiendas] FOREIGN KEY([TiendaId]) REFERENCES [dbo].[Tiendas] ([TiendaId]) ON DELETE CASCADE,
        CONSTRAINT [UK_ArticuloTienda] UNIQUE([ArticuloId], [TiendaId]),
        CONSTRAINT [CK_ArticuloTienda_Stock] CHECK ([StockTienda] >= 0)
    );
END
GO

-- Tabla ClienteArticulo (Relación Cliente-Articulo / Carrito/Compras)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ClienteArticulo]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ClienteArticulo](
        [ClienteArticuloId] INT IDENTITY(1,1) NOT NULL,
        [ClienteId] INT NOT NULL,
        [ArticuloId] INT NOT NULL,
        [Fecha] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [Cantidad] INT NOT NULL DEFAULT 1,
        [PrecioUnitario] DECIMAL(18,2) NOT NULL,
        [Total] AS ([Cantidad] * [PrecioUnitario]) PERSISTED,
        CONSTRAINT [PK_ClienteArticulo] PRIMARY KEY CLUSTERED ([ClienteArticuloId] ASC),
        CONSTRAINT [FK_ClienteArticulo_Clientes] FOREIGN KEY([ClienteId]) REFERENCES [dbo].[Clientes] ([ClienteId]) ON DELETE CASCADE,
        CONSTRAINT [FK_ClienteArticulo_Articulos] FOREIGN KEY([ArticuloId]) REFERENCES [dbo].[Articulos] ([ArticuloId]) ON DELETE CASCADE,
        CONSTRAINT [CK_ClienteArticulo_Cantidad] CHECK ([Cantidad] > 0),
        CONSTRAINT [CK_ClienteArticulo_Precio] CHECK ([PrecioUnitario] >= 0)
    );
    
    CREATE NONCLUSTERED INDEX [IX_ClienteArticulo_ClienteId] ON [dbo].[ClienteArticulo] ([ClienteId]);
    CREATE NONCLUSTERED INDEX [IX_ClienteArticulo_ArticuloId] ON [dbo].[ClienteArticulo] ([ArticuloId]);
    CREATE NONCLUSTERED INDEX [IX_ClienteArticulo_Fecha] ON [dbo].[ClienteArticulo] ([Fecha]);
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - CLIENTES
-- =============================================

-- SP_Cliente_GetAll
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Cliente_GetAll]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Cliente_GetAll];
GO

CREATE PROCEDURE [dbo].[SP_Cliente_GetAll]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ClienteId,
        Nombre,
        Apellidos,
        Direccion,
        Email,
        FechaCreacion,
        Activo
    FROM Clientes
    WHERE Activo = 1
    ORDER BY Nombre, Apellidos;
END
GO

-- SP_Cliente_GetById
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Cliente_GetById]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Cliente_GetById];
GO

CREATE PROCEDURE [dbo].[SP_Cliente_GetById]
    @ClienteId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ClienteId,
        Nombre,
        Apellidos,
        Direccion,
        Email,
        FechaCreacion,
        Activo
    FROM Clientes
    WHERE ClienteId = @ClienteId AND Activo = 1;
END
GO

-- SP_Cliente_GetByEmail
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Cliente_GetByEmail]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Cliente_GetByEmail];
GO

CREATE PROCEDURE [dbo].[SP_Cliente_GetByEmail]
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ClienteId,
        Nombre,
        Apellidos,
        Direccion,
        Email,
        PasswordHash,
        FechaCreacion,
        Activo
    FROM Clientes
    WHERE Email = @Email AND Activo = 1;
END
GO

-- SP_Cliente_Create
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Cliente_Create]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Cliente_Create];
GO

CREATE PROCEDURE [dbo].[SP_Cliente_Create]
    @Nombre NVARCHAR(100),
    @Apellidos NVARCHAR(100),
    @Direccion NVARCHAR(200),
    @Email NVARCHAR(100),
    @PasswordHash NVARCHAR(255),
    @ClienteId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Verificar si el email ya existe
        IF EXISTS (SELECT 1 FROM Clientes WHERE Email = @Email)
        BEGIN
            RAISERROR('El email ya está registrado', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        INSERT INTO Clientes (Nombre, Apellidos, Direccion, Email, PasswordHash)
        VALUES (@Nombre, @Apellidos, @Direccion, @Email, @PasswordHash);
        
        SET @ClienteId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_Cliente_Update
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Cliente_Update]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Cliente_Update];
GO

CREATE PROCEDURE [dbo].[SP_Cliente_Update]
    @ClienteId INT,
    @Nombre NVARCHAR(100),
    @Apellidos NVARCHAR(100),
    @Direccion NVARCHAR(200),
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Verificar si el cliente existe
        IF NOT EXISTS (SELECT 1 FROM Clientes WHERE ClienteId = @ClienteId AND Activo = 1)
        BEGIN
            RAISERROR('Cliente no encontrado', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Verificar si el email ya existe en otro cliente
        IF EXISTS (SELECT 1 FROM Clientes WHERE Email = @Email AND ClienteId != @ClienteId)
        BEGIN
            RAISERROR('El email ya está registrado por otro cliente', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        UPDATE Clientes 
        SET 
            Nombre = @Nombre,
            Apellidos = @Apellidos,
            Direccion = @Direccion,
            Email = @Email
        WHERE ClienteId = @ClienteId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_Cliente_Delete
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Cliente_Delete]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Cliente_Delete];
GO

CREATE PROCEDURE [dbo].[SP_Cliente_Delete]
    @ClienteId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        UPDATE Clientes 
        SET Activo = 0
        WHERE ClienteId = @ClienteId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_Cliente_Exists
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Cliente_Exists]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Cliente_Exists];
GO

CREATE PROCEDURE [dbo].[SP_Cliente_Exists]
    @ClienteId INT,
    @Exists BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Clientes WHERE ClienteId = @ClienteId AND Activo = 1)
        SET @Exists = 1;
    ELSE
        SET @Exists = 0;
END
GO

-- SP_Cliente_EmailExists
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Cliente_EmailExists]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Cliente_EmailExists];
GO

CREATE PROCEDURE [dbo].[SP_Cliente_EmailExists]
    @Email NVARCHAR(100),
    @Exists BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Clientes WHERE Email = @Email AND Activo = 1)
        SET @Exists = 1;
    ELSE
        SET @Exists = 0;
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - TIENDAS
-- =============================================

-- SP_Tienda_GetAll
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Tienda_GetAll]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Tienda_GetAll];
GO

CREATE PROCEDURE [dbo].[SP_Tienda_GetAll]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        TiendaId,
        Sucursal,
        Direccion,
        FechaCreacion,
        Activo
    FROM Tiendas
    WHERE Activo = 1
    ORDER BY Sucursal;
END
GO

-- SP_Tienda_GetById
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Tienda_GetById]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Tienda_GetById];
GO

CREATE PROCEDURE [dbo].[SP_Tienda_GetById]
    @TiendaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        TiendaId,
        Sucursal,
        Direccion,
        FechaCreacion,
        Activo
    FROM Tiendas
    WHERE TiendaId = @TiendaId AND Activo = 1;
END
GO

-- SP_Tienda_Create
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Tienda_Create]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Tienda_Create];
GO

CREATE PROCEDURE [dbo].[SP_Tienda_Create]
    @Sucursal NVARCHAR(100),
    @Direccion NVARCHAR(200),
    @TiendaId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        INSERT INTO Tiendas (Sucursal, Direccion)
        VALUES (@Sucursal, @Direccion);
        
        SET @TiendaId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_Tienda_Update
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Tienda_Update]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Tienda_Update];
GO

CREATE PROCEDURE [dbo].[SP_Tienda_Update]
    @TiendaId INT,
    @Sucursal NVARCHAR(100),
    @Direccion NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        UPDATE Tiendas 
        SET 
            Sucursal = @Sucursal,
            Direccion = @Direccion
        WHERE TiendaId = @TiendaId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_Tienda_Delete
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Tienda_Delete]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Tienda_Delete];
GO

CREATE PROCEDURE [dbo].[SP_Tienda_Delete]
    @TiendaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        UPDATE Tiendas 
        SET Activo = 0
        WHERE TiendaId = @TiendaId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_Tienda_Exists
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Tienda_Exists]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Tienda_Exists];
GO

CREATE PROCEDURE [dbo].[SP_Tienda_Exists]
    @TiendaId INT,
    @Exists BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Tiendas WHERE TiendaId = @TiendaId AND Activo = 1)
        SET @Exists = 1;
    ELSE
        SET @Exists = 0;
END
GO

PRINT 'Script ejecutado exitosamente. Base de datos TiendaDB creada con todas las tablas y procedimientos almacenados.';
