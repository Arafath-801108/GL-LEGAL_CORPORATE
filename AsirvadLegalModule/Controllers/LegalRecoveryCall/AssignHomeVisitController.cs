using API.Handler;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalRecoveryCall
{
    public class AssignHomeVisitController : Controller
    {
        PrivateAPIManager privateAPI;
        public AssignHomeVisitController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult AssignHomeVisit()
        {

            return View("~/Views/LegalRecoveryCall/AssignHomeVisit.cshtml");
        }
    }
}
