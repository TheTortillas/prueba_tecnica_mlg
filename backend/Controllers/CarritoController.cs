using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CarritoController : ControllerBase
    {
        private readonly IClienteArticuloRepository _clienteArticuloRepository;

        public CarritoController(IClienteArticuloRepository clienteArticuloRepository)
        {
            _clienteArticuloRepository = clienteArticuloRepository;
        }

        [HttpPost("procesar")]
        public async Task<ActionResult<CompraResponseDto>> ProcesarCarrito([FromBody] CarritoDto carrito)
        {
            try
            {
                var clienteIdClaim = User.FindFirst("ClienteId")?.Value;
                if (string.IsNullOrEmpty(clienteIdClaim) || !int.TryParse(clienteIdClaim, out int clienteId))
                {
                    return BadRequest(new { message = "Cliente no identificado" });
                }

                var compraRequest = new CompraRequestDto
                {
                    ClienteId = clienteId,
                    Items = carrito.Items
                };

                var resultado = await _clienteArticuloRepository.ProcesarCompraAsync(compraRequest);

                if (!resultado.Exito)
                {
                    return BadRequest(resultado);
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("historial")]
        public async Task<ActionResult<IEnumerable<ClienteArticuloDto>>> GetHistorialCompras()
        {
            try
            {
                var clienteIdClaim = User.FindFirst("ClienteId")?.Value;
                if (string.IsNullOrEmpty(clienteIdClaim) || !int.TryParse(clienteIdClaim, out int clienteId))
                {
                    return BadRequest(new { message = "Cliente no identificado" });
                }

                var compras = await _clienteArticuloRepository.GetByClienteIdAsync(clienteId);
                return Ok(compras);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost("agregar")]
        public async Task<ActionResult<ClienteArticuloDto>> AgregarArticulo([FromBody] ClienteArticuloCreateDto clienteArticuloCreateDto)
        {
            try
            {
                var clienteIdClaim = User.FindFirst("ClienteId")?.Value;
                if (string.IsNullOrEmpty(clienteIdClaim) || !int.TryParse(clienteIdClaim, out int clienteId))
                {
                    return BadRequest(new { message = "Cliente no identificado" });
                }

                clienteArticuloCreateDto.ClienteId = clienteId;

                var clienteArticulo = await _clienteArticuloRepository.CreateAsync(clienteArticuloCreateDto);
                return CreatedAtAction(nameof(AgregarArticulo), new { id = clienteArticulo.ClienteArticuloId }, clienteArticulo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}
