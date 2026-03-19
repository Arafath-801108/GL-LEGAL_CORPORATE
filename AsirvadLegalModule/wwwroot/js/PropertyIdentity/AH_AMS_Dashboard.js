$(document).ready(function () {

    checkAccess("41");

    let currentDocUrl = null;
    const section1 = document.getElementById("section1");
    const section2 = document.getElementById("section2");
    const section3 = document.getElementById("section3");
    $('#formSelect').on('change', function () {
        debugger;
        $(section1).hide();
        $(section2).hide();
        $(section3).hide();
        const selectedForm = $(this).val();
        resetsection();
        if (selectedForm === '1') {
            resetForm1();
            $(section1).show();

        } else if (selectedForm === '2') {
            $(section2).show();
        } else if (selectedForm === '3') {
            $(section3).show();
        }
    });

    //FORM 1
    $('input[name="entityType1"]').on('change', function () {
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
        $('#branch2,#branch1').empty();
        $('#selectId1, #selectIdEmp1').empty();
        resetForm1();
        try {
            const type = $('input[name="entityType1"]:checked').val();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_type: encryptAES(type),
                p_indata: encryptAES(""),
                doc1: '',
                doc2: '',
                as_optflag: encryptAES("5")
            };
            debugger;
            var Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);

            const responseData = JSON.parse(Res);
            if (responseData.err_sts == "1")
            {
                const selectElement = document.getElementById('branch1');
                const selectElement2 = document.getElementById('branch2');
                
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
    $('#branch1,#branch2').on('change', async function () {
        const selectedId = $(this).val();
        debugger;
        if (selectedId == '-1') {
            $('#selectId1, #selectIdEmp1').empty();
            resetForm1();
        } else {
            try {
                const type = $('input[name="entityType1"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("6")
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
                    await showAlert("Alert!", "Unable to load the Details.", "warning");
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
        } else {
            try {
                const type = $('input[name="entityType1"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("7")
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
                    await showAlert("Alert!", "Unable to load the Details.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });   
    $('#viewChallanBtn1').on('click', async function () {
        debugger;
        // const selectedId = $('#selectId1').val()?.trim() || $('#selectIdEmp1').val()?.trim(); // Get the relevant ID
        const id1 = $('#selectId1').val();
        const id2 = $('#selectIdEmp1').val();

        const selectedId = (id1 && id1 !== '-1') ? id1.trim() :
            (id2 && id2 !== '-1') ? id2.trim() : null;

        const entityType = $('input[name="entityType1"]:checked').val();
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
                as_optflag: encryptAES("8") // Assume optflag for viewing challan
            };

            var Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);
            const responseData = JSON.parse(Res);
            debugger;
            if (responseData.err_sts == "1") {
                const data = JSON.parse(responseData.outdata); // Assume outdata has { base64: '...' }
                const base64 = data.Table[0].CHALLAN_DOC; // Adjust based on response structure

                if (!base64) {
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
    $('#viewReceiptBtn1').on('click', async function () {
       
        const id1 = $('#selectId1').val();
        const id2 = $('#selectIdEmp1').val();

        const selectedId = (id1 && id1 !== '-1') ? id1.trim() :
            (id2 && id2 !== '-1') ? id2.trim() : null;

        const entityType = $('input[name="entityType1"]:checked').val();
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
                as_optflag: encryptAES("9") // Assume optflag for viewing challan
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
        }
        $("#globalLoader").hide();
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
        // Set up download button
        const extension = mimeType.split('/')[1]; // e.g., 'pdf', 'jpeg', 'png'
        const filename = `Property_Identification.${extension}`;

        const downloadBtn = document.getElementById('downloadDocBtn');
        if (downloadBtn) {
            downloadBtn.href = url;
            downloadBtn.download = filename;
            downloadBtn.style.display = 'inline-flex'; // Make sure it's visible
        }
    }
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
    $('#confirmBtn1').on('click', async function () {
        debugger;
        const branchId = $('#branch1').val();
        const selectedId = $('#selectId1').val();
        const branchId2 = $('#branch2').val();
        const selectedId2 = $('#selectIdEmp1').val();

        const isFirstPairInvalid =
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
            branchId2 == null || branchId2 === '-1' ||
            selectedId2 == null || selectedId2 === '-1';

        if (isFirstPairInvalid && isSecondPairInvalid) {
            await showAlert("Alert!", "Please Select the Fields.", "warning");
            return;
        }
        
        else {
            let finalBranchId = null;
            let finalSelectedId = null;

            if (!isFirstPairInvalid ) {
                finalBranchId = branchId;
                finalSelectedId = selectedId;
            } else if (!isSecondPairInvalid) {
                finalBranchId = branchId2;
                finalSelectedId = selectedId2;
            }
            try {
                $("#globalLoader").show();
                const type = $('input[name="entityType1"]:checked').val();

                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(finalSelectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("10")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                debugger;
                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Confirmed Successfully", "success");
                    loadSection1Data(); 
                    $('#selectId1, #selectIdEmp1').empty();
                    resetForm1();
                    return;

                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to submit the Details.", "warning");
                    loadSection1Data();  
                    $('#selectId1, #selectIdEmp1').empty();
                    resetForm1();
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
        const branchId = $('#branch1').val();
        const selectedId = $('#selectId1').val();
        const branchId2 = $('#branch2').val();
        const selectedId2 = $('#selectIdEmp1').val();

        const isFirstPairInvalid =
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
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
                const type = $('input[name="entityType1"]:checked').val();
                $("#globalLoader").show();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(finalSelectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("56")
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
                    $('#selectId1, #selectIdEmp1').empty();
                    resetForm1();
                    return;

                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to submit the Details.", "warning");
                    loadSection1Data(); 
                    $('#selectId1, #selectIdEmp1').empty();
                    resetForm1();
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
    // FORM 2

    $('input[name="entityType2"]').on('change', function () {
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
        $('#branch3,#branch4').empty();
        $('#selectId3, #selectIdEmp3').empty();
        resetForm1();
        try {
            const type = $('input[name="entityType2"]:checked').val();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_type: encryptAES(type),
                p_indata: encryptAES(""),
                doc1: '',
                doc2: '',
                as_optflag: encryptAES("23")
            };
            debugger;
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

    $('#branch3,#branch4').on('change', async function () {
        const selectedId = $(this).val();
        debugger;
        if (selectedId == '-1') {
            $('#selectId3, #selectIdEmp3').empty();
            resetForm1();
        } else {
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
                    as_optflag: encryptAES("24")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('selectId3');
                    const selectElement2 = document.getElementById('selectIdEmp3');
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
                    await showAlert("Alert!", "Unable to load the Details.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });

    $('#selectId3,#selectIdEmp3').on('change', async function () {
        debugger;
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            resetForm1();
        } else {
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
                    as_optflag: encryptAES("28")
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
                        $('#emp_name3').val(outdata.Table[0].EMP_NAME);
                        $('#emp_Branch3').val(outdata.Table[0].BRANCH_ID);
                        $('#empph_no3').val(outdata.Table[0].MOBILE_NO);
                        $('#emp_add3').val(outdata.Table[0].ADDRESS);
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

    $('#viewChallanBtn2').on('click', async function () {
        debugger;
        const selectedId = $('#selectId3').val() || $('#selectIdEmp3').val(); // Get the relevant ID
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
                as_optflag: encryptAES("25") // Assume optflag for viewing challan
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
        }
        $("#globalLoader").hide();
    });

    $('#viewAckBtn1').on('click', async function () {
        debugger;
        const selectedId = $('#selectId3').val() || $('#selectIdEmp3').val(); // Get the relevant ID
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
                as_optflag: encryptAES("26") // Assume optflag for viewing challan
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
        const branchId = $('#branch3').val();
        const selectedId = $('#selectId3').val();
        const branchId2 = $('#branch4').val();
        const selectedId2 = $('#selectIdEmp3').val();

        const isFirstPairInvalid =
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
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
                    as_optflag: encryptAES("27")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                debugger;
                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Recommended Successfully", "success");
                    loadSection2Data();
                    return;

                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to submit the Details.", "warning");
                    loadSection2Data();
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
        const branchId = $('#branch3').val();
        const selectedId = $('#selectId3').val();
        const branchId2 = $('#branch4').val();
        const selectedId2 = $('#selectIdEmp3').val();

        const isFirstPairInvalid =
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
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
                    as_optflag: encryptAES("58")
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
                    return;

                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to submit the Details.", "warning");
                    loadSection2Data();
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

    //FORM 3
    $('input[name="entityType3"]').on('change', function () {
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

        loadSection3Data();
    });

    async function loadSection3Data() {
        $('#branch5,#branch6').empty();
        $('#selectId5, #selectIdEmp6').empty();
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
                as_optflag: encryptAES("41")
            };
            debugger;
            var Res = await fetch("/proc_property_identification", "POST", requestData);
            Res = decryptAES(Res);

            const responseData = JSON.parse(Res);
            if (responseData.err_sts == "1") {
                const selectElement = document.getElementById('branch5');
                const selectElement2 = document.getElementById('branch6');

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

    $('#branch5,#branch6').on('change', async function () {
        const selectedId = $(this).val();
        debugger;
        if (selectedId == '-1') {
            $('#selectId5, #selectIdEmp6').empty();
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
                    as_optflag: encryptAES("42")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    const selectElement = document.getElementById('selectId5');
                    const selectElement2 = document.getElementById('selectIdEmp6');

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
                    await showAlert("Alert!", "Unable to load the Details.", "warning");
                }
            } catch {
                await showAlert("Alert!", "Error occurred..Please try again..", "warning");
                return;
            }
        }
    });

    $('#selectId5,#selectIdEmp6').on('change', async function () {
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
                    as_optflag: encryptAES("45")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                Res = decryptAES(Res);
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    outdata = JSON.parse(responseData.outdata);
                    if (type == "customer") {
                        $('#cus_name5').val(outdata.Table[0].NAME);
                        $('#cus_Branch5').val(outdata.Table[0].BRANCH_ID);
                        $('#cus_phno5').val(outdata.Table[0].PHONE2);
                        $('#cus_add5').val(outdata.Table[0].ADDRESS);
                        $('#bh_rmk').val(outdata.Table[0].REPLY_RMK);
                    }
                    else {
                        $('#emp_name6').val(outdata.Table[0].EMP_NAME);
                        $('#emp_Branch6').val(outdata.Table[0].BRANCH_ID);
                        $('#empph_no6').val(outdata.Table[0].MOBILE_NO);
                        $('#emp_add6').val(outdata.Table[0].ADDRESS);
                        $('#bh_rmk6').val(outdata.Table[0].REPLY_RMK);
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
        const selectedId = $('#selectId5').val() || $('#selectIdEmp6').val(); // Get the relevant ID
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
                as_optflag: encryptAES("43") // Assume optflag for viewing challan
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
        } $("#globalLoader").hide();
    });

  
    $('#confirmBtn3').on('click', async function () {
        const branchId = $('#branch5').val();
        const selectedId = $('#selectId5').val();
        const branchId2 = $('#branch6').val();
        const selectedId2 = $('#selectIdEmp6').val();

        const isFirstPairInvalid =
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
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
                    as_optflag: encryptAES("44")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                debugger;
                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Recommended Successfully", "success");
                    loadSection3Data();
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

    $('#rejectBtn3').on('click', async function () {
        const branchId = $('#branch5').val();
        const selectedId = $('#selectId5').val();
        const branchId2 = $('#branch6').val();
        const selectedId2 = $('#selectIdEmp6').val();

        const isFirstPairInvalid =
            branchId == null || branchId === '-1' ||
            selectedId == null || selectedId === '-1';

        const isSecondPairInvalid =
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
                    as_optflag: encryptAES("60")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                debugger;
                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Rejected Successfully", "success");
                    loadSection3Data();
                    return;

                }
                else {
                    $("#globalLoader").hide();
                    await showAlert("Alert!", "Unable to submit the Details.", "warning");
                    loadSection3Data();
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
    function resetsection() {
        $('input[name="entityType1"]').prop('checked', false);
        $('input[name="entityType2"]').prop('checked', false);
        $('input[name="entityType3"]').prop('checked', false);
        $('#section1, #section2, #section3').hide();
        $('#customerFields1, #employeeFields1,#all_fields1').hide();
        $('#customerFields3, #employeeFields3,#all_fields3').hide();
        $('#customerFields4, #employeeFields4,#all_fields4').hide();
    }
    function resetForm1() {
        $('#selectId1, #selectIdEmp1,#selectIdEmp3, #selectId3,#selectIdEmp6,#selectId5').val('-1');
        $('#cus_Branch1, #cus_name1, #cus_phno1, #cus_add1, #cus_hormk1,#emp_hormk1,#emp_add1,#empph_no1,#emp_name1,#emp_Branch1').val('');       
        $('#cus_Branch3, #cus_name3, #cus_phno3, #cus_add3,#emp_add3,#empph_no3,#emp_name3,#emp_Branch3').val('');       
        $('#cus_Branch5, #cus_name5, #cus_phno5, #cus_add5,#emp_add6,#empph_no6,#emp_name6,#emp_Branch6,#bh_rmk,#bh_rmk6').val('');
    }

    $('#exitBtn1, #exitBtn2, #exitBtn3').on('click', function () {
        redirectToDashboard();
    });

 

});