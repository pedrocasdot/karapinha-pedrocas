using backend.Model;

namespace backend.DTO
{
    public class ServiceDTO
    {
        public int Id { get; set; }

        public string? ServiceName { get; set; }

        // public Category Category {get; set;}
        public int? CategoryId { get; set; }  
        public bool? Status { get; set; } = false;


        public decimal? Price { get; set; }
    }
}