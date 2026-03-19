using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;
using AsirvadLegalModule.DTO.AdvocateEmpanelment.Response;
using AsirvadLegalModule.DTO.ChequeCollection.Response;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.DTO.IrregularityRecCall.Response;
using AsirvadLegalModule.DTO.LegalFIR.Response;
using AsirvadLegalModule.DTO.LegalNotice.Response;
using AsirvadLegalModule.DTO.LegalRecoveryCall.Response;
using AsirvadLegalModule.DTO.Login.Response;
using AsirvadLegalModule.DTO.PropertyIdentity.Response;
using AsirvadLegalModule.DTO.Response;
using AsirvadLegalModule.DTO.SeizedPledges.Response;
using AsirvadLegalModule.Utilities;
using DBAccessLibrary;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using static AsirvadLegalModule.DTO.GoldSuitFIle.Response.getPledgeListResponse;

namespace AsirvadLegalModule.Core
{
    public class Procedures
    {
        public static string Session_check(string indata, string flag)
        {
            OracleParameter[] parameter = new OracleParameter[4];
            parameter[0] = new OracleParameter("indata", OracleDbType.Varchar2);
            parameter[0].Direction = ParameterDirection.Input;
            parameter[0].Value = indata;
            parameter[1] = new OracleParameter("flag", OracleDbType.Int32);
            parameter[1].Direction = ParameterDirection.Input;
            parameter[1].Value = flag;
            parameter[2] = new OracleParameter("err_sts", OracleDbType.Varchar2);
            parameter[2].Direction = ParameterDirection.Output;
            parameter[2].Size = 100;
            parameter[3] = new OracleParameter("err_code", OracleDbType.Varchar2);
            parameter[3].Direction = ParameterDirection.Output;
            parameter[3].Size = 1000;
            new OracleHelper().ExecuteNonQuery("proc_session_check_legal", parameter);
            string cn = parameter[2].Value.ToString();
            return cn;
        }
        public static DataSet GetDetails(string p_data)
        {
            DataSet dS = new DataSet();


            try
            {
                OracleParameter[] parameter = new OracleParameter[2];

                parameter[0] = new OracleParameter("p_indata", OracleDbType.Varchar2);
                parameter[0].Direction = ParameterDirection.Input;
                parameter[0].Value = p_data;

                parameter[1] = new OracleParameter("p_queryresult", OracleDbType.RefCursor);
                parameter[1].Direction = ParameterDirection.Output;

                dS = new OracleHelper().ExecuteDataSet("proc_get_details", parameter);
            }
            catch (Exception ex)
            {
                dS = null;
            }

            return dS;
        }
        //public static string LegalCaseUpdation(GetSubmitRequset request, string flag)
        //{
        //    string Message = "";
        //    try
        //    {
        //        var pr1 = new OracleParameter[15];

        //        pr1[0] = new OracleParameter("ComplaintNo", OracleDbType.Varchar2);
        //        pr1[0].Value = request.complaint;

        //        pr1[1] = new OracleParameter("UserID", OracleDbType.Varchar2);
        //        pr1[1].Value = request.employeeId;

        //        pr1[2] = new OracleParameter("brid", OracleDbType.Int64);
        //        pr1[2].Value = Convert.ToInt32(request.branchId);

        //        pr1[3] = new OracleParameter("Complaintval", OracleDbType.Varchar2);
        //        if (flag == "")
        //        {
        //            pr1[3].Value = request.caseType + "~" + request.complaint;
        //        }
        //        else if (flag != "5")
        //        {
        //            pr1[3].Value = request.rm_cmt;
        //        }
        //        else
        //        {
        //            pr1[3].Value = "NA";
        //        }

        //        pr1[4] = new OracleParameter("ps", OracleDbType.Varchar2);
        //        pr1[4].Value = request.police;

        //        if (request.goldInPlace == "Another Branch")
        //        {
        //            pr1[5] = new OracleParameter("ab", OracleDbType.Varchar2);
        //            pr1[5].Value = request.anoBranch;
        //        }
        //        else
        //        {
        //            pr1[5] = new OracleParameter("ab", OracleDbType.Varchar2);
        //            pr1[5].Value = "";
        //        }
        //        if (request.goldInPlace == "Branch")
        //        {
        //            pr1[6] = new OracleParameter("cb", OracleDbType.Varchar2);
        //            pr1[6].Value = request.branchId;
        //        }
        //        else
        //        {
        //            pr1[6] = new OracleParameter("cb", OracleDbType.Varchar2);
        //            pr1[6].Value = "";
        //        }

        //        pr1[11] = new OracleParameter("gap", OracleDbType.Varchar2);
        //        pr1[11].Value = request.goldInPlace;

        //        pr1[12] = new OracleParameter("rsf", OracleDbType.Varchar2);
        //        pr1[12].Value = request.reason;

        //        if (request.reason == "Burglary Gold")
        //        {

        //            pr1[13] = new OracleParameter("gib", OracleDbType.Varchar2);
        //            pr1[13].Value = request.goldInBranch;
        //        }
        //        else
        //        {
        //            pr1[13] = new OracleParameter("gib", OracleDbType.Varchar2);
        //            pr1[13].Value = "";
        //        }

        //        pr1[14] = new OracleParameter("peon", OracleDbType.Varchar2);
        //        pr1[14].Value = request.prevPledge;

        //        pr1[7] = new OracleParameter("flag", OracleDbType.Varchar2);
        //        pr1[7].Value = request.flag1;

        //        pr1[8] = new OracleParameter("temppar1", OracleDbType.Varchar2);
        //        if (flag == "")
        //        {
        //            pr1[8].Value = request.pledgeList;
        //        }
        //        else
        //        {
        //            pr1[8].Value = flag;
        //        }

        //        pr1[9] = new OracleParameter("temppar2", OracleDbType.Varchar2);
        //        pr1[9].Value = "NA";

        //        pr1[10] = new OracleParameter("ErrorMsg", OracleDbType.Varchar2, 200);
        //        pr1[10].Direction = ParameterDirection.Output;

        //        new OracleHelper().ExecuteNonQuery("plp_legalCaseUpdation_new", pr1);
        //        Message = pr1[10].Value.ToString().Trim();
        //    }
        //    catch (Exception ex)
        //    {
        //    }
        //    return Message;
        //}

        public static string LegalCaseUpdation(GetSubmitRequset request, string flag)
        {
            string Message = "";
            try
            {
                var pr1 = new OracleParameter[15];

                pr1[0] = new OracleParameter("ComplaintNo", OracleDbType.Varchar2);
                pr1[0].Value = request.complaint;

                pr1[1] = new OracleParameter("UserID", OracleDbType.Varchar2);
                pr1[1].Value = request.employeeId;

                pr1[2] = new OracleParameter("brid", OracleDbType.Int64);
                pr1[2].Value = Convert.ToInt32(request.branchId);

                pr1[3] = new OracleParameter("Complaintval", OracleDbType.Varchar2);
                if (flag == "")
                {
                    pr1[3].Value = request.caseType + "~" + request.complaint;
                }
                else if (flag != "5")
                {
                    pr1[3].Value = request.rm_cmt;
                }
                else
                {
                    pr1[3].Value = request.rm_cmt;
                }

                pr1[4] = new OracleParameter("ps", OracleDbType.Varchar2);
                pr1[4].Value = request.police;

                if (request.goldInPlace == "Another Branch")
                {
                    pr1[5] = new OracleParameter("ab", OracleDbType.Varchar2);
                    pr1[5].Value = request.anoBranch;
                }
                else
                {
                    pr1[5] = new OracleParameter("ab", OracleDbType.Varchar2);
                    pr1[5].Value = "";
                }
                if (request.goldInPlace == "Branch")
                {
                    pr1[6] = new OracleParameter("cb", OracleDbType.Varchar2);
                    pr1[6].Value = request.branchId;
                }
                else
                {
                    pr1[6] = new OracleParameter("cb", OracleDbType.Varchar2);
                    pr1[6].Value = "";
                }

                pr1[11] = new OracleParameter("gap", OracleDbType.Varchar2);
                pr1[11].Value = request.goldInPlace;

                pr1[12] = new OracleParameter("rsf", OracleDbType.Varchar2);
                pr1[12].Value = request.reason;

                if (request.reason == "Burglary Gold")
                {

                    pr1[13] = new OracleParameter("gib", OracleDbType.Varchar2);
                    pr1[13].Value = request.goldInBranch;
                }
                else
                {
                    pr1[13] = new OracleParameter("gib", OracleDbType.Varchar2);
                    pr1[13].Value = "";
                }

                pr1[14] = new OracleParameter("peon", OracleDbType.Varchar2);
                pr1[14].Value = request.prevPledge;

                pr1[7] = new OracleParameter("flag", OracleDbType.Varchar2);
                pr1[7].Value = request.flag1;

                pr1[8] = new OracleParameter("temppar1", OracleDbType.Varchar2);
                if (flag == "")
                {
                    pr1[8].Value = request.pledgeList;
                }
                else
                {
                    pr1[8].Value = flag;
                }

                pr1[9] = new OracleParameter("temppar2", OracleDbType.Varchar2);
                pr1[9].Value = "NA";

                pr1[10] = new OracleParameter("ErrorMsg", OracleDbType.Varchar2, 200);
                pr1[10].Direction = ParameterDirection.Output;

                new OracleHelper().ExecuteNonQuery("plp_legalCaseUpdation_new", pr1);
                Message = pr1[10].Value.ToString().Trim();
            }
            catch (Exception ex)
            {
            }
            return Message;
        }


