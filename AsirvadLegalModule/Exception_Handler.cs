using AsirvadLegalModule.DTO.Response;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security;

namespace AsirvadLegalModule
{
    public class Exception_Handler
    {
        public class GlobalExceptionHandler() : IExceptionHandler
        {
            public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
            {
                httpContext.Response.StatusCode = exception is UnauthorizedAccessException
                            ? StatusCodes.Status401Unauthorized
                            : StatusCodes.Status500InternalServerError;

                //Session_Clear(httpContext);

                var details = new ProblemDetails()
                {
                    Status = httpContext.Response.StatusCode,
                    Detail = exception.Message,
                    
                };


                await httpContext.Response.WriteAsJsonAsync(details, cancellationToken: cancellationToken);
                return true;
            }
        }
        //public static void Session_Clear(HttpContext httpContext)
        //{
        //    var sessionValue = httpContext.Session;

        //    if (sessionValue.Keys.Any())
        //        httpContext.Session.Clear();
        //}
    }
}
