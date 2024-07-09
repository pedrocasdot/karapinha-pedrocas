using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;

namespace backend.Shared.Services
{
    public interface IProfissionalService
    {
        Task<IEnumerable<ProfissionalDTO>> GetAllProfissionalsAsync();
        Task<ProfissionalDTO> GetProfissionalByIdAsync(int id);
        Task<ProfissionalDTO> CreateProfissionalAsync(ProfissionalDTO user);
        Task UpdateProfissionalAsync(ProfissionalDTO user);

        Task<ProfissionalDTO> GetProfissionalByBIAsync(string BI);
        Task DeleteProfissionalAsync(int id);
    }
}