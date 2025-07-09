using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Cliente
    {
        [Key]
        public int ClienteId { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Apellidos { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Direccion { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public bool Activo { get; set; } = true;

        // Relación con ClienteArticulo
        public virtual ICollection<ClienteArticulo> ClienteArticulos { get; set; } = new List<ClienteArticulo>();
    }
}
