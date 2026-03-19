using API.Handler;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers
{
    public class ErrorPageController : Controller
    {
        PrivateAPIManager privateAPI;
        public ErrorPageController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
