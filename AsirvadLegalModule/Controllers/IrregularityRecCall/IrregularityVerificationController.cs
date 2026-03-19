using API.Handler;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.IrregularityRecCall
{
    public class IrregularityVerificationController : Controller
    {
        PrivateAPIManager privateAPI;
        public IrregularityVerificationController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult IrregularityVerification()
        {

            return View("~/Views/IrregularityRecCall/IrregularityVerification.cshtml");
        }
    }
}
