using AsirvadLegalModule.API;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;

var builder = WebApplication.CreateBuilder(args);

// Configure JSON serialization options
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = null;
    options.SerializerOptions.DictionaryKeyPolicy = null;
    options.SerializerOptions.WriteIndented = true;
    options.SerializerOptions.PropertyNameCaseInsensitive = false;
});

// Load configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);
// Add services to the container.

// Configure Authentication with JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
 {
     options.Events = new JwtBearerEvents
     {
         OnMessageReceived = async context =>
         {
             try
             {
                 if (context.Request.Headers.TryGetValue("Authorization", out var tokenHeader) && context.Request.Headers.TryGetValue("EmployeeAuthorization", out var empHeader))
                 {
                     var decryptedToken = await Aes_Handler.Decrypt(tokenHeader.ToString().Replace("Bearer ", ""));
                     Token_Handler tokenHandler = new Token_Handler(builder.Configuration);
                     var validateToken = tokenHandler.ValidateToken(decryptedToken, RSA.Decrypt(empHeader.ToString()));
                     context.Response.Headers["WWW-Token-Result"] = validateToken.message;
                     if (validateToken.isvalid)
                     {
                         context.Token = decryptedToken;
                     }
                     else
                     {
                         context.NoResult();
                     }
                     
                 }
             }
             catch (Exception ex)
             {
                 context.Response.Headers["WWW-Token-Result"] = string.Concat("Exception Message", ":-", ex.Message);
                 context.NoResult();
             }
         },
     };
     options.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuer = true,
         ValidateAudience = true,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,
         ClockSkew = TimeSpan.Zero,
         RequireExpirationTime = true,
         ValidIssuer = jwtSettings["Issuer"]?? throw new ArgumentNullException("JwtIssuer is missing in configuration"),
         ValidAudience = jwtSettings["Audience"] ?? throw new ArgumentNullException("JwtAudience is missing in configuration"),
         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? throw new ArgumentNullException("JwtKey is missing in configuration"))),
     };
 });
//builder.Services.AddMemoryCache(); // Required for storing rate limit counters
//builder.Services.AddInMemoryRateLimiting();
//builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
// inject counter and rules stores
//builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
builder.Services.AddAuthorization();

builder.Services.AddControllers();
builder.Services.AddScoped<Token_Handler>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
//app.UseIpRateLimiting();


// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}
//app.Use(async (context, next) =>
//{
//    context.Response.Headers.Add("Content-Security-Policy", new StringValues("default-src 'self'"));
//    context.Response.Headers.Add("X-Content-Type-Options", new StringValues("nosniff"));
//    context.Response.Headers.Add("X-Frame-Options", new StringValues("SAMEORIGIN"));
//    context.Response.Headers.Add("X-XSS-Protection", new StringValues("1; mode=block"));

//    // Adding Referrer Policy
//    context.Response.Headers.Add("Referrer-Policy", new StringValues("no-referrer"));

//    // Adding Permission Policy
//    context.Response.Headers.Add("Permissions-Policy", new StringValues("geolocation=(self), microphone=()"));

//    // Adding Cross-Origin Embedder Policy
//    context.Response.Headers.Add("Cross-Origin-Embedder-Policy", new StringValues("require-corp"));

//    // Adding Cross-Origin-Resource-Policy
//    context.Response.Headers.Add("Cross-Origin-Resource-Policy", new StringValues("same-origin"));

//    // Adding Cross-Origin-Opener-Policy
//    context.Response.Headers.Add("Cross-Origin-Opener-Policy", new StringValues("same-origin"));

//    context.Response.Headers.Add("Strict-Transport-Security", new StringValues("max-age=31536000; includeSubDomains"));
//    //context.Response.Headers.Add("Content-Security-Policy", "img-src 'self' data:; script-src  'self' 'nonce-abc123' ; base-uri 'self';object-src 'self' 'nonce-abc123'");


//    context.Response.Headers.Add("X-Response-Timestamp", DateTime.UtcNow.ToString("o"));
//    await next();
//});

//LIMITLESS BRUTFORCING BY 100887 VAPT
//services.Configure<IpRateLimitOptions>(options =>
//{
//    options.EnableEndpointRateLimiting = true;
//    options.StackBlockedRequests = false;
//    options.HttpStatusCode = 429;
//    options.RealIpHeader = "X-Real-IP";
//    options.ClientIdHeader = "X-ClientId";
//    options.GeneralRules = new List<RateLimitRule>
//        {
//            new RateLimitRule
//            {
//                Endpoint = "*",
//                Period = "15s",
//                Limit = 15,
//            }
//        };
//});
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
//app.UseMiddleware<RateLimitHander>();
app.MapControllers();

app.Run();
