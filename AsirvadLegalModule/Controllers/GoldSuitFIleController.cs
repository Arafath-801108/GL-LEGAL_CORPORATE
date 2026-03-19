//using API.Handler;
//using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
//using AsirvadLegalModule.Utilities;
//using Microsoft.AspNetCore.Mvc;
//using System.Text.Json;
//using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
//namespace AsirvadLegalModule.Controllers
//{
//    public class GoldSuitFIleController : Controller
//    {
//        PrivateAPIManager privateAPI;
//        public GoldSuitFIleController(PrivateAPIManager privateAPI)
//        {
//            this.privateAPI = privateAPI;
//        }
//        public IActionResult Index()
//        {
//            return View();
//        }
//        public IActionResult SuitFileClassify()
//        {

//            return View();
//        }

//        public IActionResult SuitFileApprove()
//        {

//            return View();
//        }

//        [HttpPost("ComplaintType")]
//        public async Task<IActionResult> ComplaintType()
//        {
//            try
//            {

//                string Res1 = await privateAPI.PostData("", " ", "/api/GoldSuitFile/ComplaintType");
//                string result = await Aes_Handler.Decrypt(Res1);
//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new
//                {
//                    responseJSON = ex.Message,
//                });
//            }
//        }
//        [HttpPost("GetTimeLine")]
//        public async Task<IActionResult> GetTimeLine([FromBody] GoldSuitFIleRequest request)
//         {
//                try
//                {
//                request.cmpType = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.cmpType);
//                var options = new JsonSerializerOptions
//                {
//                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
//                    WriteIndented = true
//                };
//                string jsonData = "";

//                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
//                string Res1 = await privateAPI.PostData(jsonData, " ", "/api/GoldSuitFile/GetTimeLinetype");
//                string result= await Aes_Handler.Decrypt(Res1);
                    
//                    return Ok(result);
//                }
//                catch (Exception ex)
//                {
//                    return BadRequest(new
//                    {
//                        responseJSON = ex.Message,
//                    });
//                }

//         }
        
//        [HttpPost("GetPledgelistCheck")]
//        public async Task<IActionResult> GetPledgelistCheck([FromBody] GetPledgeRequset request)
//        {
            
//            try
//            {
//                request.plno = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.plno);
//                request.employee = Encrypt_Decrypt.RSA.Encrypt(HttpContext.Session.GetString("EmployeeId") ?? throw new ArgumentNullException("Excepyion found"));
//                request.branch = Encrypt_Decrypt.RSA.Encrypt(HttpContext.Session.GetString("BranchId") ?? throw new ArgumentNullException("Excepyion found"));

//                var options = new JsonSerializerOptions
//                {
//                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
//                    WriteIndented = true
//                };
//                string jsonData = "";

//                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
//                string Res1 = await privateAPI.PostData(jsonData, " ", "/api/GoldSuitFile/GetPledgeList");
//                string result = await Aes_Handler.Decrypt(Res1);

//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new
//                {
//                    responseJSON = ex.Message,
//                });
//            }

//        }

//        [HttpPost("GetSuitFileSubmit")]
//        public async Task<IActionResult> GetSuitFileSubmit([FromBody] GetSubmitRequset request)
//        {

//            try
//            {
               
                
//                request.employee = Encrypt_Decrypt.RSA.Encrypt(HttpContext.Session.GetString("EmployeeId") ?? throw new ArgumentNullException("Excepyion found"));
//                request.branch = Encrypt_Decrypt.RSA.Encrypt(HttpContext.Session.GetString("BranchId") ?? throw new ArgumentNullException("Excepyion found"));
//                request.complaint = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.complaint);
//                request.caseType = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.caseType);
//                request.Complaintval = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Complaintval);
//                request.police = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.police);
//                request.anoBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.anoBranch);
//                request.curBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.curBranch);
//                request.goldInPlace = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.goldInPlace);
//                request.reason = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.reason);
//                request.prevPledge = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.prevPledge);
//                request.goldInBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.goldInBranch);
//                request.pledgeList = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.pledgeList);

//                var options = new JsonSerializerOptions
//                {
//                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
//                    WriteIndented = true
//                };
//                string jsonData = "";

//                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
//                string Res1 = await privateAPI.PostData(jsonData, " ", "/api/GoldSuitFile/GetSuitFileSubmit");
//                string result = await Aes_Handler.Decrypt(Res1);

//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new
//                {
//                    responseJSON = ex.Message,
//                });
//            }

//        }

//        //======================================================ANOTHER PAGE===================================================
//        [HttpPost("getPostCheck")]
//        public async Task<IActionResult> getPostCheck()
//        {

//            try
//            {
//                GetPostRequest request=new GetPostRequest();

//                request.employee = Encrypt_Decrypt.RSA.Encrypt(HttpContext.Session.GetString("EmployeeId") ?? throw new ArgumentNullException("Excepyion found"));
                

//                var options = new JsonSerializerOptions
//                {
//                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
//                    WriteIndented = true
//                };
//                string jsonData = "";

