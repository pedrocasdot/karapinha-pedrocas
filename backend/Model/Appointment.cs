using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model
{
    [Table("Marcacoes")]
    public class Appointment
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

        [Required(ErrorMessage = "O status é obrigatório.")]
        public bool? Status { get; set; } = false;

        // [Required(ErrorMessage = "O ID do usuário é obrigatório.")]
        public int? UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
