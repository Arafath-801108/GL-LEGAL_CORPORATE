using API.Handler;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalRecoveryCall
{
    public class StaffBalanceRecoveryController : Controller
    {
        PrivateAPIManager privateAPI;
        public StaffBalanceRecoveryController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult StaffBalanceRecovery()
        {

            return View("~/Views/LegalRecoveryCall/StaffBalanceRecovery.cshtml");
        }
    }
}
