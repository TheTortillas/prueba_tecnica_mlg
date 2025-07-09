using backend.DTOs;

namespace backend.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
        string GenerateJwtToken(ClienteDto cliente);
        Task<ClienteDto?> RegisterAsync(ClienteCreateDto clienteCreateDto);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
    }
}
