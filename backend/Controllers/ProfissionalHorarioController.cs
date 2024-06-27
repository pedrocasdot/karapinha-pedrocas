using backend.DTO;
using backend.Shared.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/profissionalHorarios")]
    [ApiController]
    public class ProfissionalHorarioController : ControllerBase
    {
        private readonly IProfissionalHorarioService _profissionalHorarioService;

        public ProfissionalHorarioController(IProfissionalHorarioService profissionalHorarioService)
        {
            _profissionalHorarioService = profissionalHorarioService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProfissionalHorarioDTO>>> GetProfissionalHorarios()
        {
            var profissionalHorarios = await _profissionalHorarioService.GetAllProfissionalHorariosAsync();
            return Ok(profissionalHorarios);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProfissionalHorarioDTO>> GetProfissionalHorario(int id)
        {
            var profissionalHorario = await _profissionalHorarioService.GetProfissionalHorariosByIdAsync(id);
            if (profissionalHorario == null)
            {
                return NotFound();
            }
            return Ok(profissionalHorario);
        }

        [HttpGet("profissional/{profissionalId}")]
        public async Task<ActionResult<IEnumerable<ProfissionalHorarioDTO>>> GetProfissionalHorariosByProfissionalId(int profissionalId)
        {
            var profissionalHorarios = await _profissionalHorarioService.GetProfissionalHorariosAsync(profissionalId);
            return Ok(profissionalHorarios);
        }

        [HttpPost]
        public async Task<ActionResult> CreateProfissionalHorario(ProfissionalHorarioDTO profissionalHorarioDto)
        {
            await _profissionalHorarioService.CreateProfissionalHorarioAsync(profissionalHorarioDto);
            return CreatedAtAction(nameof(GetProfissionalHorario), new { id = profissionalHorarioDto.Id }, profissionalHorarioDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProfissionalHorario(int id, ProfissionalHorarioDTO profissionalHorarioDto)
        {
            if (id != profissionalHorarioDto.Id)
            {
                return BadRequest();
            }

            await _profissionalHorarioService.UpdateProfissionalHorarioAsync(profissionalHorarioDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProfissionalHorario(int id)
        {
            var profissionalHorario = await _profissionalHorarioService.GetProfissionalHorariosByIdAsync(id);
            if (profissionalHorario == null)
            {
                return NotFound();
            }

            await _profissionalHorarioService.DeleteProfissionalAsync(id);
            return NoContent();
        }
    }
}
