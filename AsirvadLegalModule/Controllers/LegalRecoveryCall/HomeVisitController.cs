using API.Handler;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalRecoveryCall
{
    public class HomeVisitController : Controller
    {
        PrivateAPIManager privateAPI;
        public HomeVisitController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult HomeVisit()
        {

            return View("~/Views/LegalRecoveryCall/HomeVisit.cshtml");
        }
    }
}
