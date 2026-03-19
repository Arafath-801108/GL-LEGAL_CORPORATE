using API.Handler;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.DTO.LegalRecoveryCall.Request.LegalRecoveryCallRequest;
using System.Text.Json;
using AsirvadLegalModule.DTO.PropertyIdentity.Response;
using AsirvadLegalModule.DTO.PropertyIdentity.Request;

namespace AsirvadLegalModule.Controllers.PropertyIdentity
{
    public class HO_DashboardController : Controller
    {
        PrivateAPIManager privateAPI;
        public HO_DashboardController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult HO_Dashboard()
        {
            return View("~/Views/PropertyIdentity/HO_Dashboard.cshtml");
        }
        [HttpPost("proc_property_identification")]
        public async Task<IActionResult> proc_property_identification([FromBody] PropertyIdentityRequest request)
        {
            try
            {
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);

                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/PropertyIdentity/proc_property_identification");
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
        public async Task<IActionResult> proc_property_identify_select([FromBody] PropertyIdentityRequest request)
        {
            try
            {
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/PropertyIdentity/proc_property_identify_select");
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
