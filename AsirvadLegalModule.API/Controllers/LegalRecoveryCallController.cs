using AsirvadLegalModule.Core.BLL;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.DTO.LegalRecoveryCall.Request.LegalRecoveryCallRequest;

namespace AsirvadLegalModule.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
   
    public class LegalRecoveryCallController : ControllerBase
    {
        [HttpPost("proc_recoverycall_select")]
        public async Task<ActionResult<string>> LegalSuitFileSelect(LegalRecoveryDeatailsRequest request)
        {
            request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);
            request.branch = Encrypt_Decrypt.RSA.Decrypt(request.branch);
            request.p_indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.p_indata);
            if (!string.IsNullOrEmpty(request.p_indata))
            {
                request.p_indata += "~" + request.branch;
            }
            else
            {
                request.p_indata = request.branch;
            }
            if (ModelState.IsValid)
            {
                try
                {
                    string encryptedResponse = await LegalRecoveryCallBLL.Instance.proc_recoverycall_select(request);

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
        [HttpPost("PROC_RECOVERY_EMPLOYEE_CONFIRM_NEW")]
        public async Task<ActionResult<string>> PROC_RECOVERY_EMPLOYEE_CONFIRM_NEW(LegalRecoveryDeatailsRequest request)
        {
            request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
            request.p_indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.p_indata);
            request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);
            if (!string.IsNullOrEmpty(request.p_indata))
            {
                request.p_indata += "~" + request.employeeId;
            }
            else
            {
                request.p_indata = request.employeeId;
            }
            if (ModelState.IsValid)
            {
                try
                {
                    string encryptedResponse = await LegalRecoveryCallBLL.Instance.PROC_RECOVERY_EMPLOYEE_CONFIRM_NEW(request);

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
