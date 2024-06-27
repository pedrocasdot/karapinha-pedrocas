using backend.DTO;

namespace backend.Shared.Services;

public interface IUserService
{
    Task<IEnumerable<UserDTO>> GetAllUsersAsync();
    Task<UserDTO> GetUserByIdAsync(int id);
    Task<UserDTO> GetUserByEmailAsync(string email);

    Task<UserDTO> AuthenticateAsync(string username, string password);
    Task<UserDTO> GetUserByUsernameAsync(string username);

    Task CreateUserAsync(UserDTO user);
    Task UpdateUserAsync(UserDTO user);
    Task DeleteUserAsync(int id);
}