using AsirvadLegalModule.Core.BLL;
using AsirvadLegalModule.DTO.PropertyIdentity.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.DTO.LegalRecoveryCall.Request.LegalRecoveryCallRequest;

namespace AsirvadLegalModule.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyIdentityController : ControllerBase
    {
        [HttpPost("proc_property_identification")]
        public async Task<ActionResult<string>> proc_property_identification(PropertyIdentityRequest request)
        {
            request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
            request.branch = Encrypt_Decrypt.RSA.Decrypt(request.branch);
            request.p_indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.p_indata);
            request.p_type = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.p_type);
            request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);
            string str = request.p_indata;
            request.p_indata = $"{request.p_type}#{request.employeeId}#{request.branch}#{str}";
            if (ModelState.IsValid)
            {
                try
                {
                    string encryptedResponse = await PropertyIdentityBLL.Instance.proc_property_identification(request);

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
