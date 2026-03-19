using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.DTO.ChequeCollection.Response;
using AsirvadLegalModule.DTO.LegalFIR.Response;
using AsirvadLegalModule.DTO.LegalFIR.Request;
using AsirvadLegalModule.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AsirvadLegalModule.Core.BLL
{
    public class LegalPoliceFirBLL
    {

        private readonly static Lazy<LegalPoliceFirBLL> m_instance;

        public static LegalPoliceFirBLL Instance
        {
            get
            {
                return LegalPoliceFirBLL.m_instance.Value;
            }
        }

        static LegalPoliceFirBLL()
        {
            LegalPoliceFirBLL.m_instance = new Lazy<LegalPoliceFirBLL>(() => new LegalPoliceFirBLL());

        }


        public async Task<string> viewBranch(PoliceFirEntryRequest request)
        {

            LegalFIRResponse response = new LegalFIRResponse();

            try
            {

                response = new LegalPoliceFirDatasource().viewbranchdata(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }
    }
}
