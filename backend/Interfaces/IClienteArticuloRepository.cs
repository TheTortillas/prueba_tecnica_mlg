using backend.DTOs;

namespace backend.Interfaces
{
    public interface IClienteArticuloRepository
    {
        Task<IEnumerable<ClienteArticuloDto>> GetAllAsync();
        Task<ClienteArticuloDto?> GetByIdAsync(int id);
        Task<IEnumerable<ClienteArticuloDto>> GetByClienteAsync(int clienteId);
        Task<IEnumerable<ClienteArticuloDto>> GetByArticuloAsync(int articuloId);
        Task<ClienteArticuloDto> CreateAsync(ClienteArticuloCreateDto clienteArticuloCreateDto);
        Task<bool> DeleteAsync(int id);
        Task<CompraResponseDto> ProcesarCarritoAsync(int clienteId, CarritoDto carrito);
    }
}
