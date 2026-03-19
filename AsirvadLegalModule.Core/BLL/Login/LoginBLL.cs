using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AsirvadLegalModule.DTO.Response;
using AsirvadLegalModule.DTO.Login;
using AsirvadLegalModule.DTO.Login.Response;
using AsirvadLegalModule.DTO.Login.Request;
using AsirvadLegalModule.Core.DataSource.Login;
using AsirvadLegalModule.Utilities;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Text.Json;


namespace AsirvadLegalModule.Core.BLL.Login
{
    public class LoginBLL
    {

        private readonly static Lazy<LoginBLL> m_instance;

        public static LoginBLL Instance
        {
            get
            {
                return LoginBLL.m_instance.Value;
            }
        }

        static LoginBLL()
        {
            LoginBLL.m_instance = new Lazy<LoginBLL>(() => new LoginBLL());

        }
        public LoginResponse LoginEmployeeData(LoginRequest request)
        {
            LoginResponse p_response = new LoginResponse();

            LoginResponse response = new LoginResponse();

            try
            {
                response = new LoginDatasource().LoginEmployeeData(request);

                //if (response.Status == "true")
                //{
                //    response.Token = p_response.Token;
                //    response.Status = p_response.Status;
                //    response.Message = p_response.Message;
                //}
                //else
                //{
                //    response.Token = p_response.Token;
                //    response.Status = p_response.Status;
                //    response.Message = p_response.Message;
                //}

            }
            catch (Exception)
            {
                throw;
            }
            
            return response;
        }

        public async Task<string> GetBranchesData(GetBranchRequest request)
        {
            GetBranchResponse p_response = new GetBranchResponse();

            Response<GetBranchResponse> response = new Response<GetBranchResponse>();

            try
            {
                p_response = new LoginDatasource().GetBranchesData(request);

                if (p_response.isDataAvailable == "true")
                {
                    response.Data = p_response;
                    response.status = ResponseTypeContants.SUCCESS;
                    response.apiStatus = ApiStatusConstants.COMPLETED;
                    response.responseMsg = p_response.message;
                }
                else
                {
                    response.Data = p_response;
                    response.status = ResponseTypeContants.FAIL;
                    response.apiStatus = ApiStatusConstants.COMPLETED;
                    response.responseMsg = p_response.message;
                }

            }
            catch (Exception ex)
            {
                Exception exception = ex;
                response.status = "exception";
                response.responseMsg = "Internal Server Error";
                response.SetExceptionError(ex.Message);


            }
            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
           // return new EncryptedResponseDTO { EncryptedData = encryptedResponse };
        }

        public async Task<string> Logout(LogoutRequest request)
        {

            LogoutResponse response = new LogoutResponse();

            try
            {
                response = new LoginDatasource().Logout(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }
        public async Task<string> checkEmployeeCode(AccesscheckRequest request)
        {

            AccessCheckResponse response = new AccessCheckResponse();

            try
            {
                response = new LoginDatasource().checkEmployeeCode(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }
        public async Task<string> proc_legal_workalert(AccesscheckRequest request)
        {

            string Result;

            try
            {
                Result = new LoginDatasource().proc_legal_workalert(request);

            }
            catch (Exception)
            {
                throw;
            }

            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(Result).Result; // Encrypt the JSON string
            return encryptedResponse;
        }


    }
    }

