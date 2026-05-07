using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsirvadLegalModule.DTO.ExplainationModule.Response
{
    public class ExplainationResponse
    {
        public class BranchLoadRes
        {
            public string BRANCH_ID { get; set; }
            public string BRANCH_NAME { get; set; }
        }

        public class CustomerRes
        {
            public string IRR_CODE { get; set; }
        }

        public class IrrCustomerRes
        {
            public string cust_id { get; set; }
            public string cust_name { get; set; }
            public string pledge_no { get; set; }
            public string status { get; set; }
        }

        public class ReportRes
        {
            public string cust_id { get; set; }
            public string cust_name { get; set; }
            public string div_name { get; set; }
            public string area_name { get; set; }
            public string branch_name { get; set; }
            public string rm_date { get; set; }
            public string document {  get; set; }
            public string doc_type { get; set; }
        }

    }
}
