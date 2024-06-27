using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model
{
    public class ProfissionalHorario
    {
        public int Id { get; set; }

        public int? ProfissionalId { get; set; }

        [ForeignKey("ProfissionalId")]
        public Profissional Profissional { get; set; }

        [Required(ErrorMessage = "O horário é obrigatório.")]
        [RegularExpression(@"^(09:00|09:30|10:00|10:30|11:00|11:30|12:00|12:30|13:00|13:30|14:00|14:30|15:00|15:30|16:00|16:30|17:00|17:30|18:00|18:30|19:00|19:30)$", ErrorMessage = "O horário deve estar no formato HH:mm e entre 09:00 e 19:30, com minutos apenas em 00 ou 30.")]
        public string horario { get; set; }
    }
}
