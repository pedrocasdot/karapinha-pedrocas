using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class ProfissionalHorarioDTO
    {
        
        public int Id { get; set;}
        public int? ProfissionalId { get; set;}

        public ProfissionalDTO? profissional{ get; set;}

        public string horario {get; set;}

    }
}