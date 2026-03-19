using AsirvadLegalModule.DTO.SeizedPledges.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using System.Text.Json;
using API.Handler;

namespace AsirvadLegalModule.Controllers.SeizedPleges
{
    public class SeizedSettlementController : Controller
    {
        PrivateAPIManager privateAPI;
        public SeizedSettlementController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult TheftSettle()
        {
            return View("~/Views/SeizedPledges/SeizedSettlement.cshtml");
        }


        [HttpPost("SettlePledgeLoad")]
        public async Task<IActionResult> SettlePledgeLoad([FromBody] SeizedPledgesRequest request)
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

        [HttpPost("SettleGetDetails")]
        public async Task<IActionResult> SettleGetDetails([FromBody] SeizedPledgesRequest request)
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

        [HttpPost("SettleAmountFetch")]
        public async Task<IActionResult> SettleAmountFetch([FromBody] SetAmountRequest request)
        {

            try
            {


               // request.loan_no = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.loan_no);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.empId), "api/SeizedPledges/SettleAmountFetch");
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

        [HttpPost("SettleSubmit")]
        public async Task<IActionResult> SettleSubmit([FromBody] SetSubmitRequest request)
        {

            try
            {


               // request.loan_no = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.loan_no);
              //  request.remark = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.remark);
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.empId), "api/SeizedPledges/SettleSubmit");
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


        [HttpPost("SettleReject")]
        public async Task<IActionResult> SettleReject([FromBody] SetSubmitRequest request)
        {

            try
            {


              //  request.loan_no = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.loan_no);
              //  request.remark = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.remark);
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.empId), "api/SeizedPledges/SettleReject");
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

    }
}
