using AsirvadLegalModule.Core.BLL;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Mvc;
using AsirvadLegalModule.DTO.ExplainationModule.Request;
using Microsoft.AspNetCore.Authorization;

namespace AsirvadLegalModule.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExplainationAPIController : ControllerBase
    {
        [HttpPost("GetBranchesAsync")]
        public async Task<ActionResult<string>> GetBranchesAsyncReq(BranchloadRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
                    request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);
                    
                    string encryptedResponse = await ExplainationBLL.Instance.getBranches(request);

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

        [HttpPost("GetIrrCodesAsync")]
        public async Task<ActionResult<string>> GetIrrCodesAsyncReq(BranchloadRequest request)
        {
            try
            {
                request.branch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.branch);
                request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);
                string encryptedResponse = await ExplainationBLL.Instance.getIrrCodes(request);
                return Ok(encryptedResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("GetIrrCustomerDetailsAsync")]
        public async Task<ActionResult<string>> GetIrrCustomerDetailsAsyncReq(IrrCodeRequest request)
        {
            try
            {
                request.irrCode = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.irrCode);
                request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);
                string encryptedResponse = await ExplainationBLL.Instance.getIrrCustomerDetails(request);
                return Ok(encryptedResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("UpdateModuleAsync")]
        public async Task<ActionResult<string>> UpdateModuleAsync([FromBody] ExplainationUpdateRequest request)
        {
            try
            {
                request.EmployeeId = Encrypt_Decrypt.RSA.Decrypt(request.EmployeeId);
                request.PledgeNumber = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.PledgeNumber);
                request.BranchId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.BranchId);
                request.IrregularityStatus = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.IrregularityStatus);
                request.Remark = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Remark);
                request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);
                request.DocumentsBase64 = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.DocumentsBase64);
                request.DocType = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.DocType);
                request.IrregularityCode = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.IrregularityCode);
                request.CustomerName = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.CustomerName);
                request.CustomerId = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.CustomerId);

                string encryptedResponse = await ExplainationBLL.Instance.UpdateModule(request);
                return Ok(encryptedResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("getReport")]
        public async Task<ActionResult<string>> GetReport(ReportReq request)
        {
            try
            {
                request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);
                request.p_indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.p_indata);
                string encryptedResponse = await ExplainationBLL.Instance.getReportExpl(request);
                return Ok(encryptedResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


    }
}
