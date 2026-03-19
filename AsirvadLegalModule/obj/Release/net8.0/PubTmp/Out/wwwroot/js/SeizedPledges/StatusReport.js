
var Report = {
    ReportDetails: async function () {
       
        const fromdt = document.getElementById("fmDate").value;
        const todt = document.getElementById("toDate").value;
        const formattedFromDate = formatDate(fromdt);
        const formattedToDate = formatDate(todt);
        if (!fromdt || !todt) {
            await showAlert("Please Select Both Dates Before Clicking Generate Report.");
            return false;
        }
        try {
            const requestData = {
                Emp_id: sessionStorage.getItem("EmployeeId"),
                Token: sessionStorage.getItem("Token"),
                Indata: formattedFromDate + " ~ " + formattedToDate,
                Flag: "7"
            };
            var Res = await fetch("/ReportLoad", "POST", requestData);
            const responseData = JSON.parse(Res);
           
            if (responseData.err_code === "1") {
                const outdata = JSON.parse(responseData.outdata);
               

                // Show report section
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
                            <td>${data.CNAME || '-'}</td>
                            <td>${data.CUST_ID || '-'}</td>
                            <td>${data.PLEDGE_NO || '-'}</td>
                            <td>${data.PLEDGE_CLASS || '-'}</td>
                            <td>${data.PLEDGE_STATUS || '-'}</td>
                            <td>${data.IRREGULARITY || '-'}</td>
                            <td>${data.NET_WEIGHT || '-'}</td>
                            <td>${data.ACT_WEIGHT || '-'}</td>
                            <td>${data.PLEDGE_VAL || '-'}</td>
                            <td>${data.SEIZURED_DATE ? new Date(data.SEIZURED_DATE).toLocaleDateString() : '-'}</td>
                            <td>${data.POLICE || '-'}</td>
                            <td>${data.STATUS || '-'}</td>
                            <td>${data.CLASSIFIED_DT || '-'}</td>
                            <td>${data.SETTLE_DT || '-'}</td>
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
        await showAlert("Future dates are not allowed.");
        fromdtElement.value = "";
        todtElement.value = "";
        return false;
    }

    // Ensure "To Date" is not earlier than "From Date"
    if (toDate < fromDate) {
        await showAlert("To Date cannot be earlier than From Date.");
        todtElement.value = "";
        return false;
    }

    return true; // Validation passed
}
