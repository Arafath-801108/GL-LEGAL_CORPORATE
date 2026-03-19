using API.Handler;
using AsirvadLegalModule.DTO.IrregularityRecCall.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.DTO.LegalRecoveryCall.Request.LegalRecoveryCallRequest;
using System.Text.Json;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;

namespace AsirvadLegalModule.Controllers.IrregularityRecCall
{
    public class IrregularityRecCallController : Controller
    {
        PrivateAPIManager privateAPI;
        public IrregularityRecCallController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
       public IActionResult IrregularityRecCall()
        {

            return View("~/Views/IrregularityRecCall/IrregularityCall_Details.cshtml");
        }
        [HttpPost("getIrregularityCustomer")]
        public async Task<IActionResult> getIrregularityCustomer([FromBody] irregularitycallRequest request)
        {

            try
            {
                //request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.as_optflag);
                //request.p_indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.p_indata);
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/IrregularityRecCall/PROC_IRREGULARITYCALL_SELECT");
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

        [HttpPost("IrregularityConfirmDetails")]
        public async Task<IActionResult> IrregularityConfirmDetails([FromBody] irregularitycallRequest request)
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
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/IrregularityRecCall/PROC_IRR_RECOVERY_CONFIRM");
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
