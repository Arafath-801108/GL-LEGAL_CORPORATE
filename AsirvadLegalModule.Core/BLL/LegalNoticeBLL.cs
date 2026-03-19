using AsirvadLegalModule.Core.BLL.Login;
using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.Core.DataSource.Login;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
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
    public class LegalNoticeBLL
    {
        private readonly static Lazy<LegalNoticeBLL> m_instance;

        public static LegalNoticeBLL Instance
        {
            get
            {
                return LegalNoticeBLL.m_instance.Value;
            }
        }

        static LegalNoticeBLL()
        {
            LegalNoticeBLL.m_instance = new Lazy<LegalNoticeBLL>(() => new LegalNoticeBLL());

        }
        public async Task<string> LegalRequestSubmit(LegalRequestRequest request)
        {

            LegalRequestResponse response = new LegalRequestResponse();

            try
            {
                
                response =new LegalNoticeDatasource().LegalRequestSubmit(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }

        public async Task<string> Dropdown(DropdownRequest request)
        {

            DropdownResponse response = new DropdownResponse();

            try
            {

                response = new LegalNoticeDatasource().Dropdown(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }


        public async Task<string> TypeDropdown(DropdownRequest request)
        {

            DropdownResponse response = new DropdownResponse();

            try
            {

                response = new LegalNoticeDatasource().TypeDropdown(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }

        public async Task<string> LegalFetch(LegalFetchRequest request)
        {

            LegalFetchResponse response = new LegalFetchResponse();

            try
            {

                response = new LegalNoticeDatasource().LegalFetch(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }
        public async Task<string> PdfUpload(pdfRequest request)
        {

            DropdownResponse response = new DropdownResponse();

            try
            {

                response = new LegalNoticeDatasource().PdfUpload(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }



        public async Task<string> pdfview(LegalRequestRequest request)
        {

            pdfviewResponse response = new pdfviewResponse();

            try
            {

                response = new LegalNoticeDatasource().Pdfview(request);

            }
            catch (Exception)
            {
                throw;
            }

            string responseJson = JsonSerializer.Serialize(response); // Convert object to JSON string
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(responseJson); // Encrypt the JSON string
            return encryptedResponse;
        }

        public async Task<string> Report(ReportRequest request)
        {

            ReportResponse response = new ReportResponse();

            try
            {

                response = new LegalNoticeDatasource().Report(request);

            }
            catch (Exception)
            {
                throw;
            }
            var encryptedResponse = await Encrypt_Decrypt.Aes_Handler.Encrypt(response.outdata); // Encrypt the JSON string
            return encryptedResponse;
        }
    }
}
