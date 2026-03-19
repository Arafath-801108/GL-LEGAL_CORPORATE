using API.Handler;
using AsirvadLegalModule.DTO.LegalFIR.Request;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalFIR
{
    public class SpComplaintUpdationController : Controller
    {
        PrivateAPIManager privateAPI;
        public SpComplaintUpdationController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult SPCOMPLAINTUPDATION()
        {
            return View("Views/LegalFIR/SpComplaintUpdationView.cshtml");
        }
        public IActionResult Legal_FIR_Report()
        {
            return View("~/Views/LegalFIR/Legal_FIR_Report.cshtml");
        }
        public async Task<IActionResult>SpUpdation([FromBody] PoliceFirEntryRequest request)
        {

            try
            {


                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/LegalFirPolice/SPUpdationFetch");
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
