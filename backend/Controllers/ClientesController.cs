using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteRepository _clienteRepository;

        public ClientesController(IClienteRepository clienteRepository)
        {
            _clienteRepository = clienteRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteDto>>> GetAll()
        {
            try
            {
                var clientes = await _clienteRepository.GetAllAsync();
                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteDto>> GetById(int id)
        {
            try
            {
                var cliente = await _clienteRepository.GetByIdAsync(id);
                if (cliente == null)
                {
                    return NotFound(new { message = "Cliente no encontrado" });
                }

                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ClienteDto>> Create([FromBody] ClienteCreateDto clienteCreateDto)
        {
            try
            {
                var emailExists = await _clienteRepository.EmailExistsAsync(clienteCreateDto.Email);
                if (emailExists)
                {
                    return BadRequest(new { message = "El email ya está registrado" });
                }

                var cliente = await _clienteRepository.CreateAsync(clienteCreateDto);
                return CreatedAtAction(nameof(GetById), new { id = cliente.ClienteId }, cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ClienteDto>> Update(int id, [FromBody] ClienteUpdateDto clienteUpdateDto)
        {
            try
            {
                var exists = await _clienteRepository.ExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = "Cliente no encontrado" });
                }

                var cliente = await _clienteRepository.UpdateAsync(id, clienteUpdateDto);
                if (cliente == null)
                {
                    return BadRequest(new { message = "No se pudo actualizar el cliente" });
                }

                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var exists = await _clienteRepository.ExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = "Cliente no encontrado" });
                }

                var deleted = await _clienteRepository.DeleteAsync(id);
                if (!deleted)
                {
                    return BadRequest(new { message = "No se pudo eliminar el cliente" });
                }

                return Ok(new { message = "Cliente eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}
