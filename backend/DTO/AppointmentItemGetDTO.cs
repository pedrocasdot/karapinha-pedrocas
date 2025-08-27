using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class AppointmentItemGetDTO
    {
        
        public int Id { get; set; }
        public int? ServiceId { get; set; }

        public ServiceDTO? Servico { get; set; }

        public int? ProfissionalId { get; set; }

        public ProfissionalDTO? Profissional{ get; set; }

        public int? AppointmentId { get; set; }

        public String? Time { get; set; }
        public String? AppointmentDate { get; set; }
    }
}