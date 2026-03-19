using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.DTO.ChequeCollection.Response;
using AsirvadLegalModule.DTO.LegalFIR.Response;
using AsirvadLegalModule.DTO.LegalFIR.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.Core.DataSource
{
    public class LegalPoliceFirDatasource
    {


        public LegalFIRResponse viewbranchdata(PoliceFirEntryRequest request)
        {

            string indata = "";
            string flag = "";
            LegalFIRResponse response = new LegalFIRResponse();
            if (request.Flag == "BRANCH" || request.Flag == "SELECTSTATE"|| request.Flag == "SELECTFIRBRANCHFIR"|| request.Flag == "policeComplaintbranch" ||request.Flag == "spComplaintdataStatus")
            {
              indata = request.employeeId;
            flag = request.Flag;
            }
            if (request.Flag=="1" || request.Flag == "spComplaintrequest" || request.Flag == "SELECTCUSTOMERFIR" ||request.Flag == "policeComplaintRequestid")
            {
                indata = request.branch;
                flag = request.Flag;

            }

            if (request.Flag == "2")
            {
                indata = request.cust_id + "~" + request.branch;
                flag = request.Flag;

            }
            if (request.Flag == "SELECTDIST")
            {
                indata = request.state;
                flag = request.Flag;

            }
            if (request.Flag== "selectreqid"|| request.Flag == "selectreqidcharge")
            {
                indata = request.ReqId + "~" + request.employeeId;
                flag = request.Flag;
            }

            if(request.Flag== "INSERT"||request.Flag== "INSERTFOLLOWUP"|| request.Flag == "UPDATECHARGESHEET")
            {
                indata = request.indata;

                flag = request.Flag;
            }
            if (request.Flag == "UPDATEFIR"|| request.Flag == "UPDATESpRegister" || request.Flag== "UPDATESpStatusRegister")
            {
                indata = request.indata;
                request.img = request.img == null ? "" : request.img;
                flag = request.Flag;
            }

            if (request.Flag == "SELECTPLEDGE" || request.Flag == "GETDETAILS" || request.Flag == "DocView"||request.Flag== "Report_DocView")
            {
                indata = request.branch + "~" + request.ReqId;
                flag = request.Flag;
            }
            if (request.Flag == "Update_SpComplaint" || request.Flag == "spComplaintdataupdate" || request.Flag == "spstatusupdate")
            {
                indata = request.employeeId+"~"+request.ReqId;
                flag = request.Flag;
            }
            if (request.Flag == "UpdateDoc")
            {
                request.img = request.img == null ? "" : request.img;
                flag = request.Flag;
                indata = request.ReqId;
            }
            if (request.Flag == "UpdateDoc" || request.Flag== "UPDATEFIR" || request.Flag== "UPDATESpRegister" || request.Flag == "UPDATEFIR" ||request.Flag == "UPDATESpStatusRegister")
            {
                response = Procedures.LegalFIRDOC(request.Flag, request.img,indata);
            }
            else
            {
                response = Procedures.LegalFIRPolice(flag, indata);
            }

            return response;

        }
    }
}
