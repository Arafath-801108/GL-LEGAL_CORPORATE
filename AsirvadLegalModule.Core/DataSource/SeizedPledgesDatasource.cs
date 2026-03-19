using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.DTO.SeizedPledges.Request;
using AsirvadLegalModule.DTO.SeizedPledges.Response;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;

using System.Threading.Tasks;
using System.Xml;

namespace AsirvadLegalModule.Core.DataSource
{
   public class SeizedPledgesDatasource
    {
     
        public string PledgeLoad(SeizedPledgesRequest request)
        {
            
            string flag = request.Flag ?? ""; 
            string indata = request.Indata ?? "0";
            SeizedPledgesResponse response = new SeizedPledgesResponse();
            response = Procedures.SeizedData(flag,indata);
           
            return JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = false // Equivalent to Formatting.None in Newtonsoft.Json
            });
        
        }
        public string LO9Submit(Lo9DocumentRequest request)
        {
            
            string indata = request.Indata ?? "0";

            SeizedPledgesResponse response = Procedures.Lo9Submit(indata, request.PledgeNo, request.CaseCategory, request.Lo9Doc, request.Lo9Ex, request.RecDoc, request.RecEx, request.DraftDoc, request.DraftEx, request.EmpId);
            return JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = false
            });
        }


        public SeizedClassResponse SeizedClassSubmit(SeizedPledgesRequest request)
        {
            SeizedClassResponse response = new SeizedClassResponse();

            try
            {
                // Pass flag and data from request object to ClassSubmit
                string result = Procedures.ClassSubmit(request.Flag, request.Indata);
                response.message = string.IsNullOrEmpty(result) ? "Error Occurred! Please try again." : result;
            }
            catch (Exception ex)
            {
                response.message = $"Error Occurred: {ex.Message}";
            }

            return response;
        }

        public SettleAmountResponse SettleAmountFetch(SetAmountRequest request)
        {
            SettleAmountResponse response = new SettleAmountResponse();

            try
            {
                // Pass flag and data from request object to ClassSubmit
                string result = Procedures.SettleAmount(request.loan_no);
                response.amount = result;
            }
            catch (Exception)
            {
                //response.amount = $"Error Occurred: {ex.Message}";
                response.amount = "The pledge ";
            }

            return response;
        }



        public SettleSubmitResponse SettleSubmit(SetSubmitRequest request)
        {
            SettleSubmitResponse response = new SettleSubmitResponse();

            try
            {
                // Pass flag and data from request object to ClassSubmit
                string result = Procedures.SettleSubmit(request.loan_no,request.empId,request.remark);
                response.err_sts = string.IsNullOrEmpty(result) ? "Error Occurred! Please try again." : result;
            }
            catch (Exception ex)
            {
                response.err_sts = $"Error Occurred: {ex.Message}";
            }

            return response;
        }


        public SettleSubmitResponse SettleReject(SetSubmitRequest request)
        {
            SettleSubmitResponse response = new SettleSubmitResponse();

            try
            {
                // Pass flag and data from request object to ClassSubmit
                string result = Procedures.SettleReject(request.loan_no, request.empId, request.remark);
                response.err_sts = string.IsNullOrEmpty(result) ? "Error Occurred! Please try again." : result;
            }
            catch (Exception ex)
            {
                response.err_sts = $"Error Occurred: {ex.Message}";
            }

            return response;
        }
    }

}
