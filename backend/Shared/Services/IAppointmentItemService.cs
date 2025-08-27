using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;

namespace backend.Shared.Services
{
    public interface IAppointmentItemService
    {
        Task<IEnumerable<AppointmentItemGetDTO>> GetAllAppointmentsItemsAsync();

        Task<IEnumerable<AppointmentItemGetDTO>> FilterByAppointmentId(int appointmentId);
        Task<AppointmentItemGetDTO> GetAppointmentItemByIdAsync(int id);
        Task CreateAppointmentItemAsync(AppointmentItemAddDTO appointment);
        Task UpdateAppointmentItemAsync(AppointmentItemGetDTO appointment);
        Task DeleteAppointmentItemAsync(int id);
        Task<IEnumerable<ServicosSolicatacoesDTO>> GetServicoMaisMenosSolicitadoAsync();

        Task<IEnumerable<FaturamentoDTO>> GetFaturamentoAsync();
        Task<IEnumerable<ProfissionalSolicitacoesDTO>> GetTop5ProfissionaisAsync();
    }
}