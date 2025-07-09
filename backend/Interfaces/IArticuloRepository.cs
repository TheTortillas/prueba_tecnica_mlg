using backend.DTOs;

namespace backend.Interfaces
{
    public interface IArticuloRepository
    {
        Task<IEnumerable<ArticuloDto>> GetAllAsync();
        Task<ArticuloDto?> GetByIdAsync(int id);
        Task<ArticuloDto?> GetByCodigoAsync(string codigo);
        Task<ArticuloDto> CreateAsync(ArticuloCreateDto articuloCreateDto);
        Task<ArticuloDto?> UpdateAsync(int id, ArticuloUpdateDto articuloUpdateDto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> CodigoExistsAsync(string codigo);
        Task<IEnumerable<ArticuloDto>> GetByTiendaAsync(int tiendaId);
    }
}
