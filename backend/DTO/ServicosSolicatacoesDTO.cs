using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTO
{
    public class ServicosSolicatacoesDTO
    {
        public ServiceDTO Service { get; set; }
        public int Solicitacoes { get; set; }
    }
}