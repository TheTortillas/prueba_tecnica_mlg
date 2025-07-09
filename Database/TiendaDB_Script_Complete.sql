-- Script completo para crear la base de datos TiendaDB
-- Incluye: Base de datos, tablas, procedimientos almacenados y datos de prueba
-- Autor: Sebastián Morales Palacios
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

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - ARTICULOS
-- =============================================

-- SP_Articulo_GetAll
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Articulo_GetAll]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Articulo_GetAll];
GO

CREATE PROCEDURE [dbo].[SP_Articulo_GetAll]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ArticuloId,
        Codigo,
        Descripcion,
        Precio,
        Imagen,
        Stock,
        FechaCreacion,
        Activo
    FROM Articulos
    WHERE Activo = 1
    ORDER BY Descripcion;
END
GO

-- SP_Articulo_GetById
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Articulo_GetById]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Articulo_GetById];
GO

CREATE PROCEDURE [dbo].[SP_Articulo_GetById]
    @ArticuloId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ArticuloId,
        Codigo,
        Descripcion,
        Precio,
        Imagen,
        Stock,
        FechaCreacion,
        Activo
    FROM Articulos
    WHERE ArticuloId = @ArticuloId AND Activo = 1;
END
GO

-- SP_Articulo_GetByCodigo
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Articulo_GetByCodigo]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Articulo_GetByCodigo];
GO

CREATE PROCEDURE [dbo].[SP_Articulo_GetByCodigo]
    @Codigo NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ArticuloId,
        Codigo,
        Descripcion,
        Precio,
        Imagen,
        Stock,
        FechaCreacion,
        Activo
    FROM Articulos
    WHERE Codigo = @Codigo AND Activo = 1;
END
GO

-- SP_Articulo_GetByTienda
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Articulo_GetByTienda]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Articulo_GetByTienda];
GO

CREATE PROCEDURE [dbo].[SP_Articulo_GetByTienda]
    @TiendaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT
        a.ArticuloId,
        a.Codigo,
        a.Descripcion,
        a.Precio,
        a.Imagen,
        a.Stock,
        a.FechaCreacion,
        a.Activo
    FROM Articulos a
    INNER JOIN ArticuloTienda at ON a.ArticuloId = at.ArticuloId
    WHERE a.Activo = 1 AND at.TiendaId = @TiendaId
    ORDER BY a.Descripcion;
END
GO

-- SP_Articulo_Create
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Articulo_Create]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Articulo_Create];
GO

CREATE PROCEDURE [dbo].[SP_Articulo_Create]
    @Codigo NVARCHAR(50),
    @Descripcion NVARCHAR(200),
    @Precio DECIMAL(18,2),
    @Imagen NVARCHAR(500),
    @Stock INT,
    @ArticuloId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Verificar si el código ya existe
        IF EXISTS (SELECT 1 FROM Articulos WHERE Codigo = @Codigo)
        BEGIN
            RAISERROR('El código del artículo ya existe', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        INSERT INTO Articulos (Codigo, Descripcion, Precio, Imagen, Stock)
        VALUES (@Codigo, @Descripcion, @Precio, @Imagen, @Stock);
        
        SET @ArticuloId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_Articulo_Update
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Articulo_Update]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Articulo_Update];
GO

CREATE PROCEDURE [dbo].[SP_Articulo_Update]
    @ArticuloId INT,
    @Codigo NVARCHAR(50),
    @Descripcion NVARCHAR(200),
    @Precio DECIMAL(18,2),
    @Imagen NVARCHAR(500),
    @Stock INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Verificar si el artículo existe
        IF NOT EXISTS (SELECT 1 FROM Articulos WHERE ArticuloId = @ArticuloId AND Activo = 1)
        BEGIN
            RAISERROR('Artículo no encontrado', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Verificar si el código ya existe en otro artículo
        IF EXISTS (SELECT 1 FROM Articulos WHERE Codigo = @Codigo AND ArticuloId != @ArticuloId)
        BEGIN
            RAISERROR('El código ya está registrado por otro artículo', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        UPDATE Articulos 
        SET 
            Codigo = @Codigo,
            Descripcion = @Descripcion,
            Precio = @Precio,
            Imagen = @Imagen,
            Stock = @Stock
        WHERE ArticuloId = @ArticuloId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_Articulo_Delete
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Articulo_Delete]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Articulo_Delete];
GO

