using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Interfaces;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClienteArticuloController : ControllerBase
    {
        private readonly IClienteArticuloRepository _clienteArticuloRepository;

        public ClienteArticuloController(IClienteArticuloRepository clienteArticuloRepository)
        {
            _clienteArticuloRepository = clienteArticuloRepository;
        }

        // GET: api/clientearticulo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteArticuloDto>>> GetAll()
        {
            try
            {
                var clienteArticulos = await _clienteArticuloRepository.GetAllAsync();
                return Ok(clienteArticulos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/clientearticulo/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteArticuloDto>> GetById(int id)
        {
            try
            {
                var clienteArticulo = await _clienteArticuloRepository.GetByIdAsync(id);
                if (clienteArticulo == null)
                {
                    return NotFound($"ClienteArticulo con ID {id} no encontrado.");
                }

                return Ok(clienteArticulo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/clientearticulo/cliente/{clienteId}
        [HttpGet("cliente/{clienteId}")]
        public async Task<ActionResult<IEnumerable<ClienteArticuloDto>>> GetByClienteId(int clienteId)
        {
            try
            {
                var compras = await _clienteArticuloRepository.GetByClienteIdAsync(clienteId);
                return Ok(compras);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/clientearticulo/articulo/{articuloId}
        [HttpGet("articulo/{articuloId}")]
        public async Task<ActionResult<IEnumerable<ClienteArticuloDto>>> GetByArticuloId(int articuloId)
        {
            try
            {
                var compras = await _clienteArticuloRepository.GetByArticuloIdAsync(articuloId);
                return Ok(compras);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // POST: api/clientearticulo
        [HttpPost]
        public async Task<ActionResult<ClienteArticuloDto>> Create([FromBody] ClienteArticuloCreateDto clienteArticuloDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var clienteArticulo = await _clienteArticuloRepository.CreateAsync(clienteArticuloDto);
                return CreatedAtAction(nameof(GetById), new { id = clienteArticulo.ClienteArticuloId }, clienteArticulo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // POST: api/clientearticulo/comprar
        [HttpPost("comprar")]
        public async Task<ActionResult<CompraResponseDto>> ProcesarCompra([FromBody] CompraRequestDto compraRequest)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var resultado = await _clienteArticuloRepository.ProcesarCompraAsync(compraRequest);
                return Ok(resultado);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // PUT: api/clientearticulo/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<ClienteArticuloDto>> Update(int id, [FromBody] ClienteArticuloUpdateDto clienteArticuloDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var clienteArticulo = await _clienteArticuloRepository.UpdateAsync(id, clienteArticuloDto);
                if (clienteArticulo == null)
                {
                    return NotFound($"ClienteArticulo con ID {id} no encontrado.");
                }

                return Ok(clienteArticulo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // DELETE: api/clientearticulo/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _clienteArticuloRepository.DeleteAsync(id);
                if (!result)
                {
                    return NotFound($"ClienteArticulo con ID {id} no encontrado.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/clientearticulo/cliente/{clienteId}/historial
        [HttpGet("cliente/{clienteId}/historial")]
        public async Task<ActionResult<IEnumerable<ClienteArticuloDto>>> GetHistorialCompras(int clienteId)
        {
            try
            {
                var historial = await _clienteArticuloRepository.GetHistorialComprasAsync(clienteId);
                return Ok(historial);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/clientearticulo/estadisticas/cliente/{clienteId}
        [HttpGet("estadisticas/cliente/{clienteId}")]
        public async Task<ActionResult<object>> GetEstadisticasCliente(int clienteId)
        {
            try
            {
                var estadisticas = await _clienteArticuloRepository.GetEstadisticasClienteAsync(clienteId);
                return Ok(estadisticas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
