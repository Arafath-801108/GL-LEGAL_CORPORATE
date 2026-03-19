using API.Handler;
using AsirvadLegalModule.DTO.LegalFIR.Request;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalFIR
{
    public class FIRChargeDetailsController : Controller
    {
        PrivateAPIManager privateAPI;

        public FIRChargeDetailsController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult FIRCHARGE()
        {
            return View("Views/LegalFIR/FIRChargesheetView.cshtml");
        }
        public IActionResult FIRCHARGEUpdate()
        {
            return View("Views/LegalFIR/ChargeDetailsView.cshtml");
        }

        public async Task<IActionResult> FIRCHARGES([FromBody] PoliceFirEntryRequest request)
        {

            try
            {


                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/LegalFirPolice/FIRCHARGES");
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
