using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.DTO.SeizedPledges.Request;
using AsirvadLegalModule.DTO.SeizedPledges.Response;
using AsirvadLegalModule.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static AsirvadLegalModule.Core.BLL.SeizedPledgesBLL;

namespace AsirvadLegalModule.Core.BLL
{
  
   public class SeizedPledgesBLL
    {
        private readonly static Lazy<SeizedPledgesBLL> m_instance;

        public static SeizedPledgesBLL Instance
        {
            get
            {
                return SeizedPledgesBLL.m_instance.Value;
            }
        }

        static SeizedPledgesBLL()
        {
            SeizedPledgesBLL.m_instance = new Lazy<SeizedPledgesBLL>(() => new SeizedPledgesBLL());

        }
        public async Task<string> PledgeLoad(SeizedPledgesRequest request)
        {
            string Result;

            try
            {
                Result = new SeizedPledgesDatasource().PledgeLoad(request);
            }
            catch (Exception)
            {
                throw;
            }

           
            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(Result).Result; 
            return encryptedResponse;
        }

        public async Task<string> LO9Submit(Lo9DocumentRequest request)
        {
            string Result;

            try
            {
                Result = new SeizedPledgesDatasource().LO9Submit(request);
            }
            catch (Exception)
            {
                throw;
            }


            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(Result).Result;
            return encryptedResponse;
        }

        public async Task<string> ClassSeizedSubmit(SeizedPledgesRequest request)
        {

            SeizedClassResponse response = new SeizedClassResponse();

            try
            {
                response = new SeizedPledgesDatasource().SeizedClassSubmit(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }

        public async Task<string> SettleAmountFetch(SetAmountRequest request)
        {

            SettleAmountResponse response = new SettleAmountResponse();

            try
            {
                response = new SeizedPledgesDatasource().SettleAmountFetch(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }


        public async Task<string> SettleSubmit(SetSubmitRequest request)
        {

            SettleSubmitResponse response = new SettleSubmitResponse();

            try
            {
                response = new SeizedPledgesDatasource().SettleSubmit(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }

        public async Task<string> SettleReject(SetSubmitRequest request)
        {

            SettleSubmitResponse response = new SettleSubmitResponse();

            try
            {
                response = new SeizedPledgesDatasource().SettleReject(request);

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
