using API.Handler;
using AsirvadLegalModule.DTO.ExplainationModule.Request;
using AsirvadLegalModule.DTO.IrregularityRecCall.Request;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace AsirvadLegalModule.Controllers.ExplainationUpdation
{
    public class ExplainationUpdation: Controller
    {
        PrivateAPIManager privateAPI;
        public ExplainationUpdation(PrivateAPIManager privateAPI)
        {
            this.privateAPI = privateAPI;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ExplainationUpdate()
        {

            return View("~/Views/Explaination_Updation/ExplainationModule.cshtml");
        }


        [HttpPost("GetBranches")]
        public async Task<IActionResult> getBranches([FromBody] BranchloadRequest request)
        {

            try
            {
                //request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.as_optflag);
                //request.p_indata = await Encrypt_Decrypt.Aes_Handler.Encrypt(request.p_indata);
                string Res1 = await privateAPI.PostData(System.Text.Json.JsonSerializer.Serialize(request), string.Concat(request.token, "~", request.employeeId), "api/ExplainationAPI/GetBranchesAsync");
                //string result = await Aes_Handler.Decrypt(Res1);
                return Ok(Res1);
            }
            catch (UnauthorizedAccessException)
            {
                throw new UnauthorizedAccessException("Unauthorized access.");
            }
            catch (Exception ex)
            {

                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }
        }

        [HttpPost("GetIrrCodes")]
        public async Task<IActionResult> GetIrrCodes([FromBody] BranchloadRequest request)
        {
            try
            {
                // Serialize the request and forward it to your API
                string Res2 = await privateAPI.PostData(
                    System.Text.Json.JsonSerializer.Serialize(request),
                    string.Concat(request.token, "~", request.employeeId),
                    "api/ExplainationAPI/GetIrrCodesAsync"
                );

                return Ok(Res2);
            }
            catch (UnauthorizedAccessException)
            {
                throw new UnauthorizedAccessException("Unauthorized access.");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    responseJSON = ex.Message,
                });
            }
        }

        [HttpPost("GetIrrCustomerDetails")]
        public async Task<IActionResult> GetIrrCustomerDetails([FromBody] IrrCodeRequest request)
        {
            try
            {
                string Res3 = await privateAPI.PostData(
                    JsonSerializer.Serialize(request),
                    string.Concat(request.token, "~", request.employeeId),
                    "api/ExplainationAPI/GetIrrCustomerDetailsAsync"
                );

                return Ok(Res3);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid or expired token.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { responseJSON = ex.Message });
            }
        }

        [HttpPost("UpdateModule")]
        public async Task<IActionResult> UpdateModule([FromBody] ExplainationUpdateRequest request)
        {
            try
            {
                string Res = await privateAPI.PostData(
                    JsonSerializer.Serialize(request),
                    string.Concat(request.Token, "~", request.EmployeeId),
                    "api/ExplainationAPI/UpdateModuleAsync"
                );

                return Ok(Res);
            }
            catch (Exception ex)
            {
                return BadRequest(new { responseJSON = ex.Message });
            }
        }


    }
}
