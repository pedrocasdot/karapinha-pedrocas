using backend.Model;
using backend.Shared.Repositories;
using Microsoft.EntityFrameworkCore;

namespace backend.DAL.Repositories
{
    public class ServiceRepository : IServicesRepository
    {
        private readonly ApplicationDBContext _context;

        public ServiceRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Service>> GetAllServicesAsync()
        {
            return await _context.Services.ToListAsync();
        }

        public async Task<Service> GetServiceByIdAsync(int id)
        {
            
            return await _context.Services.FindAsync(id);
        }

        public async Task CreateServiceAsync(Service service)
        {
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateServiceAsync(Service service)
        {
            _context.Entry(service).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteServiceAsync(int id)
        {
            var service = await _context.Services.FindAsync(id);
            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
        }
    }
}