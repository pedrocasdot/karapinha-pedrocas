using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;
using backend.Shared.Repositories;
using Microsoft.EntityFrameworkCore;

namespace backend.DAL.Repositories
{
    public class ProfissionalRepository : IProfissionalsRepository
    {
        private readonly ApplicationDBContext _context;

        public ProfissionalRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Profissional>> GetAllProfissionalsAsync()
        {
            return await _context.Profissionals.ToListAsync();
        }

        public async Task<Profissional> GetProfissionalByIdAsync(int id)
        {
            var profissional = await _context.Profissionals.FindAsync(id) ?? throw new KeyNotFoundException($"Profissional with ID {id} not found.");
            return profissional;
        }

        public async Task<Profissional> CreateProfissionalAsync(Profissional profissional)
        {
            _context.Profissionals.Add(profissional);
            await _context.SaveChangesAsync();
            return profissional;
        }


        public async Task<Profissional> GetProfissionalByBIAsync(string BI)
        {
            var profissional = await _context.Profissionals
                        .FirstOrDefaultAsync(profissional => profissional.BI == BI);
            return profissional;
        }


        public async Task UpdateProfissionalAsync(Profissional profissional)
        {
            _context.Entry(profissional).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

    
        public async Task DeleteProfissionalAsync(int id)
        {
            var profissional = await _context.Profissionals.FindAsync(id) ?? throw new KeyNotFoundException($"Profissional with ID {id} not found.");
            _context.Profissionals.Remove(profissional);
            await _context.SaveChangesAsync();
        }
    }
}