using backend.DAL.Repositories;
using backend.DTO;
using backend.Model;
using backend.Shared.Repositories;
using backend.Shared.Services;

namespace backend.Services
{
    public class ServicoService : IServicoService
    {
        private readonly IServicesRepository _serviceRepository;
        private readonly ICategoryService _categoryService;

        public ServicoService(IServicesRepository serviceRepository, ICategoryService categoryService)
        {
            _serviceRepository = serviceRepository;
            _categoryService = categoryService;
        }

        public async Task<IEnumerable<ServiceDTO>> GetAllServicesAsync()
        {
            var services = await _serviceRepository.GetAllServicesAsync();
            return services.Select(s => new ServiceDTO
            {

                Id = s.Id,
                ServiceName = s.ServiceName,
                CategoryId = s.CategoryId,
                Category = _categoryService.GetCategoryByIdAsync((int)s.CategoryId).Result,
                Status = s.Status,
                Price = s.Price
            });
        }

        public async Task<ServiceDTO?> GetServiceByIdAsync(int id)
        {
            var service = await _serviceRepository.GetServiceByIdAsync(id);
            if (service == null)
                return null;

            return new ServiceDTO
            {
                Id = service.Id,
                ServiceName = service.ServiceName,
                CategoryId = service.CategoryId,
                Category = _categoryService.GetCategoryByIdAsync((int)service.CategoryId).Result,
                Status = service.Status,
                Price = service.Price
            };
        }

        public async Task CreateServiceAsync(ServiceDTO service)
        {
            var entity = new Service
            {
                ServiceName = service.ServiceName,
                CategoryId = service.CategoryId,
                Price = service.Price,
                Status = true
            };

            await _serviceRepository.CreateServiceAsync(entity);
        }

        public async Task UpdateServiceAsync(ServiceDTO service)
        {
            var entity = await _serviceRepository.GetServiceByIdAsync(service.Id);
            if (entity == null)
                return;

            entity.ServiceName = service.ServiceName;
            entity.CategoryId = service.CategoryId;
            entity.Price = service.Price;
            entity.Status = service.Status;

            await _serviceRepository.UpdateServiceAsync(entity);
        }

        public async Task DeleteServiceAsync(int id)
        {
            await _serviceRepository.DeleteServiceAsync(id);
        }
    }
}