        public static GetSuitFileDeatailsResponse LegalSuitFileSelect(string as_optflag, string p_indata)
        {
            GetSuitFileDeatailsResponse response = new GetSuitFileDeatailsResponse();
            OracleParameter[] parameter = new OracleParameter[5];
            parameter[0] = new OracleParameter("as_optflag", OracleDbType.Varchar2);
            parameter[0].Direction = ParameterDirection.Input;
            parameter[0].Value = as_optflag;
            parameter[1] = new OracleParameter("p_indata", OracleDbType.Varchar2);
            parameter[1].Direction = ParameterDirection.Input;
            parameter[1].Value = p_indata;
            parameter[2] = new OracleParameter("err_sts", OracleDbType.Varchar2);
            parameter[2].Direction = ParameterDirection.Output;
            parameter[2].Size = 100;
            parameter[3] = new OracleParameter("err_code", OracleDbType.Varchar2);
            parameter[3].Direction = ParameterDirection.Output;
            parameter[3].Size = 1000;
            parameter[4] = new OracleParameter("as_outresult", OracleDbType.RefCursor);
            parameter[4].Direction = ParameterDirection.Output;

            DataSet Result = new DataSet();
            Result = new OracleHelper().ExecuteDataSet("proc_legalSuitFile_Select", parameter);
            //string dtJson = JsonConvert.SerializeObject(Result);
            //response.outdata = Uri.EscapeDataString(dtJson).ToString();

            var resultList = new List<Dictionary<string, object>>();
            foreach (DataTable table in Result.Tables)
            {
                foreach (DataRow row in table.Rows)
                {
                    var rowDictionary = new Dictionary<string, object>();
                    foreach (DataColumn column in table.Columns)
                    {
                        rowDictionary[column.ColumnName] = row[column];
                    }
                    resultList.Add(rowDictionary);
                }
            }

            response.outdata = JsonConvert.SerializeObject(new { Table = resultList }); // Proper JSON formatting
            //response.outdata = dtJson; // Store JSON directly without URL encoding

            response.err_code = parameter[3].Value.ToString();
            response.err_sts = parameter[2].Value.ToString();

            return response;

        }
        //public static string LegalConfirmDetails(GetSuitFileDeatailsRequset request, string flag)
        //{
        //    string[] p_indataArray = request.p_indata.Split('!');
        //    string employeeId = Encrypt_Decrypt.RSA.Decrypt(p_indataArray[1]);
        //    string branch = Encrypt_Decrypt.RSA.Decrypt(p_indataArray[2]);

        //    string Message = "";
        //    try {
        //        OracleParameter[] pr1 = new OracleParameter[15];

        //        pr1[0] = new OracleParameter("ComplaintNo", OracleDbType.Varchar2, 16);
        //        pr1[0].Value = p_indataArray[0];

        //        pr1[1] = new OracleParameter("UserID", OracleDbType.Varchar2, 6);
        //        pr1[1].Value = employeeId;

        //        pr1[2] = new OracleParameter("brid", OracleDbType.Int64, 50);
        //        pr1[2].Value = Convert.ToInt32(branch);

        //        pr1[3] = new OracleParameter("Complaintval", OracleDbType.Varchar2, 500);
        //        if ((p_indataArray[4] == "AGM"))
        //        {
        //            pr1[3].Value = p_indataArray[5];
        //        }
        //        else {
        //            pr1[3].Value = p_indataArray[3];
        //        }

        //        pr1[4] = new OracleParameter("flag", OracleDbType.Varchar2, 50);
        //        pr1[4].Value = p_indataArray[4];

        //        pr1[5] = new OracleParameter("temppar1", OracleDbType.Varchar2, 100);
        //        pr1[5].Value = request.as_optflag;

        //        pr1[6] = new OracleParameter("temppar2", OracleDbType.Varchar2, 550);
        //        if ((p_indataArray[4]=="AGM") || (p_indataArray[4] == "APPROVE_REMOVE")|| (p_indataArray[4] == "REMOVAL")) 
        //        {
        //            pr1[6].Value = "NA";
        //        } 

        //        else 
        //        {
        //            if (request.as_optflag != "5")
        //            {
        //                string temppar2value = (p_indataArray[5]);
        //                pr1[6].Value = temppar2value;
        //            }
        //            else
        //            {
        //                pr1[6].Value = "NA";
        //            }
        //        }

        //        pr1[7] = new OracleParameter("ErrorMsg", OracleDbType.Varchar2, 500);
        //        pr1[7].Direction = ParameterDirection.Output;

        //        pr1[8] = new OracleParameter("ps", OracleDbType.Varchar2, 5);
        //        pr1[8].Value = "";

        //        pr1[9] = new OracleParameter("ab", OracleDbType.Varchar2, 5);
        //        pr1[9].Value = "";

        //        pr1[10] = new OracleParameter("cb", OracleDbType.Varchar2, 5);
        //        pr1[10].Value = "";

        //        pr1[11] = new OracleParameter("peon", OracleDbType.Varchar2, 5);
        //        pr1[11].Value = "";

        //        pr1[12] = new OracleParameter("gap", OracleDbType.Varchar2, 5);
        //        pr1[12].Value = "";

        //        pr1[13] = new OracleParameter("gib", OracleDbType.Varchar2, 5);
        //        pr1[13].Value = "";

        //        pr1[14] = new OracleParameter("rsf", OracleDbType.Varchar2, 5);
        //        pr1[14].Value = "";

        //        new OracleHelper().ExecuteNonQuery("plp_legalCaseUpdation_new", pr1);

        //         Message = pr1[7].Value.ToString().Trim();
        //    }
        //    catch (Exception ex)
        //    {
        //    }
        //    return Message;
        //}


        public static string LegalConfirmDetails(GetSuitFileDeatailsRequset request, string flag)
        {
            string[] p_indataArray = request.p_indata.Split('!');
            string employeeId = Encrypt_Decrypt.RSA.Decrypt(p_indataArray[1]);
            string branch = Encrypt_Decrypt.RSA.Decrypt(p_indataArray[2]);

            string Message = "";
            try
            {
                OracleParameter[] pr1 = new OracleParameter[15];

                pr1[0] = new OracleParameter("ComplaintNo", OracleDbType.Varchar2, 16);
                pr1[0].Value = p_indataArray[0];

                pr1[1] = new OracleParameter("UserID", OracleDbType.Varchar2, 6);
                pr1[1].Value = employeeId;

                pr1[2] = new OracleParameter("brid", OracleDbType.Int64, 50);
                pr1[2].Value = Convert.ToInt32(branch);

                pr1[3] = new OracleParameter("Complaintval", OracleDbType.Varchar2, 500);
                if ((p_indataArray[4] == "AGM"))
                {
                    pr1[3].Value = p_indataArray[5];
                }
                else
                {
                    pr1[3].Value = p_indataArray[3];
                }

                pr1[4] = new OracleParameter("flag", OracleDbType.Varchar2, 50);
                pr1[4].Value = p_indataArray[4];

                pr1[5] = new OracleParameter("temppar1", OracleDbType.Varchar2, 100);
                pr1[5].Value = request.as_optflag;

                pr1[6] = new OracleParameter("temppar2", OracleDbType.Varchar2, 550);
                if ((p_indataArray[4] == "AGM"))
                {

                    pr1[6].Value = p_indataArray[6];
                }
                else if ((p_indataArray[4] == "APPROVE_REMOVE") || (p_indataArray[4] == "REMOVAL"))
                {
                    pr1[6].Value = "NA";
                }
                else
                {
                    if (request.as_optflag != "5")
                    {
                        string temppar2value = (p_indataArray[5]);
                        pr1[6].Value = temppar2value;
                    }
                    else
                    {
                        pr1[6].Value = p_indataArray[6];
                    }
                }

                pr1[7] = new OracleParameter("ErrorMsg", OracleDbType.Varchar2, 500);
                pr1[7].Direction = ParameterDirection.Output;

                pr1[8] = new OracleParameter("ps", OracleDbType.Varchar2, 5);
                pr1[8].Value = "";

                pr1[9] = new OracleParameter("ab", OracleDbType.Varchar2, 5);
                pr1[9].Value = "";

                pr1[10] = new OracleParameter("cb", OracleDbType.Varchar2, 5);
                pr1[10].Value = "";

                pr1[11] = new OracleParameter("peon", OracleDbType.Varchar2, 5);
                pr1[11].Value = "";

                pr1[12] = new OracleParameter("gap", OracleDbType.Varchar2, 5);
                pr1[12].Value = "";

                pr1[13] = new OracleParameter("gib", OracleDbType.Varchar2, 5);
                pr1[13].Value = "";

                pr1[14] = new OracleParameter("rsf", OracleDbType.Varchar2, 5);
                pr1[14].Value = "";

                new OracleHelper().ExecuteNonQuery("plp_legalCaseUpdation_new", pr1);

                Message = pr1[7].Value.ToString().Trim();
            }
            catch (Exception ex)
            {
            }
            return Message;
        }


