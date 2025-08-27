using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;
using backend.Shared.Repositories;
using Microsoft.EntityFrameworkCore;

namespace backend.DAL.Repositories
{
    public class AppointmentItemRepository : IAppointmentItemRepository
    {
        private readonly ApplicationDBContext _context;

        public AppointmentItemRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AppointmentItem>> GetAllAppointmentsItemsAsync()
        {
            return await _context.AppointmentItems.ToListAsync();
        }



        public async Task<AppointmentItem> GetAppointmentItemByIdAsync(int id)
        {
            return await _context.AppointmentItems.FindAsync(id);
        }

        public async Task CreateAppointmentItemAsync(AppointmentItem appointment)
        {
            _context.AppointmentItems.Add(appointment);
            await _context.SaveChangesAsync();
        }
        
        public async Task UpdateAppointmentItemAsync(AppointmentItem appointment)
        {
            _context.Entry(appointment).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAppointmentItemAsync(int id)
        {
            var appointment = await _context.AppointmentItems.FindAsync(id);
            _context.AppointmentItems.Remove(appointment);
            await _context.SaveChangesAsync();
        }
    }
}