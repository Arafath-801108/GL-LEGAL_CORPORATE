using AsirvadLegalModule.Core.BLL;
using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.DTO.ChequeCollection.Response;
using AsirvadLegalModule.DTO.LegalNotice.Request;
using AsirvadLegalModule.DTO.LegalNotice.Response;
using AsirvadLegalModule.DTO.Response;
using AsirvadLegalModule.DTO.SeizedPledges.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace AsirvadLegalModule.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChequeCollectionController : ControllerBase
    {
        [HttpPost("Challan_bh_data")]
        public async Task<ActionResult<string>> Challan_bh_data([FromBody] ChequeCollectionRequest request)
        {
           
                   
            if (ModelState.IsValid)
            {
                
                request.Emp_id = Encrypt_Decrypt.RSA.Decrypt(request.Emp_id);
                request.Indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);
                request.Flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Flag);
                //request.Encrypted_data = Encrypt_Decrypt.RSA.Decrypt(request.Encrypted_data);






                string[] segments = request.Encrypted_data.Split('~');

                // Decrypt each segment and store the results
                List<string> decryptedSegments = new List<string>();
                foreach (string segment in segments)
                {
                    decryptedSegments.Add(Encrypt_Decrypt.RSA.Decrypt(segment)); // Assuming Decrypt is a defined method
                }

                // Join the decrypted values back into a single result
                request.Encrypted_data = string.Join("~", decryptedSegments);

                ChequeCollectionResponse response = new ChequeCollectionResponse();
                try
                {

                    string encryptedResponse = await ChequeCollectionBLL.Instance.Challan_bh_data(request);


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

        [HttpPost("pdfdown")]
        public async Task<ActionResult<string>> pdfdown([FromBody] ChequeCollectionRequest request)
        {
            request.Indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);

            //request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);

            request.Flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Flag);
            if (ModelState.IsValid)
            {
                ChequeCollectionResponse response = new ChequeCollectionResponse();
                try
                {

                    string encryptedResponse = await ChequeCollectionBLL.Instance.pdfdown(request);


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


        [HttpPost("ChequeUpdate")]
        public async Task<ActionResult<string>> ChequeUpdate([FromBody] ChequeUpdationRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    request.Br_id = Encrypt_Decrypt.RSA.Decrypt(request.Br_id);
                    request.Indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);
                    string concatenatedIndata = $"{request.Br_id}~{request.Indata}";
                    var decryptedRequest = new ChequeUpdationRequest
                    {
                        Flag = request.Flag,
                        Indata = concatenatedIndata
                    };
                    string encryptResponse = await ChequeCollectionBLL.Instance.ChequeUpdate(decryptedRequest);

                    return Ok(encryptResponse);
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




        [HttpPost("ChequeSubmit")]
        public async Task<ActionResult<string>> ChequeSubmit([FromBody] ChequeUpdationRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    request.Emp_id = Encrypt_Decrypt.RSA.Decrypt(request.Emp_id);
                    request.Indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);
                    string concatenatedIndata = $"{request.Emp_id}~{request.Indata}";
                    var decryptedRequest = new ChequeUpdationRequest
                    {
                        Flag = request.Flag,
                        Indata = concatenatedIndata
                    };
                    string encryptResponse = await ChequeCollectionBLL.Instance.ChequeUpdate(decryptedRequest);

                    return Ok(encryptResponse);
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

        [HttpPost("PdfUpload1")]
        public async Task<ActionResult<string>> PdfUpload1([FromBody] ChequeDocumentRequest request)
        {
            request.Indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);

            if (ModelState.IsValid)
            {
                ChequeUploadResponse response = new ChequeUploadResponse();
                try
                {

                    string encryptedResponse = await ChequeCollectionBLL.Instance.PdfUpload1(request);


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




        [HttpPost("ChequeVerify")]
        public async Task<ActionResult<string>> ChequeVerify([FromBody] ChequeUpdationRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    request.Br_id = Encrypt_Decrypt.RSA.Decrypt(request.Br_id);
                    request.Emp_id = Encrypt_Decrypt.RSA.Decrypt(request.Emp_id);
                    request.Indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);
                    string concatenatedIndata = $"{request.Br_id}~{request.Indata}~{request.Emp_id}";
                    var decryptedRequest = new ChequeUpdationRequest
                    {
                        Flag = request.Flag,
                        Indata = concatenatedIndata
                    };
                    string encryptResponse = await ChequeCollectionBLL.Instance.ChequeUpdate(decryptedRequest);

                    return Ok(encryptResponse);
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




        [HttpPost("ChequeReport")]
        public async Task<ActionResult<string>> ChequeReport([FromBody] ChequeUpdationRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {

                    request.Indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);

                    string encryptResponse = await ChequeCollectionBLL.Instance.ChequeUpdate(request);

                    return Ok(encryptResponse);
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
