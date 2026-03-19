using API.Handler;
using AsirvadLegalModule.DTO.LegalNotice.Request;
using AsirvadLegalModule.DTO.LegalNotice.Response;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Security;
using System.Text.Json;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
namespace AsirvadLegalModule.Controllers.LegalNotice
{
    public class LegalRequestController : Controller
    {
        PrivateAPIManager privateAPI;
        public LegalRequestController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }

        [HttpPost("LegalRequestSubmit")]
        public async Task<IActionResult> LegalRequestSubmit([FromBody] LegalRequestRequest request)
        {

            try
            {
                //request.indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.indata);
                //request.flag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag);
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.employeeId), "api/LegalNotice/LegalRequestSubmit");
                //string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
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
