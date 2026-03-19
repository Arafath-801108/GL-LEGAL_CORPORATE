using AsirvadLegalModule.Core.BLL.Login;
using AsirvadLegalModule.DTO.Login.Request;
using AsirvadLegalModule.DTO.Login.Response;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace AsirvadLegalModule.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Token_Handler _tokenHandler;
        public AuthController(Token_Handler tokenHandler)
        {
            _tokenHandler = tokenHandler;
        }
        [HttpPost("TokenCheck")]
        public async Task<ActionResult<TokenCheckRes>> TokenCheck([FromBody] TokenCheckRequest request)
        {
            if (ModelState.IsValid)
            {
                request.employeeId =  Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
                request.token = Encrypt_Decrypt.Aes_Handler.Decrypt(request.token).Result;

                var result1 = _tokenHandler.ValidateToken(request.token, request.employeeId);
                if (result1.isvalid)
                {
                    
                    string k = result1.isvalid.ToString();

                  return Ok(new TokenCheckRes
                  {
                      status = await Encrypt_Decrypt.Aes_Handler.Encrypt(result1.isvalid.ToString()),
                      message= await Encrypt_Decrypt.Aes_Handler.Encrypt(result1.message),
                  });
                }
                return Unauthorized(new TokenCheckRes
                {
                    status = await Encrypt_Decrypt.Aes_Handler.Encrypt(result1.isvalid.ToString()),
                    message = await Encrypt_Decrypt.Aes_Handler.Encrypt(result1.message),
                });
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
    }
}

