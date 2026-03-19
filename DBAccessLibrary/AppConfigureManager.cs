using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;


namespace DBAccessLibrary
{
    public class AppConfigureManager
    {
        public static string DbConnectionString = string.Empty;
        public static string ApiBaseUrl = string.Empty;
        public static string DOMAIN_URL = string.Empty;


        public AppConfigureManager()
        {
            var configurationBuilder = new ConfigurationBuilder();
            var path = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");

            configurationBuilder.AddJsonFile(path, false);

            var root = configurationBuilder.Build();


            DbConnectionString = root.GetSection("ConnectionStrings").GetSection("DbConnection").Value;
            //ApiBaseUrl = root.GetSection("baseUrl").Value;
            //DOMAIN_URL = root.GetSection("DOMAIN_URL").Value;


        }
            
        public string GetConnectionString
        {
            get => DbConnectionString;
        }
        //public string GetApiBaseUrl
        //{
        //    get => ApiBaseUrl;
        //}
        //public string GetDOMAIN_URL
        //{
        //    get => DOMAIN_URL;
        //}

    }
}
