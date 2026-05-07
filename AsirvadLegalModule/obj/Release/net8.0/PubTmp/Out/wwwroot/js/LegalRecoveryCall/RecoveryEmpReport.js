$(document).ready(async function () {
   
    checkAccess("31");
    _Report.zoneWiseDataDetails();
});


$(document).on('click', '#btnbackZone', function () {
    _Report.goBackZone(this);
});

$(document).on('click', '#btnbackReg', function () {
    _Report.goBackReg(this);
});
$(document).on('click', '#btnbackArea', function () {
    _Report.goBackArea(this);
});
$(document).on('click', '#btnexit', function () {
    redirectToDashboard();
});

var _Report = {
    async zoneWiseDataDetails() {
        try {
            
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                p_indata: "",
                as_optflag: encryptAES("7")
            };
           

            var Res = await fetch("/EmployeeConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
          

            if (responseData.err_sts === "111") {
                document.getElementById("reportZone").style.display = "block";
                document.getElementById("reportRegion").style.display = "none";
                document.getElementById("reportArea").style.display = "none";
                document.getElementById("reportBranch").style.display = "none";
                const outdata = JSON.parse(responseData.outdata);
                // Populate table
                const tbody = document.getElementById("reportTableZone");
                tbody.innerHTML = ''; // Clear previous content

//                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
//                    outdata.Table.forEach(data => {
//                        const row = document.createElement("tr");
//                        row.innerHTML = `
//<td><a href="javascript:void(0);" class="zonal-id-link" onclick="_Report.regionWiseDataDetails('${data.ZONAL_ID}')">${data.ZONAL_ID || '-'}</a></td>                            <td>${data.ZONAL_NAME || '-'}</td>
//                            <td>${data.TOTAL_CALL || '-'}</td>
//                            <td>${data.FIRST_PENDIG_CALL || '-'}</td>
//                            <td>${data.FIRST_CALL_COMPLETED || '-'}</td>
//                            <td>${data.FOLLOW_PENDING_CALL || '-'}</td>
//                            <td>${data.FOLLOW_CALL_COMPLETED || '-'}</td>
//                            <td>${data.HOME_VISIT_COMPLETED || '-'}</td>
//                            <td>${data.HOME_VISIT_PENDING || '-'}</td>
//                            <td>${data.ASSIGN_HOME_VISIT_PENDING || '-'}</td>
//                            <td>${data.HOME_VERIFY_PENDING || '-'}</td>
//                            <td>${data.HOME_VERIFY_COMPLETED || '-'}</td>

//                        `;
//                        tbody.appendChild(row);
//                    });
//                } else {
//                    const row = document.createElement("tr");
//                    row.innerHTML = `<td colspan="12" style="text-align: center; font-size: 1.5em; font-weight: bold; color: #333; padding: 20px;">No data available</td>`;
//                    tbody.appendChild(row);
                //                }


                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(data => {
                        const row = document.createElement("tr");

                        row.innerHTML = `
            <td><a href="#" class="zonal-id-link" data-zonal-id="${data.ZONAL_ID}">${data.ZONAL_ID || '-'}</a></td>
            <td>${data.ZONAL_NAME || '-'}</td>
            <td>${data.TOTAL_CALL || '-'}</td>
            <td>${data.FIRST_PENDIG_CALL || '-'}</td>
            <td>${data.FIRST_CALL_COMPLETED || '-'}</td>
            <td>${data.FOLLOW_PENDING_CALL || '-'}</td>
            <td>${data.FOLLOW_CALL_COMPLETED || '-'}</td>
            <td>${data.HOME_VISIT_COMPLETED || '-'}</td>
            <td>${data.HOME_VISIT_PENDING || '-'}</td>
            <td>${data.ASSIGN_HOME_VISIT_PENDING || '-'}</td>
            <td>${data.HOME_VERIFY_PENDING || '-'}</td>
            <td>${data.HOME_VERIFY_COMPLETED || '-'}</td>
        `;

                        tbody.appendChild(row);
                    });

                    // Attach event listener once to the parent container
                    tbody.addEventListener("click", function (e) {
                        const link = e.target.closest(".zonal-id-link");
                        if (link) {
                            const zonalId = link.getAttribute("data-zonal-id");
                            if (zonalId) {
                                _Report.regionWiseDataDetails(zonalId);
                            }
                        }
                    });

                } else {
                    const row = document.createElement("tr");
                    row.innerHTML = `<td colspan="12" style="text-align: center; font-size: 1.5em; font-weight: bold; color: #333; padding: 20px;">No data available</td>`;
                    tbody.appendChild(row);
                }

            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },
    async regionWiseDataDetails(zonalId) {
        try {
            
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                p_indata: encryptAES(zonalId),
                as_optflag: encryptAES("8")
            };


            var Res = await fetch("/EmployeeConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
           

            if (responseData.err_sts === "111") {
                document.getElementById("reportZone").style.display = "none";
                document.getElementById("reportRegion").style.display = "block";
              
                document.getElementById("reportArea").style.display = "none";
                document.getElementById("reportBranch").style.display = "none";
                const outdata = JSON.parse(responseData.outdata);
                // Populate table
                const tbody = document.getElementById("reportTableReg");
                tbody.innerHTML = ''; // Clear previous content

                //if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {


                //    outdata.Table.forEach(data => {
                //        const row = document.createElement("tr");
                //        row.innerHTML = `
                //        <td><a href="javascript:void(0);" class="zonal-id-link" onclick="_Report.areaWiseDataDetails('${data.REG_ID}')">${data.REG_ID || '-'}</a></td>
                //            <td>${data.REG_NAME || '-'}</td>
                //            <td>${data.TOTAL_CALL || '-'}</td>
                //            <td>${data.FIRST_PENDIG_CALL || '-'}</td>
                //            <td>${data.FIRST_CALL_COMPLETED || '-'}</td>
                //            <td>${data.FOLLOW_PENDING_CALL || '-'}</td>
                //            <td>${data.FOLLOW_CALL_COMPLETED || '-'}</td>
                //            <td>${data.HOME_VISIT_COMPLETED || '-'}</td>
                //            <td>${data.HOME_VISIT_PENDING || '-'}</td>
                //            <td>${data.ASSIGN_HOME_VISIT_PENDING || '-'}</td>
                //            <td>${data.HOME_VERIFY_PENDING || '-'}</td>
                //            <td>${data.HOME_VERIFY_COMPLETED || '-'}</td>

                //        `;
                //        tbody.appendChild(row);
                //    });
                //} else {
                //    const row = document.createElement("tr");
                //    row.innerHTML = `<td colspan="12" style="text-align: center; font-size: 1.5em; font-weight: bold; color: #333; padding: 20px;">No data available</td>`;
                //    tbody.appendChild(row);
                //}

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(data => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
            <td><a href="#" class="zonal-id-link" data-reg-id="${data.REG_ID}">${data.REG_ID || '-'}</a></td>
            <td>${data.REG_NAME || '-'}</td>
            <td>${data.TOTAL_CALL || '-'}</td>
            <td>${data.FIRST_PENDIG_CALL || '-'}</td>
            <td>${data.FIRST_CALL_COMPLETED || '-'}</td>
            <td>${data.FOLLOW_PENDING_CALL || '-'}</td>
            <td>${data.FOLLOW_CALL_COMPLETED || '-'}</td>
            <td>${data.HOME_VISIT_COMPLETED || '-'}</td>
            <td>${data.HOME_VISIT_PENDING || '-'}</td>
            <td>${data.ASSIGN_HOME_VISIT_PENDING || '-'}</td>
            <td>${data.HOME_VERIFY_PENDING || '-'}</td>
            <td>${data.HOME_VERIFY_COMPLETED || '-'}</td>
        `;
                        tbody.appendChild(row);
                    });

                    // Attach a single event listener to the table body
                    tbody.addEventListener("click", function (e) {
                        const link = e.target.closest(".zonal-id-link");
                        if (link) {
                            const regId = link.getAttribute("data-reg-id");
                            if (regId) {
                                _Report.areaWiseDataDetails(regId);
                            }
                        }
                    });

                } else {
                    const row = document.createElement("tr");
                    row.innerHTML = `<td colspan="12" style="text-align: center; font-size: 1.5em; font-weight: bold; color: #333; padding: 20px;">No data available</td>`;
                    tbody.appendChild(row);
                }

            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },
    async areaWiseDataDetails(regId) {
        
        try {
            
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                p_indata: encryptAES(regId),
                as_optflag: encryptAES("9")
            };


            var Res = await fetch("/EmployeeConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
       
            if (responseData.err_sts === "111") {
                
                document.getElementById("reportBranch").style.display = "none";

                document.getElementById("reportZone").style.display = "none";
                document.getElementById("reportRegion").style.display = "none";
                document.getElementById("reportArea").style.display = "block";

                const outdata = JSON.parse(responseData.outdata);
                // Populate table
                const tbody = document.getElementById("reportTableArea");
                tbody.innerHTML = ''; // Clear previous content

                //if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {


                //    outdata.Table.forEach(data => {
                //        const row = document.createElement("tr");
                //        row.innerHTML = `
                //        <td><a href="javascript:void(0);" class="zonal-id-link" onclick="_Report.branchWiseDataDetails('${data.AREA_ID}')">${data.AREA_ID || '-'}</a></td>
                //            <td>${data.AREA_NAME || '-'}</td>
                //            <td>${data.TOTAL_CALL || '-'}</td>
                //            <td>${data.FIRST_PENDIG_CALL || '-'}</td>
                //            <td>${data.FIRST_CALL_COMPLETED || '-'}</td>
                //            <td>${data.FOLLOW_PENDING_CALL || '-'}</td>
                //            <td>${data.FOLLOW_CALL_COMPLETED || '-'}</td>
                //            <td>${data.HOME_VISIT_COMPLETED || '-'}</td>
                //            <td>${data.HOME_VISIT_PENDING || '-'}</td>
                //            <td>${data.ASSIGN_HOME_VISIT_PENDING || '-'}</td>
                //            <td>${data.HOME_VERIFY_PENDING || '-'}</td>
                //            <td>${data.HOME_VERIFY_COMPLETED || '-'}</td>

                //        `;
                //        tbody.appendChild(row);
                //    });
                //} else {
                //    const row = document.createElement("tr");
                //    row.innerHTML = `<td colspan="12" style="text-align: center; font-size: 1.5em; font-weight: bold; color: #333; padding: 20px;">No data available</td>`;
                //    tbody.appendChild(row);
                //}


                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(data => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
            <td><a href="#" class="zonal-id-link" data-area-id="${data.AREA_ID}">${data.AREA_ID || '-'}</a></td>
            <td>${data.AREA_NAME || '-'}</td>
            <td>${data.TOTAL_CALL || '-'}</td>
            <td>${data.FIRST_PENDIG_CALL || '-'}</td>
            <td>${data.FIRST_CALL_COMPLETED || '-'}</td>
            <td>${data.FOLLOW_PENDING_CALL || '-'}</td>
            <td>${data.FOLLOW_CALL_COMPLETED || '-'}</td>
            <td>${data.HOME_VISIT_COMPLETED || '-'}</td>
            <td>${data.HOME_VISIT_PENDING || '-'}</td>
            <td>${data.ASSIGN_HOME_VISIT_PENDING || '-'}</td>
            <td>${data.HOME_VERIFY_PENDING || '-'}</td>
            <td>${data.HOME_VERIFY_COMPLETED || '-'}</td>
        `;
                        tbody.appendChild(row);
                    });

                    // Attach a single event listener to the table body
                    tbody.addEventListener("click", function (e) {
                        const link = e.target.closest(".zonal-id-link");
                        if (link) {
                            const areaId = link.getAttribute("data-area-id");
                            if (areaId) {
                                _Report.branchWiseDataDetails(areaId);
                            }
                        }
                    });

                } else {
                    const row = document.createElement("tr");
                    row.innerHTML = `<td colspan="12" style="text-align: center; font-size: 1.5em; font-weight: bold; color: #333; padding: 20px;">No data available</td>`;
                    tbody.appendChild(row);
                }

            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },
    async branchWiseDataDetails(areaId) {
       
        try {
            
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                p_indata: encryptAES(areaId),
                as_optflag: encryptAES("10")
            };


            var Res = await fetch("/EmployeeConfirmDetails", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
           

            if (responseData.err_sts === "111") {
                document.getElementById("reportZone").style.display = "none";
                document.getElementById("reportRegion").style.display = "none";
                document.getElementById("reportArea").style.display = "none";
                document.getElementById("reportBranch").style.display = "block";


                const outdata = JSON.parse(responseData.outdata);
                // Populate table
                const tbody = document.getElementById("reportTableBranch");
                tbody.innerHTML = ''; // Clear previous content

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {


                    outdata.Table.forEach(data => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${data.BRANCH_ID || '-'}</a></td> 
                            <td>${data.BRANCH_NAME || '-'}</td>
                            <td>${data.TOTAL_CALL || '-'}</td>
                            <td>${data.FIRST_PENDIG_CALL || '-'}</td>
                            <td>${data.FIRST_CALL_COMPLETED || '-'}</td>
                            <td>${data.FOLLOW_PENDING_CALL || '-'}</td>
                            <td>${data.FOLLOW_CALL_COMPLETED || '-'}</td>
                            <td>${data.HOME_VISIT_COMPLETED || '-'}</td>
                            <td>${data.HOME_VISIT_PENDING || '-'}</td>
                            <td>${data.ASSIGN_HOME_VISIT_PENDING || '-'}</td>
                            <td>${data.HOME_VERIFY_PENDING || '-'}</td>
                            <td>${data.HOME_VERIFY_COMPLETED || '-'}</td>
                            
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    const row = document.createElement("tr");
                    row.innerHTML = `<td colspan="12" style="text-align: center; font-size: 1.5em; font-weight: bold; color: #333; padding: 20px;">No data available</td>`;
                    tbody.appendChild(row);
                }
            }
        }
        catch {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    },
    async goBackZone() {
        document.getElementById("reportZone").style.display = "block";
        document.getElementById("reportRegion").style.display = "none";
        document.getElementById("reportArea").style.display = "none";
        document.getElementById("reportBranch").style.display = "none";
    },
    async goBackReg() {
        document.getElementById("reportZone").style.display = "none";
        document.getElementById("reportRegion").style.display = "block";
        document.getElementById("reportArea").style.display = "none";
        document.getElementById("reportBranch").style.display = "none";
    },
    async goBackArea() {
        document.getElementById("reportZone").style.display = "none";
        document.getElementById("reportRegion").style.display = "none";
        document.getElementById("reportArea").style.display = "block";
        document.getElementById("reportBranch").style.display = "none";
    },
}