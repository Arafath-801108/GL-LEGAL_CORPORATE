using AsirvadLegalModule.DTO.SeizedPledges.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using System.Text.Json;
using API.Handler;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;

namespace AsirvadLegalModule.Controllers.SeizedPleges
{
    public class SeizedClassificationController : Controller
    {
        PrivateAPIManager privateAPI;
        public SeizedClassificationController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult TheftClass()
        {
            return View("~/Views/SeizedPledges/SeizedClassification.cshtml");
        }
        public IActionResult TheftRMLM()
        {
            return View("~/Views/SeizedPledges/Seized_RM_LM_Recmd.cshtml");
        }
        public IActionResult TheftAuction()
        {
            return View("~/Views/SeizedPledges/Seized_ZM_OP_Auction.cshtml");
        }
        [HttpPost("ClassPledgeLoad")]
        public async Task<IActionResult> ClassPledgeLoad([FromBody] SeizedPledgesRequest request)
        {
            try
            {

             //   request.Indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Indata);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.Emp_id), "api/SeizedPledges/PledgeLoad");
             //   string result = await Aes_Handler.Decrypt(Res1);

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


        [HttpPost("ClassGetDetails")]
        public async Task<IActionResult> ClassGetDetails([FromBody] SeizedPledgesRequest request)
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
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.Emp_id), "api/SeizedPledges/Lo9GetDetails");
               // string result = await Aes_Handler.Decrypt(Res1);

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


        [HttpPost("ClassSeizedSubmit")]
        public async Task<IActionResult> ClassSeizedSubmit([FromBody] SeizedPledgesRequest request)
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
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.Emp_id), "api/SeizedPledges/SeizedClassSubmit");
              //  string result = await Aes_Handler.Decrypt(Res1);

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


        [HttpPost("ClassSeizedReject")]
        public async Task<IActionResult> ClassSeizedReject([FromBody] SeizedPledgesRequest request)
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
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.Emp_id), "api/SeizedPledges/SeizedClassReject");
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
