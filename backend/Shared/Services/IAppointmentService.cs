using backend.DTO;

namespace backend.Shared.Services;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync();
    Task<AppointmentDTO> GetAppointmentByIdAsync(int id);
    Task<AppointmentDTO> CreateAppointmentAsync(AppointmentAddDTO appointment);
    Task<AppointmentDTO> UpdateAppointmentAsync(AppointmentUpdateDTO appointment);
    Task DeleteAppointmentAsync(int id);
    
}