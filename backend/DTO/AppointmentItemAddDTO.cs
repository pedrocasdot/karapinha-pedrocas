using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class AppointmentItemAddDTO
    {
        public int? ServiceId { get; set; }

        public int? ProfissionalId { get; set; }
       
        public int? AppointmentId { get; set; }

        public String? Time { get; set; }
        public String? AppointmentDate { get; set; }

    }
}