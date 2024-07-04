using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using backend.Enum;

namespace backend.DTO
{
    public class UserDTO
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "O nome completo é obrigatório.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome completo deve ter entre 3 e 100 caracteres.")]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "O nome completo deve conter apenas letras e espaços.")]
        public string? NomeCompleto { get; set; }

        [StringLength(13, ErrorMessage = "O BI deve ter 13 caracteres.")]
        [RegularExpression(@"^\d{8}[A-Z]{2}\d{3}$", ErrorMessage = "O BI deve seguir o formato: 8 dígitos, 2 letras maiúsculas, 3 dígitos.")]
        public string? BI { get; set; }

        [Required(ErrorMessage = "Nome de usuário é obrigatório.")]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "O nome de usuário precisa ter 3 à 20 caracteres.")]
        [RegularExpression("^[a-zA-Z0-9]*$", ErrorMessage = "Nome de usuário é composto apenas por caracteres alfanúmericos.")]
        public string? Username { get; set; }

        // [Required(ErrorMessage = "A senha é obrigatória.")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "A senha deve ter entre 8 e 100 caracteres.")]
        [PasswordComplexity]
        public string? Password { get; set; }
        // public string Foto { get; set; }

        [StringLength(15, ErrorMessage = "O telemóvel deve ter no máximo 15 caracteres.")]
        [RegularExpression(@"^(9(1|2|4|5|3|9))\d{7}$", ErrorMessage = "O telemóvel deve começar com '91', '92', '93','94','95' ou '99' seguido de mais 7 dígitos.")]
        public string? Telemovel { get; set; }

        [Required(ErrorMessage = "O email é obrigatório.")]
        [StringLength(100, ErrorMessage = "O email deve ter no máximo 100 caracteres.")]
        [EmailAddress(ErrorMessage = "O email deve ser um endereço de email válido.")]
        public string? EnderecoEmail { get; set; }
        public bool? Status { get; set; }
        public UserType TipoUsuario { get; set; }
    }
    public class PasswordComplexityAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is string password)
            {
                if (!Regex.IsMatch(password, @"[A-Z]"))
                {
                    return new ValidationResult("A senha deve conter pelo menos uma letra maiúscula.");
                }
                if (!Regex.IsMatch(password, @"[a-z]"))
                {
                    return new ValidationResult("A senha deve conter pelo menos uma letra minúscula.");
                }
                if (!Regex.IsMatch(password, @"[0-9]"))
                {
                    return new ValidationResult("A senha deve conter pelo menos um número.");
                }
                if (!Regex.IsMatch(password, @"[\W_]"))
                {
                    return new ValidationResult("A senha deve conter pelo menos um caractere especial.");
                }
            }

            return ValidationResult.Success;
        }
    }
}
