using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;
using backend.Shared.Repositories;
using Microsoft.EntityFrameworkCore;

namespace backend.DAL.Repositories
{
    public class ProfissionalHorarioRepository : IProfissionalHorarioRepository
    {
        private readonly ApplicationDBContext _context;

        public ProfissionalHorarioRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProfissionalHorario>> GetAllProfissionalHorariosAsync()
        {
            return await _context.ProfissionalHorarios.Where(p => p.Id > 0).ToListAsync();
        }

        public async Task<ProfissionalHorario> GetProfissionalHorariosByIdAsync(int id)
        {
            var profissionalHorario = await _context.ProfissionalHorarios.FindAsync(id) ?? throw new KeyNotFoundException($"ProfissionalHorario with ID {id} not found.");
            return profissionalHorario;
        }

        public async Task<IEnumerable<ProfissionalHorario>> GetProfissionalsHorarioByIdAsync(int profissionalId)
        {
            return await _context.ProfissionalHorarios
                .Where(ph => ph.ProfissionalId == profissionalId)
                .ToListAsync();
        }

        public async Task CreateProfissionalHorarioAsync(ProfissionalHorario profissionalHorario)
        {
            _context.ProfissionalHorarios.Add(profissionalHorario);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateProfissionalHorarioAsync(ProfissionalHorario profissionalHorario)
        {
            _context.Entry(profissionalHorario).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProfissionalHorarioAsync(int id)
        {
            var profissionalHorario = await _context.ProfissionalHorarios.FindAsync(id);
            if (profissionalHorario != null)
            {
                _context.ProfissionalHorarios.Remove(profissionalHorario);
                await _context.SaveChangesAsync();
            }
        }
    }
}