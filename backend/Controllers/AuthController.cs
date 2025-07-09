using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);
                if (result == null)
                {
                    return Unauthorized(new { message = "Credenciales inválidas" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<ClienteDto>> Register([FromBody] ClienteCreateDto clienteCreateDto)
        {
            try
            {
                var result = await _authService.RegisterAsync(clienteCreateDto);
                if (result == null)
                {
                    return BadRequest(new { message = "El email ya está registrado" });
                }

                return CreatedAtAction(nameof(Register), new { id = result.ClienteId }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}
