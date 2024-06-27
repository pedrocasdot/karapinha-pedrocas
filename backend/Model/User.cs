using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Enum;

namespace backend.Model
{
    [Table("Usuarios")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome completo é obrigatório.")]
        public string NomeCompleto { get; set; }

        [Required(ErrorMessage = "O BI é obrigatório.")]
        [RegularExpression(@"^\d{8}[A-Z]{2}\d{3}$", ErrorMessage = "O BI deve estar no formato correto.")]
        public string? BI { get; set; }

        [Required(ErrorMessage = "O nome de usuário é obrigatório.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "A senha é obrigatória.")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "A senha deve ter pelo menos 8 caracteres.")]
        public string Password { get; set; }

        public byte[]? Foto { get; set; }

        [Required(ErrorMessage = "O número de telefone é obrigatório.")]
        [RegularExpression(@"^\d{9}$", ErrorMessage = "O número de telefone deve ter 9 dígitos.")]
        public string Telemovel { get; set; }

        [Required(ErrorMessage = "O endereço de email é obrigatório.")]
        [EmailAddress(ErrorMessage = "O endereço de email não é válido.")]
        public string EnderecoEmail { get; set; }

        public UserType TipoUsuario { get; set; }

        public bool? Status { get; set; } = false;

        public ICollection<Appointment> Appointments { get; set; }
    }
}
