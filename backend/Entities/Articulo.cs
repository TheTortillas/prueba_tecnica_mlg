using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Articulo
    {
        [Key]
        public int ArticuloId { get; set; }

        [Required]
        [StringLength(50)]
        public string Codigo { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Descripcion { get; set; } = string.Empty;

        [Required]
        public decimal Precio { get; set; }

        [StringLength(500)]
        public string? Imagen { get; set; }

        [Required]
        public int Stock { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public bool Activo { get; set; } = true;

        // Relaciones
        public virtual ICollection<ArticuloTienda> ArticuloTiendas { get; set; } = new List<ArticuloTienda>();
        public virtual ICollection<ClienteArticulo> ClienteArticulos { get; set; } = new List<ClienteArticulo>();
    }
}
