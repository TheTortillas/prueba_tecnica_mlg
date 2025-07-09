using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TiendasController : ControllerBase
    {
        private readonly ITiendaRepository _tiendaRepository;

        public TiendasController(ITiendaRepository tiendaRepository)
        {
            _tiendaRepository = tiendaRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TiendaDto>>> GetAll()
        {
            try
            {
                var tiendas = await _tiendaRepository.GetAllAsync();
                return Ok(tiendas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TiendaDto>> GetById(int id)
        {
            try
            {
                var tienda = await _tiendaRepository.GetByIdAsync(id);
                if (tienda == null)
                {
                    return NotFound(new { message = "Tienda no encontrada" });
                }

                return Ok(tienda);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<TiendaDto>> Create([FromBody] TiendaCreateDto tiendaCreateDto)
        {
            try
            {
                var tienda = await _tiendaRepository.CreateAsync(tiendaCreateDto);
                return CreatedAtAction(nameof(GetById), new { id = tienda.TiendaId }, tienda);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TiendaDto>> Update(int id, [FromBody] TiendaUpdateDto tiendaUpdateDto)
        {
            try
            {
                var exists = await _tiendaRepository.ExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = "Tienda no encontrada" });
                }

                var tienda = await _tiendaRepository.UpdateAsync(id, tiendaUpdateDto);
                if (tienda == null)
                {
                    return BadRequest(new { message = "No se pudo actualizar la tienda" });
                }

                return Ok(tienda);
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
                var exists = await _tiendaRepository.ExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = "Tienda no encontrada" });
                }

                var deleted = await _tiendaRepository.DeleteAsync(id);
                if (!deleted)
                {
                    return BadRequest(new { message = "No se pudo eliminar la tienda" });
                }

                return Ok(new { message = "Tienda eliminada correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}
