using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.Utilities;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using API.Handler;

namespace AsirvadLegalModule.Controllers.GoldSuitFIle
{
    public class SuitFileReportController : Controller
    {
        PrivateAPIManager privateAPI;
        public SuitFileReportController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult SuitFileReport()
        {
            return View("~/Views/GoldSuitFIle/SuitFileReport.cshtml");
        }

        [HttpPost("pdfdown1")]
        public async Task<IActionResult> pdfdown([FromBody] ChequeCollectionRequest request)
        {

            try
            {
                //request.Flag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Flag);
                //request.Indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Indata);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.Emp_id), "api/ChequeCollection/pdfdown");
                string result = await Aes_Handler.Decrypt(Res1);

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
