using API.Handler;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;

namespace AsirvadLegalModule.Controllers.LegalRecoveryCall
{
    public class RecoveryCallHOController : Controller
    {
        PrivateAPIManager privateAPI;
        public RecoveryCallHOController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult RecoveryCallHO()
        {

            return View("~/Views/LegalRecoveryCall/RecoveryCallHO.cshtml");
        }
        [HttpPost("GetRecoverycallDetailsHO")]
        public async Task<IActionResult> GetRecoverycallDetailsHO([FromBody] GetSuitFileDeatailsRequset request)
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
    }
}
