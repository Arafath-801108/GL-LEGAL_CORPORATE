using API.Handler;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.Legal_Recovery
{
    public class RecoveryStatus_ReportController : Controller
    {
        PrivateAPIManager privateAPI;
        public RecoveryStatus_ReportController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult Index()
        {
            return View("~/Views/Legal_Recovery/RecoveryStatus_Report.cshtml");
        }
    }
}
