using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.DTO.IrregularityRecCall.Request;
using AsirvadLegalModule.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static AsirvadLegalModule.DTO.LegalRecoveryCall.Request.LegalRecoveryCallRequest;

namespace AsirvadLegalModule.Core.BLL
{
    public class IrregularitycallBLL
    {
        private readonly static Lazy<IrregularitycallBLL> m_instance;

        public static IrregularitycallBLL Instance
        {
            get
            {
                return IrregularitycallBLL.m_instance.Value;
            }
        }

        static IrregularitycallBLL()
        {
            IrregularitycallBLL.m_instance = new Lazy<IrregularitycallBLL>(() => new IrregularitycallBLL());

        }
        public async Task<string> PROC_IRREGULARITYCALL_SELECT(irregularitycallRequest request)
        {
            string Result;

            try
            {
                Result = new IrregularitycallDatasource().PROC_IRREGULARITYCALL_SELECT(request);
            }
            catch (Exception)
            {
                throw;
            }

            // string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(Result).Result; // Encrypt the JSON string
            return encryptedResponse;
        }

        public async Task<string> PROC_IRR_RECOVERY_CONFIRM(irregularitycallRequest request)
        {

            string Result;

            try
            {
                Result = new IrregularitycallDatasource().PROC_IRR_RECOVERY_CONFIRM(request);

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
