using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.DTO.AdvocateEmpanelment.Request;
using AsirvadLegalModule.DTO.AdvocateEmpanelment.Response;
using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.DTO.ChequeCollection.Response;
using AsirvadLegalModule.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AsirvadLegalModule.Core.BLL
{
    public class AdvocateEmpanelmentBLL
    {
        private readonly static Lazy<AdvocateEmpanelmentBLL> m_instance;

        public static AdvocateEmpanelmentBLL Instance
        {
            get
            {
                return AdvocateEmpanelmentBLL.m_instance.Value;
            }
        }
        static AdvocateEmpanelmentBLL()
        {
            AdvocateEmpanelmentBLL.m_instance = new Lazy<AdvocateEmpanelmentBLL>(() => new AdvocateEmpanelmentBLL());

        }
        public async Task<string>EmpanelmentRequest(EmpanelmentRequest request)
        {

            EmpanelmentResponse response = new EmpanelmentResponse();

            try
            {

                response = new AdvocateEmpanelmentDataSource().EmpanelmentRequest(request);

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
