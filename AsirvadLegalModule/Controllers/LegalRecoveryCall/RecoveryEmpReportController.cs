using API.Handler;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalRecoveryCall
{
    public class RecoveryEmpReportController : Controller
    {
        PrivateAPIManager privateAPI;
        public RecoveryEmpReportController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult RecoveryEmpReport()
        {

            return View("~/Views/LegalRecoveryCall/RecoveryEmpReport.cshtml");
        }
    }
}
