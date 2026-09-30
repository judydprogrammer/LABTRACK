<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Attendance Monitoring System</title>
    <script src="https://kit.fontawesome.com/96bdbf5a1c.js" crossorigin="anonymous"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css copy/Scanner.css') }}">

</head>
<body>
    <!-- ================= LOGIN BOX ================= -->
    <div class="login-box">
        <img src="{{ asset('images/logo.png') }}" class="logo">
        <h1>LABORATORY MONITORING SYSTEM</h1>
        <p>Welcome Student!</p>

        <!-- LOGIN FORM -->
        <form action="login.php" method="POST">

            <!-- Student ID -->
            <div class="input-box">
                <i class="fa-solid fa-user"></i>
                <input
                    type="text"
                    id="studentId"
                    name="username"
                    placeholder="Student ID"
                    autocomplete="off"
                    required>
            </div>

            <!-- Password -->
            <div class="input-box">
                <i class="fa-solid fa-lock"></i>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autocomplete="new-password"
                    required>
            </div>

            <!-- Options -->
            <div class="options">
                <label>
                    <input type="checkbox">
                    Remember Me
                </label>

                <a href="ForgetPassword.html">Forgot Password?</a>
            </div>

            <!-- Login -->
            <button id="btn1" type="submit">
                LOGIN
            </button>

        </form>
        <br> 
        <!-- QR SCAN BUTTON -->
        <button type="button" id="btn2" onclick="openQRScanner()">
            <i class="fa-solid fa-qrcode"></i>
            SCAN QR CODE
        </button>

        <!-- Sign Up -->
        <div class="signup">
            <a href="HomePage.html">
                <i class="fa-solid fa-arrow-left"></i>
            </a>

            <span>Don't have an account?</span>

            <a href="SignUp.html">Sign Up</a>
        </div>

    </div>


    <!-- ================= QR SCANNER MODAL ================= -->
    <div id="qrScannerModal" class="qr-modal">

        <div class="qr-modal-box">

            <button
                type="button"
                class="qr-close"
                onclick="closeQRScanner()"
                aria-label="Close QR scanner">
                &times;
            </button>

            <h2>Scan Student ID</h2>

            <p>Place the QR code inside the scanner.</p>

            <div id="qr-reader"></div>

            <div id="qrStatus" class="qr-status">
                Waiting for QR code...
            </div>

        </div>

    </div>


    <!-- ================= SCRIPTS ================= -->
    <script src="https://unpkg.com/html5-qrcode"></script>
    <script src="{{ asset('js/Scanner.js') }}"></script>

</body>
</html>