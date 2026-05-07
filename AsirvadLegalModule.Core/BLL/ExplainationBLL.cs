using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.DTO.ExplainationModule.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static AsirvadLegalModule.Core.Procedures;
using static AsirvadLegalModule.DTO.ExplainationModule.Response.ExplainationResponse;

namespace AsirvadLegalModule.Core.BLL
{
    public class ExplainationBLL
    {
        private readonly static Lazy<ExplainationBLL> m_instance;

        public static ExplainationBLL Instance
        {
            get
            {
                return ExplainationBLL.m_instance.Value;
            }
        }
        static ExplainationBLL()
        {
            ExplainationBLL.m_instance = new Lazy<ExplainationBLL>(() => new ExplainationBLL());

        }
        public async Task<string> getBranches(BranchloadRequest request)
        {
            List<BranchLoadRes> response;
            try
            {
                response = new ExplainationDatasource().BranchIdRetrieval(request);
            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response);
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson);
            return encryptedResponse;
        }


        public async Task<string> getIrrCodes(BranchloadRequest request)
        {
            var response = new ExplainationDatasource().IrrCodeRetrieval(request);
            string responseJson = JsonSerializer.Serialize(response);
            return await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson);
        }

        public async Task<string> getIrrCustomerDetails(IrrCodeRequest request)
        {
            var response = new ExplainationDatasource().IrrCustomerRetrieval(request);
            string responseJson = JsonSerializer.Serialize(response);
            return await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson);
        }

        public async Task<string> UpdateModule(ExplainationUpdateRequest request)
        {
            var response = new ExplainationDatasource().SaveExplaination(request);
            string responseJson = JsonSerializer.Serialize(response);
            return await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson);
        }

        public async Task<string> getReportExpl(ReportReq request)
        {
            var response = new ExplainationDatasource().ExpRptGet(request);
            string responseJson = JsonSerializer.Serialize(response);
            return await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson);
        }


    }
}
