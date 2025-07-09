using backend.DTOs;

namespace backend.Interfaces
{
    public interface ITiendaRepository
    {
        Task<IEnumerable<TiendaDto>> GetAllAsync();
        Task<TiendaDto?> GetByIdAsync(int id);
        Task<TiendaDto> CreateAsync(TiendaCreateDto tiendaCreateDto);
        Task<TiendaDto?> UpdateAsync(int id, TiendaUpdateDto tiendaUpdateDto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
