using API.Handler;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using System.Text.Json;
using AsirvadLegalModule.DTO.LegalNotice.Request;

namespace AsirvadLegalModule.Controllers.GoldSuitFIle
{
    public class SuitFileApproveController : Controller
    {
        PrivateAPIManager privateAPI;
        public SuitFileApproveController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult SuitFileApprove()
        {

            return View("~/Views/GoldSuitFIle/SuitFileApprove.cshtml");
        }
        [HttpPost("getPostCheck")]
        public async Task<IActionResult> getPostCheck([FromBody] GetPostRequest request)
        {

            try
            {
               
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/getPostCheck");
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

        [HttpPost("getBranchCheck")]
        public async Task<IActionResult> getBranchCheck([FromBody] GetBranchCheckRequest request)
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
                string Res1 = await privateAPI.PostData(jsonData,string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/getBranchCheck");
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
        [HttpPost("getComplaintCheck")]
        public async Task<IActionResult> getComplaintCheck([FromBody] GetComplaintCheckReq request)
        {

            try
            {

                //request.branch = Encrypt_Decrypt.RSA.Encrypt(request.branch);

                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/GetComplaintCheck");
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
        [HttpPost("GetCaseDetails")]
        public async Task<IActionResult> GetCaseDetails([FromBody] getLegalDetailsRequest request)
        {

            try
            {

                //request.legal = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.legal);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData,string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/GetCaseDetails");
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

        [HttpPost("GetPledgeShowDetail")]
        public async Task<IActionResult> GetPledgeShowDetail([FromBody] getLegalDetailsRequest request)
        {

            try
            {

                //request.legal = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.legal);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/GetPledgeShowDetail");
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
        [HttpPost("GetSuitFileApprove")]
        public async Task<IActionResult> GetSuitFileApprove([FromBody] GetSubmitRequset request)
        {

            try
            {
            //    request.complaint = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.complaint);
            //    request.caseType = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.caseType);
            //    request.Complaintval = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Complaintval);
            //    request.police = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.police);
            //    request.anoBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.anoBranch);
            //    request.curBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.curBranch);
            //    request.goldInPlace = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.goldInPlace);
            //    request.reason = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.reason);
            //    request.prevPledge = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.prevPledge);
            //    request.goldInBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.goldInBranch);
            //    request.pledgeList = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.pledgeList);
            //    request.flag1 = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag1);
            //    request.rm_cmt = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.rm_cmt);
            //    request.doc = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.doc);
            //    request.docname = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.docname);
            //    request.flag2 = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag2);
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/GetSuitFileApprove");
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

        [HttpPost("pdf_view")]
        public async Task<IActionResult> pdf_view([FromBody] Suitfile_docRequest request)
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
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.empId), "api/GoldSuitFile/pdf_view");
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
