using API.Handler;
using AsirvadLegalModule.DTO.AdvocateEmpanelment.Request;
using Microsoft.AspNetCore.Mvc;


namespace AsirvadLegalModule.Controllers.AdvocateEmpanelment
{
    public class EmpanelmentRequestController : Controller
    {
        PrivateAPIManager privateAPI;
        public EmpanelmentRequestController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult EmpanelmentRequestView()
        {
            return View("Views/AdvocateEmpanelment/EmpanelmentRequestView.cshtml");
        }
        public IActionResult EmpanelmentApproveView()
        {
            return View("Views/AdvocateEmpanelment/EmpanelemnetApprove.cshtml");
        }

        public IActionResult EmpanelmentChargeView()
        {
            return View("Views/AdvocateEmpanelment/EmpanelmetChargeDetails.cshtml");
        }
        public IActionResult EmpanelmentLetter()
        {
            return View("Views/AdvocateEmpanelment/EmpanelmentLetter.cshtml");
        }
        public IActionResult EmpanelmentReport()
        {
            return View("Views/AdvocateEmpanelment/EmpanelmentReportView.cshtml");
        }


        [HttpPost("EmpanelmentDetails")]
        public async Task<IActionResult> EmpanelmentRequest([FromBody] EmpanelmentRequest request)

        {

            try
            {
                
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/AdvocateEmpanelment/AdvEmapnelment");
               
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
