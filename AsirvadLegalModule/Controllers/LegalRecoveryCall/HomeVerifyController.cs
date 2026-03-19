using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalRecoveryCall
{
    public class HomeVerifyController : Controller
    {
        public IActionResult HomeVerify()
        {
            return View("~/Views/LegalRecoveryCall/HomeVerify.cshtml");
        }
    }
}
