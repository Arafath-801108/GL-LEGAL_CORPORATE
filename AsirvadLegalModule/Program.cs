using API.Handler;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using Serilog;
using static AsirvadLegalModule.Exception_Handler;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CONFIGURE SERVICES ---

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(120);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.MaxAge = TimeSpan.FromMinutes(120);
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None;
});

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddControllersWithViews();
builder.Services.AddTransient<PrivateAPIManager, PrivateAPIManager>();

var app = builder.Build();

// --- 2. CONFIGURE MIDDLEWARE PIPELINE ---

app.UseSerilogRequestLogging();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseExceptionHandler("/Login");

// Static files MUST be allowed before custom security logic
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowAll");
app.UseSession();

// --- 3. CUSTOM SECURITY MIDDLEWARE ---
app.Use(async (context, next) =>
{
    var path = context.Request.Path.ToString().ToLower();

    // A. CORS HANDSHAKE
    if (HttpMethods.IsOptions(context.Request.Method))
    {
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
        return;
    }

    // B. BYPASS API & STATIC ASSETS (CRITICAL FIX)
    // This stops the middleware from redirecting your JS/CSS files to the Login page
    if (path.StartsWith("/api/") ||
        path.Contains("/js/") ||
        path.Contains("/lib/") ||
        path.Contains("/css/") ||
        path.EndsWith(".js") ||
        path.EndsWith(".css"))
    {
        await next.Invoke();
        return;
    }

    // C. UI NAVIGATION LOGIC
    var queryCount = context.Request.Query.Count;

    // Specific Page logic
    if (path.Equals("/recoverycalldetail/recoverycalldetail", StringComparison.OrdinalIgnoreCase) ||
        path.Equals("/empanelmentrequest/empanelmentletter", StringComparison.OrdinalIgnoreCase))
    {
        if (queryCount > 2) { context.Response.Redirect("/Login/Login"); return; }
    }
    else
    {
        // Fix: Added check to ensure we aren't redirecting actual file requests
        if (queryCount > 0 && !path.Contains("login") && !path.Contains("."))
        {
            context.Response.Redirect("/Login/Login");
            return;
        }
    }

    // D. CLEAR COOKIES ON LOGOUT/LOGIN ENTRY
    if (path == "/" || path == "/account/login" || path == "/account/logout" || path == "/login/login")
    {
        foreach (var item in context.Request.Cookies.Keys) { context.Response.Cookies.Delete(item); }
    }

    await next.Invoke();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Login}/{id?}");

app.Run();