        public static GetSuitFileDeatailsResponse Plp_Legal_Select(string optflag, string pledgeno, int branchid, string prgparam1, string prgparam2, string prgparam3)
        {
            try
            {
                GetSuitFileDeatailsResponse response= new GetSuitFileDeatailsResponse();
                DataSet depDS = new DataSet();
                OracleParameter[] parameter = new OracleParameter[7];

                parameter[0] = new OracleParameter("as_optflag", OracleDbType.Varchar2);
                parameter[0].Value = optflag;
                parameter[1] = new OracleParameter("as_pledgeno", OracleDbType.Varchar2);
                parameter[1].Value = pledgeno;
                parameter[2] = new OracleParameter("an_branchid", OracleDbType.Int64);
                parameter[2].Value = branchid;
                parameter[3] = new OracleParameter("param1", OracleDbType.Varchar2);
                parameter[3].Value = prgparam1;
                parameter[4] = new OracleParameter("param2", OracleDbType.Varchar2);
                parameter[4].Value = prgparam2;
                parameter[5] = new OracleParameter("param3", OracleDbType.Varchar2);
                parameter[5].Value = prgparam3;
                parameter[6] = new OracleParameter("as_outresult", OracleDbType.RefCursor);
                parameter[6].Direction = ParameterDirection.Output;

                depDS = new OracleHelper().ExecuteDataSet("PLP_LEGAL_SELECT", parameter);
               

                if (depDS != null && depDS.Tables.Count > 0 && depDS.Tables[0].Rows.Count > 0)
                {
                    response.outdata = JsonConvert.SerializeObject(new { Table = depDS });
                    response.err_code = "1";
                    response.err_sts = "SUCCESS";
                }
                else
                {
                    response.outdata = null;
                    response.err_code = "-1";
                    response.err_sts = "FAIL";
                }

                return response;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Cust_recom_det: " + ex.Message);
            }

        }
       
        public static LegalRecoveryDeatailsResponse PROC_RECOVERY_EMPLOYEE_CONFIRM(string as_optflag, string p_indata)
        {
            try
            {
                LegalRecoveryDeatailsResponse response = new LegalRecoveryDeatailsResponse();
                OracleParameter[] parameter = new OracleParameter[5];
                parameter[0] = new OracleParameter("p_indata", OracleDbType.Varchar2);
                parameter[0].Direction = ParameterDirection.Input;
                parameter[0].Value = p_indata;
                parameter[1] = new OracleParameter("as_optflag", OracleDbType.Varchar2);
                parameter[1].Direction = ParameterDirection.Input;
                parameter[1].Value = as_optflag;
                parameter[2] = new OracleParameter("as_outresult", OracleDbType.RefCursor);
                parameter[2].Direction = ParameterDirection.Output;
                parameter[3] = new OracleParameter("err_sts", OracleDbType.Varchar2);
                parameter[3].Direction = ParameterDirection.Output;
                parameter[3].Size = 100;


                DataSet Result = new DataSet();
                Result = new OracleHelper().ExecuteDataSet("PROC_RECOVERY_EMPLOYEE_CONFIRM", parameter);
                //string dtJson = JsonConvert.SerializeObject(Result);
                //response.outdata = Uri.EscapeDataString(dtJson).ToString();

                var resultList = new List<Dictionary<string, object>>();
                foreach (DataTable table in Result.Tables)
                {
                    foreach (DataRow row in table.Rows)
                    {
                        var rowDictionary = new Dictionary<string, object>();
                        foreach (DataColumn column in table.Columns)
                        {
                            rowDictionary[column.ColumnName] = row[column];
                        }
                        resultList.Add(rowDictionary);
                    }
                }

                response.outdata = JsonConvert.SerializeObject(new { Table = resultList }); // Proper JSON formatting
                response.err_sts = parameter[3].Value.ToString();
                response.err_code = "";
                return response;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Cust_recom_det: " + ex.Message);
            }
        }
        public static DataSet PdfUpload(int flag, string img, string indata)
        {
            DataSet dS = new DataSet();
            byte[] outdata = Convert.FromBase64String(img);

            try
            {
                OracleParameter[] parameter = new OracleParameter[6];

                parameter[0] = new OracleParameter("flag", OracleDbType.Int32);
                parameter[0].Direction = ParameterDirection.Input;
                parameter[0].Value = flag;

                parameter[1] = new OracleParameter("data1", OracleDbType.Varchar2);
                parameter[1].Direction = ParameterDirection.Input;
                parameter[1].Value = indata;

                parameter[2] = new OracleParameter("img", OracleDbType.Blob);
                parameter[2].Direction = ParameterDirection.Input;
                parameter[2].Value = outdata;

                parameter[3] = new OracleParameter("p_OutMsg", OracleDbType.Varchar2, 2000);
                parameter[3].Direction = ParameterDirection.Output;

                parameter[4] = new OracleParameter("p_OutSts", OracleDbType.Int64);
                parameter[4].Direction = ParameterDirection.Output;

                parameter[5] = new OracleParameter("as_outresult", OracleDbType.RefCursor);
                parameter[5].Direction = ParameterDirection.Output;

                dS = new OracleHelper().ExecuteDataSet("proc_new_pdf_insert", parameter);
            }
            catch (Exception ex)
            {
                dS = null;
            }

            return dS;
        }

        public static DataSet Suitfile_doc(int flag, string img1,string img2, string indata)
        {
            DataSet dS = new DataSet();
            byte[] outdata1 = Convert.FromBase64String(img1);
            byte[] outdata2 = Convert.FromBase64String(img2);

            try
            {
                OracleParameter[] parameter = new OracleParameter[8];

                parameter[0] = new OracleParameter("flag", OracleDbType.Int32);
                parameter[0].Direction = ParameterDirection.Input;
                parameter[0].Value = flag;

                parameter[1] = new OracleParameter("data1", OracleDbType.Varchar2);
                parameter[1].Direction = ParameterDirection.Input;
                parameter[1].Value = indata;

                parameter[2] = new OracleParameter("img1", OracleDbType.Blob);
                parameter[2].Direction = ParameterDirection.Input;
                parameter[2].Value = outdata1;

                parameter[3] = new OracleParameter("img2", OracleDbType.Blob);
                parameter[3].Direction = ParameterDirection.Input;
                parameter[3].Value = outdata2;

                parameter[4] = new OracleParameter("p_OutMsg", OracleDbType.Varchar2, 2000);
                parameter[4].Direction = ParameterDirection.Output;

                parameter[5] = new OracleParameter("p_OutSts", OracleDbType.Int64);
                parameter[5].Direction = ParameterDirection.Output;

                parameter[6] = new OracleParameter("as_outresult1", OracleDbType.RefCursor);
                parameter[6].Direction = ParameterDirection.Output;

                parameter[7] = new OracleParameter("as_outresult2", OracleDbType.RefCursor);
                parameter[7].Direction = ParameterDirection.Output;

                dS = new OracleHelper().ExecuteDataSet("proc_suitfile_doc", parameter);
                
            }
            catch (Exception ex)
            {
                dS = null;
            }

            return dS;
        }


