using API.Handler;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.IrregularityRecCall
{
    public class IrregularityCallRptController : Controller
    {
        PrivateAPIManager privateAPI;
        public IrregularityCallRptController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult IrregularityCallRpt()
        {

            return View("~/Views/IrregularityRecCall/IrregularityCallRpt.cshtml");
        }
    }
}
