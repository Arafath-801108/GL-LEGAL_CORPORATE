using API.Handler;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using AsirvadLegalModule.DTO.SeizedPledges.Request;
using AsirvadLegalModule.DTO.SeizedPledges.Response;
using System.Text.Json;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;

namespace AsirvadLegalModule.Controllers.SeizedPleges
{
    public class LO9UpdationController : Controller
    {
        PrivateAPIManager privateAPI;
        public LO9UpdationController(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }
        public IActionResult LO9Updation()
        {
            return View("~/Views/SeizedPledges/LO9Updation.cshtml");
        }


        [HttpPost("PledgeLoad")]
        public async Task<IActionResult> PledgeLoad([FromBody] SeizedPledgesRequest request)
        {
            try
            {

               // request.Indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Indata);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.Emp_id), "api/SeizedPledges/PledgeLoad");
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

        [HttpPost("Lo9GetDetails")]
        public async Task<IActionResult> Lo9GetDetails([FromBody] SeizedPledgesRequest request)
        {
            try
            {

              //  request.Indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Indata);

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.Emp_id), "api/SeizedPledges/Lo9GetDetails");
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


        [HttpPost("SubmitDetails")]
        public async Task<IActionResult> SubmitDetails([FromBody] Lo9DocumentRequest request)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrEmpty(request.Lo9Doc))
                {
                    return BadRequest(new { err_code = "0", err_sts = "No file uploaded." });
                }

                // Decode base64 string
                byte[] fileBytes;
                try
                {
                    fileBytes = Convert.FromBase64String(request.Lo9Doc);
                }
                catch (FormatException)
                {
                    return BadRequest(new { err_code = "0", err_sts = "Invalid base64-encoded file." });
                }

                // Validate file size (5MB)
                if (fileBytes.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { err_code = "0", err_sts = "File size exceeds the 2MB limit." });
                }

                // Validate file content based on Lo9Ex
                //if (fileBytes.Length >= 8)
                //{
                //    if (request.Lo9Ex == "2" && (fileBytes[0] != 0x25 || fileBytes[1] != 0x50 || fileBytes[2] != 0x44 || fileBytes[3] != 0x46)) // PDF
                //    {
                //        return BadRequest(new { err_code = "0", err_sts = "Invalid PDF file." });
                //    }
                //    else if (request.Lo9Ex == "4" && (fileBytes[0] != 0x50 || fileBytes[1] != 0x4B || fileBytes[2] != 0x03 || fileBytes[3] != 0x04)) // DOCX
                //    {
                //        return BadRequest(new { err_code = "0", err_sts = "Invalid DOCX file." });
                //    }
                //    else if (request.Lo9Ex == "3" && (fileBytes[0] != 0xD0 || fileBytes[1] != 0xCF || fileBytes[2] != 0x11 || fileBytes[3] != 0xE0)) // DOC
                //    {
                //        return BadRequest(new { err_code = "0", err_sts = "Invalid DOC file." });
                //    }
                //    else if (request.Lo9Ex == "1" && (fileBytes[0] != 0xFF || fileBytes[1] != 0xD8)) // JPEG
                //    {
                //        return BadRequest(new { err_code = "0", err_sts = "Invalid JPEG file." });
                //    }
                //}
                //else
                //{
                //    return BadRequest(new { err_code = "0", err_sts = "File too small to validate." });
                //}

                //request.Indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Indata);
               // request.CaseCategory= await Encrypt_Decrypt.Aes_Handler.Encrypt(request.CaseCategory);
                //request.PledgeNo= await Encrypt_Decrypt.Aes_Handler.Encrypt(request.PledgeNo);
               // //request.Lo9Doc= await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Lo9Doc);
               // request.Lo9Ex = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.Lo9Ex);
               

                var options = new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };
                string jsonData = "";

                jsonData = System.Text.Json.JsonSerializer.Serialize(request, options);
                string Res1 = await privateAPI.PostData(jsonData, string.Concat(request.Token, "~", request.EmpId), "api/SeizedPledges/SubmitDetails");
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