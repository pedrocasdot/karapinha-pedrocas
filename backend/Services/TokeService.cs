using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using backend.DTO;
using backend.Model;
using backend.Shared.Services;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class TokenService : ITokenService
    {

        public TokenService(IConfiguration config)
        {
        }
        public string CreateToken(UserDTO user)
        {
            var claims = new List<Claim>
            {
                new Claim("Id", user.Id.ToString()),
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("sdgfijjh3466iu345g87g08c24g7204gr803g30587ghh35807fg39074fvg80493745gf082b507807g807fgf"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }   
}