
using AsirvadLegalModule.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace AsirvadLegalModule.DTO.GoldSuitFIle.Response
{
    public class GoldSuitFIleResponse
    {
        public string? status {  get; set; }
        public List<ComplaintDeatils> ComplaintData { get; set; }
        public List<GetBranchDeatils> BranchDatas { get; set; }
    }
    public class ComplaintDeatils
    {
        public string timeline { get; set; }
        public string? type  { get; set; }

    }
    public class GetBranchDeatils
    {
        public string branchid { get; set; }
        public string? branchname { get; set; }

    }
    public class GetcurrentbranchResponse
    {
        public string? status { get; set; }
        public string? branch { get; set; }
       
    }
    public class TImeLineResponse
    {
        public string cmpTime { get; set; }
    }
    public class GetPledgeResponse
    {
        public string? status { get; set; }
        public string? plno { get; set; }
        public string? message { get; set; }
    }
    public class GetSuitfileResponse
    {
        public string? status { get; set; }
        public string? message { get; set; }
    }
    public class GetPostReponse
    {
        public string? status { get; set; }
        public string? post { get; set; }
        public string? message { get; set; }
    }
    public class GetBranchResponse
    {
        public string? status { get; set; }
        public List<BranchtDeatils> BranchData { get; set; }
    }
    public class BranchtDeatils
    {
        public string branchId{ get; set; }
        public string? branchName { get; set; }

    }
    public class GetComplaintResponse
    {
        public string? status { get; set; }
        public List<ComplaintDataDetails> ComplaintData { get; set; }
    }
    public class ComplaintDataDetails
    {
        public string legalId { get; set; }
        public string? complaint { get; set; }

    }
    public class getLegalDetailsResponse
    {
        public string status { get; set; }
        public string? legaldata { get; set; }
        public string? branchName { get; set; }

    }
    public class getPledgeListResponse
    {
        public string status { get; set; }
        public string[] pledges { get; set; }

    }
    public class GetSuitFileDeatailsResponse
    {
        public string? outdata { get; set; }
        public string? err_sts { get; set; }
        public string? err_code { get; set; }

    }

    public class CommonResponse
    {
        public string? result { get; set; }
    }
    public class GetSuitFilepdfResponse
    {
        public string? status { get; set; }
    }
    public class Suitfile_docResponse
    {
        public string? status { get; set; }
        public string? outdata { get; set; }
    }
}
