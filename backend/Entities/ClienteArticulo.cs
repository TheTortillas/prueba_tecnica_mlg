using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class ClienteArticulo
    {
        [Key]
        public int ClienteArticuloId { get; set; }

        [Required]
        public int ClienteId { get; set; }

        [Required]
        public int ArticuloId { get; set; }

        public DateTime Fecha { get; set; } = DateTime.Now;

        public int Cantidad { get; set; } = 1;

        public decimal PrecioUnitario { get; set; }

        public decimal Total { get; set; }

        // Navegación
        public virtual Cliente Cliente { get; set; } = null!;
        public virtual Articulo Articulo { get; set; } = null!;
    }
}
