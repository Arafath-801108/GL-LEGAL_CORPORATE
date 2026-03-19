using API.Handler;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using Serilog;
using static AsirvadLegalModule.Exception_Handler;

var builder = WebApplication.CreateBuilder(args);
//Seilog
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Add services to the container
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(120); // Set session timeout to 30 minutes
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.MaxAge = TimeSpan.FromMinutes(120);
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict;

});
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddTransient<PrivateAPIManager, PrivateAPIManager>();

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseSession();
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
   
}
 app.UseExceptionHandler("/Login");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();




app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
// Use session middleware

app.UseAuthorization();

app.Use(async (context, next) =>
{
    var path = context.Request.Path.ToString().ToLower();
    var key = context.Request.QueryString;
    var queryCount = context.Request.Query.Count;
    //if (!string.IsNullOrEmpty(key.ToString()) && context.Request.Query["menuId"].ToString() == "")
    //{
    //    context.Response.Redirect("Account/NoPageFound");
    //    return;
    //}
    if (path.Equals("/RecoveryCallDetail/RecoveryCallDetail",StringComparison.OrdinalIgnoreCase))
    {
        if(queryCount>2)
        {
            context.Response.Redirect("/Login/Login");
            return;

        }
    }
    else if (path.Equals("/EmpanelmentRequest/EmpanelmentLetter", StringComparison.OrdinalIgnoreCase))
    {
        if (queryCount > 2)
        {
            context.Response.Redirect("/Login/Login");
            return;

        }
    }
    else
    {
        if (queryCount > 0)
        {
            context.Response.Redirect("/Login/Login");
            return;

        }

    }


    if (path == "/" || path == "/account/login" || path == "/account/logout")
    {
        foreach (var items in context.Request.Cookies.Keys)
        {
            if (items.Any())
            {
                context.Response.Cookies.Delete(items);
            }
        }

    }

   // context.Response.Headers.Remove("Set-Cookie");
   // context.Response.Cookies.Delete("my-application-browser-tab");
   // context.Response.Headers.Append("Set-Cookie", ".my-application-browser-tab=secured; path=/;SameSite=Strict;HttpOnly=true;Secure=true");

   

   // context.Response.Headers[HeaderNames.CacheControl] = "no-cache, no-store, must-revalidate";
   // context.Response.Headers[HeaderNames.Expires] = "0";
   // context.Response.Headers[HeaderNames.Pragma] = "no-cache";




   // context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
   //context.Response.Headers.Append("Content-Security-Policy", "img-src 'self' data:  blob:; script-src  'nonce-5d67de6751aa4e158c33dfd828fc144b' 'strict-dynamic' ; base-uri 'self'; object-src 'none'");



   // context.Response.Headers.Append("Referrer-Policy", "no-referrer");



   // context.Response.Headers.Append("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()");


   // context.Response.Headers.Append("Cross-Origin-Embedder-Policy", "require-corp");

   // context.Response.Headers.Append("Cross-Origin-Resource-Policy", "same-origin");


   // context.Response.Headers.Append("Cross-Origin-Opener-Policy", "same-origin");

    await next.Invoke();
    

});


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Login}/{id?}");

app.Run();
