using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;
using backend.Shared.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/appointments")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            await _appointmentService.DeleteAppointmentAsync(id);
            return NoContent();
        }
    }
}