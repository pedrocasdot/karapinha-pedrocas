using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using backend.DTO;
using backend.Services;
using backend.Shared.Repositories;
using backend.Shared.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/appointments")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IUserService _userService;

        private readonly IServicoService _servicoServico;

        private readonly IProfissionalService _profissionalService;
        

         public EmailService EmailService { get; }

        public AppointmentsController(IAppointmentService appointmentService, IUserService userService,
         EmailService emailService, IServicoService servicoService, IProfissionalService profissionalService)
        {
            _appointmentService = appointmentService;
            _userService = userService;
            _profissionalService  = profissionalService;
            _servicoServico = servicoService;
            EmailService = emailService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAppointments()
        {
            var appointments = await _appointmentService.GetAllAppointmentsAsync();
            return Ok(appointments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDTO>> GetAppointment(int id)
        {
            var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }
            return Ok(appointment);
        }

        [HttpPost]
        public async Task<ActionResult> CreateAppointment(AppointmentDTO appointment)
        {
            await _appointmentService.CreateAppointmentAsync(appointment);
            var userEmail  = await _userService.GetUserByIdAsync((int)appointment.UserId);
            appointment.Reschedule = false;
            appointment.Servico = _servicoServico.GetServiceByIdAsync((int)appointment.ServiceId).Result;
            appointment.Profissional = _profissionalService.GetProfissionalByIdAsync((int)appointment.ProfissionalId).Result;
            appointment.User = userEmail;
            await EmailService.SendEmail(userEmail.EnderecoEmail, "Confirmação de agendamento", "Seu agendamento foi realizado com sucesso, aguarde pela confirmação!");
            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, AppointmentDTO appointment)
        {

            if (id != appointment.Id)
            {
                return BadRequest();
            }

            await _appointmentService.UpdateAppointmentAsync(appointment);
            return NoContent();
        }

        [HttpPut("confirmarMarcacao/{id:int}")]
        public async Task<IActionResult> confirmarMarcacao(int id)
        {
            var  appointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (appointment == null)
            {
                return BadRequest();
            }
            appointment.Status = true;
            await _appointmentService.UpdateAppointmentAsync(appointment);
            await  EmailService.SendEmail(appointment.User.EnderecoEmail, "Confirmação de agendamento", GenerateAppointmentEmailBody(appointment));
            return NoContent();
        }

         [HttpPut("confirmarReagendamento/{id:int}")]
        public async Task<IActionResult> ConfirmarReagendamento(int id)
        {
            var  appointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (appointment == null)
            {
                return BadRequest();
            }
            appointment.Reschedule = false;
            await _appointmentService.UpdateAppointmentAsync(appointment);
            return NoContent();
        }


         [HttpPut("reagendarMarcacao/{id:int}")]
        public async Task<IActionResult> reagendarMarcacao(int id, AppointmentReagendamentoDTO reagendamentoDTO)
        {
            var  appointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (appointment == null)
            {
                return BadRequest();
            }
            appointment.AppointmentDate = reagendamentoDTO.AppointmentDate;
            appointment.Reschedule = true;
            await _appointmentService.UpdateAppointmentAsync(appointment);
            await  EmailService.SendEmail(appointment.User.EnderecoEmail, "Reagendamento de Marcação", GenerateAppointmentEmailBodyReagendamento(appointment));
            return NoContent();
        }
         private string GenerateAppointmentEmailBody(AppointmentDTO appointment)
        {
            var sb = new StringBuilder();
            sb.Append("<html>");
            sb.Append("<head>");
            sb.Append("<style>");
            sb.Append("table { border-collapse: collapse; width: 100%; }");
            sb.Append("th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }");
            sb.Append("th { background-color: #f2f2f2; }");
            sb.Append("</style>");
            sb.Append("</head>");
            sb.Append("<body>");
            sb.Append("<h2>Confirmação de Agendamento</h2>");
            sb.Append("<p>Prezado(a) ").Append(appointment.User.NomeCompleto).Append(",</p>");
            sb.Append("<p>Seu agendamento foi realizado com sucesso. Abaixo estão os detalhes:</p>");
            sb.Append("<table>");
            sb.Append("<tr><th>Detalhes do Agendamento</th><th>Informações</th></tr>");
            sb.Append($"<tr><td>Nome do Usuário</td><td>{appointment.User.Username}</td></tr>");
            sb.Append($"<tr><td>Email do Usuário</td><td>{appointment.User.EnderecoEmail}</td></tr>");
            sb.Append($"<tr><td>Serviço</td><td>{appointment.Servico.ServiceName}</td></tr>");
            sb.Append($"<tr><td>Profissional</td><td>{appointment.Profissional.Nome}</td></tr>");
            sb.Append($"<tr><td>Data</td><td>{appointment.AppointmentDate}</td></tr>");
            sb.Append($"<tr><td>Hora</td><td>{appointment.Time}</td></tr>");
            sb.Append($"<tr><td>Preço</td><td>{appointment.Servico.Price}</td></tr>");
            sb.Append("</table>");
            sb.Append("<p>Atenciosamente,</p>");
            sb.Append("<p>Krapinha XPTO</p>");
            sb.Append("</body>");
            sb.Append("</html>");
            return sb.ToString();
        }

        private string GenerateAppointmentEmailBodyReagendamento(AppointmentDTO appointment)
        {
            var sb = new StringBuilder();
            sb.Append("<html>");
            sb.Append("<head>");
            sb.Append("<style>");
            sb.Append("table { border-collapse: collapse; width: 100%; }");
            sb.Append("th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }");
            sb.Append("th { background-color: #f2f2f2; }");
            sb.Append("</style>");
            sb.Append("</head>");
            sb.Append("<body>");
            sb.Append("<h2>Reagendamento de Marcação</h2>");
            sb.Append("<p>Prezado(a) ").Append(appointment.User.NomeCompleto).Append(",</p>");
            sb.Append("<p>Tivemos que reagendar sua marcação, entre no sistema para poder confirmar. Abaixo estão os detalhes:</p>");
            sb.Append("<table>");
            sb.Append("<tr><th>Detalhes do reagendamento</th><th>Informações</th></tr>");
            sb.Append($"<tr><td>Nome do Usuário</td><td>{appointment.User.Username}</td></tr>");
            sb.Append($"<tr><td>Email do Usuário</td><td>{appointment.User.EnderecoEmail}</td></tr>");
            sb.Append($"<tr><td>Serviço</td><td>{appointment.Servico.ServiceName}</td></tr>");
            sb.Append($"<tr><td>Profissional</td><td>{appointment.Profissional.Nome}</td></tr>");
            sb.Append($"<tr><td>Data</td><td>{appointment.AppointmentDate}</td></tr>");
            sb.Append($"<tr><td>Hora</td><td>{appointment.Time}</td></tr>");
            sb.Append($"<tr><td>Preço</td><td>{appointment.Servico.Price}</td></tr>");
            sb.Append("</table>");
            sb.Append("<p>Atenciosamente,</p>");
            sb.Append("<p>Karapinha XPTO</p>");
            sb.Append("</body>");
            sb.Append("</html>");
            return sb.ToString();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            await _appointmentService.DeleteAppointmentAsync(id);
            return NoContent();
        }

        [HttpGet("servico-solicitado")]
        public async Task<ActionResult<IEnumerable<ServicosSolicatacoesDTO>>> GetServicoMaisMenosSolicitado()
        {
            var servicos = await _appointmentService.GetServicoMaisMenosSolicitadoAsync();
            
            return Ok(servicos);
        }

        // Endpoint para os top 5 profissionais com mais solicitações
        [HttpGet("top-profissionais")]
        public async Task<ActionResult<IEnumerable<ProfissionalSolicitacoesDTO>>> GetTop5Profissionais()
        {
            var topProfissionais = await _appointmentService.GetTop5ProfissionaisAsync();
            return Ok(topProfissionais);
        }

        [HttpGet("faturamento")]
        public async Task<ActionResult<IEnumerable<FaturamentoDTO>>> GetFaturamento()
        {
            var faturamento = await _appointmentService.GetFaturamentoAsync();
            return Ok(faturamento);
        }
    }
}