using AsirvadLegalModule.DTO.IrregularityRecCall.Request;
using AsirvadLegalModule.DTO.IrregularityRecCall.Response;
using AsirvadLegalModule.DTO.LegalRecoveryCall.Response;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static AsirvadLegalModule.DTO.LegalRecoveryCall.Request.LegalRecoveryCallRequest;

namespace AsirvadLegalModule.Core.DataSource
{
    public class IrregularitycallDatasource
    {
        public string PROC_IRREGULARITYCALL_SELECT(irregularitycallRequest request)
        {
            string[] parts = request.p_indata.Split('~');
            string as_optflag = request.as_optflag ?? ""; // Example: replace with actual property
            string p_indata = request.p_indata ?? "0";
            irregularitycallResponse response = new irregularitycallResponse();
            response = Procedures.PROC_IRREGULARITYCALL_SELECT(as_optflag, p_indata);
            return JsonConvert.SerializeObject(response, Formatting.None);
        }
        public string PROC_IRR_RECOVERY_CONFIRM(irregularitycallRequest request)
        {
            string as_optflag = request.as_optflag ?? ""; // Example: replace with actual property
            string p_indata = request.p_indata ?? "0";
            irregularitycallResponse response = new irregularitycallResponse();
            response = Procedures.PROC_IRR_RECOVERY_CONFIRM(as_optflag, p_indata);
            return JsonConvert.SerializeObject(response, Formatting.None);
        }

    }
}
