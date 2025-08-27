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

        [Required(ErrorMessage = "O status é obrigatório.")]
        public bool? Status { get; set; } = false;


        public bool? Reschedule {get; set; } = false;

        public int? UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }   

        public decimal ValorTotal { get; set; }

        
        public ICollection<AppointmentItem> appointmentItems{ get; set; }
    }

}
