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
                Reschedule = a.Reschedule,
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
                Reschedule = appointment.Reschedule,
                Profissional = _profissionalService.GetProfissionalByIdAsync((int)appointment.ProfissionalId).Result,
                AppointmentDate = appointment.AppointmentDate,
                Status = appointment.Status
            };
        }

        public async Task CreateAppointmentAsync(AppointmentDTO appointment)
        {
            if (appointment == null)
                throw new ArgumentNullException(nameof(appointment), "AppointmentDTO cannot be null.");

            if (!Regex.IsMatch(appointment.Time, @"^(09:00|09:30|10:00|10:30|11:00|11:30|12:00|12:30|13:00|13:30|14:00|14:30|15:00|15:30|16:00|16:30|17:00|17:30|18:00|18:30|19:00|19:30)$"))
                throw new ValidationException("O horário deve estar no formato HH:mm e entre 09:00 e 19:30, com minutos apenas em 00 ou 30.");


            if (!DateTime.TryParseExact(appointment.AppointmentDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime appointmentDate))
                throw new ValidationException("A data do agendamento deve estar no formato 'yyyy-MM-dd'.");

            if (!TimeSpan.TryParseExact(appointment.Time, "hh\\:mm", CultureInfo.InvariantCulture, out TimeSpan appointmentTime))
                throw new ValidationException("A hora do agendamento deve estar no formato 'hh:mm'.");

            if (appointmentDate.Date < DateTime.Today)
                throw new ValidationException("A data do agendamento não pode ser um dia passado.");

            
            if (appointmentDate.Date == DateTime.Today && appointmentTime < DateTime.Now.TimeOfDay)
                throw new ValidationException("A hora do agendamento não pode ser uma hora passada.");


            var appointments = await _appointmentRepository.GetAllAppointmentsAsync();
            var found = appointments.Any(x => x.AppointmentDate == appointment.AppointmentDate && x.Time == appointment.Time && x.ProfissionalId == appointment.ProfissionalId);
            if (found)
            {
                throw new ValidationException("O profissional já está ocupado neste horário.");
            }

            var entity = new Appointment
            {
                Time = appointment.Time,
                ServiceId = appointment.ServiceId,
                UserId = appointment.UserId,
                ProfissionalId = appointment.ProfissionalId,
                AppointmentDate = appointment.AppointmentDate,
                Status = false,
                Reschedule = false
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
            entity.Reschedule = appointment.Reschedule;
            await _appointmentRepository.UpdateAppointmentAsync(entity);
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            await _appointmentRepository.DeleteAppointmentAsync(id);
        }

        public async Task<IEnumerable<ServicosSolicatacoesDTO>> GetServicoMaisMenosSolicitadoAsync()
        {
            var appointments = await _appointmentRepository.GetAllAppointmentsAsync();

            if (appointments == null || !appointments.Any())
            {
                return null;
            }

            var servicoGroup = appointments.GroupBy(a => a.ServiceId)
                .Select(g => new { ServiceId = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .ToList();

            if (!servicoGroup.Any())
            {
                return null;
            }

            var servicoMaisSolicitadoId = servicoGroup.First().ServiceId;
            var servicoMenosSolicitadoId = servicoGroup.Last().ServiceId;

            var servicoMaisSolicitado = await _servicesService.GetServiceByIdAsync((int)servicoMaisSolicitadoId);
            var servicoMenosSolicitado = await _servicesService.GetServiceByIdAsync((int)servicoMenosSolicitadoId);

            var servicosSolicitados = new List<ServicosSolicatacoesDTO>
                {
                    new ServicosSolicatacoesDTO
                    {
                        Service = servicoMaisSolicitado,
                        Solicitacoes = servicoGroup.First().Count
                    },
                    new ServicosSolicatacoesDTO
                    {
                        Service = servicoMenosSolicitado,
                        Solicitacoes = servicoGroup.Last().Count
                    }
                };

            return servicosSolicitados;
        }



        
        public async Task<IEnumerable<ProfissionalSolicitacoesDTO>> GetTop5ProfissionaisAsync()
        {
            var appointments = await _appointmentRepository.GetAllAppointmentsAsync();
            var profissionalGroup = appointments.GroupBy(a => a.ProfissionalId)
                .Select(g => new { ProfissionalId = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .Take(5)
                .ToList();

            var topProfissionais = new List<ProfissionalSolicitacoesDTO>();
            foreach (var group in profissionalGroup)
            {
                var profissional = await _profissionalService.GetProfissionalByIdAsync(group.ProfissionalId.Value);
                topProfissionais.Add(new ProfissionalSolicitacoesDTO
                {
                    Profissional = profissional,
                    Solicitacoes = group.Count
                });
            }

            return topProfissionais;
        }
        public async Task<IEnumerable<FaturamentoDTO>> GetFaturamentoAsync()
        {
            
            var appointments = await _appointmentRepository.GetAllAppointmentsAsync();

            // Valor faturado no dia corrente
            var today = DateTime.Today;
            var totalToday = appointments
                .Where(a => a.AppointmentDate == today.ToString("yyyy-MM-dd") && a.Status == true)
                .Sum(a => _servicesService.GetServiceByIdAsync((int)a.ServiceId).Result.Price);

            // Valor faturado ontem
            var yesterday = today.AddDays(-1);
            var totalYesterday = appointments
                .Where(a => a.AppointmentDate == yesterday.ToString("yyyy-MM-dd") && a.Status == true)
                .Sum(a => _servicesService.GetServiceByIdAsync((int)a.ServiceId).Result.Price);

            // Valor faturado no mês corrente
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);
            var totalMonth = appointments
                .Where(a => a.AppointmentDate.CompareTo(startOfMonth.ToString("yyyy-MM-dd")) >= 0 && a.AppointmentDate.CompareTo(endOfMonth.ToString("yyyy-MM-dd")) <= 0 && a.Status == true)
                .Sum(a => _servicesService.GetServiceByIdAsync((int)a.ServiceId).Result.Price);

            // Valor faturado no mês passado
            var startOfLastMonth = new DateTime(today.Year, today.Month, 1).AddMonths(-1);
            var endOfLastMonth = startOfLastMonth.AddMonths(1).AddDays(-1);
            var totalLastMonth = appointments
                .Where(a => a.AppointmentDate.CompareTo(startOfLastMonth.ToString("yyyy-MM-dd")) >= 0 && a.AppointmentDate.CompareTo(endOfLastMonth.ToString("yyyy-MM-dd")) <= 0 && a.Status == true)
                .Sum(a => _servicesService.GetServiceByIdAsync((int)a.ServiceId).Result.Price);


            var faturamentoList = new List<FaturamentoDTO>
         {
             new() {
                 Titulo = "Hoje",
                 Valor = (decimal)totalToday
             },
             new() {
                 Titulo = "Ontem",
                 Valor = (decimal)totalYesterday
             },
             new() {
                 Titulo = "Mês Corrente",
                 Valor = (decimal)totalMonth
             },
             new() {
                 Titulo = "Mês Passado",
                 Valor = (decimal)totalLastMonth
             }
         };
            return faturamentoList;
        }


    }
}