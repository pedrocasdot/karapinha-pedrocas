using System.Runtime.CompilerServices;
using backend.DAL.Repositories;
using backend.DTO;
using backend.Model;
using backend.Shared.Repositories;
using backend.Shared.Services;

namespace backend.Services
{
    public class ProfissionalHorarioService : IProfissionalHorarioService
    {
        private readonly IProfissionalHorarioRepository _repository;
        private readonly IProfissionalsRepository _repositoryProfissional;

        public ProfissionalHorarioService(IProfissionalHorarioRepository repository, IProfissionalsRepository repositoryPro)
        {
            _repository = repository;
            _repositoryProfissional = repositoryPro;
        }
        private ProfissionalDTO toProfissionalDTO(Profissional? profissional){
            return new ProfissionalDTO{
                Id = profissional.Id,
                Nome = profissional.Nome,
                BI = profissional.BI,
                CategoryId = profissional.CategoryId,
                Email = profissional.Email,
                Telemovel = profissional.Telemovel,
            };
        }
        public async Task<IEnumerable<ProfissionalHorarioDTO>> GetAllProfissionalHorariosAsync()
        {
            var profissionalHorarios = await _repository.GetAllProfissionalHorariosAsync();
            var profisionais = await _repositoryProfissional.GetAllProfissionalsAsync();
            return profissionalHorarios.Select(ph => new ProfissionalHorarioDTO
            {
                Id = ph.Id,
                ProfissionalId = ph.ProfissionalId,
                profissional =  toProfissionalDTO(profisionais.ToList().Find(p => p.Id == ph.ProfissionalId)),
                horario = ph.horario
            });
        }

        public async Task<ProfissionalHorarioDTO?> GetProfissionalHorariosByIdAsync(int id)
        {
            var profissionalHorario = await _repository.GetProfissionalHorariosByIdAsync(id);
            var profisionais = await _repositoryProfissional.GetAllProfissionalsAsync();
            if (profissionalHorario == null)
                return null;

            return new ProfissionalHorarioDTO
            {
                Id = profissionalHorario.Id,
                ProfissionalId = profissionalHorario.ProfissionalId,
                profissional = toProfissionalDTO(profisionais.ToList().Find(p => p.Id == profissionalHorario.ProfissionalId)),
                horario = profissionalHorario.horario
            };
        }

        public async Task<IEnumerable<ProfissionalHorarioDTO>> GetProfissionalHorariosAsync(int profissionalId){
            var profissionalHorarios = await _repository.GetProfissionalsHorarioByIdAsync(profissionalId);
            var profissionalM = await _repositoryProfissional.GetProfissionalByIdAsync(profissionalId);
            return profissionalHorarios.Select(ph => new ProfissionalHorarioDTO
            {
                Id = ph.Id,
                 ProfissionalId = ph.ProfissionalId,
                profissional = new ProfissionalDTO{
                    Id = profissionalM.Id,
                    BI = profissionalM.BI,
                    CategoryId = profissionalM.CategoryId,
                    Email = profissionalM.Email,
                    Nome = profissionalM.Nome,
                    Telemovel = profissionalM.Telemovel,
                },
                horario = ph.horario
            });
        }

        public async Task CreateProfissionalHorarioAsync(ProfissionalHorarioDTO profissionalHorarioDTO)
        {
            if (profissionalHorarioDTO == null)
                throw new ArgumentNullException(nameof(profissionalHorarioDTO), "ProfissionalHorarioDTO cannot be null.");

            var entity = new ProfissionalHorario
            {
                horario = profissionalHorarioDTO.horario,
                ProfissionalId = profissionalHorarioDTO.ProfissionalId,
            };

            await _repository.CreateProfissionalHorarioAsync(entity);
        }

        public async Task UpdateProfissionalHorarioAsync(ProfissionalHorarioDTO profissionalHorarioDTO)
        {
            if (profissionalHorarioDTO == null)
                throw new ArgumentNullException(nameof(profissionalHorarioDTO), "ProfissionalHorarioDTO cannot be null.");

            var entity = await _repository.GetProfissionalHorariosByIdAsync(profissionalHorarioDTO.Id);
            if (entity == null)
                throw new KeyNotFoundException($"ProfissionalHorario with ID {profissionalHorarioDTO.Id} not found.");

            entity.horario = profissionalHorarioDTO.horario;
            entity.ProfissionalId = profissionalHorarioDTO.ProfissionalId;

            await _repository.UpdateProfissionalHorarioAsync(entity);
        }

        public async Task DeleteProfissionalAsync(int id)
        {
            var profissionalHorario = await _repository.GetProfissionalHorariosByIdAsync(id);
            if (profissionalHorario == null)
                throw new KeyNotFoundException($"ProfissionalHorario with ID {id} not found.");

            await _repository.DeleteProfissionalHorarioAsync(id);
        }
    }
}
