using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace API.Handler
{
    public class PrivateAPIManager
    {
        private readonly HttpClient _httpClient;
        public PrivateAPIManager(IConfiguration configuration)
        {
            var baseUrl = configuration["baseUrl"];
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri(baseUrl);
        }
        public async Task<string> PostData(string data, string authToken, string endPoint)
            {
            if (authToken.Split('~').Length > 1)
            {
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", authToken.Split('~')[0]);
                _httpClient.DefaultRequestHeaders.Add("EmployeeAuthorization", authToken.Split('~')[1]);
            }
            else
            {
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", authToken);
            }
            
            var content = new StringContent(data, Encoding.UTF8, "application/json");

            //HttpResponseMessage response = await _httpClient.PostAsync(new Uri(_httpClient.BaseAddress, endPoint), content);
            HttpResponseMessage response = await _httpClient.PostAsync(endPoint, content);
            
            if (response.IsSuccessStatusCode)
            {
                string responseContent = await response.Content.ReadAsStringAsync();
                return responseContent;
            }
            else if (response.StatusCode==System.Net.HttpStatusCode.Unauthorized)
            {
                //return response.StatusCode.ToString();
                throw new UnauthorizedAccessException("Unauthorized request.");
            }
            else
            {
                string c = await response.Content.ReadAsStringAsync();
                return c;
            }
        }
        public static string EncryptedString(string cipherText)
        {
            string original = cipherText;
            using (RijndaelManaged myRijndael = new RijndaelManaged())
            {
                var keybytes = Encoding.UTF8.GetBytes("7x!A%D*G-KaPdSgV");
                var iv = Encoding.UTF8.GetBytes("7x!A%D*G-KaPdSgV");
                // Encrypt the string to an array of bytes.
                byte[] encrypted = EncryptStringToBytes(original, keybytes, iv);
                string cipherText1 = Convert.ToBase64String(encrypted);
                return string.Format(cipherText1);
            }
        }
        private static byte[] EncryptStringToBytes(string plainText, byte[] key, byte[] iv)
        {
            // Check arguments.  
            if (plainText == null || plainText.Length <= 0)
            {
                throw new ArgumentNullException("plainText");
            }
            if (key == null || key.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            if (iv == null || iv.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            byte[] encrypted;
            // Create a RijndaelManaged object  
            // with the specified key and IV.  
            using (var rijAlg = new RijndaelManaged())
            {
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.FeedbackSize = 128;

                rijAlg.Key = key;
                rijAlg.IV = iv;

                // Create a decrytor to perform the stream transform.  
                var encryptor = rijAlg.CreateEncryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for encryption.  
                using (var msEncrypt = new MemoryStream())
                {
                    using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (var swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.  
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }
            // Return the encrypted bytes from the memory stream.  
            return encrypted;
        }
    }
}
