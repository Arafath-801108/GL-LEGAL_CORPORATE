using AsirvadLegalModule.Core.BLL;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.DTO.Response;
using AsirvadLegalModule.DTO.SeizedPledges.Request;
using AsirvadLegalModule.DTO.SeizedPledges.Response;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SeizedPledgesController : ControllerBase
    {
        [HttpPost("PledgeLoad")]
        public async Task<ActionResult<string>> PledgeLoad([FromBody] SeizedPledgesRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    request.Emp_id = Encrypt_Decrypt.RSA.Decrypt(request.Emp_id);
                    request.Indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);
                    string concatenatedIndata = $"{request.Emp_id}~{request.Indata}";
                    var decryptedRequest = new SeizedPledgesRequest
                    {
                        Flag = request.Flag,
                        Indata = concatenatedIndata
                    };
                    string encryptResponse = await SeizedPledgesBLL.Instance.PledgeLoad(decryptedRequest);

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
        [HttpPost("Lo9GetDetails")]
        public async Task<ActionResult<string>> Lo9GetDetails([FromBody] SeizedPledgesRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    request.Emp_id = Encrypt_Decrypt.RSA.Decrypt(request.Emp_id);
                    request.Indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);
                    //string concatenatedIndata = $"{request.Emp_id}~{request.Indata}";
                    var decryptedRequest = new SeizedPledgesRequest
                    {
                        Flag = request.Flag,
                        Indata = request.Indata +"~"+ request.Emp_id
                    };
                    string encryptResponse = await SeizedPledgesBLL.Instance.PledgeLoad(decryptedRequest);

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

        [HttpPost("SubmitDetails")]
        public async Task<ActionResult<string>> SubmitDetails([FromBody] Lo9DocumentRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {

                    request.Indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);
                    request.CaseCategory = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.CaseCategory);
                    request.PledgeNo = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.PledgeNo);
                    //request.Lo9Doc = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Lo9Doc);
                    request.Lo9Ex = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Lo9Ex);
                    request.RecEx = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.RecEx);
                    request.DraftEx = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.DraftEx);
                    request.EmpId = Encrypt_Decrypt.RSA.Decrypt(request.EmpId);

                    var decryptedRequest = new Lo9DocumentRequest
                    {
                        Indata = request.Indata,
                        CaseCategory = request.CaseCategory,
                        PledgeNo = request.PledgeNo,
                        Lo9Doc = request.Lo9Doc,
                        Lo9Ex = request.Lo9Ex,
                        RecDoc = request.RecDoc,
                        RecEx = request.RecEx,
                        DraftDoc = request.DraftDoc,
                        DraftEx = request.DraftEx,
                        EmpId = request.EmpId

                    };
                    string encryptResponse = await SeizedPledgesBLL.Instance.LO9Submit(decryptedRequest);

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


        [HttpPost("SeizedClassSubmit")]
        public async Task<ActionResult<string>> SeizedClassSubmit([FromBody] SeizedPledgesRequest request)
        {



            request.Emp_id = Encrypt_Decrypt.RSA.Decrypt(request.Emp_id);
            string decryptedData = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);
            string[] parts = decryptedData.Split('~');

            // Assigning each part to individual variables
            string irr = parts.Length > 0 ? parts[0] : "";
            string pledge = parts.Length > 1 ? parts[1] : "";
            string status = parts.Length > 1 ? parts[2] : "";
            string remark = parts.Length > 2 ? parts[3] : "";
            string case1 = parts.Length > 2 ? parts[4] : "";

            string concatenatedIndata = $"{irr}!{request.Emp_id}!{pledge}!{status}!{remark}!{case1}";
            var decryptedRequest = new SeizedPledgesRequest
            {
                Flag = request.Flag,
                Indata = concatenatedIndata

            };

            if (ModelState.IsValid)
            {

                SeizedClassResponse response = new SeizedClassResponse();
                try
                {

                    string encryptedResponse = await SeizedPledgesBLL.Instance.ClassSeizedSubmit(decryptedRequest);


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


        [HttpPost("SeizedClassReject")]
        public async Task<ActionResult<string>> SeizedClassReject([FromBody] SeizedPledgesRequest request)
        {



            request.Emp_id = Encrypt_Decrypt.RSA.Decrypt(request.Emp_id);
            string decryptedData = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Indata);
            string[] parts = decryptedData.Split('~');

            // Assigning each part to individual variables
            string val = parts.Length > 0 ? parts[0] : "";
            string irr = parts.Length > 1 ? parts[1] : "";
            string pledge = parts.Length > 2 ? parts[2] : "";
            string status = parts.Length > 3 ? parts[3] : "";
            string remark = parts.Length > 4 ? parts[4] : "";
            string case1 = parts.Length > 2 ? parts[5] : "";

            string concatenatedIndata = $"{val}!{irr}!{request.Emp_id}!{pledge}!{status}!{remark}!{case1}";
            var decryptedRequest = new SeizedPledgesRequest
            {
                Flag = request.Flag,
                Indata = concatenatedIndata

            };

            if (ModelState.IsValid)
            {

                SeizedClassResponse response = new SeizedClassResponse();
                try
                {

                    string encryptedResponse = await SeizedPledgesBLL.Instance.ClassSeizedSubmit(decryptedRequest);


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

        [HttpPost("SettleAmountFetch")]
        public async Task<ActionResult<string>> SettleAmountFetch([FromBody] SetAmountRequest request)
        {




            request.loan_no = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.loan_no);



            var decryptedRequest = new SetAmountRequest
            {

                loan_no = request.loan_no

            };

            if (ModelState.IsValid)
            {

                SettleAmountResponse response = new SettleAmountResponse();
                try
                {

                    string encryptedResponse = await SeizedPledgesBLL.Instance.SettleAmountFetch(decryptedRequest);


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


        [HttpPost("SettleSubmit")]
        public async Task<ActionResult<string>> SettleSubmit([FromBody] SetSubmitRequest request)
        {




            request.loan_no = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.loan_no);
            request.remark = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.remark);
            request.empId = Encrypt_Decrypt.RSA.Decrypt(request.empId);

            var decryptedRequest = new SetSubmitRequest
            {

                loan_no = request.loan_no,
                remark = request.remark,
                empId = request.empId

            };

            if (ModelState.IsValid) 
            {

                SettleSubmitResponse response = new SettleSubmitResponse();
                try
                {

                    string encryptedResponse = await SeizedPledgesBLL.Instance.SettleSubmit(decryptedRequest);


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


        [HttpPost("SettleReject")]
        public async Task<ActionResult<string>> SettleReject([FromBody] SetSubmitRequest request)
        {




            request.loan_no = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.loan_no);
            request.remark = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.remark);
            request.empId = Encrypt_Decrypt.RSA.Decrypt(request.empId);

            var decryptedRequest = new SetSubmitRequest
            {

                loan_no = request.loan_no,
                remark = request.remark,
                empId = request.empId

            };

            if (ModelState.IsValid)
            {

                SettleSubmitResponse response = new SettleSubmitResponse();
                try
                {

                    string encryptedResponse = await SeizedPledgesBLL.Instance.SettleReject(decryptedRequest);


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