CREATE PROCEDURE [dbo].[SP_Articulo_Delete]
    @ArticuloId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        UPDATE Articulos 
        SET Activo = 0
        WHERE ArticuloId = @ArticuloId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_Articulo_Exists
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Articulo_Exists]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Articulo_Exists];
GO

CREATE PROCEDURE [dbo].[SP_Articulo_Exists]
    @ArticuloId INT,
    @Exists BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Articulos WHERE ArticuloId = @ArticuloId AND Activo = 1)
        SET @Exists = 1;
    ELSE
        SET @Exists = 0;
END
GO

-- SP_Articulo_CodigoExists
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_Articulo_CodigoExists]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_Articulo_CodigoExists];
GO

CREATE PROCEDURE [dbo].[SP_Articulo_CodigoExists]
    @Codigo NVARCHAR(50),
    @Exists BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Articulos WHERE Codigo = @Codigo AND Activo = 1)
        SET @Exists = 1;
    ELSE
        SET @Exists = 0;
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - ARTICULO TIENDA
-- =============================================

-- SP_ArticuloTienda_GetAll
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ArticuloTienda_GetAll]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ArticuloTienda_GetAll];
GO

CREATE PROCEDURE [dbo].[SP_ArticuloTienda_GetAll]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ArticuloTiendaId,
        ArticuloId,
        TiendaId,
        Fecha,
        StockTienda
    FROM ArticuloTienda
    ORDER BY Fecha DESC;
END
GO

-- SP_ArticuloTienda_GetById
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ArticuloTienda_GetById]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ArticuloTienda_GetById];
GO

CREATE PROCEDURE [dbo].[SP_ArticuloTienda_GetById]
    @ArticuloTiendaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ArticuloTiendaId,
        ArticuloId,
        TiendaId,
        Fecha,
        StockTienda
    FROM ArticuloTienda
    WHERE ArticuloTiendaId = @ArticuloTiendaId;
END
GO

-- SP_ArticuloTienda_GetByTienda
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ArticuloTienda_GetByTienda]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ArticuloTienda_GetByTienda];
GO

CREATE PROCEDURE [dbo].[SP_ArticuloTienda_GetByTienda]
    @TiendaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ArticuloTiendaId,
        ArticuloId,
        TiendaId,
        Fecha,
        StockTienda
    FROM ArticuloTienda
    WHERE TiendaId = @TiendaId
    ORDER BY Fecha DESC;
END
GO

-- SP_ArticuloTienda_GetByArticulo
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ArticuloTienda_GetByArticulo]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ArticuloTienda_GetByArticulo];
GO

CREATE PROCEDURE [dbo].[SP_ArticuloTienda_GetByArticulo]
    @ArticuloId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ArticuloTiendaId,
        ArticuloId,
        TiendaId,
        Fecha,
        StockTienda
    FROM ArticuloTienda
    WHERE ArticuloId = @ArticuloId
    ORDER BY Fecha DESC;
END
GO

-- SP_ArticuloTienda_Create
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ArticuloTienda_Create]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ArticuloTienda_Create];
GO

CREATE PROCEDURE [dbo].[SP_ArticuloTienda_Create]
    @ArticuloId INT,
    @TiendaId INT,
    @StockTienda INT,
    @ArticuloTiendaId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Verificar si el artículo existe
        IF NOT EXISTS (SELECT 1 FROM Articulos WHERE ArticuloId = @ArticuloId AND Activo = 1)
        BEGIN
            RAISERROR('Artículo no encontrado', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Verificar si la tienda existe
        IF NOT EXISTS (SELECT 1 FROM Tiendas WHERE TiendaId = @TiendaId AND Activo = 1)
        BEGIN
            RAISERROR('Tienda no encontrada', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Verificar si ya existe la relación
        IF EXISTS (SELECT 1 FROM ArticuloTienda WHERE ArticuloId = @ArticuloId AND TiendaId = @TiendaId)
        BEGIN
            RAISERROR('La relación Artículo-Tienda ya existe', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        INSERT INTO ArticuloTienda (ArticuloId, TiendaId, StockTienda)
        VALUES (@ArticuloId, @TiendaId, @StockTienda);
        
        SET @ArticuloTiendaId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_ArticuloTienda_Delete
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ArticuloTienda_Delete]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ArticuloTienda_Delete];
GO

CREATE PROCEDURE [dbo].[SP_ArticuloTienda_Delete]
    @ArticuloTiendaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DELETE FROM ArticuloTienda 
        WHERE ArticuloTiendaId = @ArticuloTiendaId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_ArticuloTienda_Exists
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ArticuloTienda_Exists]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ArticuloTienda_Exists];
GO

