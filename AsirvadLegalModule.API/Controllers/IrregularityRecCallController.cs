using AsirvadLegalModule.Core.BLL;
using AsirvadLegalModule.DTO.IrregularityRecCall.Request;
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
    public class IrregularityRecCallController : ControllerBase
    {
        [HttpPost("PROC_IRREGULARITYCALL_SELECT")]
        public async Task<ActionResult<string>> PROC_IRREGULARITYCALL_SELECT(irregularitycallRequest request)
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
                    string encryptedResponse = await IrregularitycallBLL.Instance.PROC_IRREGULARITYCALL_SELECT(request);

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
        [HttpPost("PROC_IRR_RECOVERY_CONFIRM")]
        public async Task<ActionResult<string>> PROC_IRR_RECOVERY_CONFIRM(irregularitycallRequest request)
        {
            request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
            request.branch = Encrypt_Decrypt.RSA.Decrypt(request.branch);
            request.p_indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.p_indata);
            request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);
            if (!string.IsNullOrEmpty(request.p_indata))
            {
                request.p_indata += "|" + request.employeeId + "|" + request.branch;
            }
            else
            {
                request.p_indata = request.employeeId;
            }
            if (ModelState.IsValid)
            {
                try
                {
                    string encryptedResponse = await IrregularitycallBLL.Instance.PROC_IRR_RECOVERY_CONFIRM(request);

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
