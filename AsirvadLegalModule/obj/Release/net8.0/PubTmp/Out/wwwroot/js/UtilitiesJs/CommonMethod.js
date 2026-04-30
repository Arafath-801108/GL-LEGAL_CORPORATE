
//document.addEventListener("click", function (event) {
//    if (event.target && event.target.id ==="btn_submit") {
//    redirectToDashboard();
//    }
//});




async function clearSessionStorage() {
    try {

        sessionStorage.removeItem("EmployeeId");
        sessionStorage.removeItem("BranchId");
        sessionStorage.removeItem("Token");
        sessionStorage.removeItem("Post");
        sessionStorage.removeItem("employeeName");

    } catch (error) {
        
    }
}


async function fetch(url, type, data) {
    debugger;
    const isDevelopment = window.location.hostname === 'localhost';
    const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate'; 
    return $.ajax({
        url: liveurl+url,
        type: type,
        contentType: "application/json",
        data: JSON.stringify(data),
        error: function (xhr, status, error) {
           
            xhrstatus(xhr.status);

        }
    });
}

async function xhrstatus(status) {
    
    const isDevelopment = window.location.hostname === 'localhost';
    const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate'; 
    
    switch (status) {

        case (401):
            clearSessionStorage()
            await showAlert("Alert!", "Session Expred..Please try again..", "warning");
            return window.location.href = liveurl + '/Login';
        case (500):
            await showAlert("Alert!", "Oops!! something went wrong..Sorry for the trouble..", "warning");
            return;
        case (429):
            clearSessionStorage()
            await showAlert("Alert!", "Limit Reached..", "warning");
            return window.location.href = liveurl + '/Login';
        default:
            await showAlert("Alert!", "Oops!! something went wrong..Sorry for the trouble..", "warning");
            return;

    }
}
async function redirectToDashboard()
{
    const isDevelopment = window.location.hostname === 'localhost';
    const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate'; 
    window.location.href = liveurl + '/Login/Dashboard';
}
  
async function fetchEmployee(url, type, data) {
    
    const isDevelopment = window.location.hostname === 'localhost';
    const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate';

    return $.ajax({
        url: liveurl + url,
        type: type,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: handleSuccess,
        error: function (xhr, status, error) {
            xhrstatus(xhr.status);
        }
    });
}

async function handleSuccess(response) {
   
    const responseData1 = typeof response === 'string' ? JSON.parse(response) : response;
    
    if (responseData1.status === "True" && responseData1.err_code === "1") {
        return responseData1;
    } else {
        await showLoadAlert1("Alert!", "You are not authorized to view this page..", "warning");
    }
    return responseData1;
}
async function checkAccess(flag) {
    
    try {
        const requestData = {
            employeeId: sessionStorage.getItem("EmployeeId"),
            token: sessionStorage.getItem("Token"),
            post: sessionStorage.getItem("Post"),
            branch: sessionStorage.getItem("BranchId"),
            formId: flag

        };

        var Res = await fetchEmployee("/checkEmployeeCode", "POST", requestData);
       /* Res = decryptAES(Res);*/
        const responseData = JSON.parse(Res);
        if (responseData.err_code === "1") {          
        }
    }
    catch {
        await showLoadAlert1("Alert!", "Error occured..Please try again..", "warning");
    }
}
async function UploadFN  (inputElement) {
    debugger;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png','application/vnd.ms-excel', // for .xls files
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const file = inputElement.files[0];


   

    if (!validTypes.includes(file.type)) {
        showAlert("Invalid File Type!!");
        $(inputElement).val('');
        return;

    }

    const isSafe = await this.checkForMaliciousContent(file);
    if (!isSafe) {
        showAlert("Malicious content detected in the file!");
        $(inputElement).val('');
        return;
    }

    
}


async function checkForMaliciousContent(file) {
    debugger;
    return new Promise(async (resolve, reject) => {
        try {
            const fileType = file.type;

            // 🧾 PDF Handling
            if (fileType === 'application/pdf') {
                const pdfData = await file.arrayBuffer();
                const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;

                const suspiciousPatterns = [
                    /<script>/i,
                    /app\.(alert|launchURL)/i,
                    /window\.location\.href/i,
                    /eval\(/i,
                    /document\.cookie/i,
                    /unauthorized access/i,
                    /your computer has been infected/i,
                    /enable macros/i,
                    /迅捷PDF编辑器/i
                ];

                let maliciousContentFound = false;

                for (let i = 1; i <= pdfDoc.numPages; i++) {
                    const page = await pdfDoc.getPage(i);
                    const annotations = await page.getAnnotations();
                    const textContent = await page.getTextContent();
                    const combinedText = textContent.items.map(item => item.str).join("").toLowerCase();

                    annotations.forEach((annotation) => {
                        if (annotation.additionalActions) {
                            maliciousContentFound = true;
                        }
                        if (annotation.url && annotation.url.startsWith("http") && !annotation.url.startsWith("https")) {
                            maliciousContentFound = true;
                        }
                    });

                    suspiciousPatterns.forEach((pattern) => {
                        if (pattern.test(combinedText)) {
                            maliciousContentFound = true;
                        }
                    });
                }

                resolve(!maliciousContentFound);
            }

            // 🖼️ Image Handling (JPEG/PNG)
            else if (fileType === 'image/jpeg' || fileType === 'image/png') {
                const img = new Image();
                img.onload = function () {
                    // Basic check: valid image dimensions
                    if (img.width > 0 && img.height > 0) {
                        resolve(true); // Valid image
                    } else {
                        resolve(false); // Possibly corrupted
                    }
                };
                img.onerror = function () {
                    resolve(false); // Invalid image
                };
                img.src = URL.createObjectURL(file);
            }
            else if (fileType === 'application/vnd.ms-excel' ||
                fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                const arrayBuffer = await file.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                // Basic check: ensure workbook has at least one sheet
                const sheetNames = workbook.SheetNames;
                if (sheetNames.length > 0) {
                    const firstSheet = workbook.Sheets[sheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                    // Optional: check for suspicious content or empty file
                    const hasContent = data.length > 0 && data.some(row => row.length > 0);
                    resolve(hasContent);
                }
            }

            // ❌ Unsupported File Type
            else {
                resolve(false);
            }

        } catch (err) {
           
            reject(err);
        }
    });
}
















