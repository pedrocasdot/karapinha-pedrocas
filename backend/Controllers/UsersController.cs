using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using backend.DTO;
using backend.Services;
using backend.Shared.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        private readonly IConfiguration _configuration;

        public EmailService EmailService { get; }



        public UsersController(IUserService userService, ITokenService tokenService, EmailService emailService, IConfiguration configuration)
        {
            _userService = userService;
            _tokenService = tokenService;
            EmailService = emailService;
            _configuration = configuration;
        }


        [HttpPost("login")]

        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            var user = await _userService.AuthenticateAsync(loginDTO.Username, loginDTO.Password);
            if (user == null)
            {
                return NotFound(new { message = "username ou password incorreto" });
            }
            if (user != null && user.TipoUsuario == 0 && user.Status == false)
            {
                return NotFound(new { message = "Conta pendente" });
            }
            return Ok(user);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPut("activate/{id}")]
        public async Task<IActionResult> ActivateUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Status = true;
            await _userService.UpdateUserAsync(user);

            var body = $"""
    <html>
        <body>
            <h2>Sua conta foi ativada</h2>
            <p>Sua conta agora está ativa. Você pode fazer login e usar os serviços.</p>
            <p>Informações da conta:</p>
            <table>
                <tr>
                    <th style="border: 1px solid #dddddd; padding: 8px;">Nome</th>
                    <td style="border: 1px solid #dddddd; padding: 8px;">{user.NomeCompleto}</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #dddddd; padding: 8px;">Email</th>
                    <td style="border: 1px solid #dddddd; padding: 8px;">{user.EnderecoEmail}</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #dddddd; padding: 8px;">Username</th>
                    <td style="border: 1px solid #dddddd; padding: 8px;">{user.Username}</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #dddddd; padding: 8px;">Telemovel</th>
                    <td style="border: 1px solid #dddddd; padding: 8px;">{user.Telemovel}</td>
                </tr>
            </table>
        </body>
    </html>
    """;

            await EmailService.SendEmail(user.EnderecoEmail, "Conta Ativada - KARAPINHA XPTO", body);

            return NoContent();
        }

        [HttpPut("deactivate/{id}")]
        public async Task<IActionResult> DeactivateUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Status = false;
            await _userService.UpdateUserAsync(user);

            var body = $"""
    <html>
        <body>
            <h2>Sua conta foi desativada</h2>
            <p>Sua conta foi desativada e você não poderá fazer login até que seja reativada.</p>
            <p>Informações da conta:</p>
            <table>
                <tr>
                    <th style="border: 1px solid #dddddd; padding: 8px;">Nome</th>
                    <td style="border: 1px solid #dddddd; padding: 8px;">{user.NomeCompleto}</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #dddddd; padding: 8px;">Email</th>
                    <td style="border: 1px solid #dddddd; padding: 8px;">{user.EnderecoEmail}</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #dddddd; padding: 8px;">Username</th>
                    <td style="border: 1px solid #dddddd; padding: 8px;">{user.Username}</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #dddddd; padding: 8px;">Telemovel</th>
                    <td style="border: 1px solid #dddddd; padding: 8px;">{user.Telemovel}</td>
                </tr>
            </table>
        </body>
    </html>
    """;

            await EmailService.SendEmail(user.EnderecoEmail, "Conta Desativada - KARAPINHA XPTO", body);

            return NoContent();
        }



        [HttpPost]
        public async Task<ActionResult> CreateUser(UserDTO user)
        {
            await _userService.CreateUserAsync(user);
            if (user.TipoUsuario == 0)
            {
                var body = $"""

             <html>
                    <body>
                                 <h2>Nova Conta Criada</h2>
                                 <p>Um novo usuário criou uma conta com as seguintes informações:</p>
                                 <table>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Nome</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.NomeCompleto}</td>
                                 </tr>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Email</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.EnderecoEmail}</td>
                                 </tr>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Username</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.Username}</td>
                                 </tr>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Telemovel</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.Telemovel}</td>
                                 </tr>
                                 </table>

                    </body>
                </html>
            <html>
            """;
                var bodyUser = $"""

             <html>
                    <body>
                                 <h2>Sua conta foi criada com sucesso, Aguarde pela ativação da sua conta</h2>
                                 <p>Informações da conta:</p>
                                 <table>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Nome</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.NomeCompleto}</td>
                                 </tr>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Email</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.EnderecoEmail}</td>
                                 </tr>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Username</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.Username}</td>
                                 </tr>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Telemovel</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.Telemovel}</td>
                                 </tr>
                                 </table>

                    </body>
                </html>
            <html>
            """;

                await EmailService.SendEmail(user.EnderecoEmail, "Bem vindo KARAPINHA XPTO", bodyUser);
                await EmailService.SendEmail(_configuration.GetSection("Constants:FromEmail").Value, "NOVO USUÁRIO", body);
            }
            else
            {
                var bodyUser = $"""

             <html>
                    <body>
                                 <h2>Olá Administrativo, sua conta foi criada</h2>
                                 <h2>É obrigratório alterar os dados antes do primeiro login</h2>
                                 <p>Informações da conta:</p>
                                 <table>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Nome</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.NomeCompleto}</td>
                                 </tr>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Email</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.EnderecoEmail}</td>
                                 </tr>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Username</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.Username}</td>
                                 </tr>
                                 <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Telemovel</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.Telemovel}</td>
                                 </tr>
                                  <tr>
                                 <th style="border: 1px solid #dddddd; padding: 8px;">Palavra-Passe</th>
                                 <td style="border: 1px solid #dddddd; padding: 8px;">{user.Password}</td>
                                 </tr>
                                 </table>

                    </body>
                </html>
            <html>
            """;
                await EmailService.SendEmail(user.EnderecoEmail, "Conta de Administrativo Criada", bodyUser);
            }
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDTO user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            await _userService.UpdateUserAsync(user);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
    }
}