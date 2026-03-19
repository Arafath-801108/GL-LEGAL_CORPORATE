$(document).ready(function () {
    
    checkAccess("40");

    const section1 = document.getElementById("section1");
    const section2 = document.getElementById("section2");
    const section3 = document.getElementById("section3");
    $('#formSelect').on('change', function () {
       
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

    // FORM1
    $('input[name="entityType"]').on('change', function () {
        const selected = $(this).val();
        $('#customerFields, #employeeFields,#all_fileds').hide();

        if (selected === 'customer') {
            resetForm1();
            $('#customerFields').show();
            $('#all_fileds').show();
           
        } else if (selected === 'employee') {
            resetForm1();
            $('#employeeFields').show();
            $('#all_fileds').show();
        }
       
        loadSection1Data();
    });
    async function loadSection1Data() {
        $('#selectId2, #selectId1').empty();
        resetForm1();   
        try {
            const type = $('input[name="entityType"]:checked').val();
            const requestData = {
                employeeId: sessionStorage.getItem("EmployeeId"),
                token: sessionStorage.getItem("Token"),
                branch: sessionStorage.getItem("BranchId"),
                p_type: encryptAES(type),
                p_indata: encryptAES(""),
                doc1: '',
                doc2: '',
                as_optflag: encryptAES("2")
            };

            var Res = await fetch("/proc_property_identification", "POST", requestData);
           
            Res = decryptAES(Res);
           
            const responseData = JSON.parse(Res);
            if ((responseData).err_sts == "1") {
                const selectElement = document.getElementById('selectId1');
                const selectElement2 = document.getElementById('selectId2');
                selectElement.innerHTML = '';
                selectElement2.innerHTML = '';

                outdata = JSON.parse(responseData.outdata);

                if (outdata && outdata.Table && Array.isArray(outdata.Table) && outdata.Table.length > 0) {
                    outdata.Table.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.ID1;
                        option.textContent = item.CUS;
                        if (type=="customer")
                            selectElement.appendChild(option);
                        else
                            selectElement2.appendChild(option);
                    });
                }
            }
            else {
                await showAlert("Alert!", "Unable to load the List.", "warning");
            }
        }
        catch
        {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    }

    $('#selectId1, #selectId2').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
            resetForm1();
        }
        else {
            try {
                const type = $('input[name="entityType"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(selectedId),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("3")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);

                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {


                    outdata = JSON.parse(responseData.outdata);
                    if (type == "customer") {
                        $('#cus_name').val(outdata.Table[0].NAME);
                        $('#cus_Branch').val(outdata.Table[0].BRANCH_ID);
                        $('#cus_phno').val(outdata.Table[0].PHONE2);
                        $('#cus_add').val(outdata.Table[0].ADDRESS);
                        $('#cus_hormk').val(outdata.Table[0].REMARK);
                    }
                    else {
                        $('#emp_name').val(outdata.Table[0].EMP_NAME);
                        $('#emp_Branch').val(outdata.Table[0].BRANCH_ID);
                        $('#empph_no').val(outdata.Table[0].MOBILE_NO);
                        $('#emp_add').val(outdata.Table[0].ADDRESS);
                        $('#emp_hormk').val(outdata.Table[0].REMARK);
                    }


                }
                else {
                    await showAlert("Alert!", "Unable to load the Details.", "warning");
                }
            }
            catch
            {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }

        }
        
    });

    $('#confirmBtn1').on('click', async function () {
        debugger;
        const selectedId1 = $('#selectId1').val();
        const selectedId2 = $('#selectId2').val();
        const rlNumber = $('#rlNumber').val().toUpperCase();
        const dispatchDate = $('#dispatchDate').val();
        const document1 = $('#challanUpload')[0].files.length;
        const document2 = $('#receiptUpload')[0].files.length;
        let selectedId = null;
        if (selectedId1 && selectedId1 !== '-1') {
            selectedId = selectedId1;
        } else if (selectedId2 && selectedId2 !== '-1') {
            selectedId = selectedId2;
        }
        const noSelection = selectedId === '-1' && selectedId2 === '-1';
        if (noSelection || !rlNumber || !dispatchDate || document1 === 0 || document2 === 0) {
           
            await showAlert("Alert!", "Please fill all required fields and upload document!", "warning");
            return;
        }
        else {
            try {
                const type = $('input[name="entityType"]:checked').val();

                let img1;
                const fileInput1 = $('#challanUpload')[0];
                if (fileInput1 && fileInput1.files && fileInput1.files[0]) {
                    img1 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64String = e.target.result.split(',')[1];
                            if (!base64String) {
                                reject(new Error('Invalid Base64 string for file 1'));
                            } else {
                                resolve(base64String);
                            }
                        };
                        reader.onerror = () => reject(new Error('Failed to read file 1'));
                        reader.readAsDataURL(fileInput1.files[0]);
                    });
                }

                let img2;
                const fileInput2 = $('#receiptUpload')[0];
                if (fileInput2 && fileInput2.files && fileInput2.files[0]) {
                    img2 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64String = e.target.result.split(',')[1];
                            if (!base64String) {
                                reject(new Error('Invalid Base64 string for file 1'));
                            } else {
                                resolve(base64String);
                            }
                        };
                        reader.onerror = () => reject(new Error('Failed to read file 1'));
                        reader.readAsDataURL(fileInput2.files[0]);
                    });
                }
                $("#globalLoader").show();
                const input_data = `${selectedId}~${rlNumber}~${dispatchDate}`
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(input_data),
                    doc1: img1,
                    doc2: img2,
                    as_optflag: encryptAES("4")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);

                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Confirmed Successfully", "success");
                    loadSection1Data();
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

    $('#btn_app').on('click', function () {
        const downloadUrl = $(this).data('url');
        window.location.href = downloadUrl;
    });

    $('#rlNumber').on('blur', async function () {
        const rlValue = $.trim($(this).val());
        //const rlPattern = /^[A-Z]{2}\d{9}IN$/;
        const rlPattern = /^[A-Za-z]{2}\d{9}[Ii][Nn]$/;
        const $errorSpan = $('#rlError');
        if (rlValue === '') {
            $('#rlNumber').val('');
        }
        else if (!rlPattern.test(rlValue)) {
            $('#rlNumber').val('');
            await showAlert("Alert!", "Invalid format. Please enter valid RL Number.", "warning");
        }
        else {
            try {
                const rlNumber = $('#rlNumber').val().toUpperCase();
                const type = $('input[name="entityType2"]:checked').val();
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(rlNumber),
                    doc1: '',
                    doc2: '',
                    as_optflag: encryptAES("62")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);
                debugger;
                Res = decryptAES(Res);

                const responseData = JSON.parse(Res);
                if ((responseData).err_sts == "1") {
                    $('#rlNumber').val(rlNumber);
                   
                }
                else {
                    await showAlert("Alert!", "Alredy entered RL Number.", "warning");
                    $('#rlNumber').val('');
                }
            }
            catch
            {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }
        }
    });

    $(document).on('change', '#dispatchDate, #dateReceived2', function () {
        validateDate(this);
   });

    // FORM2
    $('input[name="entityType2"]').on('change', function () {
        const selected = $(this).val();
        $('#customerFields1, #employeeFields1,#all_fileds1').hide();

        if (selected === 'customer') {
            $('#customerFields1').show();
            $('#all_fileds1').show();

        } else if (selected === 'employee') {
            $('#employeeFields1').show();
            $('#all_fileds1').show();
        }

        loadSection1Data2();
    });
    async function loadSection1Data2() {
        $('#selectId3, #selectId4').empty();
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
                as_optflag: encryptAES("20")
            };

            var Res = await fetch("/proc_property_identification", "POST", requestData);
            debugger;
            Res = decryptAES(Res);

            const responseData = JSON.parse(Res);
            if ((responseData).err_sts == "1") {
                const selectElement = document.getElementById('selectId3');
                selectElement.innerHTML = '';
                const selectElement2 = document.getElementById('selectId4');
                selectElement2.innerHTML = '';

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
            }
            else {
                await showAlert("Alert!", "Unable to load the List.", "warning");
            }
        }
        catch
        {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    }
    $('#selectId3,#selectId4').on('change', async function () {
       
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
                    as_optflag: encryptAES("21")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);

                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {


                    outdata = JSON.parse(responseData.outdata);
                    if (type == "customer") {
                        $('#cus_name3').val(outdata.Table[0].NAME);
                        $('#cus_Branch3').val(outdata.Table[0].BRANCH_ID);
                        $('#cus_phno3').val(outdata.Table[0].PHONE2);
                        $('#cus_add3').val(outdata.Table[0].ADDRESS);
                        $('#cus_hormk3').val(outdata.Table[0].REMARK);
                    }
                    else {
                        $('#emp_name4').val(outdata.Table[0].EMP_NAME);
                        $('#emp_Branch4').val(outdata.Table[0].BRANCH_ID);
                        $('#empph_no4').val(outdata.Table[0].MOBILE_NO);
                        $('#emp_add4').val(outdata.Table[0].ADDRESS);
                        $('#emp_hormk4').val(outdata.Table[0].REMARK);
                    }
                }
                else {
                    await showAlert("Alert!", "Unable to load the Details.", "warning");
                }
            }
            catch
            {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }

        }

    });

    $('#confirmBtn2').on('click', async function () {
        debugger;
        const selectedId = $('#selectId3').val();
        const selectedId2 = $('#selectId4').val();
        const documentType = $('#documentType').val();
        const dateReceived2 = $('#dateReceived2').val();
        const ackUpload = $('#ackUpload')[0].files.length;
        const isFirstPairInvalid =
            selectedId == null || selectedId === '-1';
        const isSecondPairInvalid =
            selectedId2 == null || selectedId2 === '-1';
        if (isFirstPairInvalid && isSecondPairInvalid) {
            await showAlert("Alert!", "Please Select the CustomerId.", "warning");
            return;
        }
        else if ( !documentType || !dateReceived2 || ackUpload === 0 ) {

            await showAlert("Alert!", "Please fill all required fields and upload document!", "warning");
            return;
        }
       
        else {
            let finalSelectedId = null;

            if (!isFirstPairInvalid) {
                finalSelectedId = selectedId;
            } else if (!isSecondPairInvalid) {
                finalSelectedId = selectedId2;
            }
            try {
                const type = $('input[name="entityType2"]:checked').val();

                let img1;
                const fileInput1 = $('#ackUpload')[0];
                if (fileInput1 && fileInput1.files && fileInput1.files[0]) {
                    img1 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64String = e.target.result.split(',')[1];
                            if (!base64String) {
                                reject(new Error('Invalid Base64 string for file 1'));
                            } else {
                                resolve(base64String);
                            }
                        };
                        reader.onerror = () => reject(new Error('Failed to read file 1'));
                        reader.readAsDataURL(fileInput1.files[0]);
                    });
                }

                $("#globalLoader").show();
                const input_data = `${finalSelectedId}~${documentType}~${dateReceived2}`
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(input_data),
                    doc1: img1,
                    doc2: '',
                    as_optflag: encryptAES("22")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);

                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Confirmed Successfully", "success");
                    loadSection1Data2();
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

    // FORM 3
    $('input[name="entityType3"]').on('change', function () {
        const selected = $(this).val();
        $('#customerFields3, #employeeFields3,#allfields3').hide();

        if (selected === 'customer') {
            $('#customerFields3').show();
            $('#allfields3').show();

        } else if (selected === 'employee') {
            $('#employeeFields3').show();
            $('#allfields3').show();
        }

        loadSection1Data3();
    });
    async function loadSection1Data3() {
        $('#selectId5, #selectId6').empty();
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
                as_optflag: encryptAES("38")
            };

            var Res = await fetch("/proc_property_identification", "POST", requestData);
            debugger;
            Res = decryptAES(Res);

            const responseData = JSON.parse(Res);
            if ((responseData).err_sts == "1") {
                const selectElement = document.getElementById('selectId5');
                const selectElement2 = document.getElementById('selectId6');

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
            }
            else {
                await showAlert("Alert!", "Unable to load the List.", "warning");
            }
        }
        catch
        {
            await showAlert("Alert!", "Error occured..Please try again..", "warning");
            return;
        }
    }
    $('#selectId5,#selectId6').on('change', async function () {
        const selectedId = $(this).val();
        if (selectedId == '-1') {
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
                    as_optflag: encryptAES("39")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);

                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {


                    outdata = JSON.parse(responseData.outdata);
                    if (type == "customer") {
                        $('#cus_name5').val(outdata.Table[0].NAME);
                        $('#cus_Branch5').val(outdata.Table[0].BRANCH_ID);
                        $('#cus_phno5').val(outdata.Table[0].PHONE2);
                        $('#cus_add5').val(outdata.Table[0].ADDRESS);
                    }
                    else {
                        $('#emp_name6').val(outdata.Table[0].EMP_NAME);
                        $('#emp_Branch6').val(outdata.Table[0].BRANCH_ID);
                        $('#emp_phno6').val(outdata.Table[0].MOBILE_NO);
                        $('#emp_add6').val(outdata.Table[0].ADDRESS);
                    }

                }
                else {
                    await showAlert("Alert!", "Unable to load the Details.", "warning");
                }
            }
            catch
            {
                await showAlert("Alert!", "Error occured..Please try again..", "warning");
                return;
            }

        }

    });

    $('#confirmBtn3').on('click', async function () {
        debugger;
        const selectedId = $('#selectId5').val();
        const selectedId2 = $('#selectId6').val();
        const reply2 = $('#reply6').val();
        const rmk = $('#remarks6').val();
        const ackUpload = $('#replyUpload6')[0].files.length;

        const isFirstPairInvalid =
            selectedId == null || selectedId === '-1' ||
            reply2 == null || reply2 === '-1';          
           
        const isSecondPairInvalid =
            selectedId2 == null || selectedId2 === '-1' ||
            reply2 == null || reply2 === '-1';  

        if (isFirstPairInvalid && isSecondPairInvalid) {
            await showAlert("Alert!", "Please Select the Fields.", "warning");
            return;
        }
        else if (!rmk || ackUpload === 0) {

            await showAlert("Alert!", "Please fill all required fields and upload document!", "warning");
            return;
        }

        else {
            let finalSelectedId = null;

            if (!isFirstPairInvalid) {
                finalSelectedId = selectedId;
                finalreply = reply2;

            } else if (!isSecondPairInvalid) {
                finalSelectedId = selectedId2;
                finalreply = reply2;
            }
            try {

                const type = $('input[name="entityType3"]:checked').val();
                let img1;
                const fileInput1 = $('#replyUpload6')[0];
                if (fileInput1 && fileInput1.files && fileInput1.files[0]) {
                    img1 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64String = e.target.result.split(',')[1];
                            if (!base64String) {
                                reject(new Error('Invalid Base64 string for file 1'));
                            } else {
                                resolve(base64String);
                            }
                        };
                        reader.onerror = () => reject(new Error('Failed to read file 1'));
                        reader.readAsDataURL(fileInput1.files[0]);
                    });
                }

                $("#globalLoader").show();
                const input_data = `${finalSelectedId}~${finalreply}~${rmk}`
                const requestData = {
                    employeeId: sessionStorage.getItem("EmployeeId"),
                    token: sessionStorage.getItem("Token"),
                    branch: sessionStorage.getItem("BranchId"),
                    p_type: encryptAES(type),
                    p_indata: encryptAES(input_data),
                    doc1: img1,
                    doc2: '',
                    as_optflag: encryptAES("40")
                };

                var Res = await fetch("/proc_property_identification", "POST", requestData);

                Res = decryptAES(Res);
                debugger;
                const responseData = JSON.parse(Res);
                if (responseData.err_sts == "1") {
                    $("#globalLoader").hide();
                    await showAlert("Success!", "Confirmed Successfully", "success");
                    loadSection1Data3();
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

    $(document).on('input', '#rlNumber', function () {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    });

    function resetsection() {
        $('input[name="entityType"]').prop('checked', false);
        $('input[name="entityType2"]').prop('checked', false);
        $('input[name="entityType3"]').prop('checked', false);
        $('#section1, #section2, #section3').hide();
        $('#customerFields, #employeeFields,#all_fileds').hide();
        $('#customerFields1, #employeeFields1,#all_fileds1').hide();
        $('#customerFields3, #employeeFields3,#allfields3').hide();
    }
    function resetForm1() {

        $('#selectId1,#selectId2,#documentType,#reply6,#reply').val('-1');
        $('#cus_Branch, #cus_name, #cus_phno, #cus_add,#cus_hormk,#emp_Branch,#emp_name,#empph_no,#emp_add,#emp_hormk').val('');
        $('#cus_Branch3, #cus_name2, #cus_phno3,#cus_name3, #cus_add3,#cus_hormk3,#emp_Branch4,#emp_name4,#empph_no4,#emp_add4,#emp_hormk4').val('');
        $('#cus_Branch5, #cus_phno5, #cus_add5, #emp_name6,#emp_add6,#emp_phno6,#emp_Branch6,#cus_name5').val('');
        $('#rlNumber,#remarks6').val('');
        $('#dispatchDate,#dateReceived2').val('');
        $('#challanUpload, #receiptUpload,#ackUpload,#replyUpload6').val('');

    }

    $('input[type="file"]').on('change', async function () {
        const file = this.files[0];
        if (file) {
            const fileSize = file.size / 1024 / 1024; // Size in MB
            const maxSize = 5; // 5MB max

            if (fileSize > maxSize) {

                await showAlert("Alert!", "File size should not exceed 5MB!", "warning");
                this.value = ''; // Clear the input
                return;
            }

            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            const disallowedExtensions = ['jfif'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedTypes.includes(file.type) || disallowedExtensions.includes(fileExtension)) {
                await showAlert("Alert!", "Only PDF, JPG, JPEG, and PNG files are allowed!", "warning");
                this.value = ''; // Clear the input
                return;
            }
        }
    });
    async function validateDate(input) {
        const selectedDate = new Date(input.value);
        const today = new Date();

        // Normalize both dates to YYYY-MM-DD format
        const selected = selectedDate.toISOString().split('T')[0];
        const current = today.toISOString().split('T')[0];

        if (selected > current) {
            await showAlert("Alert!", "Future dates are not allowed.", "warning");
            input.value = ''; // Clear the input
        }
    }
    $('#exitBtn3, #exitBtn2, #exitBtn1').on('click', function () {
        redirectToDashboard();
    });
});





