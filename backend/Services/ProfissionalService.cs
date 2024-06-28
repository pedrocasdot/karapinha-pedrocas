using backend.DTO;
using backend.Model;
using backend.Shared.Repositories;
using backend.Shared.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class ProfissionalService : IProfissionalService
    {
        private readonly IProfissionalsRepository _profissionalsRepository;
         private readonly ICategoryService _categoryService;


        public ProfissionalService(IProfissionalsRepository profissionalsRepository, ICategoryService categoryService)
        {
            _profissionalsRepository = profissionalsRepository;
            _categoryService = categoryService;
        }
       
        public async Task<IEnumerable<ProfissionalDTO>> GetAllProfissionalsAsync()
        {
            var profissionals = await _profissionalsRepository.GetAllProfissionalsAsync();
            return profissionals.Select(p => new ProfissionalDTO
            {
                Id = p.Id,
                Nome = p.Nome,
                Telemovel = p.Telemovel,
                CategoryId = p.CategoryId,
                Category = _categoryService.GetCategoryByIdAsync((int)p.CategoryId).Result,
                // horarios = _profissionalHorarioService.GetProfissionalHorariosAsync( p.Id)
                //                         .Result
                //                         .Select(ph => ph.horario)
                //                         .ToList(),
                BI = p.BI,
                Email = p.Email,
            });
        }

        public async Task<ProfissionalDTO> GetProfissionalByIdAsync(int id)
        {
            var profissional = await _profissionalsRepository.GetProfissionalByIdAsync(id);
            if (profissional == null)
                return null;

            return new ProfissionalDTO
            {
                Id = profissional.Id,
                Nome = profissional.Nome,
                Telemovel = profissional.Telemovel,
                CategoryId = profissional.CategoryId,
                Category = _categoryService.GetCategoryByIdAsync((int)profissional.CategoryId).Result,
                BI = profissional.BI,
                Email = profissional.Email,
            };
        }

        public async Task CreateProfissionalAsync(ProfissionalDTO profissionalDto)
        {
            var entity = new Profissional
            {
                Nome = profissionalDto.Nome,
                Telemovel = profissionalDto.Telemovel,
                CategoryId = profissionalDto.CategoryId,
                BI = profissionalDto.BI,
                Email = profissionalDto.Email,
            };

            await _profissionalsRepository.CreateProfissionalAsync(entity);
        }

        public async Task UpdateProfissionalAsync(ProfissionalDTO profissionalDto)
        {
            var entity = await _profissionalsRepository.GetProfissionalByIdAsync(profissionalDto.Id);
            if (entity == null)
                return;

            entity.Nome = profissionalDto.Nome;
            entity.Telemovel = profissionalDto.Telemovel;
            entity.CategoryId = profissionalDto.CategoryId;
            entity.BI = profissionalDto.BI;
            entity.Email = profissionalDto.Email;

            await _profissionalsRepository.UpdateProfissionalAsync(entity);
        }

        public async Task DeleteProfissionalAsync(int id)
        {
            await _profissionalsRepository.DeleteProfissionalAsync(id);
        }
    }
}
