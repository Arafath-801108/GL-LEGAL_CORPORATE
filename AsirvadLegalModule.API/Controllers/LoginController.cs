using Microsoft.AspNetCore.Mvc;
using AsirvadLegalModule.DTO.Response;
using AsirvadLegalModule.DTO.Login.Request;
using AsirvadLegalModule.DTO.Login.Response;
using AsirvadLegalModule.Core.BLL.Login;
using AsirvadLegalModule.Utilities;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using Microsoft.AspNetCore.Authorization;


namespace AsirvadLegalModule.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class LoginController : ControllerBase
    {
        private readonly Token_Handler _tokenHandler;

        public LoginController(Token_Handler tokenHandler)
        {
            _tokenHandler = tokenHandler;
        }
        [HttpPost("GetEmployeeLogin")]

        public ActionResult<LoginResponse> GetEmployeeLogin([FromBody] LoginRequest request )
        {
            if (ModelState.IsValid)
            {
                Encrypt_Decrypt enc = new Encrypt_Decrypt();

                request.employeeId = RSA.Decrypt(request.employeeId);                
                request.password = enc.CreateHash(request.employeeId +"raju"+Encrypt_Decrypt.RSA.Decrypt(request.password));

                 var loginresponse=  LoginBLL.Instance.LoginEmployeeData(request);
                
                if (RSA.Decrypt(loginresponse.Status ?? throw new ArgumentNullException("Status is Required to Generate the Token")) == "true") 
                {
                    var result1 = _tokenHandler.CreateToken(request.employeeId, "User");
                    if (result1.isvalid)
                    {
                        loginresponse.Token=Aes_Handler.Encrypt(result1.Token).Result;
                        return Ok(loginresponse);
                    }
                    else
                    {
                        loginresponse.Status = "false";
                        loginresponse.Message = "Token generation failed";
                        return Unauthorized(loginresponse);
                    }
                    
                }

                //  return Unauthorized(new { Message = "Invalid credentials",Status = "false"});
                return Ok(loginresponse);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPost("GetBranches")]
        public async Task<ActionResult<string>> GetBranches([FromBody] GetBranchRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    request.employeeId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.employeeId);

                    string encryptedResponse = await LoginBLL.Instance.GetBranchesData(request);

                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost("Logout")]
        public async Task<ActionResult<string>> Logout([FromBody] LogoutRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    request.employeeId=  Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
                    request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);

                    string encryptedResponse = await LoginBLL.Instance.Logout(request);

                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost("checkEmployeeCode")]
        public async Task<ActionResult<string>> checkEmployeeCode([FromBody] AccesscheckRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
                    request.post = Encrypt_Decrypt.RSA.Decrypt(request.post);
                    request.branch = Encrypt_Decrypt.RSA.Decrypt(request.branch);
                    request.formId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.formId);

                    string encryptedResponse = await LoginBLL.Instance.checkEmployeeCode(request);

                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost("proc_legal_workalert")]
        public async Task<ActionResult<string>> proc_property_identification(AccesscheckRequest request)
        {
            request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
            request.post = Encrypt_Decrypt.RSA.Decrypt(request.post);
            request.branch = Encrypt_Decrypt.RSA.Decrypt(request.branch);


            if (ModelState.IsValid)
            {
                try
                {
                    string encryptedResponse = await LoginBLL.Instance.proc_legal_workalert(request);

                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }


    }
}
