using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;

namespace backend.DTO
{
    public class ProfissionalDTO
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        
        public int? CategoryId { get; set; }
        public string? Telemovel {get; set;}
        public string? BI {get; set;}
        public string? Email { get; set; }
    }
}