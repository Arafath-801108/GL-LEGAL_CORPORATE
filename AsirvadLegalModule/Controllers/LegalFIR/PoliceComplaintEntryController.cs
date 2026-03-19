using API.Handler;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.LegalFIR.Request;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalFIR
{
    public class PoliceComplaintEntryController : Controller
    {
        PrivateAPIManager privateAPI;

        public PoliceComplaintEntryController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult LegalView()
        {
            return View("Views/LegalFIR/PoliceComplaintEntryView.cshtml");
        }

       
        public async Task <IActionResult> Branchfetch([FromBody] PoliceFirEntryRequest request)
        {

            try
            {

               
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/LegalFirPolice/LegalFIRComplaints");
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
