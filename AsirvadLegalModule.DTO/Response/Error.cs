using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.Response
{
    public class Error
    {
        public string ErrorCode
        {
            get;
            set;
        }

        public string ErrorMessage
        {
            get;
            set;
        }

        public string ErrorType
        {
            get;
            set;
        }

        public Error()
        {
        }
    }
}
