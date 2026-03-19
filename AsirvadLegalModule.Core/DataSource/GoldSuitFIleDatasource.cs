
using DBAccessLibrary;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using System.Xml.Linq;
using AsirvadLegalModule.DTO.Response;
using static AsirvadLegalModule.DTO.GoldSuitFIle.Response.getPledgeListResponse;
using Newtonsoft.Json;
//using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;
using AsirvadLegalModule.DTO.LegalNotice.Request;
using AsirvadLegalModule.DTO.LegalNotice.Response;

namespace AsirvadLegalModule.Core.DataSource
{
    public class GoldSuitFIleDatasource
    {
        public GoldSuitFIleResponse SuitClassify()
        {
            GoldSuitFIleResponse response = new GoldSuitFIleResponse();
            List<ComplaintDeatils> obj = new List<ComplaintDeatils>();
            List<GetBranchDeatils> obj1 = new List<GetBranchDeatils>();
            DataTable dt, dt1 = new DataTable();
            dt = new OracleHelper().ExecuteDataSet("select '-1' , '------------- Select -------------'  from dual union all select to_char(t.type_id) || '~' || to_char(t.timeline) AS timeline , t.type  from TBL_SUITE_FILED t").Tables[0];
            dt1 = new OracleHelper().ExecuteDataSet("select '-1' , '------------- Select -------------'  from dual union all select TO_CHAR(m.branch_id),TO_CHAR(m.branch_name) from goldloan_branch_master m").Tables[0];

            if (dt.Rows.Count > 0 && dt1.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    ComplaintDeatils Complaint = new ComplaintDeatils
                    {
                        timeline = row[0].ToString(),
                        type = row[1].ToString()
                    };
                    obj.Add(Complaint);
                }
                foreach (DataRow row in dt1.Rows)
                {
                    GetBranchDeatils Branchs = new GetBranchDeatils
                    {
                        branchid = row[0].ToString(),
                        branchname = row[1].ToString()
                    };
                    obj1.Add(Branchs);
                }
            }
            if (obj.Count > 0 && obj1.Count>0)
            {
                response.status = "True";
                response.ComplaintData = obj;
                response.BranchDatas = obj1;
            }
            else
            {
                response.status = "False";
                response.ComplaintData = null;
                response.BranchDatas = null;
            }
            return response;
        }

        public GetcurrentbranchResponse GetCurrentBranch(GetcurrentbranchRequest request)
        {
            GetcurrentbranchResponse response = new GetcurrentbranchResponse();
            DataTable dt = new DataTable();
           dt = new OracleHelper().ExecuteDataSet("select m.branch_id,m.branch_name from goldloan_branch_master m where m.branch_id='" + request.branch + "'").Tables[0];

            if (dt.Rows.Count > 0)
            {
                string data = dt.Rows[0][0].ToString() + "~" + dt.Rows[0][1].ToString();
                response.status = "True";
                response.branch = data;
            }
            
            else
            {
                response.status = "False";
                response.branch = null;
            }
            return response;
        }
        public GetPledgeResponse GetPledgeList(GetPledgeRequset requset)
        {
            GetPledgeResponse response = new GetPledgeResponse();
            DataTable dt = new DataTable();
            string indata = requset.employeeId + "~" + requset.plno + "~" + requset.branchId;
            dt = Procedures.GetDetails(indata).Tables[0];
            if (dt.Rows[0][0] != DBNull.Value && Convert.ToInt32(dt.Rows[0][0]) == 0)
            {
                response.plno = null;
                response.status = "False";
                response.message = "Please check the selected pledge number!!!";
            }
            else if (dt.Rows[0][0] != DBNull.Value && Convert.ToInt32(dt.Rows[0][0]) == 3)
            {
                response.plno = null;
                response.status = "False";
                response.message = "Please enter valid pledge number!!!";
            }
            else
            {
                dt = new OracleHelper().ExecuteDataSet("select count(*) from legal_pledges l, legal_case_mst m where m.complaint = substr (l.complaint,3) and l.legal_id = m.legal_id and l.pledge_no = '" + requset.plno + "' and m.status in (0, 1, 2) and l.removerequestedby is null and l.removalapprovedby is null").Tables[0];
                if (dt.Rows[0][0].ToString() != "0")
                {
                    response.plno = null;
                    response.status = "False";
                    response.message = "Already Entered Pledge Number!!!";
                }
                else
                {
                    response.plno = requset.plno;
                    response.status = "True";
                    response.message = "Success";
                }
            }
            return response;
        }
        public GetSuitfileResponse GetSuitFileSubmit(GetSubmitRequset request)
        {
            GetSuitfileResponse response = new GetSuitfileResponse();
            string str;
            str = Procedures.LegalCaseUpdation(request, "");
            if (!string.IsNullOrEmpty(str))
            {
                DataSet ds = Procedures.PdfUpload(4, request.doc,request.docname+"~"+str);
                DataTable dt=ds.Tables[0];
                if (dt != null && dt.Rows.Count > 0)
                {
                    response.status = str;
                    response.message = "Submitted Successfully";
                }
                else
                {
                    response.status = "False";
                    response.message = "Error Occured!..Please try again..";
                }
            }
            else
            {
                response.status = "False";
                response.message = "Error Occured!..Please try again..";
            }
            return response;
        }
        public GetPostReponse getPostCheck(GetPostRequest request)
        {
            DataTable dt = new DataTable();
            GetPostReponse response = new GetPostReponse();
            string str;
            dt = new OracleHelper().ExecuteDataSet("select t.post_id from employee_master t where t.EMP_CODE='" + request.employeeId + "' and t.STATUS_ID=1").Tables[0];

            if (dt.Rows.Count > 0)
            {
                response.post = dt.Rows[0][0].ToString();
                response.status = "True";
                response.message = "SUCCESS";
            }
            else
            {
                response.post = null;
                response.status = "False";
                response.message = "Error Occured!..Please try again..";
            }
            return response;
        }

