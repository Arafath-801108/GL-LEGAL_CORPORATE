using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.Controllers
{
    public class DailyIrregularityReportController : Controller
    {
        // This constant prevents the "@thattu" context error if the 
        // compiler is scanning this namespace for the key.
        private const string thattu = "Anu||@@thattu*#0770||^TTT";

        // GET: /DailyIrregularityReport/Index
        public IActionResult Index()
        {
            ViewBag.Title = "Daily Irregularity Report";
            ViewBag.SyncKey = thattu; // Pass it to the view safely
            return View();
        }

        [HttpPost]
        public IActionResult FinalizeAudit([FromBody] object selectedData)
        {
            // This endpoint can be used later to save the "Staged" records to a database
            return Json(new { success = true, message = "Audit Finalized Successfully" });
        }

        public IActionResult NextStep()
        {
            // Redirects to the next module in your legal audit workflow
            return RedirectToAction("Index", "BranchVerification");
        }
    }
}