namespace backend.DTOs
{
    public class ArticuloDto
    {
        public int ArticuloId { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? Imagen { get; set; }
        public int Stock { get; set; }
        public DateTime FechaCreacion { get; set; }
        public bool Activo { get; set; }
    }

    public class ArticuloCreateDto
    {
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? Imagen { get; set; }
        public int Stock { get; set; }
    }

    public class ArticuloUpdateDto
    {
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? Imagen { get; set; }
        public int Stock { get; set; }
    }

    public class ArticuloTiendaDto
    {
        public int ArticuloTiendaId { get; set; }
        public int ArticuloId { get; set; }
        public int TiendaId { get; set; }
        public DateTime Fecha { get; set; }
        public int StockTienda { get; set; }
        public ArticuloDto? Articulo { get; set; }
        public TiendaDto? Tienda { get; set; }
    }

    public class ArticuloTiendaCreateDto
    {
        public int ArticuloId { get; set; }
        public int TiendaId { get; set; }
        public int StockTienda { get; set; }
    }
}
