using AsirvadLegalModule.DTO.LegalNotice.Request;
using AsirvadLegalModule.DTO.LegalNotice.Response;
using AsirvadLegalModule.Utilities;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using API.Handler;

namespace AsirvadLegalModule.Controllers.LegalNotice
{
    public class LegalNoticeController : Controller
    {
        PrivateAPIManager privateAPI;
        public LegalNoticeController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult LegalRequest()
        {
            return View();
        }
        public IActionResult LegalAh_recommend()
        {
            return View();
        }

        public IActionResult LegalLm_recommend()
        {
            return View();
        }
        public IActionResult LegalRiimH_recommend()
        {
            return View();
        }

        public IActionResult LegalLh_recommend()
        {
            return View();
        }
        public IActionResult Legal_Report()
        {
            return View("~/Views/LegalNotice/Legal_Report.cshtml");
        }

        [HttpPost("Dropdown")]
        public async Task<IActionResult> Dropdown([FromBody] DropdownRequest request)
        {

            try
            {
                //request.indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.indata);
                //request.flag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag);
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.employeeId), "api/LegalNotice/Dropdown");
                //string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }


        [HttpPost("TypeDropdown")]
        public async Task<IActionResult> TypeDropdown([FromBody] DropdownRequest request)
        {

            try
            {
                //request.indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.indata);
                //request.flag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag);
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.employeeId), "api/LegalNotice/TypeDropdown");
                //string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }

        [HttpPost("LegalFetch")]
        public async Task<IActionResult> LegalFetch([FromBody] LegalFetchRequest request)
        {

            try
            {
                //request.indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.indata);
                //request.flag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag);
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.employeeId), "api/LegalNotice/LegalFetch");
                //string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }

    
        [HttpPost("PdfUpload")]
        public async Task<IActionResult> PdfUpload([FromBody] pdfRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.img))
            {
                return BadRequest(new { responseJSON = "No file uploaded." });
            }

            // Decode base64 string
            byte[] fileBytes;
            try
            {
                // Remove data URI prefix if present (e.g., "data:application/pdf;base64,")
                string base64String = request.img;
                if (base64String.Contains(","))
                {
                    base64String = base64String.Split(',')[1];
                }
                fileBytes = Convert.FromBase64String(base64String);
            }
            catch (FormatException)
            {
                return BadRequest(new { responseJSON = "Invalid base64-encoded file." });
            }

            // Validate file size (1MB)
            if (fileBytes.Length > 1 * 1024 * 1024)
            {
                return BadRequest(new { responseJSON = "File size must be below 1MB." });
            }

            // Validate PDF magic number
            if (fileBytes.Length < 4 || fileBytes[0] != 0x25 || fileBytes[1] != 0x50 || fileBytes[2] != 0x44 || fileBytes[3] != 0x46) // %PDF
            {
                return BadRequest(new { responseJSON = "Invalid PDF file." });
            }
            //request.flag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag);
                //request.indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.indata);
                
                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.employeeId), "api/LegalNotice/PdfUpload");
                //string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }

        [HttpPost("pdfview")]
        public async Task<IActionResult> pdfview([FromBody] LegalRequestRequest request)
        {

            try
            {
                //request.flag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag);
                //request.indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.indata);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.employeeId), "api/LegalNotice/pdfview");
                //string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }

        [HttpPost("Report")]
        public async Task<IActionResult> Report([FromBody] ReportRequest request)
        {

            try
            {

                if (request.flag == "2")
                {

                    string branch = Encrypt_Decrypt.RSA.Decrypt(request.branchId);
                    string post = Encrypt_Decrypt.RSA.Decrypt(request.post);
                    string employee = string.IsNullOrEmpty(request.employeeId) ? "0" : Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
                    string concate = request.indata + "~" + branch + "~" + post + "~" + employee;
                    request.flag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag);


                    request.indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(concate);
                }
                else
                {
                    request.indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.indata);
                    request.flag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.flag);

                }


                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.token, "~", request.employeeId), "api/LegalNotice/Report");
                //string result = await Aes_Handler.Decrypt(Res1);

                return Ok(Res1);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }

        }



    }

}
