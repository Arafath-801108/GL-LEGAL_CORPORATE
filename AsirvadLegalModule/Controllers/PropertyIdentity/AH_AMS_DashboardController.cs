using API.Handler;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.PropertyIdentity
{
    public class AH_AMS_DashboardController : Controller
    {
        PrivateAPIManager privateAPI;
        public AH_AMS_DashboardController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult AH_AMS_Dashboard()
        {
            return View("~/Views/PropertyIdentity/AH_AMS_Dashboard.cshtml");
        }
    }
}
