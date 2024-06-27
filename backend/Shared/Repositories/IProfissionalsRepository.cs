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
        Task CreateProfissionalAsync(Profissional user);
        Task UpdateProfissionalAsync(Profissional user);
        Task DeleteProfissionalAsync(int id);
    }
}