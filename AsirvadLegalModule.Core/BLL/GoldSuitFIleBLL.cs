using AsirvadLegalModule.Core.BLL.Login;
using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.Core.DataSource.Login;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.DTO.LegalNotice.Request;
using AsirvadLegalModule.DTO.LegalNotice.Response;
using AsirvadLegalModule.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static AsirvadLegalModule.DTO.GoldSuitFIle.Response.getPledgeListResponse;

namespace AsirvadLegalModule.Core.BLL
{
    public class GoldSuitFIleBLL
    {
        private readonly static Lazy<GoldSuitFIleBLL> m_instance;

        public static GoldSuitFIleBLL Instance
        {
            get
            {
                return GoldSuitFIleBLL.m_instance.Value;
            }
        }

        static GoldSuitFIleBLL()
        {
            GoldSuitFIleBLL.m_instance = new Lazy<GoldSuitFIleBLL>(() => new GoldSuitFIleBLL());

        }
        public async Task<string> SuitClassify()
        {
            GoldSuitFIleResponse response = new GoldSuitFIleResponse();

            try
            {
                response =  new GoldSuitFIleDatasource().SuitClassify(); // Ensure SuitClassify() is async
            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson).Result; // Encrypt the JSON string
            return encryptedResponse;
        }
        public async Task<string> GetCurrentBranch(GetcurrentbranchRequest request)
        {
            GetcurrentbranchResponse response = new GetcurrentbranchResponse();

            try
            {
                response = new GoldSuitFIleDatasource().GetCurrentBranch(request); // Ensure SuitClassify() is async
            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson).Result; // Encrypt the JSON string
            return encryptedResponse;
        }

        //------------------------------------------------------------------------------------------------------------------------
        public async Task<string> GetTimeLinetype(GoldSuitFIleRequest request)
        {
            try
            {
                if (!string.IsNullOrEmpty(request?.cmpType) && request.cmpType.Contains("~"))
                {
                    string[] parts = request.cmpType.Split('~');
                    if (parts.Length > 1 && int.TryParse(parts[1], out int timeline))
                    {
                        return $"{timeline} Days"; 
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }

            return "Invalid cmpType format"; 
        }


        //------------------------------------------------------------------------------------------------------------------------
        public async Task<string> GetPledgeList(GetPledgeRequset request)
        {

           GetPledgeResponse response = new GetPledgeResponse();

            try
            {
                response = new GoldSuitFIleDatasource().GetPledgeList(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }
        //------------------------------------------------------------------------------------------------------------------------
        public async Task<string> GetSuitFileSubmit(GetSubmitRequset request)
        {

            GetSuitfileResponse response = new GetSuitfileResponse();

            try
            {
                response = new GoldSuitFIleDatasource().GetSuitFileSubmit(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }
        //------------------------------------------------------------------------------------------------------------------------
        public async Task<string> getPostCheck(GetPostRequest request)
        {

            GetPostReponse response = new GetPostReponse();

            try
            {
                response = new GoldSuitFIleDatasource().getPostCheck(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }
        //------------------------------------------------------------------------------------------------------------------------
        public async Task<string> GetBranchCheck(GetBranchCheckRequest request)
        {
            GetBranchResponse response = new GetBranchResponse();

            try
            {
                response = new GoldSuitFIleDatasource().GetBranchCheck(request); // Ensure SuitClassify() is async
            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson).Result; // Encrypt the JSON string
            return encryptedResponse;
        }
        //------------------------------------------------------------------------------------------------------------------------
        public async Task<string> GetComplaintCheck(GetComplaintCheckReq request)
        {
            GetComplaintResponse response = new GetComplaintResponse();

            try
            {
                response = new GoldSuitFIleDatasource().GetComplaintCheck(request); // Ensure SuitClassify() is async
            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson).Result; // Encrypt the JSON string
            return encryptedResponse;
        }
        //------------------------------------------------------------------------------------------------------------------------
        public async Task<string> GetCaseDetails(getLegalDetailsRequest request)
        {

            getLegalDetailsResponse response = new getLegalDetailsResponse();

            try
            {
                response = new GoldSuitFIleDatasource().GetCaseDetails(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }
        public async Task<string> GetPledgeShowDetail(getLegalDetailsRequest request)
        {

            getPledgeListResponse response = new getPledgeListResponse();

            try
            {
                response = new GoldSuitFIleDatasource().GetPledgeShowDetail(request);

            }
            catch (Exception)
            {
                throw;
            }

            // Proper JSON serialization using Newtonsoft.Json
            string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(response, new Newtonsoft.Json.JsonSerializerSettings
            {
                Formatting = Newtonsoft.Json.Formatting.None, // Ensures compact JSON format
                StringEscapeHandling = Newtonsoft.Json.StringEscapeHandling.EscapeNonAscii // Handles special characters
            });

            // Encrypt the serialized JSON string
            string encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(jsonString);

            // Return the encrypted result safely
            return (encryptedResponse); // Ensures proper HTTP response formatting

        }
        //------------------------------------------------------------------------------------------------------------------------
        public async Task<string> GetSuitFileApprove(GetSubmitRequset request)
        {

            GetSuitfileResponse response = new GetSuitfileResponse();

            try
            {
                response = new GoldSuitFIleDatasource().GetSuitFileApprove(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }

        public async Task<string> LegalSuitFileSelect(GetSuitFileDeatailsRequset request)
        {
            string Result;

            try
            {
                Result = new GoldSuitFIleDatasource().LegalSuitFileSelect(request); 
            }
            catch (Exception)
            {
                throw;
            }

           // string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(Result).Result; // Encrypt the JSON string
            return encryptedResponse;
        }
        public async Task<string> LegalConfirmDetails(GetSuitFileDeatailsRequset request)
        {

            GetSuitfileResponse response = new GetSuitfileResponse();

            try
            {
                response = new GoldSuitFIleDatasource().LegalConfirmDetails(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }
        public async Task<string> plp_Legal_Select(GetSuitFileDeatailsRequset request)
        {

            string Result;

            try
            {
                Result = new GoldSuitFIleDatasource().plp_Legal_Select(request);
            }
            catch (Exception)
            {
                throw;
            }

            //string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(Result); // Encrypt the JSON string
            return encryptedResponse;
        }

        public async Task<string> PdfUpload1(GetSuitFileDocumentRequest request)
        {

            GetSuitFilepdfResponse response = new GetSuitFilepdfResponse();

            try
            {

                response = new GoldSuitFIleDatasource().PdfUpload1(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }


        public async Task<string> Suitfile_doc(Suitfile_docRequest request)
        {

            Suitfile_docResponse response = new Suitfile_docResponse();

            try
            {

                response = new GoldSuitFIleDatasource().Suitfile_doc(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }

        public async Task<string> pdf_view(Suitfile_docRequest request)
        {

            Suitfile_docResponse response = new Suitfile_docResponse();

            try
            {

                response = new GoldSuitFIleDatasource().Pdf_view(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }


    }
}
