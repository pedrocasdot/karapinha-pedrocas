using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
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
        private readonly IProfissionalService _serviceProfissional;

        public ProfissionalHorarioService(IProfissionalHorarioRepository repository, IProfissionalService serviceProfissional)
        {
            _repository = repository;
            _serviceProfissional = serviceProfissional;
        }

        public async Task<IEnumerable<ProfissionalHorarioDTO>> GetAllProfissionalHorariosAsync()
        {
            var profissionalHorarios = await _repository.GetAllProfissionalHorariosAsync();
            return profissionalHorarios.Select(ph => new ProfissionalHorarioDTO
            {
                Id = ph.Id,
                ProfissionalId = ph.ProfissionalId,
                profissional = _serviceProfissional.GetProfissionalByIdAsync((int)ph.ProfissionalId).Result,
                horario = ph.horario
            });
        }

        public async Task<ProfissionalHorarioDTO?> GetProfissionalHorariosByIdAsync(int id)
        {
            var profissionalHorario = await _repository.GetProfissionalHorariosByIdAsync(id);
            if (profissionalHorario == null)
                return null;

            return new ProfissionalHorarioDTO
            {
                Id = profissionalHorario.Id,
                ProfissionalId = profissionalHorario.ProfissionalId,
                profissional = _serviceProfissional.GetProfissionalByIdAsync((int)profissionalHorario.ProfissionalId).Result,
                horario = profissionalHorario.horario
            };
        }

        public async Task<IEnumerable<string>> GetProfissionalHorariosAsync(int profissionalId)
        {
            var profissionalHorarios = await _repository.GetProfissionalsHorarioByIdAsync(profissionalId);
            return profissionalHorarios.Select(ph => ph.horario).ToList();
        }

        public async Task CreateProfissionalHorarioAsync(ProfissionalHorarioDTO profissionalHorarioDTO)
        {
            if (profissionalHorarioDTO == null)
                throw new ArgumentNullException(nameof(profissionalHorarioDTO), "ProfissionalHorarioDTO cannot be null.");

            if (!Regex.IsMatch(profissionalHorarioDTO.horario, @"^(09:00|09:30|10:00|10:30|11:00|11:30|12:00|12:30|13:00|13:30|14:00|14:30|15:00|15:30|16:00|16:30|17:00|17:30|18:00|18:30|19:00|19:30)$"))
                throw new ValidationException("O horário deve estar no formato HH:mm e entre 09:00 e 19:30, com minutos apenas em 00 ou 30.");


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
