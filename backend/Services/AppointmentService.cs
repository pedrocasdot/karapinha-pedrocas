using backend.DAL.Repositories;
using backend.DTO;
using backend.Model;
using backend.Shared.Repositories;
using backend.Shared.Services;

namespace backend.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentsRepository _appointmentRepository;
        private readonly IServicoService _servicesService;
        private readonly IProfissionalService _profissionalService;
        private readonly IUserService _userService;
    
        public AppointmentService(IAppointmentsRepository appointmentRepository, IServicoService servicesRepository, IProfissionalService profissionalsRepository, IUserService usersRepository)
        {
            _appointmentRepository = appointmentRepository;
            _servicesService = servicesRepository;
            _profissionalService = profissionalsRepository;
            _userService = usersRepository;

        }

        public async Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync()
        {
            var appointments = await _appointmentRepository.GetAllAppointmentsAsync();
            return appointments.Select(a => new AppointmentDTO
            {
                Id = a.Id,
                Time = a.Time,
                ServiceId = a.ServiceId,
                Servico = _servicesService.GetServiceByIdAsync((int)a.ServiceId).Result,
                UserId = a.UserId,
                User = _userService.GetUserByIdAsync((int)a.UserId).Result,
                ProfissionalId = a.ProfissionalId,
                Profissional = _profissionalService.GetProfissionalByIdAsync((int)a.ProfissionalId).Result,
                AppointmentDate = a.AppointmentDate,
                Status = a.Status
            });
        }

        public async Task<AppointmentDTO> GetAppointmentByIdAsync(int id)
        {
            var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
            if (appointment == null)
                return null;

            return new AppointmentDTO
            {
                Id = appointment.Id,
                Time = appointment.Time,
                ServiceId = appointment.ServiceId,
                Servico = _servicesService.GetServiceByIdAsync((int)appointment.ServiceId).Result,
                UserId = appointment.UserId,
                User = _userService.GetUserByIdAsync((int)appointment.UserId).Result,
                ProfissionalId = appointment.ProfissionalId,
                Profissional = _profissionalService.GetProfissionalByIdAsync((int)appointment.ProfissionalId).Result,
                AppointmentDate = appointment.AppointmentDate,
                Status = appointment.Status
            };
        }

        public async Task CreateAppointmentAsync(AppointmentDTO appointment)
        {
            var entity = new Appointment
            {
                
                Time = appointment.Time,
                ServiceId = appointment.ServiceId,
                UserId = appointment.UserId,
                ProfissionalId = appointment.ProfissionalId,
                AppointmentDate = appointment.AppointmentDate,
                Status = false
            };

            await _appointmentRepository.CreateAppointmentAsync(entity);
        }

        public async Task UpdateAppointmentAsync(AppointmentDTO appointment)
        {
            var entity = await _appointmentRepository.GetAppointmentByIdAsync(appointment.Id);
            if (entity == null)
                return;

            
            entity.AppointmentDate = appointment.AppointmentDate;
            entity.ServiceId = appointment.ServiceId;
            entity.UserId = appointment.UserId;
            entity.ProfissionalId = appointment.ProfissionalId;
            entity.Time = appointment.Time;
            entity.Status = appointment.Status;
            await _appointmentRepository.UpdateAppointmentAsync(entity);
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            await _appointmentRepository.DeleteAppointmentAsync(id);
        }
    }
}