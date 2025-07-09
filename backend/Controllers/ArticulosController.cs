using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ArticulosController : ControllerBase
    {
        private readonly IArticuloRepository _articuloRepository;

        public ArticulosController(IArticuloRepository articuloRepository)
        {
            _articuloRepository = articuloRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArticuloDto>>> GetAll()
        {
            try
            {
                var articulos = await _articuloRepository.GetAllAsync();
                return Ok(articulos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ArticuloDto>> GetById(int id)
        {
            try
            {
                var articulo = await _articuloRepository.GetByIdAsync(id);
                if (articulo == null)
                {
                    return NotFound(new { message = "Artículo no encontrado" });
                }

                return Ok(articulo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("codigo/{codigo}")]
        public async Task<ActionResult<ArticuloDto>> GetByCodigo(string codigo)
        {
            try
            {
                var articulo = await _articuloRepository.GetByCodigoAsync(codigo);
                if (articulo == null)
                {
                    return NotFound(new { message = "Artículo no encontrado" });
                }

                return Ok(articulo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpGet("tienda/{tiendaId}")]
        public async Task<ActionResult<IEnumerable<ArticuloDto>>> GetByTienda(int tiendaId)
        {
            try
            {
                var articulos = await _articuloRepository.GetByTiendaAsync(tiendaId);
                return Ok(articulos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ArticuloDto>> Create([FromBody] ArticuloCreateDto articuloCreateDto)
        {
            try
            {
                var codigoExists = await _articuloRepository.CodigoExistsAsync(articuloCreateDto.Codigo);
                if (codigoExists)
                {
                    return BadRequest(new { message = "El código del artículo ya existe" });
                }

                var articulo = await _articuloRepository.CreateAsync(articuloCreateDto);
                return CreatedAtAction(nameof(GetById), new { id = articulo.ArticuloId }, articulo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ArticuloDto>> Update(int id, [FromBody] ArticuloUpdateDto articuloUpdateDto)
        {
            try
            {
                var exists = await _articuloRepository.ExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = "Artículo no encontrado" });
                }

                var articulo = await _articuloRepository.UpdateAsync(id, articuloUpdateDto);
                if (articulo == null)
                {
                    return BadRequest(new { message = "No se pudo actualizar el artículo" });
                }

                return Ok(articulo);
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
                var exists = await _articuloRepository.ExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = "Artículo no encontrado" });
                }

                var deleted = await _articuloRepository.DeleteAsync(id);
                if (!deleted)
                {
                    return BadRequest(new { message = "No se pudo eliminar el artículo" });
                }

                return Ok(new { message = "Artículo eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}
