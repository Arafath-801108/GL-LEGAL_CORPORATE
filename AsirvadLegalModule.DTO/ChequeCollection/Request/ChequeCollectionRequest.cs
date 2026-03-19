using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.ChequeCollection.Request
{
    public class ChequeCollectionRequest
    {
        public string Flag { get; set; }

        public string Indata { get; set; }

        public string Emp_id { get; set; }

        public string Token { get; set; }

        public string Encrypted_data { get; set; }

    }

    public class ChequeUpdationRequest
    {
        public int Flag { get; set; }

        public string Indata { get; set; }


        public string Br_id { get; set; }

        public string Emp_id { get; set; }

        public string Token { get; set; }
    }
    public class ChequeDocumentRequest
    {
        public string Indata { get; set; }
        public int Flag { get; set; }

        public string Img { get; set; }
        public string EmpId { get; set; }
        public string Token { get; set; }
    }
}
