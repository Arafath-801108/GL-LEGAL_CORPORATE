using AsirvadLegalModule.Models;
using Microsoft.AspNetCore.Mvc;
using API.Handler;
using AsirvadLegalModule.DTO.Login.Request;
using Microsoft.Extensions.Options;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Text.Json;
using AsirvadLegalModule.DTO.Login.Response;
using AsirvadLegalModule.Utilities;
using System.Security.Cryptography;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using Microsoft.AspNetCore.Authorization;
using static AsirvadLegalModule.DTO.Login.Response.LoginResponseDTO;
using Serilog;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;


namespace AsirvadLegalModule.Controllers
{
    
    public class LoginController : Controller
    {
        PrivateAPIManager privateAPI;
        public LoginController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public IActionResult Login()
        {
            ViewData["Title"] = "Login";
            return View();

        }
        public IActionResult Dashboard()
        {
        return View(); 
        }

        [HttpPost("LoginPost")]
        public IActionResult LoginPost([FromBody] LoginRequest request)
        {
            try
            {
                string employee = Aes_Handler.Decrypt(request.employeeId).GetAwaiter().GetResult();
                string branch = Aes_Handler.Decrypt(request.branch).GetAwaiter().GetResult();
                string password = Aes_Handler.Decrypt(request.password).GetAwaiter().GetResult();
                request.employeeId = Encrypt_Decrypt.RSA.Encrypt(employee);
                request.password = Encrypt_Decrypt.RSA.Encrypt(password);
                request.branch = Encrypt_Decrypt.RSA.Encrypt(branch);




                //string employee = Aes_Handler.Encrypt(request.employeeId).GetAwaiter().GetResult();
                //string branch = Aes_Handler.Encrypt(request.branch).GetAwaiter().GetResult();
                //string password = Aes_Handler.Encrypt(request.password).GetAwaiter().GetResult();
                //request.employeeId =Encrypt_Decrypt.RSA.Encrypt( request.employeeId);
                //request.password = Encrypt_Decrypt.RSA.Encrypt(request.password);
                //request.branch = Encrypt_Decrypt.RSA.Encrypt(request.branch);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true,
                    
                };

                string jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res = privateAPI.PostData(jsonData, "", "api/Login/GetEmployeeLogin").Result;              
                var responseObject = JsonSerializer.Deserialize<LoginResponseDTO>(Res);

                //string dec_status = Encrypt_Decrypt.RSA.Decrypt(responseObject.status );
                //string dec_message = Encrypt_Decrypt.RSA.Decrypt(responseObject.message);
                //string dec_token = Encrypt_Decrypt.Aes_Handler.Decrypt(responseObject.token).Result;
                //string dec_post = Encrypt_Decrypt.RSA.Decrypt(responseObject.post);
                string dec_status = Encrypt_Decrypt.RSA.Decrypt(responseObject.status);
                string dec_message = Encrypt_Decrypt.RSA.Decrypt(responseObject.message);

                string dec_token = responseObject.token != null ? Encrypt_Decrypt.Aes_Handler.Decrypt(responseObject.token).Result : "Token is null";
                string dec_post = responseObject.post != null ? Encrypt_Decrypt.RSA.Decrypt(responseObject.post) : "Post is null";
                string dec_name = responseObject.employeeName != null ? responseObject.employeeName : "Name is null";
                string eemployeeid= Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
               
                LoginResponseDTO responseDTO = new LoginResponseDTO();
                responseDTO.status = dec_status;
                responseDTO.message = dec_message;
                responseDTO.token = responseObject.token;
                responseDTO.post = responseObject.post;
                responseDTO.branch = request.branch;
                responseDTO.employeeId = request.employeeId;
                responseDTO.employeeName = responseObject.employeeName;
                responseDTO.dec_employee = Encrypt_Decrypt.Aes_Handler.Encrypt(Encrypt_Decrypt.RSA.Decrypt(request.employeeId)).Result;
                responseDTO.dec_time = Encrypt_Decrypt.Aes_Handler.Encrypt(DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss")).Result;
                responseDTO.dec_name = dec_name;
                return Ok(responseDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }   
           
        }

        [HttpPost("GetBranchs")]
        public async Task<IActionResult> GetBranchs([FromBody] GetBranchRequest request)
        {

            try
            {  
                //request.employeeId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.employeeId);
                //request.employeeId = await  Encrypt_Decrypt.Aes_Handler.Encrypt(request.employeeId);
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";
                
                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, " ", "api/Login/GetBranches");
                Log.Information(Res1);
                //string result = await Aes_Handler.Decrypt(Res1);
                //Log.Error("MODULE WEB" + result);
                return Ok(Res1);
            }
            catch (Exception ex)
            {
                Log.Error("MODULE"+ex.Message+"  "+request.employeeId);
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }
        [HttpPost("Dashboard")]
        public IActionResult Dashboard([FromBody] TokenRequest request)
        {
            try
            {
            
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";
                var request1 = new
                {
                    employeeId = request.employeeId,
                    token = request.token,
                };

                jsonData = System.Text.Json.JsonSerializer.Serialize(request1, options);
                var Res1 =  privateAPI.PostData(jsonData, " ", "api/Auth/TokenCheck").Result;
                var obj = JsonSerializer.Deserialize<TokenCheckRes>(Res1);
               // string status =  Aes_Handler.Decrypt(obj.status).Result;
                TokenCheckRes responseDTO = new TokenCheckRes();
                responseDTO.status = Aes_Handler.Decrypt(obj.status).Result;
                responseDTO.message = Aes_Handler.Decrypt(obj.message).Result;

                if (responseDTO.status == "True")
                {
                    return Ok(responseDTO);

                }
                else
                {
                   //session clear 
                    return RedirectToAction("Login");

                }
            }
            catch
            (Exception ex)
            {
               // Exception_Handler.Session_Clear(HttpContext);
                return RedirectToAction("Login");

            }
        }
        [HttpPost("GetDetailsRemoval")]
        public async Task<IActionResult> GetDetailsLegalHead([FromBody] GetSuitFileDeatailsRequset request)
        {

            try
            {
                //request.p_indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.p_indata);
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/plp_Legal_Select");
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
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            try
            {

                request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.as_optflag);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request),"", "api/Login/Logout");
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
        [HttpPost("checkEmployeeCode")]
        public async Task<IActionResult> checkEmployeeCode([FromBody] AccesscheckRequest request)
        {
            try
            {

                request.formId = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.formId);
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/Login/checkEmployeeCode");
                string result = await Aes_Handler.Decrypt(Res1);
                return Ok(result);
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

        [HttpPost("proc_legal_workalert")]
        public async Task<IActionResult> proc_legal_workalert([FromBody] AccesscheckRequest request)
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

                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/Login/proc_legal_workalert");
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


    }
}