        public static AccessCheckResponse proc_legal_access_check(string employeeId,string post, string formId,string barnch)
        {
            AccessCheckResponse response = new AccessCheckResponse();
            OracleParameter[] parameter = new OracleParameter[7];

            parameter[0] = new OracleParameter("p_formId", OracleDbType.Varchar2);
            parameter[0].Direction = ParameterDirection.Input;
            parameter[0].Value = formId;
            parameter[1] = new OracleParameter("p_postid", OracleDbType.Varchar2);
            parameter[1].Direction = ParameterDirection.Input;
            parameter[1].Value = post;
            parameter[2] = new OracleParameter("p_employeeId", OracleDbType.Varchar2);
            parameter[2].Direction = ParameterDirection.Input;
            parameter[2].Value = employeeId;
            parameter[3] = new OracleParameter("p_branch", OracleDbType.Varchar2);
            parameter[3].Direction = ParameterDirection.Input;
            parameter[3].Value = barnch;
            parameter[4] = new OracleParameter("err_sts", OracleDbType.Varchar2);
            parameter[4].Direction = ParameterDirection.Output;
            parameter[4].Size = 100;
            parameter[5] = new OracleParameter("err_code", OracleDbType.Varchar2);
            parameter[5].Direction = ParameterDirection.Output;
            parameter[5].Size = 1000;
            parameter[6] = new OracleParameter("as_outresult", OracleDbType.RefCursor);
            parameter[6].Direction = ParameterDirection.Output;

            DataSet Result = new DataSet();
            Result = new OracleHelper().ExecuteDataSet("proc_legal_access_check", parameter);
            
            response.err_code = parameter[5].Value.ToString();
            response.err_sts = parameter[4].Value.ToString();

            return response;

        }

        //---------------Theft start

        public static SeizedPledgesResponse SeizedData(string flag, string indata)
        {
            SeizedPledgesResponse response = new SeizedPledgesResponse();
            OracleParameter[] parameter = new OracleParameter[5];

            parameter[0] = new OracleParameter("indata", OracleDbType.Varchar2);
            parameter[0].Direction = ParameterDirection.Input;
            parameter[0].Value = indata;

            parameter[1] = new OracleParameter("flag", OracleDbType.Varchar2);
            parameter[1].Direction = ParameterDirection.Input;
            parameter[1].Value = flag;

            parameter[2] = new OracleParameter("err_sts", OracleDbType.Varchar2);
            parameter[2].Direction = ParameterDirection.Output;
            parameter[2].Size = 100;

            parameter[3] = new OracleParameter("err_code", OracleDbType.Varchar2);
            parameter[3].Direction = ParameterDirection.Output;
            parameter[3].Size = 1000;

            parameter[4] = new OracleParameter(" out_result ", OracleDbType.RefCursor);
            parameter[4].Direction = ParameterDirection.Output;


            DataSet Result = new DataSet();
            Result = new OracleHelper().ExecuteDataSet("proc_seized_data", parameter);
            //string dtJson = JsonConvert.SerializeObject(Result);
            //response.outdata = Uri.EscapeDataString(dtJson).ToString();

            var resultList = new List<Dictionary<string, object>>();
            foreach (DataTable table in Result.Tables)
            {
                foreach (DataRow row in table.Rows)
                {
                    var rowDictionary = new Dictionary<string, object>();
                    foreach (DataColumn column in table.Columns)
                    {
                        rowDictionary[column.ColumnName] = row[column];
                    }
                    resultList.Add(rowDictionary);
                }
            }

            response.outdata = JsonConvert.SerializeObject(new { Table = resultList });


            response.err_code = parameter[3].Value.ToString();
            response.err_sts = parameter[2].Value.ToString();

            return response;


        }
        public static SeizedPledgesResponse Lo9Submit(string indata, string pledgeNo, string caseCategory, string lo9Doc, string lo9Ex, string RecDoc, string RecEx, string DraftDoc, string DraftEx, string emp_id)
        {
            SeizedPledgesResponse response = new SeizedPledgesResponse();
            OracleParameter[] parameter = new OracleParameter[13]; // Increased array size for additional parameters

            parameter[0] = new OracleParameter("indata", OracleDbType.Varchar2) { Direction = ParameterDirection.Input, Value = indata ?? "0" };
            parameter[1] = new OracleParameter("p_pledge_no", OracleDbType.Varchar2) { Direction = ParameterDirection.Input, Value = pledgeNo };
            parameter[2] = new OracleParameter("p_case_category", OracleDbType.Varchar2) { Direction = ParameterDirection.Input, Value = caseCategory };

            try
            {
                if (string.IsNullOrEmpty(lo9Doc) || lo9Doc.Length % 4 != 0 || !Regex.IsMatch(lo9Doc, @"^[A-Za-z0-9+/=]+$"))
                {
                    throw new ArgumentException("Invalid Base64 string for Lo9Doc");
                }

                byte[] blobData = Convert.FromBase64String(lo9Doc);
                parameter[3] = new OracleParameter("p_lo9_doc", OracleDbType.Blob) { Direction = ParameterDirection.Input, Value = blobData };
            }
            catch (FormatException ex)
            {
                throw new ArgumentException("Failed to convert Lo9Doc to binary: " + ex.Message);
            }

            parameter[4] = new OracleParameter("p_lo9_ex", OracleDbType.Varchar2) { Direction = ParameterDirection.Input, Value = lo9Ex };

            try
            {
                parameter[5] = new OracleParameter("p_rec_doc", OracleDbType.Blob) { Direction = ParameterDirection.Input, Value = string.IsNullOrEmpty(RecDoc) ? DBNull.Value : Convert.FromBase64String(RecDoc) };

            }
            catch (FormatException ex)
            {
                throw new ArgumentException("RecDoc is not valid Base64: " + ex.Message);
            }

            parameter[6] = new OracleParameter("p_rec_ex", OracleDbType.Varchar2) { Direction = ParameterDirection.Input, Value = RecEx };

            try
            {
                parameter[7] = new OracleParameter("p_draft_doc", OracleDbType.Blob) { Direction = ParameterDirection.Input, Value = string.IsNullOrEmpty(DraftDoc) ? DBNull.Value : Convert.FromBase64String(DraftDoc) };

            }
            catch (FormatException ex)
            {
                throw new ArgumentException("Failed to convert Lo9Doc to binary: " + ex.Message);
            }
            parameter[8] = new OracleParameter("p_draft_ex", OracleDbType.Varchar2) { Direction = ParameterDirection.Input, Value = DraftEx };


            parameter[9] = new OracleParameter("emp_id", OracleDbType.Varchar2) { Direction = ParameterDirection.Input, Value = emp_id };
            parameter[10] = new OracleParameter("err_sts", OracleDbType.Varchar2) { Direction = ParameterDirection.Output, Size = 100 };
            parameter[11] = new OracleParameter("err_code", OracleDbType.Varchar2) { Direction = ParameterDirection.Output, Size = 1000 };

            parameter[12] = new OracleParameter("out_result", OracleDbType.RefCursor) { Direction = ParameterDirection.Output };

            DataSet Result = new OracleHelper().ExecuteDataSet("SeizedUpdate", parameter);

            var resultList = new List<Dictionary<string, object>>();
            foreach (DataTable table in Result.Tables)
            {
                foreach (DataRow row in table.Rows)
                {
                    var rowDictionary = new Dictionary<string, object>();
                    foreach (DataColumn column in table.Columns)
                    {
                        rowDictionary[column.ColumnName] = row[column];
                    }
                    resultList.Add(rowDictionary);
                }
            }

            response.outdata = JsonConvert.SerializeObject(new { Table = resultList });

            // ✅ Properly retrieving error status and code from output parameters
            response.err_code = parameter[11].Value?.ToString() ?? "0";
            response.err_sts = parameter[10].Value?.ToString() ?? "0";

            return response;
        }
        public static string ClassSubmit(string flag, string indata)
        {
            try
            {
                OracleParameter[] parameter = new OracleParameter[3];

                parameter[0] = new OracleParameter("datastr", OracleDbType.Varchar2)
                {
                    Direction = ParameterDirection.Input,
                    Value = indata
                };

                parameter[1] = new OracleParameter("ch", OracleDbType.Varchar2)
                {
                    Direction = ParameterDirection.Input,
                    Value = flag
                };

                parameter[2] = new OracleParameter("msg", OracleDbType.Varchar2)
                {
                    Direction = ParameterDirection.Output,
                    Size = 1000
                };


                new OracleHelper().ExecuteNonQuery("GOLDSPURIOUS_UPDATE_NEW", parameter);


                return parameter[2].Value?.ToString() ?? "";
            }
            catch (Exception ex)
            {

                return ex.Message;
            }
        }
        public static string SettleAmount(string loanNo, string auctionDate = null)
        {
            try
            {
                DateTime date = DateTime.Now;

                // Format as MM/dd/yyyy
                //string auctionDate1 = now.ToString("MM/dd/yyyy");
                string auctionDate1 = date.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture);
                OracleParameter[] parameters = InitializeParameters(loanNo, auctionDate1);
                new OracleHelper().ExecuteNonQuery("PLEDGE_INT_CALCULATOR_TEST", parameters);

                // Extract and convert required output parameters to decimal
                decimal totAmt = ConvertToDecimal(parameters[4].Value, "TOTAMT");
                decimal post = ConvertToDecimal(parameters[8].Value, "POST");
                decimal balance = ConvertToDecimal(parameters[16].Value, "BALANCE");

                // Calculate the sum
                decimal total = totAmt + post + balance;

                // Construct result string with all output parameters
                string result = $"{parameters[4].Value}@" + // TOTAMT
                               $"{parameters[5].Value}@" + // INTAMT
                               $"{parameters[6].Value}@" + // SERAMT
                               $"{parameters[7].Value}@" + // APPAMT
                               $"{parameters[8].Value}@" + // POST
                               $"{parameters[9].Value}@" + // INTDT
                               $"{parameters[10].Value}@" + // CLSDT
                               $"{parameters[11].Value}@" + // PLGDT
                               $"{parameters[12].Value}@" + // DUEDT
                               $"{parameters[13].Value}@" + // TENDT
                               $"{parameters[14].Value}@" + // DAYS
                               $"{parameters[15].Value}@" + // INTRT
                               $"{parameters[16].Value}@" + // BALANCE
                               $"{parameters[17].Value}@" + // PLGAMT
                               $"{parameters[18].Value}@" + // CUSNAME
                               $"{parameters[19].Value}@" + // SCHEME
                               $"{parameters[20].Value}@" + // FORMCHG
                               $"{parameters[21].Value}@" + // PERIOD
                               $"{parameters[22].Value}@" + // CUS_ID
                               $"{parameters[24].Value}@" + // IntWaive
                               $"{parameters[25].Value}@" + // rebate
                               $"{parameters[26].Value}";   // oth

                return $"{total}";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }
        private static OracleParameter[] InitializeParameters(string loanNo, string auctionDate1)
        {
            OracleParameter[] parameters = new OracleParameter[27];

            // Input Parameters
            parameters[0] = new OracleParameter("PLGNO", OracleDbType.Varchar2, 164) { Value = loanNo, Direction = ParameterDirection.Input };
            parameters[1] = new OracleParameter("INAMT", OracleDbType.Double) { Value = 0, Direction = ParameterDirection.Input };
            parameters[2] = new OracleParameter("TCURRAMT", OracleDbType.Double) { Value = 0, Direction = ParameterDirection.Input };
            parameters[3] = new OracleParameter("RCURRAMT", OracleDbType.Double) { Value = 0, Direction = ParameterDirection.Input };
            parameters[23] = new OracleParameter("Auction_Date", OracleDbType.Date)
            {
                Value = auctionDate1,
                Direction = ParameterDirection.Input
            };

            // Output Parameters
            parameters[4] = new OracleParameter("TOTAMT", OracleDbType.Double) { Direction = ParameterDirection.Output };
            parameters[5] = new OracleParameter("INTAMT", OracleDbType.Double) { Direction = ParameterDirection.Output };
            parameters[6] = new OracleParameter("SERAMT", OracleDbType.Double) { Direction = ParameterDirection.Output };
            parameters[7] = new OracleParameter("APPAMT", OracleDbType.Double) { Direction = ParameterDirection.Output };
            parameters[8] = new OracleParameter("POST", OracleDbType.Double) { Direction = ParameterDirection.Output };
            parameters[9] = new OracleParameter("INTDT", OracleDbType.Varchar2, 11) { Direction = ParameterDirection.Output };
            parameters[10] = new OracleParameter("CLSDT", OracleDbType.Date) { Direction = ParameterDirection.Output };
            parameters[11] = new OracleParameter("PLGDT", OracleDbType.Date) { Direction = ParameterDirection.Output };
            parameters[12] = new OracleParameter("DUEDT", OracleDbType.Date) { Direction = ParameterDirection.Output };
            parameters[13] = new OracleParameter("TENDT", OracleDbType.Date) { Direction = ParameterDirection.Output };
            parameters[14] = new OracleParameter("DAYS", OracleDbType.Int64) { Direction = ParameterDirection.Output };
            parameters[15] = new OracleParameter("INTRT", OracleDbType.Double) { Direction = ParameterDirection.Output };
            parameters[16] = new OracleParameter("BALANCE", OracleDbType.Double) { Direction = ParameterDirection.Output };
            parameters[17] = new OracleParameter("PLGAMT", OracleDbType.Double) { Direction = ParameterDirection.Output };
            parameters[18] = new OracleParameter("CUSNAME", OracleDbType.Varchar2, 60) { Direction = ParameterDirection.Output };
            parameters[19] = new OracleParameter("SCHEME", OracleDbType.Varchar2, 10) { Direction = ParameterDirection.Output };
            parameters[20] = new OracleParameter("FORMCHG", OracleDbType.Int64) { Direction = ParameterDirection.Output };
            parameters[21] = new OracleParameter("PERIOD", OracleDbType.Int64) { Direction = ParameterDirection.Output };
            parameters[22] = new OracleParameter("CUS_ID", OracleDbType.Varchar2, 20) { Direction = ParameterDirection.Output };
            parameters[24] = new OracleParameter("IntWaive", OracleDbType.Double) { Direction = ParameterDirection.Output };
            parameters[25] = new OracleParameter("rebate", OracleDbType.Double) { Direction = ParameterDirection.Output };
            parameters[26] = new OracleParameter("oth", OracleDbType.Double) { Direction = ParameterDirection.Output };

            return parameters;
        }

