using API.Handler;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers.PropertyIdentity
{
    public class BH_ABH_DashboardController : Controller
    {
        PrivateAPIManager privateAPI;
        public BH_ABH_DashboardController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult BH_ABH_Dashboard()
        {
            return View("~/Views/PropertyIdentity/BH_ABH_Dashboard.cshtml");
        }
        public FileResult DownloadApplicationForm()
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/files/ApplicationForm.pdf");
            string contentType = "application/pdf";
            string fileName = "ApplicationForm.pdf";

            return PhysicalFile(filePath, contentType, fileName);
        }

    }
}
