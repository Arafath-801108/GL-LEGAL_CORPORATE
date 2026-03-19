using API.Handler;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.IrregularityRecCall
{
    public class IrregularityAssignHomeController : Controller
    {
        PrivateAPIManager privateAPI;
        public IrregularityAssignHomeController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult IrregularityAssignHome()
        {

            return View("~/Views/IrregularityRecCall/IrregularityAssignHome.cshtml");
        }
    }
}
