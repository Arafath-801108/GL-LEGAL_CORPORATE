using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.LegalProcedingsSPOffice
{
    public class ReportGenerationController : Controller
    {
        public IActionResult ReportGeneration()
        {
            return View();
        }
    }
}
