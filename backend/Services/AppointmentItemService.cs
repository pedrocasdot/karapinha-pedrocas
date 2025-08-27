using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using backend.DTO;
using backend.Model;
using backend.Shared.Repositories;
using backend.Shared.Services;

namespace backend.Services
{
    public class AppointmentItemService : IAppointmentItemService
    {
        
        private readonly IAppointmentItemRepository _appointmentRepository;
        private readonly IServicoService _servicesService;
        private readonly IProfissionalService _profissionalService;


        public AppointmentItemService(IAppointmentItemRepository appointmentRepository, IServicoService servicesRepository, IProfissionalService profissionalsRepository)
        {
            _appointmentRepository = appointmentRepository;
            _servicesService = servicesRepository;
            _profissionalService = profissionalsRepository;

        }

        public async Task<IEnumerable<AppointmentItemGetDTO>> GetAllAppointmentsItemsAsync()
        {
            var appointments = await _appointmentRepository.GetAllAppointmentsItemsAsync();
            return appointments.Select(a => new AppointmentItemGetDTO
            {
                Id = a.Id,
                Time = a.Time,
                ServiceId = a.ServiceId,
                Servico = _servicesService.GetServiceByIdAsync((int)a.ServiceId).Result,
                ProfissionalId = a.ProfissionalId,
                AppointmentId = a.AppointmentId,
                Profissional = _profissionalService.GetProfissionalByIdAsync((int)a.ProfissionalId).Result,
                AppointmentDate = a.AppointmentDate
            });
        }

        public async Task<IEnumerable<AppointmentItemGetDTO>> FilterByAppointmentId(int appointmentId){
            
        }

        public async Task<AppointmentItemGetDTO> GetAppointmentItemByIdAsync(int id)
        {
            var a = await _appointmentRepository.GetAppointmentItemByIdAsync(id);

            if (a == null)
                return null;

            return new AppointmentItemGetDTO
            {
                Id = a.Id,
                Time = a.Time,
                ServiceId = a.ServiceId,
                Servico = _servicesService.GetServiceByIdAsync((int)a.ServiceId).Result,
                ProfissionalId = a.ProfissionalId,
                AppointmentId = a.AppointmentId,
                Profissional = _profissionalService.GetProfissionalByIdAsync((int)a.ProfissionalId).Result,
                AppointmentDate = a.AppointmentDate
            };
        }

        public async Task CreateAppointmentItemAsync(AppointmentItemAddDTO appointment)
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


            var appointments = await _appointmentRepository.GetAllAppointmentsItemsAsync();
            var found = appointments.Any(x => x.AppointmentDate == appointment.AppointmentDate && x.Time == appointment.Time && x.ProfissionalId == appointment.ProfissionalId);
            if (found)
            {
                throw new ValidationException("O profissional já está ocupado neste horário.");
            }

            var entity = new AppointmentItem
            {
                Time = appointment.Time,
                ServiceId = appointment.ServiceId,
                ProfissionalId = appointment.ProfissionalId,
                AppointmentDate = appointment.AppointmentDate,
            };

            await _appointmentRepository.CreateAppointmentItemAsync(entity);
        }

        public async Task UpdateAppointmentItemAsync(AppointmentItemGetDTO appointment)
        {
            var entity = await _appointmentRepository.GetAppointmentItemByIdAsync(appointment.Id);
            if (entity == null)
                return;

            entity.AppointmentDate = appointment.AppointmentDate ?? entity.AppointmentDate;
            entity.ServiceId = appointment.ServiceId ?? entity.ServiceId;
            entity.ProfissionalId = appointment.ProfissionalId ?? entity.ProfissionalId ;
            entity.Time = appointment.Time ?? entity.Time;
            await _appointmentRepository.UpdateAppointmentItemAsync(entity);
        }

        public async Task DeleteAppointmentItemAsync(int id)
        {
            await _appointmentRepository.DeleteAppointmentItemAsync(id);
        }


        public async Task<IEnumerable<ServicosSolicatacoesDTO>> GetServicoMaisMenosSolicitadoAsync()
        {
            var appointments = await _appointmentRepository.GetAllAppointmentsItemsAsync();

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
            var appointments = await _appointmentRepository.GetAllAppointmentsItemsAsync();
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
            
            var appointments = await _appointmentRepository.GetAllAppointmentsItemsAsync();

            // Valor faturado no dia corrente
            var today = DateTime.Today;
            var totalToday = appointments
                .Where(a => a.AppointmentDate == today.ToString("yyyy-MM-dd") )
                .Sum(a => _servicesService.GetServiceByIdAsync((int)a.ServiceId).Result.Price);

            // Valor faturado ontem
            var yesterday = today.AddDays(-1);
            var totalYesterday = appointments
                .Where(a => a.AppointmentDate == yesterday.ToString("yyyy-MM-dd"))
                .Sum(a => _servicesService.GetServiceByIdAsync((int)a.ServiceId).Result.Price);

            // Valor faturado no mês corrente
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);
            var totalMonth = appointments
                .Where(a => a.AppointmentDate.CompareTo(startOfMonth.ToString("yyyy-MM-dd")) >= 0 && a.AppointmentDate.CompareTo(endOfMonth.ToString("yyyy-MM-dd")) <= 0 )
                .Sum(a => _servicesService.GetServiceByIdAsync((int)a.ServiceId).Result.Price);

            // Valor faturado no mês passado
            var startOfLastMonth = new DateTime(today.Year, today.Month, 1).AddMonths(-1);
            var endOfLastMonth = startOfLastMonth.AddMonths(1).AddDays(-1);
            var totalLastMonth = appointments
                .Where(a => a.AppointmentDate.CompareTo(startOfLastMonth.ToString("yyyy-MM-dd")) >= 0 && a.AppointmentDate.CompareTo(endOfLastMonth.ToString("yyyy-MM-dd")) <= 0 )
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