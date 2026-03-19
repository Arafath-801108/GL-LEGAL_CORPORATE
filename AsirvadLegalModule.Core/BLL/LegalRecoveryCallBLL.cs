using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static AsirvadLegalModule.DTO.LegalRecoveryCall.Request.LegalRecoveryCallRequest;

namespace AsirvadLegalModule.Core.BLL
{
    public class LegalRecoveryCallBLL
    {
        private readonly static Lazy<LegalRecoveryCallBLL> m_instance;

        public static LegalRecoveryCallBLL Instance
        {
            get
            {
                return LegalRecoveryCallBLL.m_instance.Value;
            }
        }

        static LegalRecoveryCallBLL()
        {
            LegalRecoveryCallBLL.m_instance = new Lazy<LegalRecoveryCallBLL>(() => new LegalRecoveryCallBLL());

        }
        public async Task<string> proc_recoverycall_select(LegalRecoveryDeatailsRequest request)
        {
            string Result;

            try
            {
                Result = new LegalRecoveryCallDatasource().proc_recoverycall_select(request);
            }
            catch (Exception)
            {
                throw;
            }

            // string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(Result).Result; // Encrypt the JSON string
            return encryptedResponse;
        }
        public async Task<string> PROC_RECOVERY_EMPLOYEE_CONFIRM_NEW(LegalRecoveryDeatailsRequest request)
        {

            string Result;

            try
            {
                Result = new LegalRecoveryCallDatasource().PROC_RECOVERY_EMPLOYEE_CONFIRM_NEW(request);

            }
            catch (Exception)
            {
                throw;
            }

            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(Result).Result; // Encrypt the JSON string
            return encryptedResponse;
        }
        
    }
}
