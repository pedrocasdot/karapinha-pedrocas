using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;

namespace backend.Shared.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync();
        Task<CategoryDTO> GetCategoryByIdAsync(int id);
        Task CreateCategoryAsync(CategoryDTO category);
        Task UpdateCategoryAsync(CategoryDTO category);
        Task DeleteCategoryAsync(int id);
    }
}