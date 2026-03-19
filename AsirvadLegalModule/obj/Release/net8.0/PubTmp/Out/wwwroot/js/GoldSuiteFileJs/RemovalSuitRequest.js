$(document).ready(async function () {

    checkAccess("14");


});
$(document).on('change', '#DatePickerTextBox1', function () {
    _Suit.toDateChanged1(this);
});

$(document).on('click', '#rbtchoice1', function () {
    _Suit.handleRadioClick(this);
});

$(document).on('change', '#DatePickerTextBox', function () {
    _Suit.fromDateChanged1(this);
});

$(document).on('click', '#rbtchoice2', function () {
    _Suit.handleRadioClick(this);
});

$(document).on('click', '#rbtchoice3', function () {
    _Suit.handleRadioClick(this);
});

$(document).on('click', '#rbtchoice4', function () {
    _Suit.handleRadioClick(this);
});

$(document).on('click', '#btnRemove', function () {
    _Suit.buttonConfirmClick();
});
$(document).on('click', '#btnExit', function () {
    redirectToDashboard();
});
$(document).on('click', '#btnConfirm', function () {
    _Suit.buttonSubmitClick(this);
});

var _Suit = {
    async handleRadioClick(radioElement) {
        
        try {
            const radioType = radioElement.dataset.type;
            if (!radioType) throw new Error("Invalid radio button");

            const settings = {
                Legal: { label: "LEGALID", showLegalId: true, showDate: false },
                Pledge: { label: "PLEDGENO", showLegalId: true, showDate: false },
                Customer: { label: "CUSTOMERID", showLegalId: true, showDate: false },
                Period: { label: "PERIOD", showLegalId: false, showDate: true }
            };

            const config = settings[radioType];
            if (!config) throw new Error("Invalid radio type");

            document.getElementById("lblcomplaint").innerHTML = config.label;
            document.getElementById("txtcomplaint").value = "";

            if (radioType === "Period") {
                const datePicker1 = document.getElementById("DatePickerTextBox");
                const datePicker2 = document.getElementById("DatePickerTextBox1");
                if (datePicker1) datePicker1.value = "";
                if (datePicker2) datePicker2.value = "";
            }

            div_legalid.style.display = config.showLegalId ? "flex" : "none";
            div_date.style.display = config.showDate ? "flex" : "none";
            div_btn.style.display = "block";

            const gridElement = document.getElementById("GridView1");
            if (gridElement) gridElement.innerHTML = "";

            div_grid.style.display = "none";
            div_confirm.style.display = "none";
        } catch {
            await showAlert("Alert!", "Error occurred. Please try again.", "warning");
        }
    },

    async formatDate(dateString) {
       
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const [year, month, day] = dateString.split('-');
        const monthName = months[parseInt(month) - 1];
        if (!year || !month || !day || isNaN(parseInt(month)) || parseInt(month) < 1 || parseInt(month) > 12) {
            throw new Error("Invalid date format. Expected YYYY-MM-DD.");
        }
        return `${day}/${monthName}/${year}`;
},

    async buttonSubmitClick(radioElement) {
        
        const rbtchoice1 = document.getElementById('rbtchoice1');
        const rbtchoice2 = document.getElementById('rbtchoice2');
        const rbtchoice3 = document.getElementById('rbtchoice3');
        const rbtchoice4 = document.getElementById('rbtchoice4');
        const txtcomplaint = document.getElementById('txtcomplaint');
        const DatePickerTextBox = document.getElementById('DatePickerTextBox');
        const DatePickerTextBox1 = document.getElementById('DatePickerTextBox1');
        const lblcomplaint = document.getElementById('lblcomplaint');

        if ((rbtchoice1.checked || rbtchoice2.checked || rbtchoice3.checked) && txtcomplaint.value !== '') {
            _Suit.GetPledges(lblcomplaint.textContent, txtcomplaint.value, '');
        } else if (rbtchoice4.checked && DatePickerTextBox.value !== '' && DatePickerTextBox1.value !== '') {
            const formattedDate1 = await _Suit.formatDate(DatePickerTextBox.value); // Output: "01/01/2025"
            const formattedDate2 = await _Suit.formatDate(DatePickerTextBox1.value); // Output: "06/05/2025"
            _Suit.GetPledges(lblcomplaint.textContent, formattedDate1, formattedDate2);
        }
        else {
            await showAlert("Alert!", "Please enter " + lblcomplaint.textContent +"..", "warning");
            return;
        }

    },

    async GetPledges(searchType, param1, param2) {
        
        try { 
        searchType: searchType;
        param1: param1;
        param2: param2;

        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: encryptAES(""),
            p_indata: encryptAES("SEARCH" + "~" + "" + "~" + 0 + "~" + searchType + "~" + param1 + "~" + param2),
            as_optflag: encryptAES(""),
        };
            var Res = await fetch("/GetDetailsRemovalReq", "POST", requestData);
            Res = decryptAES(Res);
        const responseData = JSON.parse(Res);
        if (responseData.err_code === "1") {
            outdata = JSON.parse(responseData.outdata);
 
            const tableContainer = document.querySelector('.table-container');
            if (!tableContainer) {
               
                return;
            }

            // Create table
            const table = document.createElement('table');
            table.className = 'grid-view';

            // Create table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
        <tr>
            <th>Pledge No</th>
            <th>Legal ID</th>
            <th>Complaint</th>
            <th>Case no</th>
            <th><span>Select All</span> <input type="checkbox" class="chkHeader" /></th>
        </tr>
    `;
            table.appendChild(thead);

            // Create table body
            const tbody = document.createElement('tbody');
            outdata.Table.Table.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td>${item.PLEDGE_NO}</td>
            <td>${item.LEGAL_ID}</td>
            <td>${item.COMPLAINT || ''}</td>
            <td>${item.CASE_NO || ''}</td>
            <td><input type="checkbox" class="chkItem" /></td>
        `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            // Clear container and append table
            tableContainer.innerHTML = '';
            tableContainer.appendChild(table);
            tableContainer.style.display = 'block';
            div_confirm.style.display = "flex";
            // Add Select All functionality
            const chkSelectAll = document.querySelector('.chkHeader');
            if (chkSelectAll) {
                chkSelectAll.addEventListener('change', function () {
                    const checkboxes = document.querySelectorAll('.chkItem');
                    checkboxes.forEach(chk => {
                        chk.checked = chkSelectAll.checked;
                    });
                });
            }
        }
        else {
            await showAlert("Alert!", "Please check the detail you entered...", "warning");
        }
    }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
           

        }
    },

    async buttonConfirmClick() {
        
        try {
            let pledges = ''; // Initialize pledges as an empty string
            const rows = document.querySelectorAll('.grid-view tbody tr'); // Select only body rows
            let anyChecked = false; // Flag to track if any checkbox is checked

            rows.forEach(row => {
                const checkbox = row.querySelector('input[type="checkbox"].chkItem');
                if (checkbox && checkbox.checked) {
                    anyChecked = true; // Mark that at least one checkbox is checked
                    const cells = row.cells;
                    const rowData = `${cells[0].textContent}^${cells[1].textContent}~`;
                    pledges += rowData; // Append row data
                }
            });

            if (!anyChecked) {
                await showAlert("Alert!", "Please select at least one Pledge Number.", "warning");
                return;
            }
            else {
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: encryptAES(""),
                    p_indata: encryptAES("NA" + "!" + sessionStorage.getItem("EmployeeId") + "!" + sessionStorage.getItem("BranchId") + "!" + "NA" + "!" + "REMOVAL" + "!" + "NA"),
                    as_optflag: encryptAES(pledges)
                };

                var Res = await fetch("/RemovalRequestDetails", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.status === "True") {
                    await showLoadAlert("Success!", "Approved Removal Request", "success");
                    
                }

                else {
                    await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
                   
                }
            }
        }
        catch {
            await showLoadAlert("Alert!", "Error occured..Please try again..", "warning");
            
        }
        
    },

    async isFutureDate(dateStr) {
     const selectedDate = new Date(dateStr);
    const today = new Date();
    return selectedDate > today;
    },

    async fromDateChanged1() {
     
        const fromDateTextbox = document.getElementById("DatePickerTextBox");
        const toDateTextbox = document.getElementById("DatePickerTextBox1");
        if (await _Suit.isFutureDate(fromDateTextbox.value))
        {
        fromDateTextbox.value = ''; 
        }

        if (toDateTextbox.value !== '' && new Date(fromDateTextbox.value) > new Date(toDateTextbox.value))
        {
        toDateTextbox.value = ''; 
        }
    },

    async toDateChanged1() {
    
         const fromDateTextbox = document.getElementById("DatePickerTextBox");
         const toDateTextbox = document.getElementById("DatePickerTextBox1");

        if (await _Suit.isFutureDate(toDateTextbox.value))
         {
         toDateTextbox.value = ''; 
         }

        if (fromDateTextbox.value !== '' && new Date(toDateTextbox.value) < new Date(fromDateTextbox.value))
        {
        toDateTextbox.value = ''; 
        }
    }    

};