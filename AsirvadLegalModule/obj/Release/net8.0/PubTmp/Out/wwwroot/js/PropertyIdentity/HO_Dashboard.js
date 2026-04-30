$(document).ready(function () {

    checkAccess("42");

    const section1 = document.getElementById("section1");
    const section2 = document.getElementById("section2");
    const section3 = document.getElementById("section3");
    const section4 = document.getElementById("section4");

    $('#formSelect').on('change', function () {
        const value = this.value;
        $(section1).hide();
        $(section2).hide();
        $(section3).hide();
        $(section4).hide();
        resetsection();
        $('input[type="text"], input[type="number"]').val('');
        $('input[name="entityType"]').prop('checked', false);
        $('#customerFields, #employeeFields,#all_fields4,#all_fields3 ,#all_fields1,#addButton, #addButton2').hide();
        $("#gridView tr").filter(function () {
            var $row = $(this);
            return $row.find('th').length === 0 && !$row.hasClass('header') && !$row.hasClass('GridViewHeader');
        }).remove();

        if (value === "1") $(section1).show();
        else if (value === "2") $(section2).show();
        else if (value === "3") $(section3).show();
        else if (value === "4") $(section4).show();
    });

    // COMMON API
    async function callPropertyIdentification(optFlag, indata) {
        $("#globalLoader").show();
        const type = $('input[name="entityType"]:checked').val();
        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            branch: sessionStorage.getItem("BranchId"),
            p_type: encryptAES(type),
            p_indata: encryptAES(indata),
            doc1: '',
            doc2: '',
            as_optflag: encryptAES(optFlag)
        };

        try {
            let Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);
            
            return JSON.parse(Res);
        } catch {
            
            return { err_sts: "error" };
        }
    }

    //FORM 1  Assign RTI Pending List
    $('input[name="entityType"]').on('change', function () {
        debugger;
        const selected = $(this).val();
        $('#customerFields, #employeeFields, #addButton, #addButton2').hide();

        if (selected === 'customer') {
            $('#customerFields').show();
            $('#addButton').show();
            $("#tab1 tr").filter(function () {
                var $row = $(this);
                return $row.find('th').length === 0 && !$row.hasClass('header') && !$row.hasClass('GridViewHeader');
            }).remove();

        } else if (selected === 'employee') {
            $('#employeeFields').show();
            $('#addButton2').show();
            $("#tab1 tr").filter(function () {
                var $row = $(this);
                return $row.find('th').length === 0 && !$row.hasClass('header') && !$row.hasClass('GridViewHeader');
            }).remove();
        }
        
    });
    async function validateEntityId(inputSelector) {
        const selectedId = $(inputSelector).val().trim();
        if (!selectedId) return;

        const responseData = await callPropertyIdentification("54", selectedId);

        if (responseData.err_sts === "3") {
            $("#globalLoader").hide();
            await showAlert("Alert!", "Already entered Id", "warning");
            $(inputSelector).val('');
            return;
        } else if (responseData.err_sts === "2") {
            $("#globalLoader").hide();
            await showAlert("Alert!", "Please check the Id", "warning");
            $(inputSelector).val('');
            return;
        } else if (isValueInGrid(selectedId)) {
            $("#globalLoader").hide();
            await showAlert("Alert!", "Value exists in the grid!", "warning");
            $(inputSelector).val('');
            return;
        } else if (responseData.err_sts === "error") {
            $("#globalLoader").hide();
            await showAlert("Alert!", "Error occurred..Please try again..", "warning");
            $(inputSelector).val('');
            return;
        }
        $("#globalLoader").hide();
    }
    $('#customerId').on('change', function () {
        validateEntityId('#customerId');
    });
    $('#employeeId').on('change', function () {
        validateEntityId('#employeeId');
    }); 
    function isValueInGrid(valueToCheck) {
        let exists = false;

        $('#tab1 tbody tr').each(function () {
            const cellValue = $(this).find('td:eq(0)').text().trim(); // ID column
            if (cellValue === valueToCheck) {
                exists = true;
                return false; // Exit loop early
            }
        });

        return exists;
    }
    $('#branchId1').on('change', async function () {
        debugger;
        const selectedId = $(this).val().trim();
        const responseData = await callPropertyIdentification("55", selectedId);

        if (responseData.err_sts === "2") {
            $("#globalLoader").hide();
            await showAlert("Alert!", "Please check the Branch Id", "warning");
            $('#branchId1').val('');
        } else if (responseData.err_sts === "error") {
            $("#globalLoader").hide();
            await showAlert("Alert!", "Error occurred..Please try again..", "warning");
            $('#branchId1').val('');
        }
        $("#globalLoader").hide();
    });
    $('#branchId2').on('change', async function () {
        debugger;
        const selectedId = $(this).val().trim();
        const responseData = await callPropertyIdentification("55", selectedId);

        if (responseData.err_sts === "2") {
            $("#globalLoader").hide();
            await showAlert("Alert!", "Please check the Branch Id", "warning");
            $('#branchId2').val('');
        } else if (responseData.err_sts === "error") {
            $("#globalLoader").hide();
            await showAlert("Alert!", "Error occurred..Please try again..", "warning");
            $('#branchId2').val('');
        }
        $("#globalLoader").hide();
    });
    $('#addButton').on('click', async function () {
      const type = $('input[name="entityType"]:checked').val();
        if (!type) {
            await showAlert("Alert!", "Please select Customer or Employee..", "warning");
            return;           
        }
        
        let id, branchId = '';
        if (type === 'customer') {
            id = $('#customerId').val();
            branchId = $('#branchId1').val();
            ho_rmk = $('#ho_rmk').val();
            if (!id || !branchId || !ho_rmk) {
                await showAlert("Alert!", "Please enter the Details...", "warning");
                return;
            }
        } 

        const row = $('<tr>').html(
            '<td>' + id + '</td>' +
            '<td>' + branchId + '</td>' +
            '<td>' + ho_rmk + '</td>' +
            '<td><button class="delete-row">Delete</button></td>'
        );
        $('#gridView tbody').append(row);

        $('#customerId, #branchId1, #employeeId,#ho_rmk').val('');
    });
    $('#addButton2').on('click', async function () {
        const type = $('input[name="entityType"]:checked').val();
        if (!type) {
            await showAlert("Alert!", "Please select Customer or Employee..", "warning");
            return; 
        }

        let id, branchId = '';
        if (type === 'employee') {
            id = $('#employeeId').val();
            branchId2 = $('#branchId2').val();
            ho_rmk2 = $('#ho_rmk2').val();

            if (!id || !branchId2 || !ho_rmk2) {
                await showAlert("Alert!", "Please enter the Details...", "warning");
                return;
            }
        }

        const row = $('<tr>').html(
            '<td>' + id + '</td>' +
            '<td>' + branchId2 + '</td>' +
            '<td>' + ho_rmk2 + '</td>' +
            '<td><button class="delete-row">Delete</button></td>'
        );
        $('#gridView tbody').append(row);

        $('#customerId, #branchId2, #employeeId,#ho_rmk2').val('');
    });
    $(document).on('click', '.delete-row', function () {
        $(this).closest('tr').remove();
    });
    $('#confirmBtn').on('click', async function () {
        if ($('#gridView tbody tr').length === 0) {
            await showAlert("Alert!", "No items added to the grid", "warning");
            return;
        } else if ($('#customerId').val().trim() !== '' || $('#branchId1').val().trim() !== '' || $('#ho_rmk').val() !== '') {
            await showAlert("Alert!", "You have entered data in the input fields.", "warning");
            return;
        }

        const formattedData = $('#gridView tbody tr').map(function () {
            const cells = $(this).find('td');
            return [
                cells.eq(0).text().trim(),
                cells.eq(1).text().trim(),
                cells.eq(2).text().trim()
            ].join('~');
        }).get().join('*');

        const responseData = await callPropertyIdentification("1", formattedData);
        $("#globalLoader").hide();
        if (responseData.err_sts === "1") {
            await showLoadAlert("Success!", "Confirmed Successfully", "success");
        } else {
            await showLoadAlert("Alert!", "Error Occured Please try again!!", "warning");
        }
    });
   
    //FORM 2  List Certificate HO Approve
    $('input[name="entityType2"]').on('change', function () {
        debugger;
        const selected = $(this).val();
        $('#customerFields1, #employeeFields1, #all_fields1').hide();

        if (selected === 'customer') {
            $('#customerFields1').show();
            $('#all_fields1').show();
        } else if (selected === 'employee') {
            $('#employeeFields1').show();
            $('#all_fields1').show();
        }

        loadSection1Data();
    });
    async function loadSection1Data() {
        $('#zone1, #emp_zone1').empty();
        $('#region1, #emp_region1').empty();
        $('#area1, #emp_area1').empty();
        $('#branch1, #emp_branch1').empty();
        $('#selectIdEmp1, #selectId1').empty();
        resetForm1();
        try {
            debugger; 
            const type = $('input[name="entityType2"]:checked').val();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_type: encryptAES(type),
                p_indata: encryptAES(""),
                doc1: '',
                doc2: '',
                as_optflag: encryptAES("11")
            };
           
            var Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);
            debugger;
            const responseData = JSON.parse(Res);
            if (responseData.err_sts == "1") {
                const selectElement = document.getElementById('zone1');
                //selectElement.innerHTML = '<option value="-1">--Select Zonal ID--</option>';
                const selectElement2 = document.getElementById('emp_zone1');
                outdata = JSON.parse(responseData.outdata);

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID1;
                        option.textContent = item.ZON;
                        if (type == "customer")
                            selectElement.appendChild(option);
                        else
                            selectElement2.appendChild(option);
                    });
                }
            } else {
                await showAlert("Alert!", "Unable to load the List.", "warning");
            }
        } catch {
            await showAlert("Alert!", "Error occurred..Please try again..", "warning");
            return;
        }
    }
    $('#zone1,#emp_zone1').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            $('#region1, #emp_region1').empty();
            $('#area1, #emp_area1').empty();
            $('#branch1, #emp_branch1').empty();
            $('#selectIdEmp1, #selectId1').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType2"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("12")
                };
               
                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('region1');
                    const selectElement2 = document.getElementById('emp_region1');
                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.REG;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#region1,#emp_region1').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            $('#area1, #emp_area1').empty();
            $('#branch1, #emp_branch1').empty();
            $('#selectIdEmp1, #selectId1').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType2"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("13")
                };
                
                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('area1');
                    const selectElement2 = document.getElementById('emp_area1');
                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.AREA;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#area1,#emp_area1').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
           
            $('#branch1, #emp_branch1').empty();
            $('#selectIdEmp1, #selectId1').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType2"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("14")
                };
               
                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('branch1');
                    const selectElement2 = document.getElementById('emp_branch1');

                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.BRN;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#branch1,#emp_branch1').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
           
            $('#selectIdEmp1, #selectId1').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType2"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("15")
                };
               
                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('selectId1');
                    const selectElement2 = document.getElementById('selectIdEmp1');
                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.CUS;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#selectId1,#selectIdEmp1').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
             resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType2"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("16")
                };
                
                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {

                    
                    outdata = JSON.parse(responseData.outdata);
                    if (type == "customer") {
                        $('#cus_name1').val(outdata.Table[0].NAME);
                        $('#cus_Branch1').val(outdata.Table[0].BRANCH_ID);
                        $('#cus_phno1').val(outdata.Table[0].PHONE2);
                        $('#cus_add1').val(outdata.Table[0].ADDRESS);
                        $('#cus_hormk1').val(outdata.Table[0].REMARK);
                    }
                    else {
                        $('#emp_name1').val(outdata.Table[0].EMP_NAME);
                        $('#emp_Branch1').val(outdata.Table[0].BRANCH_ID);
                        $('#empph_no1').val(outdata.Table[0].MOBILE_NO);
                        $('#emp_add1').val(outdata.Table[0].ADDRESS);
                        $('#emp_hormk1').val(outdata.Table[0].REMARK);
                    }

                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#viewChallanBtn1').on('click', async function () {
        debugger;
        const id1 = $('#selectId1').val();
        const id2 = $('#selectIdEmp1').val();

        const selectedId = (id1 && id1 !== '-1') ? id1.trim() :
            (id2 && id2 !== '-1') ? id2.trim() : null;

        const entityType = $('input[name="entityType2"]:checked').val();
        if (!selectedId || selectedId === '-1') {
            await showAlert("Alert!", "Please select an ID first.", "warning");
            return;
        }

        try {
            $("#globalLoader").show();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_type: encryptAES(entityType),
                p_indata: encryptAES(selectedId),
                doc1: '',
                doc2: '',
                as_optflag: encryptAES("17") // Assume optflag for viewing challan
            };

            var Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            debugger;
            if (responseData.err_sts == "1") {
                const data = JSON.parse(responseData.outdata); // Assume outdata has { base64: '...' }
                const base64 = data.Table[0].CHALLAN_DOC; // Adjust based on response structure

                if (!base64) {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "No document found.", "warning");
                    return;
                }

                const mimeType = detectMimeType(base64);
                const blob = base64ToBlob(base64, mimeType);
                currentDocUrl = URL.createObjectURL(blob);

                viewDocument(currentDocUrl, mimeType);
            } else { 
                $("#globalLoader").hide();
                await showAlert("Alert!", "Unable to load document.", "warning");
            }
        } catch (error) {
            $("#globalLoader").hide();
            await showAlert("Alert!", "Error loading document. Please try again.", "warning");
        } $("#globalLoader").hide();
    });
    $('#viewReceiptBtn1').on('click', async function () {
        const id1 = $('#selectId1').val();
        const id2 = $('#selectIdEmp1').val();

        const selectedId = (id1 && id1 !== '-1') ? id1.trim() :
            (id2 && id2 !== '-1') ? id2.trim() : null;

        const entityType = $('input[name="entityType2"]:checked').val();
        if (!selectedId || selectedId === '-1') {
            await showAlert("Alert!", "Please select an ID first.", "warning");
            return;
        }

        try {
            $("#globalLoader").show();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_type: encryptAES(entityType),
                p_indata: encryptAES(selectedId),
                doc1: '',
                doc2: '',
                as_optflag: encryptAES("18") // Assume optflag for viewing challan
            };

            var Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            debugger;
            if (responseData.err_sts == "1") {
                const data = JSON.parse(responseData.outdata); // Assume outdata has { base64: '...' }
                const base64 = data.Table[0].RECEIPT_DOC; // Adjust based on response structure

                if (!base64) {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "No document found.", "warning");
                    return;
                }

                const mimeType = detectMimeType(base64);
                const blob = base64ToBlob(base64, mimeType);
                currentDocUrl = URL.createObjectURL(blob);

                viewDocument(currentDocUrl, mimeType);
            } else {
                $("#globalLoader").hide();
                await showAlert("Alert!", "Unable to load document.", "warning");
            }
        } catch (error) {
            $("#globalLoader").hide();

            await showAlert("Alert!", "Error loading document. Please try again.", "warning");
        } $("#globalLoader").hide();
    });
    $('#confirmBtn1').on('click', async function () {
        debugger;
        const zoneId = $('#zone1').val();
        const zoneId2 = $('#emp_zone1').val();
        const regid = $('#region1').val();
        const regid2 = $('#emp_region1').val();
        const area1 = $('#area1').val();
        const area2 = $('#emp_area1').val();
        const branchId = $('#branch1').val();
        const selectedId = $('#selectId1').val();
        const branchId2 = $('#emp_branch1').val();
        const selectedId2 = $('#selectIdEmp1').val();

        const isFirstPairInvalid =
            zoneId == null || zoneId === '-1' ||
            regid == null || regid === '-1' ||
            area1 == null || area1 === '-1' ||
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
            zoneId2 == null || zoneId2 === '-1' ||
            regid2 == null || regid2 === '-1' ||
            area2 == null || area2 === '-1' ||
            branchId2 == null || branchId2 === '-1' ||
            selectedId2 == null || selectedId2 === '-1';

        if (isFirstPairInvalid && isSecondPairInvalid) {
            await showAlert("Alert!", "Please Select the Fields.", "warning");
            return;
        }

        else {
            let finalBranchId = null;
            let finalSelectedId = null;

            if (!isFirstPairInvalid) {
                finalBranchId = branchId;
                finalSelectedId = selectedId;
            } else if (!isSecondPairInvalid) {
                finalBranchId = branchId2;
                finalSelectedId = selectedId2;
            }
            try {
                $("#globalLoader").show();
                const type = $('input[name="entityType2"]:checked').val();

                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(finalSelectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("19")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                debugger;
                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Approved Successfully", "success");
                    loadSection1Data();
                    resetForm1();
                    return;

                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to submit the Details.", "warning");
                    return;
                }
            }
            catch
            {
                $("#globalLoader").hide();
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    });
    $('#rejectBtn1').on('click', async function () {
        debugger;
        const zoneId = $('#zone1').val();
        const zoneId2 = $('#emp_zone1').val();
        const regid = $('#region1').val();
        const regid2 = $('#emp_region1').val();
        const area1 = $('#area1').val();
        const area2 = $('#emp_area1').val();
        const branchId = $('#branch1').val();
        const selectedId = $('#selectId1').val();
        const branchId2 = $('#emp_branch1').val();
        const selectedId2 = $('#selectIdEmp1').val();

        const isFirstPairInvalid =
            zoneId == null || zoneId === '-1' ||
            regid == null || regid === '-1' ||
            area1 == null || area1 === '-1' ||
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
            zoneId2 == null || zoneId2 === '-1' ||
            regid2 == null || regid2 === '-1' ||
            area2 == null || area2 === '-1' ||
            branchId2 == null || branchId2 === '-1' ||
            selectedId2 == null || selectedId2 === '-1';

        if (isFirstPairInvalid && isSecondPairInvalid) {
            await showAlert("Alert!", "Please Select the Fields.", "warning");
            return;
        }

        else {
            let finalBranchId = null;
            let finalSelectedId = null;

            if (!isFirstPairInvalid) {
                finalBranchId = branchId;
                finalSelectedId = selectedId;
            } else if (!isSecondPairInvalid) {
                finalBranchId = branchId2;
                finalSelectedId = selectedId2;
            }
            try {
                const type = $('input[name="entityType2"]:checked').val();
                $("#globalLoader").show();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(finalSelectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("57")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                debugger;
                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Rejected Successfully", "success");
                    loadSection1Data();
                    resetForm1();
                    return;

                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to submit the Details.", "warning");
                    return;
                }
            }
            catch
            {
                $("#globalLoader").hide();
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    });

    //FORM 3  List Certificate HO Approve

    $('input[name="entityType3"]').on('change', function () {
        debugger;
        const selected = $(this).val();
        $('#customerFields3, #employeeFields3, #all_fields3').hide();

        if (selected === 'customer') {
            $('#customerFields3').show();
            $('#all_fields3').show();
        } else if (selected === 'employee') {
            $('#employeeFields3').show();
            $('#all_fields3').show();
        }

        loadSection2Data();
    });
    async function loadSection2Data() {
        $('#zone3, #zone4').empty();
        $('#region3, #region4').empty();
        $('#area3, #area4').empty();
        $('#branch3, #branch4').empty();
        $('#selectId3, #selectIdEmp4').empty();
        resetForm1();
        try {
            const type = $('input[name="entityType3"]:checked').val();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_type: encryptAES(type),
                p_indata: encryptAES(""),
                doc1: '',
                doc2: '',
                as_optflag: encryptAES("29")
            };

            var Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);

            const responseData = JSON.parse(Res);
            if (responseData.err_sts == "1") {
                const selectElement = document.getElementById('zone3');
                const selectElement2 = document.getElementById('zone4');

                outdata = JSON.parse(responseData.outdata);

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID1;
                        option.textContent = item.ZON;
                        if (type == "customer")
                            selectElement.appendChild(option);
                        else
                            selectElement2.appendChild(option);
                    });
                }
            } else {
                await showAlert("Alert!", "Unable to load the List.", "warning");
            }
        } catch {
            await showAlert("Alert!", "Error occurred..Please try again..", "warning");
            return;
        }
    }
    $('#zone3,#zone4').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            $('#region3, #region4').empty();
            $('#area3, #area4').empty();
            $('#branch3, #branch4').empty();
            $('#selectId3, #selectIdEmp4').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType3"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("30")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('region3');
                    const selectElement2 = document.getElementById('region4');

                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.REG;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#region3,#region4').on('change', async function () {
        debugger;
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            $('#area3, #area4').empty();
            $('#branch3, #branch4').empty();
            $('#selectId3, #selectIdEmp4').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType3"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("31")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('area3');
                    const selectElement2 = document.getElementById('area4');

                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.AREA;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#area3,#area4').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            $('#branch3, #branch4').empty();
            $('#selectId3, #selectIdEmp4').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType3"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("32")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('branch3');
                    const selectElement2 = document.getElementById('branch4');

                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.BRN;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#branch3,#branch4').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            $('#selectId3, #selectIdEmp4').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType3"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("33")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('selectId3');
                    const selectElement2 = document.getElementById('selectIdEmp4');


                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.CUS;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#selectId3,#selectIdEmp4').on('change', async function () {
        debugger;
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            resetForm1();
        } else {
            try {
                const type = $('input[name="entityType3"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("34")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    outdata = JSON.parse(responseData.outdata);
                    if (type == "customer") {
                    $('#cus_name3').val(outdata.Table[0].NAME);
                    $('#cus_Branch3').val(outdata.Table[0].BRANCH_ID);
                    $('#cus_phno3').val(outdata.Table[0].PHONE2);
                    $('#cus_add3').val(outdata.Table[0].ADDRESS);
                    }
                    else {
                        $('#emp_name4').val(outdata.Table[0].EMP_NAME);
                        $('#emp_Branch4').val(outdata.Table[0].BRANCH_ID);
                        $('#empph_no4').val(outdata.Table[0].MOBILE_NO);
                        $('#emp_add4').val(outdata.Table[0].ADDRESS);
                        
                    }

                    //$('#cus_hormk2').val(outdata.Table[0].REMARK);
                } else {
                    await showAlert("Alert!", "Unable to load the Details.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#viewChallanBtn2').on('click', async function () {
        const selectedId = $('#selectId3').val() || $('#selectIdEmp4').val(); // Get the relevant ID
        const entityType = $('input[name="entityType3"]:checked').val();
        if (!selectedId || selectedId === '-1') {
            await showAlert("Alert!", "Please select an ID first.", "warning");
            return;
        }

        try {
            $("#globalLoader").show();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_type: encryptAES(entityType),
                p_indata: encryptAES(selectedId),
                doc1: '',
                doc2: '',
                as_optflag: encryptAES("35") // Assume optflag for viewing challan
            };

            var Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            debugger;
            if (responseData.err_sts == "1") {
                const data = JSON.parse(responseData.outdata); // Assume outdata has { base64: '...' }
                const base64 = data.Table[0].CHALLAN_DOC; // Adjust based on response structure

                if (!base64) {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "No document found.", "warning");
                    return;
                }

                const mimeType = detectMimeType(base64);
                const blob = base64ToBlob(base64, mimeType);
                currentDocUrl = URL.createObjectURL(blob);

                viewDocument(currentDocUrl, mimeType);
            } else {
                $("#globalLoader").hide();
                await showAlert("Alert!", "Unable to load document.", "warning");
            }
        } catch (error) {
            $("#globalLoader").hide();

            await showAlert("Alert!", "Error loading document. Please try again.", "warning");
        } $("#globalLoader").hide();
    });
    $('#viewAckBtn2').on('click', async function () {
        const selectedId = $('#selectId3').val() || $('#selectIdEmp4').val(); // Get the relevant ID
        const entityType = $('input[name="entityType3"]:checked').val();
        if (!selectedId || selectedId === '-1') {
            await showAlert("Alert!", "Please select an ID first.", "warning");
            return;
        }

        try {
            $("#globalLoader").show();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_type: encryptAES(entityType),
                p_indata: encryptAES(selectedId),
                doc1: '',
                doc2: '',
                as_optflag: encryptAES("36") // Assume optflag for viewing challan
            };

            var Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            debugger;
            if (responseData.err_sts == "1") {
                const data = JSON.parse(responseData.outdata); // Assume outdata has { base64: '...' }
                const base64 = data.Table[0].ACK_RE_DOC; // Adjust based on response structure

                if (!base64) {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "No document found.", "warning");
                    return;
                }

                const mimeType = detectMimeType(base64);
                const blob = base64ToBlob(base64, mimeType);
                currentDocUrl = URL.createObjectURL(blob);

                viewDocument(currentDocUrl, mimeType);
            } else {
                $("#globalLoader").hide();
                await showAlert("Alert!", "Unable to load document.", "warning");
            }
        } catch (error) {
            $("#globalLoader").hide();
            await showAlert("Alert!", "Error loading document. Please try again.", "warning");
        } $("#globalLoader").hide();
    });
    $('#confirmBtn2').on('click', async function () {
       
        const zoneId = $('#zone3').val();
        const zoneId2 = $('#zone4').val();
        const regid = $('#region3').val();
        const regid2 = $('#region4').val();
        const area1 = $('#area3').val();
        const area2 = $('#area4').val();
        const branchId = $('#branch3').val();
        const branchId2 = $('#branch4').val();
        const selectedId = $('#selectId3').val();
        const selectedId2 = $('#selectIdEmp4').val();

        const isFirstPairInvalid =
            zoneId == null || zoneId === '-1' ||
            regid == null || regid === '-1' ||
            area1 == null || area1 === '-1' ||
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
            zoneId2 == null || zoneId2 === '-1' ||
            regid2 == null || regid2 === '-1' ||
            area2 == null || area2 === '-1' ||
            branchId2 == null || branchId2 === '-1' ||
            selectedId2 == null || selectedId2 === '-1';

        if (isFirstPairInvalid && isSecondPairInvalid) {
            await showAlert("Alert!", "Please Select the Fields.", "warning");
            return;
        }

        else {
            let finalBranchId = null;
            let finalSelectedId = null;

            if (!isFirstPairInvalid) {
                finalBranchId = branchId;
                finalSelectedId = selectedId;
            } else if (!isSecondPairInvalid) {
                finalBranchId = branchId2;
                finalSelectedId = selectedId2;
            }


            try {
                const type = $('input[name="entityType3"]:checked').val();
                $("#globalLoader").show();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(finalSelectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("37")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                debugger;
                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Approved Successfully", "success");
                    loadSection2Data();
                    resetForm1();
                    return;

                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to submit the Details.", "warning");
                    return;
                }
            }
            catch
            {
                $("#globalLoader").hide();
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    });
    $('#rejectBtn2').on('click', async function () {
        debugger;
        const zoneId = $('#zone3').val();
        const zoneId2 = $('#zone4').val();
        const regid = $('#region3').val();
        const regid2 = $('#region4').val();
        const area1 = $('#area3').val();
        const area2 = $('#area4').val();
        const branchId = $('#branch3').val();
        const branchId2 = $('#branch4').val();
        const selectedId = $('#selectId3').val();
        const selectedId2 = $('#selectIdEmp4').val();

        const isFirstPairInvalid =
            zoneId == null || zoneId === '-1' ||
            regid == null || regid === '-1' ||
            area1 == null || area1 === '-1' ||
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
            zoneId2 == null || zoneId2 === '-1' ||
            regid2 == null || regid2 === '-1' ||
            area2 == null || area2 === '-1' ||
            branchId2 == null || branchId2 === '-1' ||
            selectedId2 == null || selectedId2 === '-1';

        if (isFirstPairInvalid && isSecondPairInvalid) {
            await showAlert("Alert!", "Please Select the Fields.", "warning");
            return;
        }

        else {
            let finalBranchId = null;
            let finalSelectedId = null;

            if (!isFirstPairInvalid) {
                finalBranchId = branchId;
                finalSelectedId = selectedId;
            } else if (!isSecondPairInvalid) {
                finalBranchId = branchId2;
                finalSelectedId = selectedId2;
            }
            try {
                const type = $('input[name="entityType3"]:checked').val();
                $("#globalLoader").show();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(finalSelectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("59")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                debugger;
                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Rejected Successfully", "success");
                    loadSection2Data();
                    resetForm1();
                    return;

                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to submit the Details.", "warning");
                    return;
                }
            }
            catch
            {
                $("#globalLoader").hide();
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    });
    //FORM 4 RTI REPLY VERIFICATION

    $('input[name="entityType4"]').on('change', function () {
        debugger;
        const selected = $(this).val();
        $('#customerFields4, #employeeFields4, #all_fields4').hide();

        if (selected === 'customer') {
            $('#customerFields4').show();
            $('#all_fields4').show();
        } else if (selected === 'employee') {
            $('#employeeFields4').show();
            $('#all_fields4').show();
        }

        loadSection4Data();
    });
    async function loadSection4Data() {
        
        $('#zone6, #zone5').empty();
        $('#region6, #region5').empty();
        $('#area6, #area5').empty();
        $('#branch6, #branch5').empty();
        $('#selectId6, #selectId5').empty();
        resetForm1();
        try {
            const type = $('input[name="entityType4"]:checked').val();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_type: encryptAES(type),
                p_indata: encryptAES(""),
                doc1: '',
                doc2: '',
                as_optflag: encryptAES("46")
            };

            var Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);

            const responseData = JSON.parse(Res);
            if (responseData.err_sts == "1") {
                const selectElement = document.getElementById('zone6');
                const selectElement2 = document.getElementById('zone5');


                outdata = JSON.parse(responseData.outdata);

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID1;
                        option.textContent = item.ZON;
                        if (type == "customer")
                            selectElement.appendChild(option);
                        else
                            selectElement2.appendChild(option);
                    });
                }
            } else {
                await showAlert("Alert!", "Unable to load the List.", "warning");
            }
        } catch {
            await showAlert("Alert!", "Error occurred..Please try again..", "warning");
            return;
        }
    }
    $('#zone5,#zone6').on('change', async function () {
       
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            $('#region6, #region5').empty();
            $('#area6, #area5').empty();
            $('#branch6, #branch5').empty();
            $('#selectId6, #selectId5').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType4"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("47")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('region6');
                    const selectElement2 = document.getElementById('region5');

                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.REG;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#region5,#region6').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            $('#area6, #area5').empty();
            $('#branch6, #branch5').empty();
            $('#selectId6, #selectId5').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType4"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("48")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('area6');
                    const selectElement2 = document.getElementById('area5');

                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.AREA;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#area5,#area6').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            $('#branch6, #branch5').empty();
            $('#selectId6, #selectId5').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType4"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("49")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('branch6');
                    const selectElement2 = document.getElementById('branch5');

                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.BRN;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#branch5,#branch6').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            $('#selectId6, #selectId5').empty();
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType4"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("50")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('selectId6');
                    const selectElement2 = document.getElementById('selectId5');

                    outdata = JSON.parse(responseData.outdata);

                    if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                        outdata.Table.forEach(item => {
                            const option = document.createElement("option");
                            option.value = item.ID1;
                            option.textContent = item.CUS;
                            if (type == "customer")
                                selectElement.appendChild(option);
                            else
                                selectElement2.appendChild(option);
                        });
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the List.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#selectId5,#selectId6').on('change', async function () {
        debugger;
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            resetForm1();
        } else {
            try {
                const type = $('input[name="entityType4"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("51")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    outdata = JSON.parse(responseData.outdata);
                    if (type == "customer") {
                        $('#cus_name6').val(outdata.Table[0].NAME);
                        $('#cus_Branch6').val(outdata.Table[0].BRANCH_ID);
                        $('#cus_phno6').val(outdata.Table[0].PHONE2);
                        $('#cus_add6').val(outdata.Table[0].ADDRESS);
                        $('#bh_rmk6').val(outdata.Table[0].REPLY_RMK);
                    }
                    else {
                        $('#emp_name5').val(outdata.Table[0].EMP_NAME);
                        $('#emp_Branch5').val(outdata.Table[0].BRANCH_ID);
                        $('#empph_no5').val(outdata.Table[0].MOBILE_NO);
                        $('#emp_add5').val(outdata.Table[0].ADDRESS);
                        $('#bh_rmk5').val(outdata.Table[0].REPLY_RMK);
                    }
                } else {
                    await showAlert("Alert!", "Unable to load the Details.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });
    $('#viewDoc').on('click', async function () {
        const selectedId = $('#selectId5').val() || $('#selectId6').val(); // Get the relevant ID
        const entityType = $('input[name="entityType4"]:checked').val();
        if (!selectedId || selectedId === '-1') {
            await showAlert("Alert!", "Please select an ID first.", "warning");
            return;
        }

        try {
            $("#globalLoader").show();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_type: encryptAES(entityType),
                p_indata: encryptAES(selectedId),
                doc1: '',
                doc2: '',
                as_optflag: encryptAES("52") // Assume optflag for viewing challan
            };

            var Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            debugger;
            if (responseData.err_sts == "1") {
                const data = JSON.parse(responseData.outdata); // Assume outdata has { base64: '...' }
                const base64 = data.Table[0].REPLY_DOC; // Adjust based on response structure

                if (!base64) {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "No document found.", "warning");
                    return;
                }

                const mimeType = detectMimeType(base64);
                const blob = base64ToBlob(base64, mimeType);
                currentDocUrl = URL.createObjectURL(blob);

                viewDocument(currentDocUrl, mimeType);
            } else {
                $("#globalLoader").hide();
                await showAlert("Alert!", "Unable to load document.", "warning");
            }
        } catch (error) {
            $("#globalLoader").hide();

            await showAlert("Alert!", "Error loading document. Please try again.", "warning");
        }
        $("#globalLoader").hide();
    });
    $('#confirmBtn4').on('click', async function () {
        const zoneId = $('#zone6').val();
        const zoneId2 = $('#zone5').val();
        const regid = $('#region6').val();
        const regid2 = $('#region5').val();
        const area1 = $('#area6').val();
        const area2 = $('#area5').val();
        const branchId = $('#branch6').val();
        const branchId2 = $('#branch5').val();
        const selectedId = $('#selectId6').val();
        const selectedId2 = $('#selectId5').val();

        const isFirstPairInvalid =
            zoneId == null || zoneId === '-1' ||
            regid == null || regid === '-1' ||
            area1 == null || area1 === '-1' ||
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
            zoneId2 == null || zoneId2 === '-1' ||
            regid2 == null || regid2 === '-1' ||
            area2 == null || area2 === '-1' ||
            branchId2 == null || branchId2 === '-1' ||
            selectedId2 == null || selectedId2 === '-1';

        if (isFirstPairInvalid && isSecondPairInvalid) {
            await showAlert("Alert!", "Please Select the Fields.", "warning");
            return;
        }

        else {
            let finalBranchId = null;
            let finalSelectedId = null;

            if (!isFirstPairInvalid) {
                finalBranchId = branchId;
                finalSelectedId = selectedId;
            } else if (!isSecondPairInvalid) {
                finalBranchId = branchId2;
                finalSelectedId = selectedId2;
            }


            try {
                const type = $('input[name="entityType4"]:checked').val();
                $("#globalLoader").show();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(finalSelectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("53")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                debugger;
                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Approved Successfully", "success");
                    loadSection4Data();
                    resetForm1();
                    return;

                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to submit the Details.", "warning");
                    return;
                }
            }
            catch
            {
                $("#globalLoader").hide();
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    });
    $('#rejectBtn4').on('click', async function () {
        debugger;
        const zoneId = $('#zone6').val();
        const zoneId2 = $('#zone5').val();
        const regid = $('#region6').val();
        const regid2 = $('#region5').val();
        const area1 = $('#area6').val();
        const area2 = $('#area5').val();
        const branchId = $('#branch6').val();
        const branchId2 = $('#branch5').val();
        const selectedId = $('#selectId6').val();
        const selectedId2 = $('#selectId5').val();

        const isFirstPairInvalid =
            zoneId == null || zoneId === '-1' ||
            regid == null || regid === '-1' ||
            area1 == null || area1 === '-1' ||
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
            zoneId2 == null || zoneId2 === '-1' ||
            regid2 == null || regid2 === '-1' ||
            area2 == null || area2 === '-1' ||
            branchId2 == null || branchId2 === '-1' ||
            selectedId2 == null || selectedId2 === '-1';

        if (isFirstPairInvalid && isSecondPairInvalid) {
            await showAlert("Alert!", "Please Select the Fields.", "warning");
            return;
        }

        else {
            let finalBranchId = null;
            let finalSelectedId = null;

            if (!isFirstPairInvalid) {
                finalBranchId = branchId;
                finalSelectedId = selectedId;
            } else if (!isSecondPairInvalid) {
                finalBranchId = branchId2;
                finalSelectedId = selectedId2;
            }
            try {
                const type = $('input[name="entityType4"]:checked').val();
                $("#globalLoader").show();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(finalSelectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("61")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                debugger;
                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Rejected Successfully", "success");
                    loadSection4Data();
                    resetForm1();
                    return;

                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to submit the Details.", "warning");
                    return;
                }
            }
            catch
            {
                $("#globalLoader").hide();
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    });

    $(document).on('input', '#employeeId', function () {
        this.value = this.value.replace(/[^0-9\s]/g, '');
    });
    $(document).on('input', '#branchId2', function () {
        this.value = this.value.replace(/[^0-9\s]/g, '');
    });
    $(document).on('input', '#customerId', function () {
        this.value = this.value.replace(/[^0-9\s]/g, '');
    });
    $(document).on('input', '#branchId1', function () {
        this.value = this.value.replace(/[^0-9\s]/g, '');
    });
    $(document).on('input', '#ho_rmk', function () {
        this.value = this.value.replace(/[^a-zA-Z0-9\s]/g, '');
    });
    $('#exitBtn,#exitBtn1,#exitBtn2,#exitBtn4').on('click', function () {
        redirectToDashboard();
    });
});

function detectMimeType(base64) {
    debugger;
    const header = base64.substring(0, 10);
    if (header.indexOf('/9j/') === 0) return 'image/jpeg';
    if (header.indexOf('iVBORw0KG') === 0) return 'image/png';
    if (header.indexOf('JVBERi0') === 0) return 'application/pdf';
    if (header.indexOf('R0lGODl') === 0) return 'image/gif';
    // Default to PDF for documents
    return 'application/pdf';
}
function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}
function viewDocument(url, mimeType) {
    $('#documentModal').show();
    if (mimeType && mimeType.startsWith('image/')) {
        $('#imgViewer').attr('src', url).show();
        $('#docViewer').hide();
    } else {
        // For PDF or unknown, use iframe (note: iframe may not work perfectly for all PDFs in all browsers)
        $('#docViewer').attr('src', url).show();
        $('#imgViewer').hide();
    }
    const extension = mimeType.split('/')[1]; // e.g., 'pdf', 'jpeg', 'png'
    const filename = `Property_Identification.${extension}`;

    const downloadBtn = document.getElementById('downloadDocBtn');
    if (downloadBtn) {
        downloadBtn.href = url;
        downloadBtn.download = filename;
        downloadBtn.style.display = 'inline-flex'; // Make sure it's visible
    }
}
// Close modal and cleanup
$(document).on('click', '.close', function () {
    $('#documentModal').hide();
    $('#docViewer').attr('src', '');
    $('#imgViewer').attr('src', '').hide();
    $('#downloadDocBtn').hide(); // Hide download button
    if (currentDocUrl && currentDocUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentDocUrl);
    }
    currentDocUrl = null;
});
// Close on outside click
$(document).on('click', '#documentModal', function (e) {
    if (e.target === this) {
        $(this).hide();
        $('#docViewer').attr('src', '');
        $('#imgViewer').attr('src', '').hide();
        if (currentDocUrl && currentDocUrl.startsWith('blob:')) {
            URL.revokeObjectURL(currentDocUrl);
        }
        currentDocUrl = null;
    }
});
function resetForm1() {
  //  $('#selectId1,#selectIdEmp1,#zone1,#emp_zone1,#region1,#emp_region1,#area1,#emp_area1,#branch1,#emp_branch1').val('-1');
    $('#cus_Branch1, #cus_name1, #cus_phno1, #cus_add1, #cus_hormk1,#emp_name1,#emp_Branch1,#empph_no1,#emp_add1,#emp_hormk1').val('');
    $('#cus_Branch3, #cus_name3, #cus_phno3, #cus_add3,#emp_name4,#emp_Branch4,#empph_no4,#emp_add4').val('');
    $('#cus_Branch6, #cus_name6, #cus_phno6, #cus_add6,#bh_rmk6,#emp_name5,#emp_Branch5,#empph_no5,#emp_add5,#bh_rmk5').val('');

}


function resetsection() {
    $('input[name="entityType"]').prop('checked', false);
    $('input[name="entityType2"]').prop('checked', false);
    $('input[name="entityType3"]').prop('checked', false);
    $('input[name="entityType4"]').prop('checked', false);
    $('#section1, #section2, #section3,#section4').hide();
    $('#customerFields, #employeeFields').hide();
    $('#customerFields1, #employeeFields1,#all_fileds1').hide();
    $('#customerFields3, #employeeFields3,#allfields3').hide();
    $('#customerFields4, #employeeFields4,#allfields4').hide();
}

