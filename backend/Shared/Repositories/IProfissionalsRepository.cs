using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;

namespace backend.Shared.Repositories
{
    public interface IProfissionalsRepository
    {
        Task<IEnumerable<Profissional>> GetAllProfissionalsAsync();
        Task<Profissional> GetProfissionalByIdAsync(int id);
        Task<Profissional> CreateProfissionalAsync(Profissional user);
        Task<Profissional> GetProfissionalByBIAsync(string BI);
        Task UpdateProfissionalAsync(Profissional user);
        Task DeleteProfissionalAsync(int id);
    }
}