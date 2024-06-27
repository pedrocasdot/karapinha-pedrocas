using backend.DTO;

namespace backend.Shared.Services
{
    public interface IServicoService
    {
        Task<IEnumerable<ServiceDTO>> GetAllServicesAsync();
        Task<ServiceDTO> GetServiceByIdAsync(int id);
        Task CreateServiceAsync(ServiceDTO service);
        Task UpdateServiceAsync(ServiceDTO service);
        Task DeleteServiceAsync(int id);
    }
}