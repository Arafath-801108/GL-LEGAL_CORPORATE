using API.Handler;
using AsirvadLegalModule.DTO.ExplainationModule.Request;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace AsirvadLegalModule.Controllers.ExplainationReport
{
    public class ExplainationReportController : Controller
    {
        PrivateAPIManager privateAPI;
        public ExplainationReportController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult ExplainationReport()
        {

            return View("~/Views/Explaination_Report/ExplainationReport.cshtml");
        }

        [HttpPost("getExplReport")]
        public async Task<IActionResult> GetExplReports([FromBody] ReportReq request)
        {
            try
            {
                string Res = await privateAPI.PostData(
                    JsonSerializer.Serialize(request),
                    string.Concat(request.token, "~", request.employeeId),
                    "api/ExplainationAPI/getReport"
                );

                return Ok(Res);
            }
            catch (Exception ex)
            {
                return BadRequest(new { responseJSON = ex.Message });
            }
        }
    }
}
