<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Student Attendance Monitoring System</title>

    <script src="https://kit.fontawesome.com/96bdbf5a1c.js" crossorigin="anonymous"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Laravel CSS -->
    <link rel="stylesheet" href="{{ asset('css copy/Scanner.css') }}">
</head>

<body>

    <!-- ================= LOGIN BOX ================= -->
    <div class="login-box">

        <img src="{{ asset('images/logo.png') }}" class="logo">

        <h1>LABORATORY MONITORING SYSTEM</h1>

        <p>Welcome Student!</p>


        <!-- ================= LOGIN FORM ================= -->
        <form action="{{ route('student.login.submit') }}" method="POST"  autocomplete="off">

            @csrf

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
                    <input type="checkbox" id="rememberMe">
                    Remember Me
                </label>

                <a href="{{ route('student.forgot-password') }}">
                    Forgot Password?
                </a>

            </div>


            <!-- Login -->
            <button id="btn1" type="submit">
                LOGIN
            </button>

        </form>


        <br>


        <!-- ================= QR SCAN BUTTON ================= -->
        <button
            type="button"
            id="btn2"
            onclick="openQRScanner()">

            <i class="fa-solid fa-qrcode"></i>
            SCAN QR CODE

        </button>


        <!-- ================= SIGN UP ================= -->
        <div class="signup">

            <a href="{{ route('home') }}">
                <i class="fa-solid fa-arrow-left"></i>
            </a>

            <span>Don't have an account?</span>

            <a href="{{ route('student.signup') }}">
                Sign Up
            </a>

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


            <!-- QR SCANNER -->
            <div id="qr-reader"></div>


            <!-- QR STATUS -->
            <div id="qrStatus" class="qr-status">
                Waiting for QR code...
            </div>

        </div>

    </div>



    <!-- ================= LOGIN ERROR POPUP ================= -->

    @if(session('error'))

        <div class="popup-overlay" id="errorPopup">

            <div class="error-popup">

                <div class="error-icon">
                    <i class="fa-solid fa-xmark"></i>
                </div>

                <h2>Login Failed</h2>

                <p>{{ session('error') }}</p>

                <button
                    type="button"
                    id="closeErrorPopup">

                    OK

                </button>

            </div>

        </div>

    @endif



    <!-- ================= SCRIPTS ================= -->

    <script src="https://unpkg.com/html5-qrcode"></script>

    <script src="{{ asset('js/Scanner.js') }}"></script>


    <!-- ERROR POPUP SCRIPT -->
    <script>

        document.addEventListener('DOMContentLoaded', function () {

            const popup = document.getElementById('errorPopup');

            const closeButton =
                document.getElementById('closeErrorPopup');


            if (popup && closeButton) {

                closeButton.addEventListener('click', function () {

                    popup.remove();

                });

            }

        });
    </script>

</body>
</html>