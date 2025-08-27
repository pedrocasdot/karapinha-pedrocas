using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Model
{
    public class AppointmentItem
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O horário é obrigatório.")]
        [RegularExpression(@"^(0[9]|1[0-9]):([0-5][0-9])$", ErrorMessage = "O horário deve estar no formato HH:mm e ser entre 09:00 e 19:59.")]
        public string? Time { get; set; }

        [Required(ErrorMessage = "A data do agendamento é obrigatória.")]
        [DataType(DataType.Date, ErrorMessage = "A data do agendamento deve estar no formato válido de data.")]
        public string? AppointmentDate { get; set; }
        
        // [Required(ErrorMessage = "O ID do serviço é obrigatório.")]
        public int? ServiceId { get; set; }

        [ForeignKey("ServiceId")]
        public Service Service { get; set; }

        // [Required(ErrorMessage = "O ID do profissional é obrigatório.")]
        public int? ProfissionalId { get; set; }

        [ForeignKey("ProfissionalId")]
        public Profissional Profissional { get; set; }
        

        
        public int? AppointmentId { get; set; }

        [ForeignKey("AppointmentId")]
        public Appointment Appointment { get; set; }

    }
}