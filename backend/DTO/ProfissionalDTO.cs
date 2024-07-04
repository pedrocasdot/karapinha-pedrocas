using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;

namespace backend.DTO
{
    public class ProfissionalDTO
    {
        public int Id { get; set; }
        public int? CategoryId { get; set; }
        public CategoryDTO? Category { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres.")]
        public string? Nome { get; set; }

        [Required(ErrorMessage = "O telemóvel é obrigatório.")]
        [StringLength(15, ErrorMessage = "O telemóvel deve ter no máximo 15 caracteres.")]
        [RegularExpression(@"^(9(1|2|4|5|3|9))\d{7}$", ErrorMessage = "O telemóvel deve começar com '91', '92', '93','94','95' ou '99' seguido de mais 7 dígitos.")]
        public string? Telemovel { get; set; }

        [Required(ErrorMessage = "O BI é obrigatório.")]
        [StringLength(13, ErrorMessage = "O BI deve ter 13 caracteres.")]
        [RegularExpression(@"^\d{8}[A-Z]{2}\d{3}$", ErrorMessage = "O BI deve seguir o formato: 8 dígitos, 2 letras maiúsculas, 3 dígitos.")]
        public string? BI { get; set; }

        [Required(ErrorMessage = "O email é obrigatório.")]
        [StringLength(100, ErrorMessage = "O email deve ter no máximo 100 caracteres.")]
        [EmailAddress(ErrorMessage = "O email deve ser um endereço de email válido.")]
        public string? Email { get; set; }
    }
}