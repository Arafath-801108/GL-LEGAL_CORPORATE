using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.DTO.LegalAudit;

using AsirvadLegalModule.Utilities;
using System;
using System.Threading.Tasks;

namespace AsirvadLegalModule.Core.BLL
{
    public class LegalAuditBLL
    {
        private readonly static Lazy<LegalAuditBLL> m_instance;

        public static LegalAuditBLL Instance
        {
            get
            {
                return LegalAuditBLL.m_instance.Value;
            }
        }

        static LegalAuditBLL()
        {
            LegalAuditBLL.m_instance = new Lazy<LegalAuditBLL>(() => new LegalAuditBLL());
        }

        /// <summary>
        /// Business Logic for Step 1: Daily Irregularity Report
        /// </summary>
        public async Task<string> Proc_new_RIIM_Legal_Details(LegalAuditRequest request)
        {
            string Result;

            try
            {
                // Calling the Datasource service you just created
                Result = new LegalAuditDatasource().Proc_new_RIIM_Legal_Details(request);
            }
            catch (Exception)
            {
                throw;
            }

            // Encrypt the JSON result string before sending it back to the Controller
            // This matches your security pattern for modern web apps
            string encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(Result);

            return encryptedResponse;
        }
    }
}