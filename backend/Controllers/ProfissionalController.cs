using backend.DTO;
using backend.Shared.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/profissionals")]
    [ApiController]
    public class ProfissionalController : ControllerBase
    {
        private readonly IProfissionalService _profissionalService;

        public ProfissionalController(IProfissionalService profissionalService)
        {
            _profissionalService = profissionalService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProfissionalDTO>>> GetProfissionals()
        {
            var profissionals = await _profissionalService.GetAllProfissionalsAsync();
            return Ok(profissionals);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProfissionalDTO>> GetProfissional(int id)
        {
            var profissional = await _profissionalService.GetProfissionalByIdAsync(id);
            if (profissional == null)
            {
                return NotFound();
            }
            return Ok(profissional);
        }

        [HttpGet("byBI/{BI}")]
        public async Task<ActionResult<ProfissionalDTO>> GetProfissionalByBI(string BI)
        {
            var profissional = await _profissionalService.GetProfissionalByBIAsync(BI);
            if (profissional == null)
            {
                return NotFound();
            }
            return Ok(profissional);
        }

        [HttpPost]
        public async Task<ActionResult> CreateProfissional(ProfissionalDTO profissionalDto)
        {
            await _profissionalService.CreateProfissionalAsync(profissionalDto);
            var profissional = await _profissionalService.GetProfissionalByBIAsync(profissionalDto.BI);

            if (profissional == null)
            {
                return NotFound();
            }

            return CreatedAtAction(nameof(GetProfissional), new { id = profissional.Id }, profissional);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> UpdateProfissional(int id, ProfissionalDTO profissionalDto)
        {
            if (id != profissionalDto.Id)
            {
                return BadRequest();
            }

            await _profissionalService.UpdateProfissionalAsync(profissionalDto);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProfissional(int id)
        {
            var profissional = await _profissionalService.GetProfissionalByIdAsync(id);
            if (profissional == null)
            {
                return NotFound();
            }

            await _profissionalService.DeleteProfissionalAsync(id);
            return NoContent();
        }
    }
}
