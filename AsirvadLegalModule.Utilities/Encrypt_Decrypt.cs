using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace AsirvadLegalModule.Utilities
{
    public class Encrypt_Decrypt
    {
        private const string _securityKey = "raju";

        public string CreateHash(string SourceText)
        {
            if (String.IsNullOrEmpty(SourceText))
            {
                return String.Empty;
            }
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(SourceText);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                return Convert.ToHexString(hashBytes);
            }
        }

        public static class get_key
        {
            public static string getKey(int defaultKey)
            {
                string xmlKeys = File.ReadAllText("keys.xml");


                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(xmlKeys);

                return defaultKey switch
                {
                    1 => xmlDoc.SelectSingleNode("//publickey//RSAKeyValue")?.OuterXml
                        ?? throw new InvalidOperationException("Public key not found"),
                    2 => xmlDoc.SelectSingleNode("//privatekey//RSAKeyValue")?.OuterXml
                        ?? throw new InvalidOperationException("Private key not found"),
                    3 => xmlDoc.SelectSingleNode("//aeskey")?.InnerText.Trim()
                        ?? throw new InvalidOperationException("AES key not found"),
                    _ => throw new ArgumentException("Invalid key type specified", nameof(defaultKey))
                };
            }
        }

        public static class RSA
        {
            public static void GenerateKeys(out string publicKeyXml, out string privateKeyXml)
            {
                using (RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(2048))
                {
                    publicKeyXml = rsa.ToXmlString(false);
                    privateKeyXml = rsa.ToXmlString(true);
                }
            }
            public static string Encrypt(string data)
            {
                try
                {
                    using (RSACryptoServiceProvider rsa = new RSACryptoServiceProvider())
                    {
                        rsa.FromXmlString(get_key.getKey(1));
                        byte[] dataToEncrypt = Encoding.UTF8.GetBytes(data);
                        byte[] encryptedData = rsa.Encrypt(dataToEncrypt, true);
                        return Convert.ToBase64String(encryptedData);
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public static string Decrypt(string data)
            {
                try
                {
                    using (RSACryptoServiceProvider rsa = new RSACryptoServiceProvider())
                    {
                        rsa.FromXmlString(get_key.getKey(2));
                        byte[] dataToDecrypt = Convert.FromBase64String(data);
                        byte[] decryptedData = rsa.Decrypt(dataToDecrypt, true);
                        return Encoding.UTF8.GetString(decryptedData);
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }

       
        public static class Aes_Handler
        {
            public static async Task<string> Encrypt(string data)
            {
                byte[] iv = new byte[16];
                string key = get_key.getKey(3);
                byte[] encrypted;
                using (System.Security.Cryptography.Aes aesAlg = System.Security.Cryptography.Aes.Create())
                {
                    aesAlg.Key = Encoding.UTF8.GetBytes(key);
                    aesAlg.IV = iv;

                    using (ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV))
                    using (MemoryStream msEncrypt = new MemoryStream())
                    {
                        using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            await swEncrypt.WriteAsync(data);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
                return Convert.ToBase64String(encrypted);
            }

            public static async Task<string> Decrypt(string data)
            {
                byte[] iv = new byte[16];
                string key = get_key.getKey(3);
                string decrypted;

                byte[] cipherText = Convert.FromBase64String(data);
                using (System.Security.Cryptography.Aes aesAlg = System.Security.Cryptography.Aes.Create())
                {
                    aesAlg.Key = Encoding.UTF8.GetBytes(key);
                    aesAlg.IV = iv;

                    using (ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV))
                    using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                    {
                        using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            decrypted = await srDecrypt.ReadToEndAsync();
                        }
                    }
                }
                return decrypted;
            }
        }

    }
}
