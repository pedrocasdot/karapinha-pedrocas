using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model
{
    [Table("Profissionais")]
    public class Profissional
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres.")]
        public string? Nome { get; set; }

        [Required(ErrorMessage = "O telemóvel é obrigatório.")]
        [StringLength(15, ErrorMessage = "O telemóvel deve ter no máximo 15 caracteres.")]
        [Phone(ErrorMessage = "O telemóvel deve ser um número de telefone válido.")]
        public string? Telemovel { get; set; }

        [Required(ErrorMessage = "O BI é obrigatório.")]
        [StringLength(13, ErrorMessage = "O BI deve ter 13 caracteres.")]
        [RegularExpression(@"^\d{8}[A-Z]{2}\d{3}$", ErrorMessage = "O BI deve seguir o formato: 8 dígitos, 2 letras maiúsculas, 3 dígitos.")]
        public string? BI { get; set; }

        [Required(ErrorMessage = "O email é obrigatório.")]
        [StringLength(100, ErrorMessage = "O email deve ter no máximo 100 caracteres.")]
        [EmailAddress(ErrorMessage = "O email deve ser um endereço de email válido.")]
        public string? Email { get; set; }

        // [Required(ErrorMessage = "A categoria é obrigatória.")]
        public int? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category Category { get; set; }

        public bool? Status { get; set; } = true;
        public ICollection<AppointmentItem> AppointmentItems { get; set; } = new List<AppointmentItem>();
        public ICollection<ProfissionalHorario> ProfissionalHorarios { get; set; } = new List<ProfissionalHorario>();
    }
}
