using API.Handler;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;

namespace AsirvadLegalModule.Controllers.GoldSuitFIle
{
    public class RemovalSuitRequestController : Controller
    {
        PrivateAPIManager privateAPI;
        public RemovalSuitRequestController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
       
        public IActionResult RemovalSuitRequest()
        {

            return View("~/Views/GoldSuitFIle/RemovalSuitRequest.cshtml");
        }
        [HttpPost("GetDetailsRemovalReq")]
        public async Task<IActionResult> GetDetailsRemovalReq([FromBody] GetSuitFileDeatailsRequset request)
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

        [HttpPost("RemovalRequestDetails")]
        public async Task<IActionResult> LOConfirmDetails([FromBody] GetSuitFileDeatailsRequset request)
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
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/GoldSuitFile/LegalConfirmDetails");
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
