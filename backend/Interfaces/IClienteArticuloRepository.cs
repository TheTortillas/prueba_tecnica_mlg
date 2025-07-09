using backend.DTOs;

namespace backend.Interfaces
{
    public interface IClienteArticuloRepository
    {
        Task<IEnumerable<ClienteArticuloDto>> GetAllAsync();
        Task<ClienteArticuloDto?> GetByIdAsync(int id);
        Task<IEnumerable<ClienteArticuloDto>> GetByClienteIdAsync(int clienteId);
        Task<IEnumerable<ClienteArticuloDto>> GetByArticuloIdAsync(int articuloId);
        Task<ClienteArticuloDto> CreateAsync(ClienteArticuloCreateDto clienteArticuloCreateDto);
        Task<ClienteArticuloDto?> UpdateAsync(int id, ClienteArticuloUpdateDto clienteArticuloUpdateDto);
        Task<bool> DeleteAsync(int id);
        Task<CompraResponseDto> ProcesarCompraAsync(CompraRequestDto compraRequest);
        Task<IEnumerable<ClienteArticuloDto>> GetHistorialComprasAsync(int clienteId);
        Task<object> GetEstadisticasClienteAsync(int clienteId);
    }
}
