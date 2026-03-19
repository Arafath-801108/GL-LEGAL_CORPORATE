using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.GoldSuitFIle.Request
{
    public class GetTokenRequest
    {

        public string employeeId { get; set; }//session
        public string token { get; set; }//session
    }
    public class GetcurrentbranchRequest
    {
        public string branch { get; set; }
        public string employeeId { get; set; }//session
        public string token { get; set; }//session
    }
    public class GoldSuitFIleRequest
    {
        public string cmpType { get; set; }
        public string employeeId { get; set; }//session
        public string token { get; set; }//session
    }
    public class GetPledgeRequset
    {
        public string plno { get; set; }
        public string employeeId { get; set; }//session
        public string token { get; set; }//session
        public string branchId { get; set; }//session
    }
    public class GetSubmitRequset
    {
        public string employeeId { get; set; }//session
        public string token { get; set; }//session
        public string branchId { get; set; }//session
        public string complaint { get; set; }
        public string caseType { get; set; }
        public string Complaintval { get; set; }
        public string police { get; set; }
        public string anoBranch { get; set; }
        public string curBranch { get; set; }
        public string goldInPlace { get; set; }
        public string reason { get; set; }
        public string prevPledge { get; set; }
        public string goldInBranch { get; set; }
        public string pledgeList { get; set; }
        public string flag1 {  get; set; }
        public string rm_cmt { get; set; }
        public string doc { get; set; }
        public string docname { get; set; }
        public string flag2 { get; set; }
    }
    public class GetPostRequest
    {
        public string employeeId { get; set; }//session
        public string token { get; set; }//session
       

    }
    public class GetBranchCheckRequest
    {
        public string employeeId { get; set; }//session
        public string token { get; set; }//session
        public string post { get; set; }//session
        public string branch { get; set; }//session

    }
    public class GetComplaintCheckReq
    {
        public string branch { get; set; }
        public string post { get; set; }//session
        public string employeeId { get; set; }//session
        public string token { get; set; }//session

    }
    public class getLegalDetailsRequest
    {
        public string legal { get; set; }
        public string employeeId { get; set; }//session
        public string token { get; set; }//session
    }
    public class GetSuitFileDeatailsRequset
    {

        public string? employeeId { get; set; }//session
        public string? token { get; set; }//session
        public string? branch { get; set; }//session
        public string? p_indata {  get; set; }
        public string? as_optflag { get; set; }   

    }
    public class GetSuitFileDocumentRequest
    {
        public string indata { get; set; }
        public string flag { get; set; }

        public string img2 { get; set; }
        public string empId { get; set; }
        public string token { get; set; }
    }
    public class Suitfile_docRequest
    {
        public string indata { get; set; }
        public string flag { get; set; }
        public string encrypt_data { get; set; }
        public string img1 { get; set; }
        public string img2 { get; set; }
        public string empId { get; set; }
        public string token { get; set; }
    }
}
