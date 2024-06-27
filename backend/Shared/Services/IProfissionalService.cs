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
        Task CreateProfissionalAsync(ProfissionalDTO user);
        Task UpdateProfissionalAsync(ProfissionalDTO user);
        Task DeleteProfissionalAsync(int id);
    }
}