using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model
{
    [Table("Categorias")]
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres.")]
        public string? Name { get; set; }

        public ICollection<Service> Services { get; set; } = new List<Service>();
        public ICollection<Profissional> Profissionals { get; set; } = new List<Profissional>();
    }
}
