using AsirvadLegalModule.Core.BLL;
using AsirvadLegalModule.DTO.LegalAudit;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class LegalAuditController : ControllerBase
    {
        [HttpOptions("Proc_new_RIIM_Legal_Details")]
        public IActionResult Preflight()
        {
            SetManualCorsHeaders();
            return Ok();
        }

        [HttpPost("Proc_new_RIIM_Legal_Details")]
        public async Task<ActionResult> Proc_new_RIIM_Legal_Details([FromBody] LegalAuditRequest? request)
        {
            SetManualCorsHeaders();

            if (request == null)
                return BadRequest("Invalid request payload.");

            try
            {
                // 1. Decrypt incoming data safely
                await DecryptRequestData(request);

                // 2. Execute Business Logic
                if (ModelState.IsValid)
                {
                    var result = await LegalAuditBLL.Instance.Proc_new_RIIM_Legal_Details(request);

                    if (result == null) return NotFound("No data returned from business logic.");

                    return Ok(result);
                }

                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                // FIX: Log exception to fix "Variable ex is declared but never used"
                Console.WriteLine($"[ERROR] LegalAudit Controller: {ex.Message}");

                return StatusCode(500, new
                {
                    error = "Processing failed.",
                    details = ex.Message
                });
            }
        }

        //private async Task DecryptRequestData(LegalAuditRequest request)
        //{
        //    try
        //    {
        //        // FIX: Use '?? ""' to ensure strings are NEVER null when passed to Decrypt
        //        // This satisfies the "Possible null reference argument" errors.
        //        string data1 = request.indata ?? string.Empty;
        //        if (data1.Length > 5)
        //            request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(data1) ?? string.Empty;

        //        string data2 = request.employeeId ?? string.Empty;
        //        if (data2.Length > 5)
        //            request.employeeId = await Encrypt_Decrypt.Aes_Handler.Decrypt(data2) ?? string.Empty;

        //        string data3 = request.branch ?? string.Empty;
        //        if (data3.Length > 5)
        //            request.branch = await Encrypt_Decrypt.Aes_Handler.Decrypt(data3) ?? string.Empty;

        //        // REMOVED 'jsonData' assignment to fix "assigned but never used"
        //    }
        //    catch (Exception ex)
        //    {
        //        // FIX: Logging 'ex' to the debug console fixes "Variable ex is declared but never used"
        //        System.Diagnostics.Debug.WriteLine(ex.Message);
        //    }
        //}

        //private async Task DecryptRequestData(LegalAuditRequest request)
        //{
        //    // Local helper to ensure we only try to decrypt valid Base64 strings
        //    // This prevents the "The input is not a valid Base-64 string" crash
        //    bool IsValidBase64(string? s) =>
        //        !string.IsNullOrEmpty(s) && s.Length >= 8 && (s.Length % 4 == 0);

        //    try
        //    {
        //        // 1. Process indata
        //        if (IsValidBase64(request.indata))
        //        {
        //            request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata!) ?? string.Empty;
        //        }

        //        // 2. Process employeeId
        //        if (IsValidBase64(request.employeeId))
        //        {
        //            request.employeeId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.employeeId!) ?? string.Empty;
        //        }

        //        // 3. Process branch
        //        if (IsValidBase64(request.branch))
        //        {
        //            request.branch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.branch!) ?? string.Empty;
        //        }

        //        // 4. Process p_type (Added because your JS payload includes this)
        //        if (IsValidBase64(request.p_type))
        //        {
        //            request.p_type = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.p_type!) ?? string.Empty;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log to Debug window
        //        System.Diagnostics.Debug.WriteLine($"DECRYPTION FAILURE: {ex.Message}");

        //        // RE-THROW or handle specifically so the Controller knows the data is corrupted
        //        throw new Exception("Security Decryption Failed. Check Key/IV consistency.", ex);
        //    }
        //}



        private async Task DecryptRequestData(LegalAuditRequest request)
        {
            // Helper to check if a string is a valid encrypted block (Base64 + multiple of 16 bytes)
            bool IsBase64Encrypted(string? s)
            {
                if (string.IsNullOrWhiteSpace(s) || s.Length < 16) return false;
                try
                {
                    byte[] data = Convert.FromBase64String(s);
                    return data.Length % 16 == 0;
                }
                catch { return false; }
            }

            try
            {
                // Only try to decrypt if the data looks like a valid AES block
                if (IsBase64Encrypted(request.indata))
                    request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata!) ?? string.Empty;

                if (IsBase64Encrypted(request.employeeId))
                    request.employeeId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.employeeId!) ?? string.Empty;

                if (IsBase64Encrypted(request.branch))
                    request.branch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.branch!) ?? string.Empty;

                if (IsBase64Encrypted(request.p_type))
                    request.p_type = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.p_type!) ?? string.Empty;
            }
            catch (Exception ex)
            {
                // Log the error but don't crash; let the raw data proceed
                System.Diagnostics.Debug.WriteLine($"Decryption Check Failed: {ex.Message}");
            }
        }
        private void SetManualCorsHeaders()
        {
            Response.Headers["Access-Control-Allow-Origin"] = "https://localhost:7240";
            Response.Headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
            Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With";
            Response.Headers["Access-Control-Allow-Credentials"] = "true";
        }
    }
}