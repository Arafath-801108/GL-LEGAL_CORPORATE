
$(document).ready(async function () {

    checkAccess("46");


});
$(document).on('click', '#generateReport', function () {
    var categoryValue = $('#category').val();   // get selected value
    Report.ReportDetails(categoryValue);
});
$(document).on('change', '#fmDate,#toDate', function () {
    validateDates();
});

$(document).on('click', '#exitButton', function () {
    redirectToDashboard();
});
$(document).on('change', '#category', function () {
    document.getElementById("reportResult").style.display = "none";
    document.getElementById("reportResult2").style.display = "none";
});
var Report = {
    ReportDetails: async function () {
       
        const fromdt = document.getElementById("fmDate").value;
        const todt = document.getElementById("toDate").value;
        const formattedFromDate = formatDate(fromdt);
        const formattedToDate = formatDate(todt);
        const sts = document.getElementById("category").value;
        if (!fromdt || !todt) {
            await showAlert("Alert!", "Please Select Both Dates Before Clicking Generate Report.", "warning");
            return false;
        }
        if (sts=="-1") {
            await showAlert("Alert!", "Please Select Category Type.", "warning");
            return false;
        }

        try {
            if (sts == "1")
            {

            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: encryptAES(formattedFromDate + " ~ " + formattedToDate),
                Flag: "7"
            };
                var Res = await fetch("/ReportLoad", "POST", requestData);
                Res = decryptAES(Res);
            const responseData = JSON.parse(Res);

            if (responseData.err_code === "1") {
                const outdata = JSON.parse(responseData.outdata);
                

                document.getElementById("reportResult2").style.display = "none";
                document.getElementById("reportResult").style.display = "block";

                // Populate table
                const tbody = document.getElementById("reportTableBody");
                tbody.innerHTML = ''; // Clear previous content

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(data => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                           <td>${data.REGION || '-'}</td>
    <td>${data.AREA || '-'}</td>
    <td>${data.BRANCH || '-'}</td>
    <td>${data.BRANCH_ID || '-'}</td>
    <td>${data.STATE_NAME || '-'}</td>
    <td>${data.ZONAL_NAME || '-'}</td>
    <td>${data.CUST_ID || '-'}</td>
    <td>${data.CNAME || '-'}</td>
    <td>${data.PLEDGE_NO || '-'}</td>
    <td>${data.SEIZURE_MAHASSER || '-'}</td>
    <td>${data.FIRNO || '-'}</td>
    <td>${data.FIRDT ? new Date(data.FIRDT).toLocaleDateString() : '-'}</td>
    <td>${data.FIRDOC || '-'}</td>
    <td>${data.POLICE || '-'}</td>
    <td>${data.IRREGULARITY || '-'}</td>
    <td>${data.SEIZURED_DATE ? new Date(data.SEIZURED_DATE).toLocaleDateString() : '-'}</td>
    <td>${data.COURT || '-'}</td>
    <td>${data.PLEDGE_STATUS || '-'}</td>
    <td>${data.TDATE ? new Date(data.TDATE).toLocaleDateString() : '-'}</td>
    <td>${data.PLEDGE_VAL || '-'}</td>
    <td>${data.BALANCE || '-'}</td>  <!-- Loan Balance -->
    <td>${data.ACT_WEIGHT || '-'}</td>  <!-- Gross Wt (your query has act_weight as gross) -->
    <td>${data.STONE_WEIGHT || '-'}</td>
    <td>${data.NET_WEIGHT || '-'}</td>
    <td>${data.UPDATED_DT ? new Date(data.UPDATED_DT).toLocaleDateString() : '-'}</td>
    <td>${data.UPDATE_ID || '-'}</td>
    <td>${data.LO9_DT ? new Date(data.LO9_DT).toLocaleDateString() : '-'}</td>
    <td>${data.LO9_AUTH || '-'}</td>
    <td>${data.CLASSIFIED_DT ? new Date(data.CLASSIFIED_DT).toLocaleDateString() : '-'}</td>
    <td>${data.CLASSIFIED_AUTH || '-'}</td>
    <td>${data.RM_DT ? new Date(data.RM_DT).toLocaleDateString() : '-'}</td>
<td>${data.RM_AUTH || '-'}</td>
<td>${data.LM_DT ? new Date(data.LM_DT).toLocaleDateString() : '-'}</td>
<td>${data.LM_ID || '-'}</td>

    <td>${data.SETTLE_DT ? new Date(data.SETTLE_DT).toLocaleDateString() : '-'}</td>
    <td>${data.SETTLE_ID || '-'}</td>
    <td>${data.STATUS || '-'}</td>
    <td>${data.PLEDGE_CLASS || '-'}</td>
     <td>${data.PLEDGE_ZONE || '-'}</td>
    <td>${data.PAPER || '-'}</td>
    <td>${data.MANUALID || '-'}</td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    const row = document.createElement("tr");
                    row.innerHTML = `<td colspan="19" style="text-align: center; font-size: 1.5em; font-weight: bold; color: #333; padding: 20px;">No data available</td>`;
                    tbody.appendChild(row);
                }
            } else {
                await showAlert("Alert!", "Unable to load Details..", "warning");
            }
            }
            if (sts == "2") {
                debugger;
                const requestData = {
                    Emp_id: sessionStorage.getItem("EmployeeId"),
                    Token: sessionStorage.getItem("Token"),
                    Indata: encryptAES(formattedFromDate + " ~ " + formattedToDate),
                    Flag: "20"
                };
                var Res = await fetch("/ReportLoad", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);

                if (responseData.err_code === "1") {
                    const outdata = JSON.parse(responseData.outdata);
                    document.getElementById("reportResult").style.display = "none";
                    document.getElementById("reportResult2").style.display = "block";

                    // Populate table
                    const tbody = document.getElementById("reportTableBody2");
                    tbody.innerHTML = ''; // Clear previous content

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(data => {
                            const row = document.createElement("tr");
                            row.innerHTML = `
                            <tr>
  <td>${data.BRANCH_ID || '-'}</td>
  <td>${data.BRANCH_NAME || '-'}</td>
  <td>${data.AREA_NAME || '-'}</td>
  <td>${data.REGION_NAME || '-'}</td>
  <td>${data.ZONAL_NAME || '-'}</td>
  <td>${data.PLEDGE_NUMBER || '-'}</td>
  <td>${data.CUSTOMER_ID || '-'}</td>
  <td>${data.CUSTOMER_NAME || '-'}</td>
  <td>${data.GROSS_WEIGHT || '-'}</td>
  <td>${data.NET_WEIGHT || '-'}</td>
  <td>${data.SEIZER_DATE ? new Date(data.SEIZER_DATE).toLocaleDateString() : '-'}</td>
  <td>${data.PLEDGE_STATUS || '-'}</td>
   <td>${data.UPDATED_DT ? new Date(data.UPDATED_DT).toLocaleDateString() : '-'}</td>
   <td>${data.UPDATE_ID || '-'}</td>
   <td>${data.LO5_DT ? new Date(data.LO5_DT).toLocaleDateString() : '-'}</td>
   <td>${data.LO5_ID || '-'}</td>
    <td>${data.CLASSIFIED_DT ? new Date(data.CLASSIFIED_DT).toLocaleDateString() : '-'}</td>
   <td>${data.CLASSIFY_EMP || '-'}</td>
  <td>${data.RECOMMENDER1 || '-'}</td>
  <td>${data.RECOMMENDED1_DATE ? new Date(data.RECOMMENDED1_DATE).toLocaleDateString() : '-'}</td>
  <td>${data.RECOMMENDER2 || '-'}</td>
  <td>${data.RECOMMENDED2_DATE ? new Date(data.RECOMMENDED2_DATE).toLocaleDateString() : '-'}</td>
  <td>${data.APPROVER || '-'}</td>
  <td>${data.SETTLED_DATE ? new Date(data.SETTLED_DATE).toLocaleDateString() : '-'}</td>
  <td>${data.PLEDGE_VALUE || '-'}</td>
  <td>${data.POLICE_STATION || '-'}</td>
  <td>${data.FIR_NUMBER || '-'}</td>
  <td>${data.FIR_DATE ? new Date(data.FIR_DATE).toLocaleDateString() : '-'}</td>
  <td>${data.SEIZURE_MAHASSER || '-'}</td>
  <td>${data.IRREGULARITY_STATUS || '-'}</td>
  <td>${data.PLEDGE_ZONE || '-'}</td>
  <td>${data.SETTLED_AMOUNT || '-'}</td>
</tr>

                        `;
                            tbody.appendChild(row);
                        });
                    } else {
                        const row = document.createElement("tr");
                        row.innerHTML = `<td colspan="19" style="text-align: center; font-size: 1.5em; font-weight: bold; color: #333; padding: 20px;">No data available</td>`;
                        tbody.appendChild(row);
                    }
                } else {
                    await showAlert("Alert!", "Unable to load Details..", "warning");
                }
            }
        } catch (error) {
          
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");
            return;
        }
    }
};

function formatDate(inputDate) {
    let date = new Date(inputDate);
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = date.getDate().toString().padStart(2, '0');
    let month = monthNames[date.getMonth()]; // Get month abbreviation
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

async function validateDates() {
    const fromdtElement = document.getElementById("fmDate");
    const todtElement = document.getElementById("toDate");

    const fromdt = fromdtElement.value;
    const todt = todtElement.value;

    const fromDate = new Date(fromdt);
    const toDate = new Date(todt);
    const today = new Date();

    // Ensure "From Date" and "To Date" are not in the future
    if (fromDate > today || toDate > today) {
        await showAlert("Alert!", "Future dates are not allowed.", "warning");
        fromdtElement.value = "";
        todtElement.value = "";
        return false;
    }

    // Ensure "To Date" is not earlier than "From Date"
    if (toDate < fromDate) {
        await showAlert("Alert!", "To Date cannot be earlier than From Date.", "warning");
        todtElement.value = "";
        return false;
    }

    return true; // Validation passed
}
