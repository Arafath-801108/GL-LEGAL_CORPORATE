using AsirvadLegalModule.DTO.AdvocateEmpanelment.Request;
using AsirvadLegalModule.DTO.AdvocateEmpanelment.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.Core.DataSource
{
    public class AdvocateEmpanelmentDataSource
    {
        public EmpanelmentResponse EmpanelmentRequest(EmpanelmentRequest request)
        {
            int flagValue = int.Parse(request.Flag);
            // Call the procedure with all required parameters
            EmpanelmentResponse response = Procedures.Proc_Advocate_Empanelment(flagValue, request.indata,request.indata1,request.img);

            return response;
        }
    }

}
