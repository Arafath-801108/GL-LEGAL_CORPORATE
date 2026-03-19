using API.Handler;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using static AsirvadLegalModule.DTO.LegalRecoveryCall.Request.LegalRecoveryCallRequest;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;

namespace AsirvadLegalModule.Controllers.LegalRecoveryCall
{
    public class RecoveryCallDetailController : Controller
    {
        PrivateAPIManager privateAPI;
        public RecoveryCallDetailController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult RecoveryCallDetail()
        {

            return View("~/Views/LegalRecoveryCall/RecoveryCallDetail.cshtml");
        }

        [HttpPost("EmployeeGetDetails")]
        public async Task<IActionResult> GetRecoverycallDetailsHO([FromBody] LegalRecoveryDeatailsRequest request)
        {

            try
            {
                //request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.as_optflag);

                //request.p_indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.p_indata);
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/LegalRecoveryCall/proc_recoverycall_select");
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
        [HttpPost("EmployeeConfirmDetails")]
        public async Task<IActionResult> LOConfirmDetails([FromBody] LegalRecoveryDeatailsRequest request)
        {
            try
            {
                //request.p_indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.p_indata);
                //request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.as_optflag);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/LegalRecoveryCall/PROC_RECOVERY_EMPLOYEE_CONFIRM_NEW");
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