        public static decimal ConvertToDecimal(object value, string paramName)
        {
            if (value == null || value == DBNull.Value)
            {
                throw new InvalidOperationException($"Parameter {paramName} is null or DBNull, which is not allowed as per requirement.");
            }

            switch (value)
            {
                case OracleDecimal oracleDecimal:
                    // Use Value property for OracleDecimal, which returns a decimal
                    return oracleDecimal.Value;
                case int intValue:
                    return intValue;
                case long longValue:
                    return longValue;
                case double doubleValue:
                    return (decimal)doubleValue; // Cast double to decimal, beware of potential precision issues
                case decimal decValue:
                    return decValue;
                default:
                    throw new InvalidCastException($"Cannot convert type {value.GetType().FullName} for parameter {paramName} to decimal.");
            }
        }
        public static string SettleSubmit(string loan_no, string EmpId, string remark)
        {
            try
            {
                OracleParameter[] parameter = new OracleParameter[4];

                parameter[0] = new OracleParameter("loanno", OracleDbType.Varchar2)
                {
                    Direction = ParameterDirection.Input,
                    Value = loan_no
                };

                parameter[1] = new OracleParameter("userid", OracleDbType.Varchar2)
                {
                    Direction = ParameterDirection.Input,
                    Value = EmpId
                };

                parameter[2] = new OracleParameter("stlmnt_rmrk", OracleDbType.Varchar2)
                {
                    Direction = ParameterDirection.Input,
                    Value = remark
                };

                parameter[3] = new OracleParameter("err_stat", OracleDbType.Int64)
                {
                    Direction = ParameterDirection.Output,
                    Size = 1
                };


                new OracleHelper().ExecuteNonQuery("pledge_seize_settlement", parameter);


                return parameter[3].Value?.ToString() ?? "";
            }
            catch (Exception ex)
            {

                return ex.Message;
            }
        }
        public static string SettleReject(string loan_no, string remark, string EmpId)
        {
            try
            {
                OracleParameter[] parameter = new OracleParameter[4];

                parameter[0] = new OracleParameter("loanno", OracleDbType.Varchar2)
                {
                    Direction = ParameterDirection.Input,
                    Value = loan_no
                };

                parameter[1] = new OracleParameter("userid", OracleDbType.Varchar2)
                {
                    Direction = ParameterDirection.Input,
                    Value = EmpId
                };

                parameter[2] = new OracleParameter("stlmnt_rmrk", OracleDbType.Varchar2)
                {
                    Direction = ParameterDirection.Input,
                    Value = remark
                };

                parameter[3] = new OracleParameter("err_stat", OracleDbType.Int64)
                {
                    Direction = ParameterDirection.Output,
                    Size = 1
                };


                new OracleHelper().ExecuteNonQuery("pledge_seize_rejection", parameter);


                return parameter[3].Value?.ToString() ?? "";
            }
            catch (Exception ex)
            {

                return ex.Message;
            }
        }


