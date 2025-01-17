using backend.DTO;

namespace backend.Shared.Services;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync();
    Task<AppointmentDTO> GetAppointmentByIdAsync(int id);
    Task CreateAppointmentAsync(AppointmentDTO appointment);
    Task UpdateAppointmentAsync(AppointmentDTO appointment);
    Task DeleteAppointmentAsync(int id);
    Task<IEnumerable<ServicosSolicatacoesDTO>> GetServicoMaisMenosSolicitadoAsync();

    Task<IEnumerable<FaturamentoDTO>> GetFaturamentoAsync();
    Task<IEnumerable<ProfissionalSolicitacoesDTO>> GetTop5ProfissionaisAsync();
}