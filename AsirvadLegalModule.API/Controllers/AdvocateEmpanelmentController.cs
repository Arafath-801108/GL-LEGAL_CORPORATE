using AsirvadLegalModule.Core.BLL;
using AsirvadLegalModule.DTO.AdvocateEmpanelment.Request;
using AsirvadLegalModule.DTO.AdvocateEmpanelment.Response;
using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.DTO.LegalFIR.Response;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AsirvadLegalModule.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvocateEmpanelmentController : ControllerBase
    {

        [HttpPost("AdvEmapnelment")]
        public async Task<ActionResult<EmpanelmentResponse>> Emapnelment([FromBody] EmpanelmentRequest request)
        {
            if (ModelState.IsValid)
            {


                EmpanelmentResponse response = new EmpanelmentResponse();
                try
                {
                    request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
                   
                    request.Flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Flag);
                    
                    
                    if (!string.IsNullOrEmpty(request.indata))
                    {
                        request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata) + "^" + request.employeeId;
                    }

                    if (!string.IsNullOrEmpty(request.indata1))
                    {
                        request.indata1 = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata1);
                    }
                    if (!string.IsNullOrEmpty(request.img))
                    {
                        request.img = request.img;
                    }

                    string encryptedResponse = await AdvocateEmpanelmentBLL.Instance.EmpanelmentRequest(request);


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
     