        //---------------Legal Notice start
        public static DataSet LegalRequest(int flag, string LR_data)
        {
            DataSet dS = new DataSet();


            try
            {
                OracleParameter[] parameter = new OracleParameter[5];

                parameter[0] = new OracleParameter("flag", OracleDbType.Int64);
                parameter[0].Direction = ParameterDirection.Input;
                parameter[0].Value = flag;

                parameter[1] = new OracleParameter("indata", OracleDbType.Varchar2);
                parameter[1].Direction = ParameterDirection.Input;
                parameter[1].Value = LR_data;

                parameter[2] = new OracleParameter("out_result", OracleDbType.RefCursor);
                parameter[2].Direction = ParameterDirection.Output;

                parameter[3] = new OracleParameter("Error_status", OracleDbType.Int64);
                parameter[3].Direction = ParameterDirection.Output;

                parameter[4] = new OracleParameter("Error_msg", OracleDbType.Varchar2, 2000);
                parameter[4].Direction = ParameterDirection.Output;

                dS = new OracleHelper().ExecuteDataSet("Proc_new_RIIM_Legal_Details", parameter);
            }
            catch (Exception ex)
            {
                dS = null;
            }

            return dS;
        }

        public static DataSet Report(int flag, string LR_data)
        {
            DataSet dS = new DataSet();

            ReportResponse response = new ReportResponse();
            try
            {
                OracleParameter[] parameter = new OracleParameter[5];

                parameter[0] = new OracleParameter("flag", OracleDbType.Int64);
                parameter[0].Direction = ParameterDirection.Input;
                parameter[0].Value = flag;

                parameter[1] = new OracleParameter("indata", OracleDbType.Varchar2);
                parameter[1].Direction = ParameterDirection.Input;
                parameter[1].Value = LR_data;

                parameter[2] = new OracleParameter("out_result", OracleDbType.RefCursor);
                parameter[2].Direction = ParameterDirection.Output;

                parameter[3] = new OracleParameter("Error_status", OracleDbType.Int64);
                parameter[3].Direction = ParameterDirection.Output;

                parameter[4] = new OracleParameter("Error_msg", OracleDbType.Varchar2, 2000);
                parameter[4].Direction = ParameterDirection.Output;

                dS = new OracleHelper().ExecuteDataSet("Proc_new_Riim_Report", parameter);
                response.status = parameter[3].Value?.ToString();
            }
            catch (Exception ex)
            {
                dS = null;

            }

            return dS;
        }
	

	 public static ChequeCollectionResponse ChequeCollection(int flag, string indata)
 {
     ChequeCollectionResponse response = new ChequeCollectionResponse();
     OracleParameter[] parameter = new OracleParameter[4];


     parameter[0] = new OracleParameter("p_flag", OracleDbType.Int16);
     parameter[0].Direction = ParameterDirection.Input;
     parameter[0].Value = flag;

     parameter[1] = new OracleParameter("data", OracleDbType.Varchar2);
     parameter[1].Direction = ParameterDirection.Input;
     parameter[1].Value = indata;

     parameter[2] = new OracleParameter("Error_status", OracleDbType.Int64);
     parameter[2].Direction = ParameterDirection.Output;

     parameter[3] = new OracleParameter(" qry_result ", OracleDbType.RefCursor);
     parameter[3].Direction = ParameterDirection.Output;





     DataSet Result = new DataSet();
     Result = new OracleHelper().ExecuteDataSet("proc_new_irregularity_recovery", parameter);
     //string dtJson = JsonConvert.SerializeObject(Result);
     //response.outdata = Uri.EscapeDataString(dtJson).ToString();

     var resultList = new List<Dictionary<string, object>>();
     foreach (DataTable table in Result.Tables)
     {
         foreach (DataRow row in table.Rows)
         {
             var rowDictionary = new Dictionary<string, object>();
             foreach (DataColumn column in table.Columns)
             {
                 rowDictionary[column.ColumnName] = row[column];
             }
             resultList.Add(rowDictionary);
         }
     }

            response.outdata = JsonConvert.SerializeObject(new { Table = resultList });
            response.status = parameter[2].Value?.ToString() ?? "-1";



     return response;


 }

 public static DataSet ChequeCollection_imgdownload(int flag, string indata)
 {
     ChequeCollectionResponse response = new ChequeCollectionResponse();
     OracleParameter[] parameter = new OracleParameter[4];
     DataSet ds = new DataSet();
     try
     {

         parameter[0] = new OracleParameter("p_flag", OracleDbType.Int16);
         parameter[0].Direction = ParameterDirection.Input;
         parameter[0].Value = flag;

         parameter[1] = new OracleParameter("data", OracleDbType.Varchar2);
         parameter[1].Direction = ParameterDirection.Input;
         parameter[1].Value = indata;

         parameter[2] = new OracleParameter("Error_status", OracleDbType.Int64);
         parameter[2].Direction = ParameterDirection.Output;

         parameter[3] = new OracleParameter(" qry_result ", OracleDbType.RefCursor);
         parameter[3].Direction = ParameterDirection.Output;


         


         
         ds = new OracleHelper().ExecuteDataSet("proc_new_irregularity_recovery", parameter);
         
     }
     catch (Exception ex)
     {
        ds = null;
         
     }

     return ds;

 }

        public static LegalRecoveryDeatailsResponse proc_recoverycall_select(string as_optflag, string p_indata)
        {
            LegalRecoveryDeatailsResponse response = new LegalRecoveryDeatailsResponse();
            OracleParameter[] parameter = new OracleParameter[5];
            parameter[0] = new OracleParameter("as_optflag", OracleDbType.Varchar2);
            parameter[0].Direction = ParameterDirection.Input;
            parameter[0].Value = as_optflag;
            parameter[1] = new OracleParameter("p_indata", OracleDbType.Varchar2);
            parameter[1].Direction = ParameterDirection.Input;
            parameter[1].Value = p_indata;
            parameter[2] = new OracleParameter("err_sts", OracleDbType.Varchar2);
            parameter[2].Direction = ParameterDirection.Output;
            parameter[2].Size = 100;
            parameter[3] = new OracleParameter("err_code", OracleDbType.Varchar2);
            parameter[3].Direction = ParameterDirection.Output;
            parameter[3].Size = 1000;
            parameter[4] = new OracleParameter("as_outresult", OracleDbType.RefCursor);
            parameter[4].Direction = ParameterDirection.Output;

            DataSet Result = new DataSet();
            Result = new OracleHelper().ExecuteDataSet("proc_recoverycall_select", parameter);
            //string dtJson = JsonConvert.SerializeObject(Result);
            //response.outdata = Uri.EscapeDataString(dtJson).ToString();

            var resultList = new List<Dictionary<string, object>>();
            foreach (DataTable table in Result.Tables)
            {
                foreach (DataRow row in table.Rows)
                {
                    var rowDictionary = new Dictionary<string, object>();
                    foreach (DataColumn column in table.Columns)
                    {
                        rowDictionary[column.ColumnName] = row[column];
                    }
                    resultList.Add(rowDictionary);
                }
            }

            response.outdata = JsonConvert.SerializeObject(new { Table = resultList }); // Proper JSON formatting
                                                                                        //response.outdata = dtJson; // Store JSON directly without URL encoding

            response.err_code = parameter[3].Value.ToString();
            response.err_sts = parameter[2].Value.ToString();

            return response;

        }

        public static LegalRecoveryDeatailsResponse PROC_RECOVERY_EMPLOYEE_CONFIRM_NEW(string as_optflag, string p_indata)
        {
            try
            {
                LegalRecoveryDeatailsResponse response = new LegalRecoveryDeatailsResponse();
                OracleParameter[] parameter = new OracleParameter[4];
                parameter[0] = new OracleParameter("indata", OracleDbType.Varchar2);
                parameter[0].Direction = ParameterDirection.Input;
                parameter[0].Value = p_indata;
                parameter[1] = new OracleParameter("flag", OracleDbType.Int64);
                parameter[1].Direction = ParameterDirection.Input;
                parameter[1].Value = as_optflag;
                parameter[2] = new OracleParameter("query_result", OracleDbType.RefCursor);
                parameter[2].Direction = ParameterDirection.Output;
                parameter[3] = new OracleParameter("error_status", OracleDbType.Int64);
                parameter[3].Direction = ParameterDirection.Output;
                parameter[3].Size = 100;


                DataSet Result = new DataSet();
                Result = new OracleHelper().ExecuteDataSet("PROC_RECOVERY_EMPLOYEE_CONFIRM_NEW", parameter);
                //string dtJson = JsonConvert.SerializeObject(Result);
                //response.outdata = Uri.EscapeDataString(dtJson).ToString();

                var resultList = new List<Dictionary<string, object>>();
                foreach (DataTable table in Result.Tables)
                {
                    foreach (DataRow row in table.Rows)
                    {
                        var rowDictionary = new Dictionary<string, object>();
                        foreach (DataColumn column in table.Columns)
                        {
                            rowDictionary[column.ColumnName] = row[column];
                        }
                        resultList.Add(rowDictionary);
                    }
                }

                response.outdata = JsonConvert.SerializeObject(new { Table = resultList }); // Proper JSON formatting
                response.err_sts = parameter[3].Value.ToString();
                response.err_code = "";
                return response;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Cust_recom_det: " + ex.Message);
            }
        }

