using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.DTO.ChequeCollection.Response;
using AsirvadLegalModule.DTO.Response;
using DBAccessLibrary;
using Microsoft.AspNetCore.Http.HttpResults;
using AsirvadLegalModule.DTO.LegalNotice.Request;
using AsirvadLegalModule.DTO.LegalNotice.Response;
using System.Text.Json;

namespace AsirvadLegalModule.Core.DataSource
{
    public class ChequeCollectionDatasource
    {
        public ChequeCollectionResponse Challan_bh_data(ChequeCollectionRequest request)
        {
            ChequeCollectionResponse response = new ChequeCollectionResponse();
            //DataTable dt = new DataTable();
            string indata = request.Encrypted_data + "~" + request.Indata;
            int flag = Convert.ToInt32(request.Flag);
            response = Procedures.ChequeCollection(flag, indata);
            //if (response.status=='')

            return response;

        }


        public ChequeCollectionResponse Pdfdown(ChequeCollectionRequest request)
        {
            ChequeCollectionResponse response = new ChequeCollectionResponse();
            try
            {

                //List<Dropdown> obj1 = new List<Dropdown>();
                DataTable dt1 = new DataTable();
                string indata = request.Indata;
                int flag = Convert.ToInt32(request.Flag);
                //dt1 = Procedures.LegalRequest(flag, indata).Tables[0];
                //response = Procedures.ChequeCollection_(flag, indata);
                dt1 = Procedures.ChequeCollection_imgdownload(flag, indata).Tables[0];
                if (dt1.Rows.Count > 0 && dt1.Rows[0][0] != DBNull.Value)
                {
                    // Cast the BLOB data to byte array
                    byte[] blobData = (byte[])dt1.Rows[0][0];

                    // Convert byte array to base64 string
                    string base64Result = Convert.ToBase64String(blobData);

                    // Now you can use base64Result
                    Console.WriteLine($"Base64 length: {base64Result.Length}");
                    response.outdata = base64Result;
                    response.status = "True";
                }
                else
                {
                    response.status = "False";
                    response.outdata = null;
                    // Handle case where no data is found or data is null
                    Console.WriteLine("No BLOB data found or data is null");
                }
            }
            catch (Exception ex)
            {
            }
            return response;
        }

        public string ChequeUpdate(ChequeUpdationRequest request)
        {

            int flag = request.Flag;
            string indata = request.Indata ?? "0";
            ChequeCollectionResponse response = new ChequeCollectionResponse();
            response = Procedures.ChequeCollection(flag, indata);


            return JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = false // Equivalent to Formatting.None in Newtonsoft.Json
            });
        }

        public ChequeUploadResponse PdfUpload1(ChequeDocumentRequest request)
        {
            ChequeUploadResponse response = new ChequeUploadResponse();
            DataTable dt1 = new DataTable();
            string indata = request.Indata;
           
            dt1 = Procedures.PdfUpload(request.Flag, request.Img, indata).Tables[0];
            if (dt1 == null || dt1.Rows.Count == 0 || dt1.Rows[0][0]?.ToString() == "0")
            {

                response.status = "False";
            }
            else
            {

                response.status = "True";
            }
            return response;

        }
    }
}
