using AsirvadLegalModule.DTO.Login.Request;
using AsirvadLegalModule.DTO.Login.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBAccessLibrary;
using Oracle.ManagedDataAccess.Client;
using System.Data;
using System.Collections;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using Newtonsoft.Json;

namespace AsirvadLegalModule.Core.DataSource.Login
{
    public class LoginDatasource
    {
        public LoginResponse LoginEmployeeData(LoginRequest request)
        {
            LoginResponse response = new LoginResponse();
            DataTable dt = new DataTable();
            string emp = request.employeeId;
            try
            {
                OracleParameter[] parameter = new OracleParameter[3];
                parameter[0] = new OracleParameter("P_USERID", OracleDbType.Int32);
                parameter[0].Direction = ParameterDirection.Input;
                parameter[0].Value = request.employeeId;
                parameter[1] = new OracleParameter("P_PASSWORD", OracleDbType.Varchar2);
                parameter[1].Direction = ParameterDirection.Input;
                parameter[1].Value = request.password;
                parameter[2] = new OracleParameter("P_OUT", OracleDbType.Int32, 2);
                parameter[2].Direction = ParameterDirection.Output;
                new OracleHelper().ExecuteNonQuery("PROC_CHECK_USERPASSWORD", parameter);
                string cn = parameter[2].Value.ToString();

                if (cn == "1")
                {
                    string sql = "select e.EMP_NAME,e.post_id from aml_gloan.employee_master e where e.EMP_CODE='" + emp + "'";
                    dt = new OracleHelper().ExecuteDataSet(sql).Tables[0];
                    response.Status = RSA.Encrypt("true");
                    response.Message= RSA.Encrypt("Successfully Logined");
                    response.employeeName = Aes_Handler.Encrypt(dt.Rows[0][0].ToString()).Result;
                    response.post = RSA.Encrypt(dt.Rows[0][1].ToString());

                }
                else if (cn == "2")
                {
                    response.Status = RSA.Encrypt("false");
                    response.Message = RSA.Encrypt("Password will expire soon..");
                    response.employeeName = null;
                    response.post = null;

                }
                else if (cn == "3")
                {
                    response.Status = RSA.Encrypt("false");
                    response.Message = RSA.Encrypt("Password Expired. Please change Password and try again.");
                    response.employeeName = null;
                    response.post = null;

                }
                else if (cn == "4")
                {
                    response.Status = RSA.Encrypt("false");
                    response.Message = RSA.Encrypt("Password Expired. Please change Password and try again.");
                    response.employeeName = null;
                    response.post = null;

                }
                else if (cn == "5")
                {
                    response.Status = RSA.Encrypt("false");
                    response.Message = RSA.Encrypt("You are not punched today!!");
                    response.employeeName = null;
                    response.post = null;

                }
               
                else if (cn=="6")
                {
                    response.Status = RSA.Encrypt("false");
                    response.Message = RSA.Encrypt("Account locked for 15 minutes!!");
                    response.employeeName = null;
                    response.post = null;

                }
                else 
                {
                    response.Status = RSA.Encrypt("false");
                    response.Message = RSA.Encrypt("Please check your username and password.");
                    response.employeeName = null;
                    response.post = null;
                }
                

            }
            catch (Exception)
            {
                throw;
            }
            return response;
        }

        public GetBranchResponse GetBranchesData(GetBranchRequest request)
        {
            GetBranchResponse response = new GetBranchResponse();
            BranchDetails BranchDetails = new BranchDetails();
            DataTable dt = new DataTable();
            DataTable dt1,dt2 = new DataTable();
            string emp = request.employeeId;
            List<BranchDetails> obj = new List<BranchDetails>();
            string typeId = "0";

            dt1 = new OracleHelper().ExecuteDataSet("select count(*) from employee_master e where e.STATUS_ID=1 and e.EMP_CODE= '" + emp + "'").Tables[0];
                if (dt1.Rows.Count >= 1 && Convert.ToInt32(dt1.Rows[0][0]) != 0)
                {
                    string sql = "select e.post_id from aml_gloan.employee_master e where e.EMP_CODE='" + emp + "'";
                     dt2 = new OracleHelper().ExecuteDataSet(sql).Tables[0];
                    string query = string.Empty;
                if (dt2.Rows[0][0].ToString() == "136")
                    {
                         query = "select -1,'--Select Branch--' from dual union all select d.branch_id,d.BRANCH_NAME from branch_detail d where d.area_id in (select t.area_id from branch_detail t where t.BRANCH_ID in (select e.BRANCH_ID from employee_master e where e.EMP_CODE='" + emp + "'))";
                    typeId = "1";
                }
                    else if (dt2.Rows[0][0].ToString() == "199")
                    {
                         query = "select -1,'--Select Branch--' from dual union all select d.branch_id,d.BRANCH_NAME from branch_detail d where d.reg_id in (select t.reg_id from branch_detail t where t.BRANCH_ID in (select e.BRANCH_ID from employee_master e where e.EMP_CODE='" + emp + "'))";
                    typeId = "1";
                }
                    else
                    {
                         query = "select -1, '--Select Branch--' from dual union all select t.branch_id, t.branch_name from branch_detail t, employee_master e where t.branch_id = e.BRANCH_ID  and e.EMP_CODE = '" + emp + "' order by 1";                  
                    }
                dt = new OracleHelper().ExecuteDataSet(query).Tables[0];
                if (dt.Rows.Count > 0)
                    {
                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            BranchDetails branch = new BranchDetails();
                        {
                            branch.BranchId = dt.Rows[i][0].ToString();
                            branch.BranchName = dt.Rows[i][1].ToString();
                        };
                            obj.Add(branch);
                        
                        }
                    }

                    if (obj.Count > 0)
                    {
                        response.isDataAvailable = "true";
                        response.BranchData = obj;
                    response.message = "SUCCESS";
                    response.type_id = typeId;

                    }
                    else
                    {
                    response.isDataAvailable = "false"; 
                    response.BranchData = null; 
                    response.message = "NO DATA FOUND";
                   response.type_id = "5"; 
                }
                   
                }
            return response;
        }

        public LogoutResponse Logout(LogoutRequest request)
        {
            LogoutResponse response = new LogoutResponse();
            string str;
            str = Procedures.Session_check(request.employeeId, request.as_optflag);
            if (str == "1")
            {
                response.status = "True";
                response.message = "Tocken cleared Successfully";
            }
           
            else
            {
                response.status = "False";
                response.message = "Error Occured!..Please try again..";
            }
            return response;
        }
        public AccessCheckResponse checkEmployeeCode(AccesscheckRequest request)
        {
            AccessCheckResponse response = new AccessCheckResponse();

            response = Procedures.proc_legal_access_check(request.employeeId, request.post, request.formId, request.branch);
            if (response.err_code == "1")
            {
                response.status = "True";
                response.message = "Access Approved...";
            }

            else
            {
                response.status = "False";
                response.message = "Access Denied...";
            }
            return response;
        }
        public string proc_legal_workalert(AccesscheckRequest request)
        {
            string employeeId = request.employeeId ?? "";
            string branch = request.branch ?? "0";
            string post = request.post ?? "0";
            string p_indata = $"{employeeId}~{branch}~{post}";

            legalalertResponse response = new legalalertResponse();
            response = Procedures.proc_legal_workalert(p_indata);
            return JsonConvert.SerializeObject(response, Formatting.None);
        }
    }
}