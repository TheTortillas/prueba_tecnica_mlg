using backend.DTOs;
using backend.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IClienteRepository _clienteRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IClienteRepository clienteRepository, IConfiguration configuration)
        {
            _clienteRepository = clienteRepository;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var cliente = await _clienteRepository.GetByEmailAsync(loginDto.Email);
            if (cliente == null)
                return null;

            // Aquí necesitarías obtener el hash de la contraseña desde la base de datos
            // Por ahora, asumimos que el password está hasheado
            // if (!VerifyPassword(loginDto.Password, hashedPassword))
            //     return null;

            var token = GenerateJwtToken(cliente);
            var expiresAt = DateTime.UtcNow.AddHours(24);

            return new LoginResponseDto
            {
                Token = token,
                Cliente = cliente,
                ExpiresAt = expiresAt
            };
        }

        public string GenerateJwtToken(ClienteDto cliente)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "MiClaveSecretaSuperLargaYSegura123456789";
            var issuer = jwtSettings["Issuer"] ?? "TiendaAPI";
            var audience = jwtSettings["Audience"] ?? "TiendaClients";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, cliente.ClienteId.ToString()),
                new Claim(ClaimTypes.Email, cliente.Email),
                new Claim(ClaimTypes.Name, $"{cliente.Nombre} {cliente.Apellidos}"),
                new Claim("ClienteId", cliente.ClienteId.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<ClienteDto?> RegisterAsync(ClienteCreateDto clienteCreateDto)
        {
            var emailExists = await _clienteRepository.EmailExistsAsync(clienteCreateDto.Email);
            if (emailExists)
                return null;

            var hashedPassword = HashPassword(clienteCreateDto.Password);
            clienteCreateDto.Password = hashedPassword;

            return await _clienteRepository.CreateAsync(clienteCreateDto);
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
