using API.Handler;
using AsirvadLegalModule.DTO.LegalFIR.Request;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalFIR
{
    public class SpComplaintController : Controller
    {

        PrivateAPIManager privateAPI;

        public SpComplaintController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult SPView()
        {
            return View("Views/LegalFIR/SpPoliceComplaintView.cshtml");
        }
        public async Task<IActionResult> SPfetch([FromBody] PoliceFirEntryRequest request)
        {

            try
            {


                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/LegalFirPolice/SPCOMPLAINT");
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
