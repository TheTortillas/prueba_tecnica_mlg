using backend.DTOs;

namespace backend.Interfaces
{
    public interface IClienteRepository
    {
        Task<IEnumerable<ClienteDto>> GetAllAsync();
        Task<ClienteDto?> GetByIdAsync(int id);
        Task<ClienteDto?> GetByEmailAsync(string email);
        Task<string?> GetPasswordHashByEmailAsync(string email);
        Task<ClienteDto> CreateAsync(ClienteCreateDto clienteCreateDto);
        Task<ClienteDto?> UpdateAsync(int id, ClienteUpdateDto clienteUpdateDto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> EmailExistsAsync(string email);
    }
}