        public static SeizedPledgesResponse legal_rate_limit(string indata, int flag)
        {
            SeizedPledgesResponse response = new SeizedPledgesResponse();
            OracleParameter[] parameter = new OracleParameter[5];

            parameter[0] = new OracleParameter("indata", OracleDbType.Varchar2);
            parameter[0].Direction = ParameterDirection.Input;
            parameter[0].Value = indata;

            parameter[1] = new OracleParameter("flag", OracleDbType.Int64);
            parameter[1].Direction = ParameterDirection.Input;
            parameter[1].Value = flag;

            parameter[2] = new OracleParameter("errorstat", OracleDbType.Int64);
            parameter[2].Direction = ParameterDirection.Output;
            parameter[2].Size = 100;

            parameter[3] = new OracleParameter("errormsg", OracleDbType.Varchar2);
            parameter[3].Direction = ParameterDirection.Output;
            parameter[3].Size = 1000;

            parameter[4] = new OracleParameter(" as_outresult ", OracleDbType.RefCursor);
            parameter[4].Direction = ParameterDirection.Output;


            DataSet Result = new DataSet();
            Result = new OracleHelper().ExecuteDataSet("proc_Legal_ratelimit", parameter);
            //string dtJson = JsonConvert.SerializeObject(Result);
            //response.outdata = Uri.EscapeDataString(dtJson).ToString();

            var resultList = new List<Dictionary<string, object>>();
            foreach (DataTable table in Result.Tables)
            {
                foreach (DataRow row in table.Rows)
                {
                    var rowDictionary = new Dictionary<string, object>();
                    foreach (DataColumn column in table.Columns)
                    {
                        rowDictionary[column.ColumnName] = row[column];
                    }
                    resultList.Add(rowDictionary);
                }
            }

            response.outdata = JsonConvert.SerializeObject(new { Table = resultList });


            response.err_code = parameter[3].Value.ToString();
            response.err_sts = parameter[2].Value.ToString();

            return response;


        }

        public static irregularitycallResponse PROC_IRREGULARITYCALL_SELECT(string as_optflag, string p_indata)
        {
            irregularitycallResponse response = new irregularitycallResponse();
            OracleParameter[] parameter = new OracleParameter[5];
            parameter[0] = new OracleParameter("as_optflag", OracleDbType.Varchar2);
            parameter[0].Direction = ParameterDirection.Input;
            parameter[0].Value = as_optflag;
            parameter[1] = new OracleParameter("p_indata", OracleDbType.Varchar2);
            parameter[1].Direction = ParameterDirection.Input;
            parameter[1].Value = p_indata;
            parameter[2] = new OracleParameter("err_sts", OracleDbType.Varchar2);
            parameter[2].Direction = ParameterDirection.Output;
            parameter[2].Size = 100;
            parameter[3] = new OracleParameter("err_code", OracleDbType.Varchar2);
            parameter[3].Direction = ParameterDirection.Output;
            parameter[3].Size = 1000;
            parameter[4] = new OracleParameter("as_outresult", OracleDbType.RefCursor);
            parameter[4].Direction = ParameterDirection.Output;

            DataSet Result = new DataSet();
            Result = new OracleHelper().ExecuteDataSet("proc_IrregularityCall_select", parameter);

            var resultList = new List<Dictionary<string, object>>();

            foreach (DataTable table in Result.Tables)
            {
                foreach (DataRow row in table.Rows)
                {
                    var rowDictionary = new Dictionary<string, object>();
                    foreach (DataColumn column in table.Columns)
                    {
                        rowDictionary[column.ColumnName] = row[column];
                    }
                    resultList.Add(rowDictionary);
                }
            }

            response.outdata = JsonConvert.SerializeObject(new { Table = resultList });
            response.err_code = parameter[3].Value.ToString();
            response.err_sts = parameter[2].Value.ToString();

            return response;

        }

        public static irregularitycallResponse PROC_IRR_RECOVERY_CONFIRM(string as_optflag, string p_indata)
        {
            try
            {
                string[] parts = p_indata.Split('|');

                string inputData = parts.Length > 0 ? parts[0] : string.Empty;
                string homeData = parts.Length > 1 ? parts[1] : string.Empty;
                string fileData1 = parts.Length > 1 ? parts[2] : string.Empty;
                string fileData2 = parts.Length > 1 ? parts[3] : string.Empty;
                string employee = parts.Length > 1 ? parts[4] : string.Empty;
                string branch = parts.Length > 1 ? parts[5] : string.Empty;
                //string[] inputFields = inputData.Split('*');
                string visitdata = inputData += "*" + employee + "*" + branch;

                byte[] outdata1 = null;
                byte[] outdata2 = null;
                outdata1 = Convert.FromBase64String(fileData1);
                outdata2 = Convert.FromBase64String(fileData2);
                irregularitycallResponse response = new irregularitycallResponse();
                OracleParameter[] PR = new OracleParameter[7];

                PR[0] = new OracleParameter("indata", OracleDbType.Varchar2);
                PR[0].Size = 20000;
                PR[0].Value = string.IsNullOrEmpty(visitdata) ? DBNull.Value : visitdata;

                PR[1] = new OracleParameter("homedata", OracleDbType.Varchar2);
                PR[1].Size = 1500;
                PR[1].Value = string.IsNullOrWhiteSpace(homeData) ? DBNull.Value : homeData;

                PR[2] = new OracleParameter("P_Doc1_V", OracleDbType.Blob);
                PR[2].Size = outdata1 != null ? outdata1.Length : 0;
                PR[2].Value = outdata1 != null ? outdata1 : DBNull.Value;

                PR[3] = new OracleParameter("P_Doc2_V", OracleDbType.Blob);
                PR[3].Size = outdata2 != null ? outdata2.Length : 0;
                PR[3].Value = outdata2 != null ? outdata2 : DBNull.Value;

                PR[4] = new OracleParameter("flag", OracleDbType.Int64);
                PR[4].Size = 10;
                PR[4].Value = Convert.ToInt32(as_optflag);

                PR[5] = new OracleParameter("err_sts", OracleDbType.Varchar2);
                PR[5].Size = 50;
                PR[5].Direction = ParameterDirection.Output;

                PR[6] = new OracleParameter("err_msg", OracleDbType.Varchar2);
                PR[6].Size = 50;
                PR[6].Direction = ParameterDirection.Output;

                new OracleHelper().ExecuteNonQuery("PROC_IRR_RECOVERY_CONFIRM", PR);
                response.outdata = null;
                response.err_code = PR[5].Value.ToString();
                response.err_sts = PR[6].Value.ToString();

                return response;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Cust_recom_det: " + ex.Message);
            }
        }

        public static LegalFIRResponse LegalFIRPolice(string flag, string indata)
        {
            LegalFIRResponse response = new LegalFIRResponse();
            OracleParameter[] parameter = new OracleParameter[3];


            parameter[0] = new OracleParameter("flag", OracleDbType.Varchar2);
            parameter[0].Direction = ParameterDirection.Input;
            parameter[0].Value = flag;

            parameter[1] = new OracleParameter("indata", OracleDbType.Varchar2);
            parameter[1].Direction = ParameterDirection.Input;
            parameter[1].Value = indata;

            parameter[2] = new OracleParameter("query_result", OracleDbType.RefCursor);
            parameter[2].Direction = ParameterDirection.Output;


            DataSet Result = new DataSet();
            Result = new OracleHelper().ExecuteDataSet("PROC_FIRCASE_POLICE_FILING_NEW", parameter);


            var resultList = new List<Dictionary<string, object>>();
            foreach (DataTable table in Result.Tables)
            {
                foreach (DataRow row in table.Rows)
                {
                    var rowDictionary = new Dictionary<string, object>();
                    foreach (DataColumn column in table.Columns)
                    {
                        rowDictionary[column.ColumnName] = row[column];
                    }
                    resultList.Add(rowDictionary);
                }
            }

            response.Query_result = JsonConvert.SerializeObject(new { Table = resultList });


            return response;


        }

