let qrScanner = null;
let isProcessingQR = false;


// ==========================================
// OPEN QR SCANNER
// ==========================================
function openQRScanner() {

    const modal = document.getElementById("qrScannerModal");

    if (!modal) {
        console.error("QR modal not found.");
        return;
    }

    modal.classList.add("open");

    const status = document.getElementById("qrStatus");

    if (status) {
        status.textContent = "Starting QR scanner...";
        status.className = "qr-status";
    }

    // Prevent duplicate scanner
    if (qrScanner) {
        console.log("QR scanner already running.");
        return;
    }

    const reader = document.getElementById("qr-reader");

    if (!reader) {
        console.error("QR reader element not found.");
        return;
    }

    isProcessingQR = false;

    qrScanner = new Html5Qrcode("qr-reader");

    
const config = {
    fps: 15,
    aspectRatio: 1.0,
    disableFlip: false,

    experimentalFeatures: {
        useBarCodeDetectorIfSupported: true
    }
};

qrScanner.start(
    {
        facingMode: "environment"
    },

    config,

    // ==============================
    // QR DETECTED
    // ==============================
    function(decodedText, decodedResult) {

        console.log("================================");
        console.log("QR DETECTED:", decodedText);
        console.log("================================");

        if (isProcessingQR) {
            return;
        }

        isProcessingQR = true;

        const studentId =
            String(decodedText || "").trim();

        console.log(
            "Student ID from QR:",
            studentId
        );

        if (!studentId) {
            isProcessingQR = false;
            return;
        }

        const status =
            document.getElementById("qrStatus");

        if (status) {
            status.textContent =
                "✓ QR Code detected! Verifying...";

            status.className =
                "qr-status verified";
        }

        verifyStudentByQR(studentId);
    },

    // ==============================
    // SCANNING ERROR
    // ==============================
    function(errorMessage) {
        // Ignore normal scanning errors.
    }
)
.then(function() {

    console.log("QR CAMERA STARTED");

    if (status) {
        status.textContent =
            "● SCANNING — Looking for QR code...";

        status.className =
            "qr-status scanning";
    }

})
.catch(function(error) {

    console.error(
        "QR CAMERA ERROR:",
        error
    );

    qrScanner = null;

    if (status) {
        status.textContent =
            "Unable to start camera.";

        status.className =
            "qr-status error";
    }

});
}


// ==========================================
// VERIFY STUDENT
// ==========================================
function verifyStudentByQR(studentId) {

    console.log(
        "Verifying Student ID:",
        studentId
    );


    const csrf =
        document.querySelector(
            'meta[name="csrf-token"]'
        );


    if (!csrf) {

        console.error(
            "CSRF token is missing."
        );

        restartQRScanner();

        return;
    }


    fetch("/student/qr-login", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json",

            "Accept":
                "application/json",

            "X-CSRF-TOKEN":
                csrf.getAttribute("content")

        },

        body: JSON.stringify({

            student_id:
                studentId.trim()

        })

    })


    .then(function(response) {

        console.log(
            "QR LOGIN HTTP STATUS:",
            response.status
        );

        return response.json();

    })


    .then(function(result) {

        console.log(
            "QR LOGIN RESULT:",
            result
        );


        const status =
            document.getElementById("qrStatus");


        // ======================================
        // SUCCESS
        // ======================================
        if (result.success) {

            console.log(
                "QR LOGIN SUCCESS"
            );


            if (status) {

                status.textContent =
                    "✓ Student verified! Redirecting...";

                status.className =
                    "qr-status verified";
            }


            setTimeout(function() {

                window.location.href =
                    result.redirect;

            }, 700);

        }


        // ======================================
        // INVALID STUDENT
        // ======================================
        else {

            console.error(
                "QR LOGIN FAILED:",
                result.message
            );


            if (status) {

                status.textContent =
                    result.message ||
                    "Student ID not found.";

                status.className =
                    "qr-status error";
            }


            isProcessingQR = false;

            setTimeout(function() {

                restartQRScanner();

            }, 1500);
        }

    })


    .catch(function(error) {

        console.error(
            "QR LOGIN ERROR:",
            error
        );


        const status =
            document.getElementById("qrStatus");


        if (status) {

            status.textContent =
                "Unable to verify Student ID.";

            status.className =
                "qr-status error";
        }


        isProcessingQR = false;


        setTimeout(function() {

            restartQRScanner();

        }, 1500);

    });
}



// ==========================================
// RESTART SCANNER
// ==========================================
function restartQRScanner() {

    console.log(
        "Restarting QR scanner..."
    );


    if (qrScanner) {

        qrScanner.clear();

        qrScanner = null;
    }


    const reader =
        document.getElementById("qr-reader");


    if (reader) {

        reader.innerHTML = "";
    }


    isProcessingQR = false;


    openQRScanner();
}



// ==========================================
// CLOSE QR SCANNER
// ==========================================
function closeQRScanner() {

    const modal =
        document.getElementById(
            "qrScannerModal"
        );


    if (qrScanner) {

        qrScanner.stop()

            .then(function() {

                console.log(
                    "QR CAMERA STOPPED"
                );

                qrScanner.clear();

                qrScanner = null;

            })

            .catch(function(error) {

                console.error(
                    "Scanner close error:",
                    error
                );

                qrScanner = null;
            });
    }


    if (modal) {

        modal.classList.remove("open");
    }


    isProcessingQR = false;
}