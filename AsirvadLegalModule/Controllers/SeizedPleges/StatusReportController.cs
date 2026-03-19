using API.Handler;
using AsirvadLegalModule.DTO.SeizedPledges.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using System.Text.Json;

namespace AsirvadLegalModule.Controllers.SeizedPleges
{
    public class StatusReportController : Controller
    {
        PrivateAPIManager privateAPI;
        public StatusReportController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult ReportView()
        {
            return View("~/Views/SeizedPledges/StatusReport.cshtml");
        }

        [HttpPost("ReportLoad")]
        public async Task<IActionResult> ReportLoad([FromBody] SeizedPledgesRequest request)
        {
            try
            {

               // request.Indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Indata);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.Emp_id), "api/SeizedPledges/PledgeLoad");
              ///  string result = await Aes_Handler.Decrypt(Res1);

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
