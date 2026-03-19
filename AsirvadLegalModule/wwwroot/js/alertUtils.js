// alertUtils.js
(function () {
    // Inject the CSS
    const style = document.createElement('style');
    style.textContent = `
        /* Custom SweetAlert Styling */
        .custom-swal-title {
            font-family: 'Arial', sans-serif;
            font-size: 18px !important;
            color: #343a40 !important;
        }
        
        .custom-swal-content {
            font-family: 'Arial', sans-serif;
            font-size: 14px !important;
        }
        
        .custom-swal-button {
            background-color: #007bff !important;
            font-size: 14px !important;
            padding: 6px 16px !important;
        }
        
        /* Make the icon smaller */
        .swal2-icon {
            transform: scale(0.8);
            margin: 0.5em auto !important;
        }
        
        /* Prevent scrollbars when modal is shown */
        body.swal2-shown {
            overflow: hidden !important;
        }
        
        /* Fixed container styles to prevent scrolling */
        .swal2-container {
            overflow-y: hidden !important;
        }
        
        /* Ensure modal content doesn't overflow */
        .swal2-popup {
            overflow-y: hidden !important;
        }
    `;
    document.head.appendChild(style);

    // Define the alert function
    window.showAlert = async function (title, text, icon) {
        return await Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            timer: null,
            showConfirmButton: true,
            width: '300px',
            padding: '0.75rem',
            background: '#f8f9fa',
            color: '#212529',
            customClass: {
                title: 'custom-swal-title',
                content: 'custom-swal-content',
                confirmButton: 'custom-swal-button'
            },
            // Prevent layout shifts
            heightAuto: false,
            scrollbarPadding: false,
            // Prevent scrolling
            allowEscapeKey: false,
            allowOutsideClick: false
        });
    };
    window.showLoadAlert = async function (title, text, icon) {
        return await Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            timer: null,
            showConfirmButton: true,
            width: '300px',
            padding: '0.75rem',
            background: '#f8f9fa',
            color: '#212529',
            customClass: {
                title: 'custom-swal-title',
                content: 'custom-swal-content',
                confirmButton: 'custom-swal-button'
            },
            // Prevent layout shifts
            heightAuto: false,
            scrollbarPadding: false,
            // Prevent scrolling
            allowEscapeKey: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload(); // Refresh the page when OK is clicked
            }
        });
    };
    window.showLoadAlert1 = async function (title, text, icon) {
        return await Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            timer: null,
            showConfirmButton: true,
            width: '300px',
            padding: '0.75rem',
            background: '#f8f9fa',
            color: '#212529',
            customClass: {
                title: 'custom-swal-title',
                content: 'custom-swal-content',
                confirmButton: 'custom-swal-button'
            },
            // Prevent layout shifts
            heightAuto: false,
            scrollbarPadding: false,
            // Prevent scrolling
            allowEscapeKey: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                const isDevelopment = window.location.hostname === 'localhost';
                const liveurl = isDevelopment ? '' : '/AsirvadGoldloan/LegalCorporate';
                window.location.href = liveurl + '/Login/Dashboard'; // Refresh the page when OK is clicked
            }
        });
    };
})();