        public static LegalFIRResponse LegalFIRDOC(string flag, string img, string indata)
        {
            LegalFIRResponse response = new LegalFIRResponse();
            byte[] outdata1 = Convert.FromBase64String(img);
            OracleParameter[] parameter = new OracleParameter[4];


            parameter[0] = new OracleParameter("flag", OracleDbType.Varchar2);
            parameter[0].Direction = ParameterDirection.Input;
            parameter[0].Value = flag;

            parameter[1] = new OracleParameter("data1", OracleDbType.Varchar2);
            parameter[1].Direction = ParameterDirection.Input;
            parameter[1].Value = indata;
            parameter[2] = new OracleParameter("img", OracleDbType.Blob);
            parameter[2].Direction = ParameterDirection.Input;
            parameter[2].Value = outdata1;

            parameter[3] = new OracleParameter("as_outresult1", OracleDbType.RefCursor);
            parameter[3].Direction = ParameterDirection.Output;


            DataSet Result = new DataSet();
            Result = new OracleHelper().ExecuteDataSet("proc_FIR_Complaints_doc", parameter);


            var resultList = new List<Dictionary<string, object>>();
            foreach (DataTable table in Result.Tables)
            {
                foreach (DataRow row in table.Rows)
                {
                    var rowDictionary = new Dictionary<string, object>();
                    foreach (DataColumn column in table.Columns)
                    {
                        rowDictionary[column.ColumnName] = row[column];
                    }
                    resultList.Add(rowDictionary);
                }
            }

            response.Query_result = JsonConvert.SerializeObject(new { Table = resultList });


            return response;


        }


        public static PropertyIdentityResponse proc_property_identification(string as_optflag, string p_indata, string doc1, string doc2)
        {
            try
            {

                byte[] outdata1 = null;
                byte[] outdata2 = null;
                outdata1 = Convert.FromBase64String(doc1);
                outdata2 = Convert.FromBase64String(doc2);

                PropertyIdentityResponse response = new PropertyIdentityResponse();
                OracleParameter[] parameter = new OracleParameter[7];
                parameter[0] = new OracleParameter("P_Indata", OracleDbType.Varchar2);
                parameter[0].Direction = ParameterDirection.Input;
                parameter[0].Value = p_indata;
                parameter[1] = new OracleParameter("P_Flag", OracleDbType.Int64);
                parameter[1].Direction = ParameterDirection.Input;
                parameter[1].Value = as_optflag;
                parameter[2] = new OracleParameter("P_Doc1_V", OracleDbType.Blob);
                parameter[2].Direction = ParameterDirection.Input;
                parameter[2].Size = outdata1 != null ? outdata1.Length : 0;
                parameter[2].Value = outdata1 != null ? outdata1 : DBNull.Value; ;
                parameter[3] = new OracleParameter("P_Doc2_V", OracleDbType.Blob);
                parameter[3].Direction = ParameterDirection.Input;
                parameter[3].Size = outdata2 != null ? outdata2.Length : 0;
                parameter[3].Value = outdata2 != null ? outdata2 : DBNull.Value; ;
                parameter[4] = new OracleParameter("qry_result", OracleDbType.RefCursor);
                parameter[4].Direction = ParameterDirection.Output;
                parameter[5] = new OracleParameter("p_Error_sts", OracleDbType.Int64);
                parameter[5].Direction = ParameterDirection.Output;
                parameter[5].Size = 100;
                parameter[6] = new OracleParameter("P_Error_msg", OracleDbType.Varchar2);
                parameter[6].Direction = ParameterDirection.Output;
                parameter[6].Size = 100;


                DataSet Result = new DataSet();
                Result = new OracleHelper().ExecuteDataSet("proc_property_identification", parameter);
                //string dtJson = JsonConvert.SerializeObject(Result);
                //response.outdata = Uri.EscapeDataString(dtJson).ToString();

                var resultList = new List<Dictionary<string, object>>();
                foreach (DataTable table in Result.Tables)
                {
                    foreach (DataRow row in table.Rows)
                    {
                        var rowDictionary = new Dictionary<string, object>();
                        foreach (DataColumn column in table.Columns)
                        {
                            rowDictionary[column.ColumnName] = row[column];
                        }
                        resultList.Add(rowDictionary);
                    }
                }

                response.outdata = JsonConvert.SerializeObject(new { Table = resultList }); // Proper JSON formatting
                response.err_sts = parameter[5].Value.ToString();
                response.err_code = parameter[6].Value.ToString();
                return response;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Cust_recom_det: " + ex.Message);
            }
        }

        public static legalalertResponse proc_legal_workalert(string p_indata)
        {
            try
            {

                legalalertResponse response = new legalalertResponse();
                OracleParameter[] parameter = new OracleParameter[4];
                parameter[0] = new OracleParameter("P_Indata", OracleDbType.Varchar2);
                parameter[0].Direction = ParameterDirection.Input;
                parameter[0].Value = p_indata;
                parameter[1] = new OracleParameter("p_alerts_cursor", OracleDbType.RefCursor);
                parameter[1].Direction = ParameterDirection.Output;
                parameter[2] = new OracleParameter("p_Error_sts", OracleDbType.Int64);
                parameter[2].Direction = ParameterDirection.Output;
                parameter[2].Size = 100;
                parameter[3] = new OracleParameter("P_Error_msg", OracleDbType.Varchar2);
                parameter[3].Direction = ParameterDirection.Output;
                parameter[3].Size = 100;


                DataSet Result = new DataSet();
                Result = new OracleHelper().ExecuteDataSet("proc_legal_workalert", parameter);

                var resultList = new List<Dictionary<string, object>>();
                foreach (DataTable table in Result.Tables)
                {
                    foreach (DataRow row in table.Rows)
                    {
                        var rowDictionary = new Dictionary<string, object>();
                        foreach (DataColumn column in table.Columns)
                        {
                            rowDictionary[column.ColumnName] = row[column];
                        }
                        resultList.Add(rowDictionary);
                    }
                }

                response.outdata = JsonConvert.SerializeObject(new { Table = resultList }); // Proper JSON formatting
                response.err_sts = parameter[2].Value.ToString();
                response.err_code = parameter[3].Value.ToString();
                return response;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Cust_recom_det: " + ex.Message);
            }
        }

        public static EmpanelmentResponse Proc_Advocate_Empanelment(int flag, string indata, string indata1, string img)
        {
            try
            {
                // Convert base64 image string to byte array (if provided)
                byte[] outdata1 = string.IsNullOrEmpty(img) ? null : Convert.FromBase64String(img);

                EmpanelmentResponse response = new EmpanelmentResponse();

                OracleParameter[] parameter = new OracleParameter[7];

                parameter[0] = new OracleParameter("flag", OracleDbType.Int32)
                {
                    Direction = ParameterDirection.Input,
                    Value = flag
                };

                parameter[1] = new OracleParameter("indata", OracleDbType.Varchar2)
                {
                    Direction = ParameterDirection.Input,
                    Value = indata ?? (object)DBNull.Value
                };

                parameter[2] = new OracleParameter("indata1", OracleDbType.Varchar2)
                {
                    Direction = ParameterDirection.Input,
                    Value = indata1 ?? (object)DBNull.Value
                };

                parameter[3] = new OracleParameter("img", OracleDbType.Blob)
                {
                    Direction = ParameterDirection.Input,
                    Value = outdata1 ?? (object)DBNull.Value
                };

                parameter[4] = new OracleParameter("out_result", OracleDbType.RefCursor)
                {
                    Direction = ParameterDirection.Output
                };

                parameter[5] = new OracleParameter("Error_status", OracleDbType.Int32)
                {
                    Direction = ParameterDirection.Output
                };

                parameter[6] = new OracleParameter("Error_msg", OracleDbType.Varchar2, 100)
                {
                    Direction = ParameterDirection.Output
                };

                // Execute stored procedure
                DataSet result = new OracleHelper().ExecuteDataSet("PROC_RIIM_ADVOCATE_NEW", parameter);

                // Convert DataSet to List<Dictionary<string, object>>
                var resultList = new List<Dictionary<string, object>>();
                foreach (DataTable table in result.Tables)
                {
                    foreach (DataRow row in table.Rows)
                    {
                        var rowDictionary = new Dictionary<string, object>();
                        foreach (DataColumn column in table.Columns)
                        {
                            rowDictionary[column.ColumnName] = row[column];
                        }
                        resultList.Add(rowDictionary);
                    }
                }

                // Serialize to JSON
                response.out_result = JsonConvert.SerializeObject(new { Table = resultList });


                // Safe conversion from OracleDecimal to int
                if (parameter[5].Value == DBNull.Value)
                {
                    response.Error_status = 0;
                }
                else
                {
                    response.Error_status = ((OracleDecimal)parameter[5].Value).ToInt32();
                }


                response.Error_msg = parameter[6].Value?.ToString();

                return response;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Proc_Advocate_Empanelment failed: " + ex.Message, ex);
            }
        }



    }
}
