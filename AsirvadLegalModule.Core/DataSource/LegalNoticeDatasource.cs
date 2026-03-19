using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;

using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.DTO.LegalNotice.Request;
using AsirvadLegalModule.DTO.LegalNotice.Response;
using AsirvadLegalModule.DTO.Response;
using DBAccessLibrary;
using Microsoft.AspNetCore.Http.HttpResults;
using Newtonsoft.Json;


namespace AsirvadLegalModule.Core.DataSource
{
    public class LegalNoticeDatasource
    {
        public LegalRequestResponse LegalRequestSubmit(LegalRequestRequest request)
        {
            LegalRequestResponse response = new LegalRequestResponse();
            DataTable dt = new DataTable();
            string indata = request.indata + "~" + request.employeeId + "~" + request.branchId;
            int flag = Convert.ToInt32(request.flag);
            dt = Procedures.LegalRequest(flag,indata).Tables[0];
            if (dt == null || dt.Rows.Count == 0 || dt.Rows[0][0]?.ToString() == "-1")
            {
                response.outdata = null;
                response.status = "False";
            }
            else
            {
                response.outdata = dt.Rows[0][1] != DBNull.Value ? dt.Rows[0][1]?.ToString() : null;
                response.status = "True";
            }

            return response;
           
        }

        public DropdownResponse TypeDropdown(DropdownRequest request)
        {
            DropdownResponse response = new DropdownResponse();
            List<Dropdown> obj1 = new List<Dropdown>();
            DataTable dt1 = new DataTable();
            string indata = request.indata;
            int flag = Convert.ToInt32(request.flag);
            dt1 = Procedures.LegalRequest(flag, indata).Tables[0];
            if (dt1.Rows.Count > 0)
            {
                foreach (DataRow row in dt1.Rows)
                {
                    Dropdown sd = new Dropdown
                    {
                        items = row[0].ToString(),
                        items_name = row[1].ToString()

                    };
                    obj1.Add(sd);
                }
            }
            if ( obj1.Count > 0)
            {
                response.status = "True";
                
                response.Dropdown = obj1;
            }
            else
            {
                response.status = "False";
               
                response.Dropdown = null;
            }
            return response;

        }


        public DropdownResponse Dropdown(DropdownRequest request)
        {
            DropdownResponse response = new DropdownResponse();
            List<Dropdown> obj1 = new List<Dropdown>();
            DataTable dt1 = new DataTable();
            string indata = request.enindata;
            int flag = Convert.ToInt32(request.flag);
            dt1 = Procedures.LegalRequest(flag, indata).Tables[0];
            if (dt1.Rows.Count > 0)
            {
                foreach (DataRow row in dt1.Rows)
                {
                    Dropdown sd = new Dropdown
                    {
                        items = row[0].ToString(),
                        items_name = row[1].ToString()

                    };
                    obj1.Add(sd);
                }
            }
            if (obj1.Count > 0)
            {
                response.status = "True";

                response.Dropdown = obj1;
            }
            else
            {
                response.status = "False";

                response.Dropdown = null;
            }
            return response;

        }

        public LegalFetchResponse LegalFetch(LegalFetchRequest request)
        {
            LegalFetchResponse response = new LegalFetchResponse();
            List<Dropdown> obj1 = new List<Dropdown>();
            DataTable dt = new DataTable();
            string indata = request.indata;
            int flag = Convert.ToInt32(request.flag);
            dt = Procedures.LegalRequest(flag, indata).Tables[0];
            if (dt.Rows.Count > 0)
            {
                response.status = "True";

                response.data1=(string?)dt.Rows[0][0];

            }
            return response;

        }
        public DropdownResponse PdfUpload(pdfRequest request)
        {
            DropdownResponse response = new DropdownResponse();
            List<Dropdown> obj1 = new List<Dropdown>();
            DataTable dt1 = new DataTable();
            string indata = request.indata;
            int flag = Convert.ToInt32(request.flag);
            dt1 = Procedures.PdfUpload(flag,request.img, indata).Tables[0];
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


        public pdfviewResponse Pdfview(LegalRequestRequest request)
        {
            pdfviewResponse response = new pdfviewResponse();
            try
            {
                
                //List<Dropdown> obj1 = new List<Dropdown>();
                DataTable dt1 = new DataTable();
                string indata = request.indata;
                int flag = Convert.ToInt32(request.flag);
                dt1 = Procedures.LegalRequest(flag, indata).Tables[0];
                if (dt1.Rows.Count > 0 && dt1.Rows[0][0] != DBNull.Value)
                {
                    // Cast the BLOB data to byte array
                    byte[] blobData = (byte[])dt1.Rows[0][0];

                    // Convert byte array to base64 string
                    string base64Result = Convert.ToBase64String(blobData);

                    // Now you can use base64Result
                    Console.WriteLine($"Base64 length: {base64Result.Length}");
                    response.outdata= base64Result;
                    response.status= "True";
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

        public ReportResponse Report(ReportRequest request)
        {
            ReportResponse response = new ReportResponse();

            DataTable dt1 = new DataTable();
            string indata = request.indata + "~" + request.Encrypted_data;
            int flag = Convert.ToInt32(request.flag);
            dt1 = Procedures.Report(flag, indata).Tables[0];




            response.outdata = JsonConvert.SerializeObject(dt1, Formatting.Indented);




            return response;

        }
    }
}
