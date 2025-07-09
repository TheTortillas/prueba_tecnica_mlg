namespace backend.DTOs
{
    public class ClienteArticuloDto
    {
        public int ClienteArticuloId { get; set; }
        public int ClienteId { get; set; }
        public int ArticuloId { get; set; }
        public DateTime Fecha { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Total { get; set; }
        public ClienteDto? Cliente { get; set; }
        public ArticuloDto? Articulo { get; set; }
    }

    public class ClienteArticuloCreateDto
    {
        public int ClienteId { get; set; }
        public int ArticuloId { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
    }

    public class ClienteArticuloUpdateDto
    {
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
    }

    public class CarritoItemDto
    {
        public int ArticuloId { get; set; }
        public int Cantidad { get; set; }
    }

    public class CarritoDto
    {
        public List<CarritoItemDto> Items { get; set; } = new List<CarritoItemDto>();
    }

    public class CompraRequestDto
    {
        public int ClienteId { get; set; }
        public List<CarritoItemDto> Items { get; set; } = new List<CarritoItemDto>();
    }

    public class CompraResponseDto
    {
        public bool Exito { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public List<ClienteArticuloDto> Compras { get; set; } = new List<ClienteArticuloDto>();
        public decimal TotalGeneral { get; set; }
    }
}
