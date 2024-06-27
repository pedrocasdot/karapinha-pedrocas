using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTO;
using backend.Model;

namespace backend.Shared.Services
{
    public interface ITokenService
    {
         string CreateToken(UserDTO user);
    }
}