using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;
using backend.Model;
using backend.Shared.Repositories;
using backend.Shared.Services;

namespace backend.Services
{
    public class CategoryService : ICategoryService
    {
         private readonly ICategoriesRepository _categoryRepository;
         

        public CategoryService(ICategoriesRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllCategoriesAsync();
            return categories.Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name
            });
        }

        public async Task<CategoryDTO?> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(id);
            if (category == null)
                return null;

            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        public async Task CreateCategoryAsync(CategoryDTO category)
        {
            var entity = new Category
            {
                Name = category.Name
            };

            await _categoryRepository.CreateCategoryAsync(entity);
        }

        public async Task UpdateCategoryAsync(CategoryDTO category)
        {
            var entity = await _categoryRepository.GetCategoryByIdAsync(category.Id);
            if (entity == null)
                return;

            entity.Name = category.Name;

            await _categoryRepository.UpdateCategoryAsync(entity);
        }

        public async Task DeleteCategoryAsync(int id)
        {
            await _categoryRepository.DeleteCategoryAsync(id);
        }
    }
}