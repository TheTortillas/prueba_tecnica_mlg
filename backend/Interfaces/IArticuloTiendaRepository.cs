using backend.DTOs;

namespace backend.Interfaces
{
    public interface IArticuloTiendaRepository
    {
        Task<IEnumerable<ArticuloTiendaDto>> GetAllAsync();
        Task<ArticuloTiendaDto?> GetByIdAsync(int id);
        Task<IEnumerable<ArticuloTiendaDto>> GetByTiendaAsync(int tiendaId);
        Task<IEnumerable<ArticuloTiendaDto>> GetByArticuloAsync(int articuloId);
        Task<ArticuloTiendaDto> CreateAsync(ArticuloTiendaCreateDto articuloTiendaCreateDto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int articuloId, int tiendaId);
        Task<bool> UpdateStockAsync(int articuloId, int tiendaId, int nuevoStock);
    }
}
