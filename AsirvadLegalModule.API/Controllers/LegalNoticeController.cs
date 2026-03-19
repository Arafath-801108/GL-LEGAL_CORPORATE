
using AsirvadLegalModule.Core.BLL;
using AsirvadLegalModule.Core.BLL.Login;
using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.Core.DataSource.Login;
using AsirvadLegalModule.DTO.LegalNotice.Request;
using AsirvadLegalModule.DTO.LegalNotice.Response;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;


namespace AsirvadLegalModule.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LegalNoticeController : ControllerBase
    {
        [HttpPost("LegalRequestSubmit")]

        public async Task<ActionResult<string>> LegalRequestSubmit([FromBody] LegalRequestRequest request)
        {
            request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);

            request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);
            request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
           
            request.flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag);
            if (ModelState.IsValid)
            {
                LegalRequestResponse response = new LegalRequestResponse();
                try
                {

                    string encryptedResponse = await LegalNoticeBLL.Instance.LegalRequestSubmit(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPost("Dropdown")]

        public async Task<ActionResult<string>> Dropdown([FromBody] DropdownRequest request)
        {
            //request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);

            //request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);
            request.enindata = Encrypt_Decrypt.RSA.Decrypt(request.enindata);

            request.flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag);
            if (ModelState.IsValid)
            {
                DropdownResponse response = new DropdownResponse();
                try
                {

                    string encryptedResponse = await LegalNoticeBLL.Instance.Dropdown(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost("TypeDropdown")]
        public async Task<ActionResult<string>> TypeDropdown([FromBody] DropdownRequest request)
        {
            request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);

            //request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);
            request.enindata = Encrypt_Decrypt.RSA.Decrypt(request.enindata);

            request.flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag);
            if (ModelState.IsValid)
            {
                DropdownResponse response = new DropdownResponse();
                try
                {

                    string encryptedResponse = await LegalNoticeBLL.Instance.TypeDropdown(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPost("PdfUpload")]
        public async Task<ActionResult<string>> PdfUpload([FromBody] pdfRequest request)
        {
            request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);

            //request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);
            request.enindata = Encrypt_Decrypt.RSA.Decrypt(request.enindata);

            request.flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag);
            if (ModelState.IsValid)
            {
                DropdownResponse response = new DropdownResponse();
                try
                {

                    string encryptedResponse = await LegalNoticeBLL.Instance.PdfUpload(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPost("LegalFetch")]

        public async Task<ActionResult<string>> LegalFetch([FromBody] LegalFetchRequest request)
        {
            request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);

            //request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);
            request.enindata = Encrypt_Decrypt.RSA.Decrypt(request.enindata);

            request.flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag);
            if (ModelState.IsValid)
            {
                LegalFetchResponse response = new LegalFetchResponse();
                try
                {

                    string encryptedResponse = await LegalNoticeBLL.Instance.LegalFetch(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }


        [HttpPost("pdfview")]
        public async Task<ActionResult<string>> pdfview([FromBody] LegalRequestRequest request)
        {
            request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);

            //request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);

            request.flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag);
            if (ModelState.IsValid)
            {
                pdfviewResponse response = new pdfviewResponse();
                try
                {

                    string encryptedResponse = await LegalNoticeBLL.Instance.pdfview(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPost("Report")]
        public async Task<ActionResult<string>> Report([FromBody] ReportRequest request)
        {
            request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);

            //request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);

            request.flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag);

            string[] segments = request.Encrypted_data.Split('~');

            // Decrypt each segment and store the results
            List<string> decryptedSegments = new List<string>();
            foreach (string segment in segments)
            {
                decryptedSegments.Add(Encrypt_Decrypt.RSA.Decrypt(segment)); // Assuming Decrypt is a defined method
            }

            // Join the decrypted values back into a single result
            request.Encrypted_data = string.Join("~", decryptedSegments);
            if (ModelState.IsValid)
            {
                ReportResponse response = new ReportResponse();
                try
                {

                    string encryptedResponse = await LegalNoticeBLL.Instance.Report(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
    }
}
