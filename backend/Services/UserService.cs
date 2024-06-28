using backend.DTO;
using backend.Model;
using backend.Shared.Repositories;
using backend.Shared.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using BCrypt.Net;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUsersRepository _userRepository;

        public UserService(IUsersRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task DeleteUserAsync(int id)
        {
            await _userRepository.DeleteUserAsync(id);
        }

        public async Task<IEnumerable<UserDTO>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return users.Select(u => new UserDTO
            {
                Id = u.Id,
                NomeCompleto = u.NomeCompleto,
                Username = u.Username,
                EnderecoEmail = u.EnderecoEmail,
                Telemovel = u.Telemovel,
                Status = u.Status,
                //,
                // Foto = u.Foto,
                BI = u.BI,
                TipoUsuario = u.TipoUsuario
            });
        }

        public async Task<UserDTO> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
                return null;

            return new UserDTO
            {
                Id = user.Id,
                NomeCompleto = user.NomeCompleto,
                Username = user.Username,
                EnderecoEmail = user.EnderecoEmail,
                Telemovel = user.Telemovel,
                // Password = user.Password,
                BI = user.BI,
                TipoUsuario = user.TipoUsuario,
                Status = user.Status
            };
        }

        public async Task<UserDTO> GetUserByUsernameAsync(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null)
                return null;

            return new UserDTO
            {
                Id = user.Id,
                NomeCompleto = user.NomeCompleto,
                Username = user.Username,
                EnderecoEmail = user.EnderecoEmail,
                Telemovel = user.Telemovel,
                BI = user.BI,
                TipoUsuario = user.TipoUsuario,
                Status = user.Status
            };
        }

        public async Task<UserDTO> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
                return null;

            return new UserDTO
            {
                Id = user.Id,
                NomeCompleto = user.NomeCompleto,
                Username = user.Username,
                EnderecoEmail = user.EnderecoEmail,
                Telemovel = user.Telemovel,
                // Password = user.Password,
                BI = user.BI,
                TipoUsuario = user.TipoUsuario,
                Status = user.Status
            };
        }

        public async Task CreateUserAsync(UserDTO user)
        {
            var entity = new User
            {
                NomeCompleto = user.NomeCompleto,
                Username = user.Username,
                EnderecoEmail = user.EnderecoEmail,
                Telemovel = user.Telemovel,
                BI = user.BI,
                TipoUsuario = user.TipoUsuario,
                Password = BCrypt.Net.BCrypt.HashPassword(user.Password),
                Status = false,
            };

            await _userRepository.CreateUserAsync(entity);
        }

        public async Task UpdateUserAsync(UserDTO user)
        {
            var entity = await _userRepository.GetUserByIdAsync(user.Id);
            if (entity == null)
                return;

            entity.NomeCompleto = user.NomeCompleto ?? entity.NomeCompleto;
            entity.EnderecoEmail = user.EnderecoEmail ?? entity.NomeCompleto;
            if (!string.IsNullOrEmpty(user.Password))
			{
 	   			entity.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
			}
            entity.Telemovel = user.Telemovel ?? entity.Telemovel;
            entity.Username = user.Username ?? entity.Username;
            entity.BI = user.BI ?? entity.BI;
            entity.Status = user.Status ?? entity.Status;
            await _userRepository.UpdateUserAsync(entity);
        }

        public async Task<UserDTO> AuthenticateAsync(string username, string password)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);            

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
                return null;

            return new UserDTO
            {
            	Id = user.Id,
                NomeCompleto = user.NomeCompleto,
                Username = user.Username,
                EnderecoEmail = user.EnderecoEmail,
                Telemovel = user.Telemovel,
                BI = user.BI,
                TipoUsuario = user.TipoUsuario,
                Status = user.Status,
            };
        }
    }
}
