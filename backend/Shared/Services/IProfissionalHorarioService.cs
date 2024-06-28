using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;

namespace backend.Shared.Services
{
    public interface IProfissionalHorarioService
    {
        Task<IEnumerable<ProfissionalHorarioDTO>> GetAllProfissionalHorariosAsync();
        Task<ProfissionalHorarioDTO> GetProfissionalHorariosByIdAsync(int id);

        Task<IEnumerable<string>> GetProfissionalHorariosAsync(int profissionalId);

        Task CreateProfissionalHorarioAsync(ProfissionalHorarioDTO user);
        Task UpdateProfissionalHorarioAsync(ProfissionalHorarioDTO user);
        Task DeleteProfissionalAsync(int id);
    }
}