CREATE PROCEDURE [dbo].[SP_ArticuloTienda_Exists]
    @ArticuloId INT,
    @TiendaId INT,
    @Exists BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM ArticuloTienda WHERE ArticuloId = @ArticuloId AND TiendaId = @TiendaId)
        SET @Exists = 1;
    ELSE
        SET @Exists = 0;
END
GO

-- SP_ArticuloTienda_UpdateStock
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ArticuloTienda_UpdateStock]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ArticuloTienda_UpdateStock];
GO

CREATE PROCEDURE [dbo].[SP_ArticuloTienda_UpdateStock]
    @ArticuloId INT,
    @TiendaId INT,
    @NuevoStock INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        UPDATE ArticuloTienda 
        SET StockTienda = @NuevoStock
        WHERE ArticuloId = @ArticuloId AND TiendaId = @TiendaId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS - CLIENTE ARTICULO
-- =============================================

-- SP_ClienteArticulo_GetAll
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ClienteArticulo_GetAll]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ClienteArticulo_GetAll];
GO

CREATE PROCEDURE [dbo].[SP_ClienteArticulo_GetAll]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ClienteArticuloId,
        ClienteId,
        ArticuloId,
        Fecha,
        Cantidad,
        PrecioUnitario,
        Total
    FROM ClienteArticulo
    ORDER BY Fecha DESC;
END
GO

-- SP_ClienteArticulo_GetById
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ClienteArticulo_GetById]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ClienteArticulo_GetById];
GO

CREATE PROCEDURE [dbo].[SP_ClienteArticulo_GetById]
    @ClienteArticuloId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ClienteArticuloId,
        ClienteId,
        ArticuloId,
        Fecha,
        Cantidad,
        PrecioUnitario,
        Total
    FROM ClienteArticulo
    WHERE ClienteArticuloId = @ClienteArticuloId;
END
GO

-- SP_ClienteArticulo_GetByCliente
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ClienteArticulo_GetByCliente]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ClienteArticulo_GetByCliente];
GO

CREATE PROCEDURE [dbo].[SP_ClienteArticulo_GetByCliente]
    @ClienteId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ClienteArticuloId,
        ClienteId,
        ArticuloId,
        Fecha,
        Cantidad,
        PrecioUnitario,
        Total
    FROM ClienteArticulo
    WHERE ClienteId = @ClienteId
    ORDER BY Fecha DESC;
END
GO

-- SP_ClienteArticulo_GetByArticulo
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ClienteArticulo_GetByArticulo]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ClienteArticulo_GetByArticulo];
GO

CREATE PROCEDURE [dbo].[SP_ClienteArticulo_GetByArticulo]
    @ArticuloId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        ClienteArticuloId,
        ClienteId,
        ArticuloId,
        Fecha,
        Cantidad,
        PrecioUnitario,
        Total
    FROM ClienteArticulo
    WHERE ArticuloId = @ArticuloId
    ORDER BY Fecha DESC;
END
GO

-- SP_ClienteArticulo_Create
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ClienteArticulo_Create]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ClienteArticulo_Create];
GO