        public GetBranchResponse GetBranchCheck(GetBranchCheckRequest request)
        {
            GetBranchResponse response = new GetBranchResponse();
            List<BranchtDeatils> obj = new List<BranchtDeatils>();
            //DataTable dt, dt1 = new DataTable();
            DataTable dt = null;
            string branch = request.branch;
            string post = request.post;
            if (post == "136")
            {
                dt = new OracleHelper().ExecuteDataSet("select -1 as branch_id, '--------------SELECT--------------' as branch_name from dual union all select br.branch_id as branch_id, br.branch_name as branch_name from branch_dtl_new br where br.area_id = (select area_id from branch_dtl_new where branch_id = " + branch + ") and br.branch_id in (select t.rec_branch from legal_case_mst t where t.ah_emp is null and t.appr_id is  null  and trunc(t.rec_date) > '16-feb-2024'  and  t.rha_emp is  null) order by branch_name").Tables[0];
            }
            else if (post == "199")
            {
                dt = new OracleHelper().ExecuteDataSet("select -1 as branch_id, '--------------SELECT--------------' as branch_name from dual union all select m.branch_id as branch_id, m.branch_name as branch_name from branch_master m where m.region_id = (select region_id from branch_master where branch_id = " + branch + ")and m.branch_id in(select t.rec_branch from legal_case_mst t where t.appr_id is null and t.ah_emp is not null   and t.rha_emp is not null and t.status<>5 and trunc(t.rec_date) > '16-feb-2024' )order by branch_name").Tables[0];
            }
            else if (post == "621")
            {
                dt = new OracleHelper().ExecuteDataSet("select -1 as branch_id, '--------------SELECT--------------' as branch_name from dual union all select m.branch_id as branch_id, m.branch_name as branch_name from branch_master m where m.region_id = (select region_id from branch_master where branch_id = " + branch + ")and m.branch_id in(select t.rec_branch from legal_case_mst t where  t.rha_emp is null and t.appr_id is null and t.ah_emp is not null and t.status<>5 and trunc(t.rec_date) > '16-feb-2024')order by branch_name").Tables[0];
            }

            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    BranchtDeatils Complaint = new BranchtDeatils
                    {
                        branchId = row[0].ToString(),
                        branchName = row[1].ToString()
                    };
                    obj.Add(Complaint);
                }
            }
            if (obj.Count > 0)
            {
                response.status = "True";
                response.BranchData = obj;
            }
            else
            {
                response.status = "False";
                response.BranchData = null;
            }
            return response;
        }
        public GetComplaintResponse GetComplaintCheck(GetComplaintCheckReq request)
        {
            GetComplaintResponse response = new GetComplaintResponse();
            List<ComplaintDataDetails> obj = new List<ComplaintDataDetails>();
            DataTable dt = null;
            string branch = request.branch;
            string post = request.post;
            if (post == "136")
            {
                dt = new OracleHelper().ExecuteDataSet("select '-1' as legalid, '--------------SELECT--------------' from dual union all select t.legal_id, (t.legal_id || '~' || t.complaint) as complaint_det from legal_case_mst t where t.ah_emp is null  and trunc(t.rec_date) > '16-feb-2024' and t.rec_branch = " + branch).Tables[0];
            }
            else if (post == "199")
            {
                dt = new OracleHelper().ExecuteDataSet("select '-1' as legalid, '--------------SELECT--------------' from dual union all select t.legal_id,(t.legal_id || '~' || t.complaint) as complaint_det from legal_case_mst t where t.appr_id is null and t.ah_emp is not null and trunc(t.rec_date) > '16-feb-2024' and t.rha_emp is not null and  t.status <> 5 and t.rec_branch = " + branch).Tables[0];
            }
            else if (post == "621")
            {
                dt = new OracleHelper().ExecuteDataSet("select '-1' as legalid, '--------------SELECT--------------' from dual union all select t.legal_id,(t.legal_id || '~' || t.complaint) as complaint_det from legal_case_mst t where t.rha_emp is null and trunc(t.rec_date) > '16-feb-2024' and t.ah_emp is not null and t.status <> 5 and t.rec_branch = " + branch).Tables[0];
            }

            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    ComplaintDataDetails Complaint = new ComplaintDataDetails
                    {
                        legalId = row[0].ToString(),
                        complaint = row[1].ToString()
                    };
                    obj.Add(Complaint);
                }
            }
            if (obj.Count > 0)
            {
                response.status = "True";
                response.ComplaintData = obj;
            }
            else
            {
                response.status = "False";
                response.ComplaintData = null;
            }
            return response;

        }

        public getLegalDetailsResponse GetCaseDetails(getLegalDetailsRequest request)
        {
            getLegalDetailsResponse response = new getLegalDetailsResponse();
            DataTable dt, dt1 = null;

            dt = new OracleHelper().ExecuteDataSet("select p.type, p.timeline, t.comp_attch_name, t.gold_avl_place, t.current_branch, t.other_branch_id, t.policestat_name, t.SEIZER_MAHAR_NME, t.RESON_SUIT_FILE, t.goldinbranch, t.previous_entered_or_not, t.comp_attch, t.seizer_mahar from legal_case_mst t, TBL_SUITE_FILED p where t.complaint_type = p.type_id and t.legal_id = '" + request.legal + "'").Tables[0];

            if (dt.Rows.Count > 0)
            {
                if (dt.Rows[0][3].ToString() == "Branch")
                {
                    dt1 = new OracleHelper().ExecuteDataSet("select m.branch_name from goldloan_branch_master m where m.branch_id='" + dt.Rows[0][4].ToString() + "'").Tables[0];
                    response.branchName = dt1.Rows[0][0].ToString();
                }
                else if (dt.Rows[0][3].ToString() == "Another Branch")
                {
                    dt1 = new OracleHelper().ExecuteDataSet("select m.branch_name from goldloan_branch_master m where m.branch_id='" + dt.Rows[0][5].ToString() + "'").Tables[0];
                    response.branchName = dt1.Rows[0][0].ToString();
                }
                else
                {
                    response.branchName = null;
                }

                response.status = "True";

                // Convert Byte[] to Base64 if present
                var legalDataList = dt.Rows[0].ItemArray.Select(item => item?.ToString()).ToList();

                if (dt.Rows[0]["comp_attch"] is byte[] fileBytes && fileBytes.Length > 0)
                {
                    string base64String = Convert.ToBase64String(fileBytes);
                    legalDataList[11] = base64String;
                }
                

                if (dt.Rows[0]["seizer_mahar"] is byte[] fileBytes1 && fileBytes1.Length > 0)
                {
                    string base64String1 = Convert.ToBase64String(fileBytes1);
                    legalDataList[12] = base64String1;
                }

                response.legaldata = string.Join("|", legalDataList);
            }
            else
            {
                response.status = "False";
                response.legaldata = null;
                response.branchName = null;
            }

            return response;


        }
        public getPledgeListResponse GetPledgeShowDetail(getLegalDetailsRequest request)
        {
            getPledgeListResponse response = new getPledgeListResponse();
            DataTable dt, dt1 = null;
            List<string> pledgesList = new List<string>();
            dt = new OracleHelper().ExecuteDataSet("select p.pledge_no from legal_pledges p  where p.legal_id = '" + request.legal + "'").Tables[0];

            if (dt != null && dt.Rows.Count > 0)

            {
                foreach (DataRow row in dt.Rows)
                {
                    pledgesList.Add(row[0].ToString());

                }
                response.status = "True";
                response.pledges = pledgesList.ToArray(); // Convert list to array

            }
            else
            {

                response.status = "False";
                response.pledges = null;
            }

            return response;
        }
        public GetSuitfileResponse GetSuitFileApprove(GetSubmitRequset request)
        {
            GetSuitfileResponse response = new GetSuitfileResponse();
            string str;
            str = Procedures.LegalCaseUpdation(request, request.flag2);
            if (str == "Confirmed Successfully")
            {
                response.status = "True";
                response.message = "Submitted Successfully";
            }
            else if (str == "Legal Case Cancelled for Complaint Number")
            {
                response.status = "True";
                response.message = "Rejected Successfully";
            }
            else
            {
                response.status = "False";
                response.message = "Error Occured!..Please try again..";
            }
            return response;
        }
        public string LegalSuitFileSelect(GetSuitFileDeatailsRequset request)
        {
            string as_optflag = request.as_optflag ?? ""; // Example: replace with actual property
            string p_indata = request.p_indata ?? "0";
            GetSuitFileDeatailsResponse response = new GetSuitFileDeatailsResponse();
            response = Procedures.LegalSuitFileSelect(as_optflag, p_indata);
            // Ensure that `outdata` is stored as an actual JSON object, not an escaped string
            //response.outdata = JsonConvert.SerializeObject(JsonConvert.DeserializeObject<object>(response.outdata));
            // Return **full response** as a single properly formatted JSON string
            return JsonConvert.SerializeObject(response, Formatting.None);
        }

        public GetSuitfileResponse LegalConfirmDetails(GetSuitFileDeatailsRequset request)
        {
            GetSuitfileResponse response = new GetSuitfileResponse();
            string str;
            str = Procedures.LegalConfirmDetails(request, "");
            if (str == "Approved Successfully")
            {
                response.status = "True";
                response.message = "Approved Successfully";
            }
            else if (str == "Legal Case Cancelled")
            {
                response.status = "True";
                response.message = "Legal Case Cancelled";
            }
            else if (str == "Legal Case Rejected")
            {
                response.status = "True";
                response.message = "Legal Case Rejected";
            }
            else if (str == "Approved Removal Request")
            {
                response.status = "True";
                response.message = "Approved Removal Request";
            }
            else if (str == "Removal Request Saved")
            {
                response.status = "True";
                response.message = "Approved Removal Request";
            }
            else
            {
                response.status = "False";
                response.message = "Error Occured!..Please try again..";
            }
            return response;
        }
        public string plp_Legal_Select(GetSuitFileDeatailsRequset request)
        {
            string[] parts = request.p_indata.Split('~');
            GetSuitFileDeatailsResponse response = new GetSuitFileDeatailsResponse();
            response = Procedures.Plp_Legal_Select(parts[0].Trim(), parts[1].Trim(), int.Parse(parts[2].Trim()), parts[3].Trim(), parts[4].Trim(), parts[5].Trim());
            return JsonConvert.SerializeObject(response, Formatting.None);
        }
        public GetSuitFilepdfResponse PdfUpload1(GetSuitFileDocumentRequest request)
        {
            GetSuitFilepdfResponse response = new GetSuitFilepdfResponse();
            DataTable dt1 = new DataTable();
            string indata = request.indata;
            int flag = Convert.ToInt32(request.flag);
            dt1 = Procedures.PdfUpload(flag, request.img2, indata).Tables[0];
            if (dt1 == null || dt1.Rows.Count == 0 || dt1.Rows[0][0]?.ToString() == "0")
            {

                response.status = "False";
            }
            else
            {

                response.status = "True";
            }
            return response;

        }


        public Suitfile_docResponse Suitfile_doc(Suitfile_docRequest request)
        {
            Suitfile_docResponse response = new Suitfile_docResponse();
            List<Dropdown> obj1 = new List<Dropdown>();
            DataTable dt1 = new DataTable();
            string indata = request.indata + "~"+ request.encrypt_data;
            int flag = Convert.ToInt32(request.flag);
            dt1 = Procedures.Suitfile_doc(flag, request.img1,request.img2, indata).Tables[0];
            if (dt1 == null || dt1.Rows.Count == 0 || dt1.Rows[0][0]?.ToString() == "0")
            {

                response.status = "False";
            }
            else
            {

                response.status = "True";
            }
            return response;

        }

        public Suitfile_docResponse Pdf_view(Suitfile_docRequest request)
        {
            Suitfile_docResponse response = new Suitfile_docResponse();
            try
            {

                //List<Dropdown> obj1 = new List<Dropdown>();
                DataTable dt1 = new DataTable();
                string indata = request.indata;
                int flag = Convert.ToInt32(request.flag);
                dt1 = Procedures.Suitfile_doc(flag, request.img1, request.img2, indata).Tables[0];
                if (dt1.Rows.Count > 0 && dt1.Rows[0][0] != DBNull.Value)
                {
                    // Cast the BLOB data to byte array
                    byte[] blobData = (byte[])dt1.Rows[0][0];

                    // Convert byte array to base64 string
                    string base64Result = Convert.ToBase64String(blobData);

                    // Now you can use base64Result
                    Console.WriteLine($"Base64 length: {base64Result.Length}");
                    response.outdata = base64Result;
                    response.status = "True";
                }
                else
                {
                    response.status = "False";
                    response.outdata = null;
                    // Handle case where no data is found or data is null
                    Console.WriteLine("No BLOB data found or data is null");
                }
            }
            catch (Exception ex)
            {
            }
            return response;
        }

    }

}

