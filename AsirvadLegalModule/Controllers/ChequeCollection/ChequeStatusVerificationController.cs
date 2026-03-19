using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using System.Text.Json;
using API.Handler;

namespace AsirvadLegalModule.Controllers.ChequeCollection
{
    public class ChequeStatusVerificationController : Controller
    {
        PrivateAPIManager privateAPI;
        public ChequeStatusVerificationController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult StatusVerify()
        {
            return View("~/Views/ChequeCollection/ChequeStatusVerification.cshtml");
        }
        [HttpPost("IrrSelect1")]
        public async Task<IActionResult> IrrSelect1([FromBody] ChequeUpdationRequest request)
        {
            try
            {

                //request.Indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Indata);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.Emp_id), "api/ChequeCollection/ChequeVerify");
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
