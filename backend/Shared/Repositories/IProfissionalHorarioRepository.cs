using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;

namespace backend.Shared.Repositories
{
    public interface IProfissionalHorarioRepository
    {

        Task<IEnumerable<ProfissionalHorario>> GetAllProfissionalHorariosAsync();
        Task<ProfissionalHorario> GetProfissionalHorariosByIdAsync(int id);

        Task<IEnumerable<ProfissionalHorario>> GetProfissionalsHorarioByIdAsync(int profissionalId);
        Task CreateProfissionalHorarioAsync(ProfissionalHorario profissionalHorario);
        Task UpdateProfissionalHorarioAsync(ProfissionalHorario profissionalHorario);
        Task DeleteProfissionalHorarioAsync(int id);
    }
}