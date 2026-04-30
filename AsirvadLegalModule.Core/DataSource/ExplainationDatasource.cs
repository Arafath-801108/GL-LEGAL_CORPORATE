using AsirvadLegalModule.DTO.ExplainationModule.Request;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static AsirvadLegalModule.DTO.ExplainationModule.Response.ExplainationResponse;

namespace AsirvadLegalModule.Core.DataSource
{
    public class ExplainationDatasource
    {
        public List<BranchLoadRes> BranchIdRetrieval(BranchloadRequest request)
        {
            return Procedures.ExplainationUpdate(request.employeeId, request.as_optflag);
        }

        public List<CustomerRes> IrrCodeRetrieval(BranchloadRequest request)
        {
            return Procedures.GetIrrCodes(request.branch, request.as_optflag);
        }

        public List<IrrCustomerRes> IrrCustomerRetrieval(IrrCodeRequest request)
        {
            return Procedures.GetIrrCustomerDetails(request.irrCode, request.as_optflag);
        }

        public string SaveExplaination(ExplainationUpdateRequest request)
        {
            // Convert Base64 to byte[] and bind as BLOB
            byte[] fileBytes = Convert.FromBase64String(request.DocumentsBase64); 
            string reqParams = $"{request.CustomerId}~{request.IrregularityCode}~{request.PledgeNumber}~{request.IrregularityStatus}~{request.DocType}~{request.Remark}~{request.EmployeeId}~{request.BranchId}";
            return Procedures.InsertExplaination(reqParams, request.as_optflag, fileBytes);
        }

        public List<ReportRes> ExpRptGet(ReportReq request)
        {
            return Procedures.GetExplRpt(request.p_indata, request.as_optflag);
        }




    }


}
