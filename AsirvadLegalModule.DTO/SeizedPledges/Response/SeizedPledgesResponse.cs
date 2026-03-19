using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.SeizedPledges.Response
{
    public class SeizedPledgesResponse
    {
       public string? outdata { get; set; }
        public string? err_code { get; set; }
        public string? err_sts { get; set; }


    }

    public class SeizedClassResponse
    {
        public string? status { get; set; }
        public string? message { get; set; }
    }

    public class SettleAmountResponse
    {
        public string? status { get; set; }
        public string? amount { get; set; }
    }

    public class SettleSubmitResponse
    {
        public string? status { get; set; }
        public string? err_sts { get; set; }
    }
}
