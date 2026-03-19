using API.Handler;
using AsirvadLegalModule.DTO.LegalFIR.Request;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalFIR
{
    public class FIRRegistrationController : Controller
    {
        PrivateAPIManager privateAPI;

        public FIRRegistrationController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult FIRView()
        {
            return View("Views/LegalFIR/FIRRegisrtaionView.cshtml");
        }

        public async Task<IActionResult> FIRfetch([FromBody] PoliceFirEntryRequest request)
        {

            try
            {


                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/LegalFirPolice/FIRRegister");
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
