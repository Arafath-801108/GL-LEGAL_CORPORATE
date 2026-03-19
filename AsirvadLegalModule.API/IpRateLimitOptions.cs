//using AspNetCoreRateLimit;
//using System.Collections.Generic;

//namespace AsirvadLegalModule.API
//{
//    public class IpRateLimitOptions : RateLimitOptions
//    {
//            public IpRateLimitOptions();

//            public string RealIpHeader { get; set; }
//            public string ClientIdHeader { get; set; }
//            public string IpPolicyPrefix { get; set; }
//            public List<string> IpWhitelist { get; set; }

//}
//}
using AsirvadLegalModule.Core;
using AsirvadLegalModule.DTO.Response;
using Serilog;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;
using System.Net.NetworkInformation;
using System.Net;
using System.Text.Json;

public class RateLimitHander
{
    private readonly RequestDelegate _next;

    public RateLimitHander(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext httpContext)
    {
        try
        {
            httpContext.Request.Headers.TryGetValue("EmployeeAuthorization", out var empHeader);
            if (string.IsNullOrWhiteSpace(empHeader))
            {
                 await _next(httpContext);return;
            }
               
            int user = Convert.ToInt32(RSA.Decrypt(empHeader.ToString() ?? throw new ArgumentNullException("Emp Code is Empty, So Unable to track the users Usage")));
            if (string.IsNullOrWhiteSpace(user.ToString()))
            {
                Log.Error("Rate Limit", "Emp Code is Empty, So Unable to track the users Usage");
                httpContext.Response.ContentType = "application/json";
                httpContext.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;

                var Result = new
                {
                    result = "Emp Code is Empty, So Unable to track the users Usage",
                    status = 429,
                    Message = "Emp Code is Empty, So Unable to track the users Usage",
                    ErrorCode = "#001"
                };
                string responseData = await Aes_Handler.Encrypt(JsonSerializer.Serialize(Result));

                await httpContext.Response.WriteAsync(JsonSerializer.Serialize(new { result = responseData }));
                return;
            }

           string? Emp_code =  httpContext.Request.Headers["EmployeeAuthorization"];
            Emp_code = RSA.Decrypt(Emp_code??string.Empty);
            var Ratelimit_status = Procedures.legal_rate_limit(Emp_code ?? string.Empty, 0);



            if (Ratelimit_status.err_sts != "1")
            {
                Log.Error("Rate Limit", Ratelimit_status.err_code);
                httpContext.Response.ContentType = "application/json";
                httpContext.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;

                var Result = new
                {
                    result = "Rate Limit Reached, Kindly Try After Few Minutes",
                    status = 429,
                    Message = "Rate Limit Reached, Kindly Try After Few Minutes",
                    ErrorCode = "#002"
                };
                string res = await Aes_Handler.Encrypt(JsonSerializer.Serialize(Result));

                //await httpContext.Response.WriteAsync(JsonSerializer.Serialize(new { result = res }));
                await httpContext.Response.WriteAsync(res);
                return;
            }

            await _next(httpContext);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Emp Code is Empty, So Unable to track the users Usage");
            throw;
        }
    }
}