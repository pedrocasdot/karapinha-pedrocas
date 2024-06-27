using System.Text.Json.Serialization;
using backend.Enum;

namespace backend.DTO
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string? NomeCompleto { get; set; }
        public string? BI { get; set; }

        public string? Username { get; set; }
        public string? Password { get; set; }
        // public string Foto { get; set; }
        public string? Telemovel { get; set; }
        public string? EnderecoEmail { get; set; }
        public bool? Status {get; set;} 
        public UserType TipoUsuario { get; set; }
    }
}
