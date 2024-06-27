using backend.Model;

namespace backend.DTO
{

    public class AppointmentDTO
    {
        public int Id { get; set; }

        public int? ServiceId { get; set; }

        public ServiceDTO? Servico { get; set; }

        public int? UserId { get; set; }

        public UserDTO? User { get; set; }

        public int? ProfissionalId { get; set; }

        public ProfissionalDTO? Profissional{ get; set; }

        public bool? Status {get; set;}

        public String? Time { get; set; }
        public String? AppointmentDate { get; set; }
    }

}