using backend.DTOs;
using backend.Interfaces;
using backend.Services.Auth;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IClienteRepository _clienteRepository;
        private readonly IConfiguration _configuration;
        private readonly IPasswordHasher _passwordHasher;

        public AuthService(IClienteRepository clienteRepository, IConfiguration configuration, IPasswordHasher passwordHasher)
        {
            _clienteRepository = clienteRepository;
            _configuration = configuration;
            _passwordHasher = passwordHasher;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var cliente = await _clienteRepository.GetByEmailAsync(loginDto.Email);
            if (cliente == null)
                return null;

            // Obtener el hash de la contraseña desde la base de datos
            var passwordHash = await _clienteRepository.GetPasswordHashByEmailAsync(loginDto.Email);
            if (passwordHash == null)
                return null;

            // Verificar la contraseña
            if (!VerifyPassword(loginDto.Password, passwordHash))
                return null;

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
            return _passwordHasher.Hash(password);
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            return _passwordHasher.Verify(password, hashedPassword);
        }
    }
}
