using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.DTO.ChequeCollection.Response;
using AsirvadLegalModule.Utilities;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using API.Handler;


namespace AsirvadLegalModule.Controllers.ChequeCollection
{
    public class Challan_AhController : Controller
    {
        PrivateAPIManager privateAPI;
        public Challan_AhController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult Challan_Ah()
        {
            return View("~/Views/ChequeCollection/Challan_Ah.cshtml");
        }

        [HttpPost("Challan_Ah_data")]
        public async Task<IActionResult> Challan_Ah_data([FromBody] ChequeCollectionRequest request)
        {
            try
            {
                //request.Flag = await Aes_Handler.Encrypt(request.Flag);
                //request.Indata = await Aes_Handler.Encrypt(request.Indata);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.Emp_id), "api/ChequeCollection/Challan_bh_data");
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

        [HttpPost("pdfdown")]
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