//                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
//                string Res1 = await privateAPI.PostData(jsonData, " ", "/api/GoldSuitFile/getPostCheck");
//                string result = await Aes_Handler.Decrypt(Res1);

//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new
//                {
//                    responseJSON = ex.Message,
//                });
//            }

//        }

//        [HttpPost("getBranchCheck")]
//        public async Task<IActionResult> getBranchCheck()
//        {

//            try
//            {
//                GetBranchCheckRequest request = new GetBranchCheckRequest();

//                request.branch = Encrypt_Decrypt.RSA.Encrypt(HttpContext.Session.GetString("BranchId") ?? throw new ArgumentNullException("Excepyion found"));
//                request.post = Encrypt_Decrypt.RSA.Encrypt(HttpContext.Session.GetString("Post") ?? throw new ArgumentNullException("Excepyion found"));

//                var options = new JsonSerializerOptions
//                {
//                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
//                    WriteIndented = true
//                };
//                string jsonData = "";

//                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
//                string Res1 = await privateAPI.PostData(jsonData, " ", "/api/GoldSuitFile/getBranchCheck");
//                string result = await Aes_Handler.Decrypt(Res1);

//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new
//                {
//                    responseJSON = ex.Message,
//                });
//            }

//        }
//        [HttpPost("getComplaintCheck")]
//        public async Task<IActionResult> getComplaintCheck([FromBody] GetComplaintCheckReq request)
//        {

//            try
//            {
               
//                request.branch =  Encrypt_Decrypt.RSA.Encrypt(request.branch);
//                request.post = Encrypt_Decrypt.RSA.Encrypt(HttpContext.Session.GetString("Post") ?? throw new ArgumentNullException("Excepyion found"));

//                var options = new JsonSerializerOptions
//                {
//                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
//                    WriteIndented = true
//                };
//                string jsonData = "";

//                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
//                string Res1 = await privateAPI.PostData(jsonData, " ", "/api/GoldSuitFile/GetComplaintCheck");
//                string result = await Aes_Handler.Decrypt(Res1);

//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new
//                {
//                    responseJSON = ex.Message,
//                });
//            }

//        }
//        [HttpPost("GetCaseDetails")]
//        public async Task<IActionResult> GetCaseDetails([FromBody] getLegalDetailsRequest request)
//        {

//            try
//            {

//                request.legal = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.legal);

//                var options = new JsonSerializerOptions
//                {
//                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
//                    WriteIndented = true
//                };
//                string jsonData = "";

//                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
//                string Res1 = await privateAPI.PostData(jsonData, " ", "/api/GoldSuitFile/GetCaseDetails");
//                string result = await Aes_Handler.Decrypt(Res1);

//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new
//                {
//                    responseJSON = ex.Message,
//                });
//            }

//        }

//        [HttpPost("GetPledgeShowDetail")]
//        public async Task<IActionResult> GetPledgeShowDetail([FromBody] getLegalDetailsRequest request)
//        {

//            try
//            {

//                request.legal = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.legal);

//                var options = new JsonSerializerOptions
//                {
//                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
//                    WriteIndented = true
//                };
//                string jsonData = "";

//                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
//                string Res1 = await privateAPI.PostData(jsonData, " ", "/api/GoldSuitFile/GetPledgeShowDetail");
//                string result = await Aes_Handler.Decrypt(Res1);

//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new
//                {
//                    responseJSON = ex.Message,
//                });
//            }

//        }
//        [HttpPost("GetSuitFileApprove")]
//        public async Task<IActionResult> GetSuitFileApprove([FromBody] GetSubmitRequset request)
//        {

//            try
//            {


//                request.employee = Encrypt_Decrypt.RSA.Encrypt(HttpContext.Session.GetString("EmployeeId") ?? throw new ArgumentNullException("Excepyion found"));
//                request.branch = Encrypt_Decrypt.RSA.Encrypt(HttpContext.Session.GetString("BranchId") ?? throw new ArgumentNullException("Excepyion found"));
//                request.complaint = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.complaint);
//                request.caseType = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.caseType);
//                request.Complaintval = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Complaintval);
//                request.police = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.police);
//                request.anoBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.anoBranch);
//                request.curBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.curBranch);
//                request.goldInPlace = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.goldInPlace);
//                request.reason = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.reason);
//                request.prevPledge = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.prevPledge);
//                request.goldInBranch = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.goldInBranch);
//                request.pledgeList = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.pledgeList);
//                request.flag1 = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag1);
//                request.rm_cmt = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.rm_cmt);

//                var options = new JsonSerializerOptions
//                {
//                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
//                    WriteIndented = true
//                };
//                string jsonData = "";

//                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
//                string Res1 = await privateAPI.PostData(jsonData, " ", "/api/GoldSuitFile/GetSuitFileApprove");
//                string result = await Aes_Handler.Decrypt(Res1);

//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new
//                {
//                    responseJSON = ex.Message,
//                });
//            }

//        }
//    }
//}