CREATE PROCEDURE [dbo].[SP_ClienteArticulo_Create]
    @ClienteId INT,
    @ArticuloId INT,
    @Cantidad INT,
    @PrecioUnitario DECIMAL(18,2),
    @ClienteArticuloId INT OUTPUT
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
        
        -- Verificar si el artículo existe
        IF NOT EXISTS (SELECT 1 FROM Articulos WHERE ArticuloId = @ArticuloId AND Activo = 1)
        BEGIN
            RAISERROR('Artículo no encontrado', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        INSERT INTO ClienteArticulo (ClienteId, ArticuloId, Cantidad, PrecioUnitario)
        VALUES (@ClienteId, @ArticuloId, @Cantidad, @PrecioUnitario);
        
        SET @ClienteArticuloId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_ClienteArticulo_Delete
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ClienteArticulo_Delete]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ClienteArticulo_Delete];
GO

CREATE PROCEDURE [dbo].[SP_ClienteArticulo_Delete]
    @ClienteArticuloId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DELETE FROM ClienteArticulo 
        WHERE ClienteArticuloId = @ClienteArticuloId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- SP_ClienteArticulo_ProcesarCompra
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_ClienteArticulo_ProcesarCompra]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[SP_ClienteArticulo_ProcesarCompra];
GO

CREATE PROCEDURE [dbo].[SP_ClienteArticulo_ProcesarCompra]
    @ClienteId INT,
    @ArticuloId INT,
    @Cantidad INT,
    @PrecioUnitario DECIMAL(18,2),
    @ClienteArticuloId INT OUTPUT
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
        
        -- Verificar si el artículo existe y tiene stock suficiente
        DECLARE @StockActual INT;
        SELECT @StockActual = Stock 
        FROM Articulos 
        WHERE ArticuloId = @ArticuloId AND Activo = 1;
        
        IF @StockActual IS NULL
        BEGIN
            RAISERROR('Artículo no encontrado', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        IF @StockActual < @Cantidad
        BEGIN
            RAISERROR('Stock insuficiente', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Actualizar stock del artículo
        UPDATE Articulos 
        SET Stock = Stock - @Cantidad
        WHERE ArticuloId = @ArticuloId;
        
        -- Crear la compra
        INSERT INTO ClienteArticulo (ClienteId, ArticuloId, Cantidad, PrecioUnitario)
        VALUES (@ClienteId, @ArticuloId, @Cantidad, @PrecioUnitario);
        
        SET @ClienteArticuloId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- =============================================
-- DATOS DE PRUEBA
-- =============================================

-- Insertar datos de prueba para Tiendas
IF NOT EXISTS (SELECT 1 FROM Tiendas)
BEGIN
    INSERT INTO Tiendas (Sucursal, Direccion) VALUES 
    ('Sucursal Centro', 'Av. Principal 123, Centro'),
    ('Sucursal Norte', 'Blvd. Norte 456, Col. Norte'),
    ('Sucursal Sur', 'Calle Sur 789, Col. Sur');
END
GO

-- Insertar datos de prueba para Artículos
IF NOT EXISTS (SELECT 1 FROM Articulos)
BEGIN
    INSERT INTO Articulos (Codigo, Descripcion, Precio, Imagen, Stock) VALUES 
    ('ART001', 'Laptop Gaming', 15000.00, 'laptop-gaming.jpg', 10),
    ('ART002', 'Mouse Gamer', 800.00, 'mouse-gamer.jpg', 25),
    ('ART003', 'Teclado Mecánico', 1200.00, 'teclado-mecanico.jpg', 15),
    ('ART004', 'Monitor 24 pulgadas', 3500.00, 'monitor-24.jpg', 8),
    ('ART005', 'Audífonos Bluetooth', 950.00, 'audifonos-bt.jpg', 20);
END
GO

-- Insertar datos de prueba para ArticuloTienda
IF NOT EXISTS (SELECT 1 FROM ArticuloTienda)
BEGIN
    INSERT INTO ArticuloTienda (ArticuloId, TiendaId, StockTienda) VALUES 
    (1, 1, 3), (1, 2, 4), (1, 3, 3),
    (2, 1, 8), (2, 2, 9), (2, 3, 8),
    (3, 1, 5), (3, 2, 5), (3, 3, 5),
    (4, 1, 2), (4, 2, 3), (4, 3, 3),
    (5, 1, 7), (5, 2, 7), (5, 3, 6);
END
GO
