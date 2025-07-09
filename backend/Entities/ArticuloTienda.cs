using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class ArticuloTienda
    {
        [Key]
        public int ArticuloTiendaId { get; set; }

        [Required]
        public int ArticuloId { get; set; }

        [Required]
        public int TiendaId { get; set; }

        public DateTime Fecha { get; set; } = DateTime.Now;

        public int StockTienda { get; set; } = 0;

        // Navegación
        public virtual Articulo Articulo { get; set; } = null!;
        public virtual Tienda Tienda { get; set; } = null!;
    }
}
