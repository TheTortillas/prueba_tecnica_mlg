using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Tienda
    {
        [Key]
        public int TiendaId { get; set; }

        [Required]
        [StringLength(100)]
        public string Sucursal { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Direccion { get; set; } = string.Empty;

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public bool Activo { get; set; } = true;

        // Relación con ArticuloTienda
        public virtual ICollection<ArticuloTienda> ArticuloTiendas { get; set; } = new List<ArticuloTienda>();
    }
}
