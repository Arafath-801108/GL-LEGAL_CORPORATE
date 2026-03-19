using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.DTO.PropertyIdentity.Request;
using AsirvadLegalModule.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static AsirvadLegalModule.DTO.LegalRecoveryCall.Request.LegalRecoveryCallRequest;

namespace AsirvadLegalModule.Core.BLL
{
    public class PropertyIdentityBLL
    {
        private readonly static Lazy<PropertyIdentityBLL> m_instance;

        public static PropertyIdentityBLL Instance
        {
            get
            {
                return PropertyIdentityBLL.m_instance.Value;
            }
        }

        static PropertyIdentityBLL()
        {
            PropertyIdentityBLL.m_instance = new Lazy<PropertyIdentityBLL>(() => new PropertyIdentityBLL());

        }
        public async Task<string> proc_property_identification(PropertyIdentityRequest request)
        {

            string Result;

            try
            {
                Result = new PropertyIdentityDatasource().proc_property_identification(request);

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
