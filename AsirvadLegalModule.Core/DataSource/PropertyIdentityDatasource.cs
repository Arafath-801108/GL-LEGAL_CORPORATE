using AsirvadLegalModule.DTO.LegalRecoveryCall.Response;
using AsirvadLegalModule.DTO.PropertyIdentity.Request;
using AsirvadLegalModule.DTO.PropertyIdentity.Response;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static AsirvadLegalModule.DTO.LegalRecoveryCall.Request.LegalRecoveryCallRequest;

namespace AsirvadLegalModule.Core.DataSource
{
    public class PropertyIdentityDatasource
    {
        public string proc_property_identification(PropertyIdentityRequest request)
        {
            string as_optflag = request.as_optflag ?? ""; // Example: replace with actual property
            string p_indata = request.p_indata ?? "0";
            string doc1 = request.doc1 ?? "";
            string doc2 = request.doc2 ?? "";
            PropertyIdentityResponse response = new PropertyIdentityResponse();
            response = Procedures.proc_property_identification(as_optflag, p_indata,doc1,doc2);
            return JsonConvert.SerializeObject(response, Formatting.None);
        }
        

    }
}
