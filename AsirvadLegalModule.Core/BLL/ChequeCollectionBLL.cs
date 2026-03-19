using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.DTO.ChequeCollection.Response;
using AsirvadLegalModule.DTO.LegalNotice.Request;
using AsirvadLegalModule.DTO.LegalNotice.Response;
using AsirvadLegalModule.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
namespace AsirvadLegalModule.Core.BLL
{
    public class ChequeCollectionBLL
    {
        private readonly static Lazy<ChequeCollectionBLL> m_instance;

        public static ChequeCollectionBLL Instance
        {
            get
            {
                return ChequeCollectionBLL.m_instance.Value;
            }
        }

        static ChequeCollectionBLL()
        {
            ChequeCollectionBLL.m_instance = new Lazy<ChequeCollectionBLL>(() => new ChequeCollectionBLL());

        }
        public async Task<string> Challan_bh_data(ChequeCollectionRequest request)
        {

            ChequeCollectionResponse response = new ChequeCollectionResponse();

            try
            {

                response = new ChequeCollectionDatasource().Challan_bh_data(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }

        public async Task<string> pdfdown(ChequeCollectionRequest request)
        {

            ChequeCollectionResponse response = new ChequeCollectionResponse();

            try
            {

                response = new ChequeCollectionDatasource().Pdfdown(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }

        public async Task<string> ChequeUpdate(ChequeUpdationRequest request)
        {
            string Result;

            try
            {
                Result = new ChequeCollectionDatasource().ChequeUpdate(request);
            }
            catch (Exception)
            {
                throw;
            }


            string encryptedResponse = Encrypt_Decrypt.Aes_Handler.Encrypt(Result).Result;
            return encryptedResponse;
        }

        public async Task<string> PdfUpload1(ChequeDocumentRequest request)
        {

            ChequeUploadResponse response = new ChequeUploadResponse();

            try
            {

                response = new ChequeCollectionDatasource().PdfUpload1(request);

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
