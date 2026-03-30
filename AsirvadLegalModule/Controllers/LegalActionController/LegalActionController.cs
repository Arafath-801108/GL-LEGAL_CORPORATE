using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalActionController
{
    public class LegalActionController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
