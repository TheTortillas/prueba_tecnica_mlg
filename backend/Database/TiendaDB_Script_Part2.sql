-- Script para crear procedimientos almacenados - ARTICULOS, ARTICULO-TIENDA, CLIENTE-ARTICULO
-- Base de datos: TiendaDB
-- Parte 2 del script

USE TiendaDB;
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

-- Insertar datos de prueba
INSERT INTO Tiendas (Sucursal, Direccion) VALUES 
('Sucursal Centro', 'Av. Principal 123, Centro'),
('Sucursal Norte', 'Blvd. Norte 456, Col. Norte'),
('Sucursal Sur', 'Calle Sur 789, Col. Sur');

INSERT INTO Articulos (Codigo, Descripcion, Precio, Imagen, Stock) VALUES 
('ART001', 'Laptop Gaming', 15000.00, 'laptop-gaming.jpg', 10),
('ART002', 'Mouse Gamer', 800.00, 'mouse-gamer.jpg', 25),
('ART003', 'Teclado Mecánico', 1200.00, 'teclado-mecanico.jpg', 15),
('ART004', 'Monitor 24 pulgadas', 3500.00, 'monitor-24.jpg', 8),
('ART005', 'Audífonos Bluetooth', 950.00, 'audifonos-bt.jpg', 20);

INSERT INTO ArticuloTienda (ArticuloId, TiendaId, StockTienda) VALUES 
(1, 1, 3), (1, 2, 4), (1, 3, 3),
(2, 1, 8), (2, 2, 9), (2, 3, 8),
(3, 1, 5), (3, 2, 5), (3, 3, 5),
(4, 1, 2), (4, 2, 3), (4, 3, 3),
(5, 1, 7), (5, 2, 7), (5, 3, 6);

PRINT 'Script Parte 2 ejecutado exitosamente. Procedimientos almacenados y datos de prueba creados.';
