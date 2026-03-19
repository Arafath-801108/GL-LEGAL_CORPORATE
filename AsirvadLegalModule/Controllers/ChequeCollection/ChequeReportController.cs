using API.Handler;
using AsirvadLegalModule.DTO.SeizedPledges.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using System.Text.Json;
using AsirvadLegalModule.DTO.ChequeCollection.Request;

namespace AsirvadLegalModule.Controllers.ChequeCollection
{
    public class ChequeReportController : Controller
    {
        PrivateAPIManager privateAPI;
        public ChequeReportController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult ChequeRep()
        {
            return View("~/Views/ChequeCollection/ChequeReport.cshtml");
        }
        [HttpPost("ChequeReportDetails")]
        public async Task<IActionResult> ChequeReportDetails([FromBody] ChequeUpdationRequest request)
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
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.Emp_id), "api/ChequeCollection/ChequeReport");
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
