using API.Handler;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.LegalNotice.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System.Security;
using System.Text.Json;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;

namespace AsirvadLegalModule.Controllers.GoldSuitFIle
{
    public class SuitFileClassifyController : Controller
    {
        PrivateAPIManager privateAPI;
        public SuitFileClassifyController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult SuitFileClassify()
        {

            return View("~/Views/GoldSuitFIle/SuitFileClassify.cshtml");
        }

        [HttpPost("ComplaintType")]
        public async Task<IActionResult> ComplaintType([FromBody] GetTokenRequest request)
        {
           
            try
            {               
                string Res1 = await privateAPI.PostData("",string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/ComplaintType");
                //string result = await Aes_Handler.Decrypt(Res1);
                return Ok(Res1);
            }
            catch (UnauthorizedAccessException)
            {
                throw new UnauthorizedAccessException("Unauthorized access.");
            }
            catch (Exception ex)
            {
                
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }
        }
        [HttpPost("GetTimeLine")]
        public async Task<IActionResult> GetTimeLine([FromBody] GoldSuitFIleRequest request)
        {
            try
            {
                //request.cmpType = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.cmpType);
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/GetTimeLinetype");
                //string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
            }
            catch (UnauthorizedAccessException)
            {
                throw new UnauthorizedAccessException("Unauthorized access.");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }

        [HttpPost("GetPledgelistCheck")]
        public async Task<IActionResult> GetPledgelistCheck([FromBody] GetPledgeRequset request)
        {

            try
            {
                //request.plno = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.plno);
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData,string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/GetPledgeList");
                //string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
            }
            catch (UnauthorizedAccessException)
            {
                throw new UnauthorizedAccessException("Unauthorized access.");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }

        [HttpPost("GetSuitFileSubmit")]
        public async Task<IActionResult> GetSuitFileSubmit([FromBody] GetSubmitRequset request)
        {

            try
            {


                //request.complaint = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.complaint);
                //request.caseType = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.caseType);
                //request.Complaintval = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Complaintval);
                //request.police = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.police);
                //request.anoBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.anoBranch);
                //request.curBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.curBranch);
                //request.goldInPlace = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.goldInPlace);
                //request.reason = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.reason);
                //request.prevPledge = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.prevPledge);
                //request.goldInBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.goldInBranch);
                //request.pledgeList = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.pledgeList);
                //request.flag1 = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag1);
                //request.rm_cmt = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.rm_cmt);
                //request.doc = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.doc);
                //request.docname = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.docname);
                //request.flag2 = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag2);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData,string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/GetSuitFileSubmit");
                //string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
            }
            catch (UnauthorizedAccessException)
            {
                throw new UnauthorizedAccessException("Unauthorized access.");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }

        [HttpPost("PdfUpload1")]
        public async Task<IActionResult> PdfUpload1([FromBody] GetSuitFileDocumentRequest request)
        {
            
            try
            {
                
                //request.indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.indata);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.empId), "api/GoldSuitFile/PdfUpload1");
                string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
            }
            catch (UnauthorizedAccessException)
            {
                throw new UnauthorizedAccessException("Unauthorized access.");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }

        [HttpPost("GetCurrentBranch")]
        public async Task<IActionResult> GetCurrentBranch([FromBody] GetcurrentbranchRequest request)
        {

            try
            {
                
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";
                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);

                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/GetCurrentBranch");
                //string result = await Aes_Handler.Decrypt(Res1);
                return Ok(Res1);
            }
            catch (UnauthorizedAccessException)
            {
                throw new UnauthorizedAccessException("Unauthorized access.");
            }
            catch (Exception ex)
            {

                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }
        }

        [HttpPost("Suitfile_doc")]
        public async Task<IActionResult> PdfUpload([FromBody] Suitfile_docRequest request)
        {

            try
            {
                //request.flag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag);
                //request.indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.indata);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.empId), "api/GoldSuitFile/Suitfile_doc");
                //string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }
    }
}
