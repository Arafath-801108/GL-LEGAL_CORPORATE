//using AsirvadLegalModule.DTO.LegalAudit;

//using Newtonsoft.Json;
//using System;

//namespace AsirvadLegalModule.Core.DataSource
//{
//    public class LegalAuditDatasource
//    {
//        public string Proc_new_RIIM_Legal_Details(LegalAuditRequest request)
//        {
//            int flag = request.flag;
//            string indata = request.indata ?? "";

//            // This now converts perfectly!
//            LegalAuditResponse response = Procedures.Proc_new_RIIM_Legal_Details(flag, indata);

//            return JsonConvert.SerializeObject(response, Formatting.None);
//        }
//    }
//}
using AsirvadLegalModule.DTO.LegalAudit;
using Newtonsoft.Json;
using System;
using AsirvadLegalModule.Core; // Ensure this points to where Procedures lives

namespace AsirvadLegalModule.Core.DataSource
{
    public class LegalAuditDatasource
    {
        public string Proc_new_RIIM_Legal_Details(LegalAuditRequest request)
        {
            // FIX: Pass the 'request' object, not just two variables
            LegalAuditResponse response = Procedures.Proc_new_RIIM_Legal_Details(request);

            return JsonConvert.SerializeObject(response, Formatting.None);
        }
    }
}