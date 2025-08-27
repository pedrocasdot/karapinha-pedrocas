using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Text.RegularExpressions;
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
        private readonly IAppointmentItemService _appointmentItemService;
        private readonly IUserService _userService;

        public AppointmentService(IAppointmentsRepository appointmentRepository, IUserService usersRepository, IAppointmentItemService appointmentItemService)
        {
            _appointmentRepository = appointmentRepository;
            _userService = usersRepository;
            _appointmentItemService = appointmentItemService;

        }

        public async Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync()
        {
            var appointments = await _appointmentRepository.GetAllAppointmentsAsync();
            return appointments.Select(a => new AppointmentDTO
            {
                Id = a.Id,
                UserId = a.UserId,
                User = _userService.GetUserByIdAsync((int)a.UserId).Result,
                Reschedule = a.Reschedule,
                ValorTotal = a.ValorTotal,
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
                ValorTotal = appointment.ValorTotal,
                UserId = appointment.UserId,
                User = _userService.GetUserByIdAsync((int)appointment.UserId).Result,
                Reschedule = appointment.Reschedule,
                Status = appointment.Status
            };
        }

        public async Task<AppointmentDTO> CreateAppointmentAsync(AppointmentAddDTO appointment)
        {
            if (appointment == null)
                throw new ArgumentNullException(nameof(appointment), "AppointmentDTO cannot be null.");


            var entity = new Appointment
            {
                UserId = appointment.UserId,
                Status = false,
                Reschedule = false,
                ValorTotal = (decimal)appointment.ValorTotal,
            };
            
            var Id = await _appointmentRepository.CreateAppointmentAsync(entity);
            return new AppointmentDTO {
                Id = Id,
                UserId = entity.UserId,
                User = _userService.GetUserByIdAsync((int)entity.UserId).Result,
                Reschedule = entity.Reschedule,
                Status  = entity.Status,
                ValorTotal = entity.ValorTotal,
                // AppointmentItems = 
            };
        }

        public async Task<AppointmentDTO> UpdateAppointmentAsync(AppointmentUpdateDTO appointment)
        {
            var entity = await _appointmentRepository.GetAppointmentByIdAsync(appointment.Id);
            if (entity == null)
                throw new Exception("Entidade não foi encontrada");
            entity.UserId = appointment.UserId;
            entity.Status = appointment.Status;
            entity.Reschedule = appointment.Reschedule;
            await _appointmentRepository.UpdateAppointmentAsync(entity);
            return new AppointmentDTO {
                Id = entity.Id,
                                
            };
        }

        internal AppointmentDTO dTO(Generic appointment){

        }

        public async Task DeleteAppointmentAsync(int id)
        {
            await _appointmentRepository.DeleteAppointmentAsync(id);
        }
    }
}