using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class AppointmentUpdateDTO
    {
         public int Id { get; set; }

        public int? UserId { get; set; }
        
        public decimal? ValorTotal { get; set; }
        public bool? Status {get; set;}

        public bool? Reschedule {get; set;}

    }
}