using AsirvadLegalModule.Core.BLL;
using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.DTO.ChequeCollection.Response;
using AsirvadLegalModule.DTO.LegalFIR.Response;
using AsirvadLegalModule.DTO.LegalFIR.Request;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LegalFirPoliceController : ControllerBase
    {

        [HttpPost("LegalFIRComplaints")]
        public async Task<ActionResult<string>> police_updation([FromBody] PoliceFirEntryRequest request)
        {


            if (ModelState.IsValid)
            {

                request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);

                request.Flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Flag);

                if (!string.IsNullOrEmpty(request.branch) && request.branch.Trim().ToLower() != "null")
                {
                    request.branch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.branch);
                }

                if (!string.IsNullOrEmpty(request.cust_id) && request.cust_id.Trim().ToLower() != "null")
                {
                    request.cust_id = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.cust_id);
                }

                if (!string.IsNullOrEmpty(request.state) && request.state.Trim().ToLower() != "null")
                {
                    request.state = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.state);
                }

                if (!string.IsNullOrEmpty(request.indata) && request.indata.Trim().ToLower() != "null")
                {
                    string data = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);
                    var parts = data.Split('~').ToList();

                    if (parts.Count > 7)
                    {
                        parts.Insert(7, request.employeeId);
                    }


                    request.indata = string.Join("~", parts);

                }

                if (!string.IsNullOrEmpty(request.ReqId) && request.ReqId.Trim().ToLower() != "null")
                {
                    request.ReqId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.ReqId);
                }


                LegalFIRResponse response = new LegalFIRResponse();
                try
                {

                    string encryptedResponse = await LegalPoliceFirBLL.Instance.viewBranch(request);


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
        [HttpPost("FIRRegister")]
        public async Task<ActionResult<string>> FIR_Register([FromBody] PoliceFirEntryRequest request)
        {


            if (ModelState.IsValid)
            {

                request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);

                request.Flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Flag);

                if (!string.IsNullOrEmpty(request.branch) && request.branch.Trim().ToLower() != "null")
                {
                    request.branch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.branch);
                }

                if (!string.IsNullOrEmpty(request.cust_id) && request.cust_id.Trim().ToLower() != "null")
                {
                    request.cust_id = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.cust_id);
                }

                if (!string.IsNullOrEmpty(request.state) && request.state.Trim().ToLower() != "null")
                {
                    request.state = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.state);
                }

                if (!string.IsNullOrEmpty(request.indata) && request.indata.Trim().ToLower() != "null")
                {
                    string data = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);
                    var parts = data.Split('~').ToList();

                    if (parts.Count > 1)
                    {
                        parts.Insert(1, request.employeeId);
                    }


                    request.indata = string.Join("~", parts);

                }

                if (!string.IsNullOrEmpty(request.ReqId) && request.ReqId.Trim().ToLower() != "null")
                {
                    request.ReqId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.ReqId);
                }


                LegalFIRResponse response = new LegalFIRResponse();
                try
                {

                    string encryptedResponse = await LegalPoliceFirBLL.Instance.viewBranch(request);


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

        [HttpPost("SPCOMPLAINT")]
        public async Task<ActionResult<string>> SPCOMPLAINT([FromBody] PoliceFirEntryRequest request)
        {

            if (ModelState.IsValid)
            {

                request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);

                request.Flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Flag);
                if (!string.IsNullOrEmpty(request.branch) && request.branch.Trim().ToLower() != "null")
                {
                    request.branch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.branch);
                }
                if (!string.IsNullOrEmpty(request.ReqId) && request.ReqId.Trim().ToLower() != "null")
                {
                    request.ReqId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.ReqId);
                }
                if (!string.IsNullOrEmpty(request.indata) && request.indata.Trim().ToLower() != "null")
                {
                    string data = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);
                    var parts = data.Split('~').ToList();

                    if (parts.Count > 1)
                    {
                        parts.Insert(0, request.employeeId);
                    }


                    request.indata = string.Join("~", parts);

                }

                LegalFIRResponse response = new LegalFIRResponse();
            
            try
            {

                string encryptedResponse = await LegalPoliceFirBLL.Instance.viewBranch(request);


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


        [HttpPost("SPUpdationFetch")]
        public async Task<ActionResult<string>> SPUpdationFetch([FromBody] PoliceFirEntryRequest request)
        {

            if (ModelState.IsValid)
            {

                request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);

                request.Flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Flag);
                if (!string.IsNullOrEmpty(request.branch) && request.branch.Trim().ToLower() != "null")
                {
                    request.branch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.branch);
                }
                if (!string.IsNullOrEmpty(request.ReqId) && request.ReqId.Trim().ToLower() != "null")
                {
                    request.ReqId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.ReqId);
                }
                if (!string.IsNullOrEmpty(request.indata) && request.indata.Trim().ToLower() != "null")
                {
                    string data = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);
                    var parts = data.Split('~').ToList();

                    if (parts.Count > 1)
                    {
                        parts.Insert(0, request.employeeId);
                    }


                    request.indata = string.Join("~", parts);

                }

                LegalFIRResponse response = new LegalFIRResponse();

                try
                {

                    string encryptedResponse = await LegalPoliceFirBLL.Instance.viewBranch(request);


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

        [HttpPost("FIRCHARGES")]
        public async Task<ActionResult<string>> FIRCHARGES([FromBody] PoliceFirEntryRequest request)
        {

            if (ModelState.IsValid)
            {

                request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);

                request.Flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Flag);
                if (!string.IsNullOrEmpty(request.branch) && request.branch.Trim().ToLower() != "null")
                {
                    request.branch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.branch);
                }
                if (!string.IsNullOrEmpty(request.ReqId) && request.ReqId.Trim().ToLower() != "null")
                {
                    request.ReqId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.ReqId);
                }
                if (!string.IsNullOrEmpty(request.indata) && request.indata.Trim().ToLower() != "null")
                {
                    string data = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);
                    var parts = data.Split('~').ToList();

                    if (parts.Count > 1)
                    {
                        parts.Insert(0, request.employeeId);
                    }


                    request.indata = string.Join("~", parts);

                }

                LegalFIRResponse response = new LegalFIRResponse();

                try
                {

                    string encryptedResponse = await LegalPoliceFirBLL.Instance.viewBranch(request);


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

