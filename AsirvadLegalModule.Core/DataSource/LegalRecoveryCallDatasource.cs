using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.DTO.LegalRecoveryCall.Response;
using AsirvadLegalModule.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static AsirvadLegalModule.DTO.LegalRecoveryCall.Request.LegalRecoveryCallRequest;

namespace AsirvadLegalModule.Core.DataSource
{
    public class LegalRecoveryCallDatasource
    {
        public string proc_recoverycall_select(LegalRecoveryDeatailsRequest request)
        {
            string[] parts = request.p_indata.Split('~');
            string as_optflag = request.as_optflag ?? ""; // Example: replace with actual property
            string p_indata = request.p_indata ?? "0";
            LegalRecoveryDeatailsResponse response = new LegalRecoveryDeatailsResponse();
            response = Procedures.proc_recoverycall_select(as_optflag, p_indata);
            return JsonConvert.SerializeObject(response, Formatting.None);
        }
        public string PROC_RECOVERY_EMPLOYEE_CONFIRM_NEW(LegalRecoveryDeatailsRequest request)
        {
            string as_optflag = request.as_optflag ?? ""; // Example: replace with actual property
            string p_indata = request.p_indata ?? "0";
            LegalRecoveryDeatailsResponse response = new LegalRecoveryDeatailsResponse();
            response = Procedures.PROC_RECOVERY_EMPLOYEE_CONFIRM_NEW(as_optflag, p_indata);
            return JsonConvert.SerializeObject(response, Formatting.None);
        }
    }
}
