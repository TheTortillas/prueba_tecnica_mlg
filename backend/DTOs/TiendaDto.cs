namespace backend.DTOs
{
    public class TiendaDto
    {
        public int TiendaId { get; set; }
        public string Sucursal { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public bool Activo { get; set; }
    }

    public class TiendaCreateDto
    {
        public string Sucursal { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
    }

    public class TiendaUpdateDto
    {
        public string Sucursal { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
    }
}
