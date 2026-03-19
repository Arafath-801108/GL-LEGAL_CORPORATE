using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.Response
{
    public class ApiStatusConstants
    {
        public static string COMPLETED;

        public static string NOT_COMPLETED;

        static ApiStatusConstants()
        {
            ApiStatusConstants.COMPLETED = "COMPLETED";
            ApiStatusConstants.NOT_COMPLETED = "NOT_COMPLETED";
        }

        public ApiStatusConstants()
        {
        }
    }
}
