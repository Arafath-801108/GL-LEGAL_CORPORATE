using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.LegalNotice.Response
{
    public class LegalRequestResponse
    {
        public string status { get; set; }
        public string outdata { get; set; }

    }

    public class DropdownResponse
    {
        public string status { get; set; }
        public List<Dropdown> Dropdown { get; set; }

    }
    public class Dropdown
    {
        public string? items { get; set; }

        public string? items_name { get; set; }
    }

    public class LegalFetchResponse
    {
        public string status { get; set; }
        public string data1 { get; set; }
        public string data2 { get; set; }
        public string data3 { get; set; }
        public string data4 { get; set; }
        public string data5 { get; set; }
        public string data6 { get; set; }
        public string data7 { get; set; }
        public string data8 { get; set; }
        public string data9 { get; set; }
        public string data10 { get; set; }
    }

    public class pdfviewResponse
    {
        public string status { get; set; }
        public string outdata { get; set; }
        public string img { get; set; }
    }
    public class ReportResponse
    {
        public string status { get; set; }
        public string outdata { get; set; }
       
    }
}