using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using DBAccessLibrary;
using Oracle.ManagedDataAccess.Client;
using System.Data;
using AsirvadLegalModule.Core;
using AsirvadLegalModule.DTO.Response;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using System.Net.NetworkInformation;
using System;


namespace AsirvadLegalModule.API
{
    public class Token_Handler
    {
        private readonly IConfiguration _config;

        public Token_Handler(IConfiguration config)
        {
            _config = config ?? throw new ArgumentNullException(nameof(config));
        }

        public (bool isvalid,string Token) CreateToken(string username, string role)
        {
        var jwtSettings = _config.GetSection("JwtSettings");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            IssuedAt = DateTime.UtcNow,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        string _GenToken=tokenHandler.WriteToken(token);
            try
            {
                string indata = username +"~"+ _GenToken + "~" + DateTime.Now.AddHours(1).ToString("dd-MM-yyyy HH:mm:ss"); ;
                string res = Procedures.Session_check(indata, "1");
                if (res == "1")
                { 
                    return (true,_GenToken);
                }
                
            }
            catch (Exception ex) {
                
            }
            return (false,null);


    }
        //validate JWT Token
        public  (bool isvalid, string message) ValidateToken(string jwtToken, string emp_code)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.Zero,
                RequireExpirationTime = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(key),

            };

            try
            {
                string indata = emp_code + "~" + jwtToken ;
                string res = Procedures.Session_check(indata, "2");
                if (res == "2")
                {
                    var principal = tokenHandler.ValidateToken(jwtToken, validationParameters, out SecurityToken validatedToken);

                    ClaimsPrincipal Claim_principal = GetPrincipal(jwtToken);
                    if (Claim_principal == null)
                        throw new SecurityTokenMalformedException("Claim's was Null");

                    var emp_id = principal.FindFirst(ClaimTypes.Name)?.Value;
                    if (string.IsNullOrWhiteSpace(emp_id))
                        throw new SecurityTokenMalformedException("Claim's was Null");

                    var expClaim = principal.Claims.First(x => x.Type == "exp").Value;
                    var tokenExpiryTime = UnixTimeToDateTime(Convert.ToInt64(expClaim));

                    if (emp_id == emp_code)
                    {
                        if (tokenExpiryTime < DateTime.UtcNow)
                            throw new SecurityTokenExpiredException("Token expired");

                        return (true, "Valid Token");
                    }
                    else
                    {
                        return (false, "Invalid Token");
                    }
                }
                else
                {
                    return (false, "Invalid Token");
                }
            }
            catch (SecurityTokenExpiredException)
            {
                return (false, "Token expired");
            }
            catch (SecurityTokenInvalidSignatureException)
            {
                return (false, "Invalid token signature.");
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }

        //Get Principal from Token
        public  ClaimsPrincipal GetPrincipal(string token)
        {
            try
            {
                var jwtSettings = _config.GetSection("JwtSettings");
                var Jkey = jwtSettings["Key"];
                JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                JwtSecurityToken jwtToken = (JwtSecurityToken)tokenHandler.ReadToken(token);
                if (jwtToken == null)
                    throw new UnauthorizedAccessException("JWT token is required for authentication, In Get Principal JWT Token in null");
              
                TokenValidationParameters parameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero,
                    RequireExpirationTime = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Jkey ?? string.Empty)),
                };
                SecurityToken securityToken;
                ClaimsPrincipal principal = tokenHandler.ValidateToken(token,
                      parameters, out securityToken);
                return principal;
            }
            catch (Exception e)
            {
                throw new UnauthorizedAccessException(string.Concat("JWT token is required for authentication, In Get Principal - ", e.Message));
            }
        }

        //convert to UnixTime
        public static DateTime UnixTimeToDateTime(long unixtime)
        {
            return DateTimeOffset.FromUnixTimeSeconds(unixtime).DateTime.ToLocalTime();
        }

    }

}
