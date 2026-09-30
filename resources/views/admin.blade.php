<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Student Attendance Monitoring System</title>

    <script src="https://kit.fontawesome.com/96bdbf5a1c.js" crossorigin="anonymous"></script>

<link rel="stylesheet" href="{{ asset('css copy/AdminPage.css') }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>

<body>

<div class="login-box">

    <img class="logo" src="{{ asset('../images/logo.png') }}" alt="Logo">

    <h1>LABORATORY MONITORING SYSTEM</h1>

    <p>Welcome Admin!</p>

    <form action="{{ route('admin.login') }}" method="POST">
        @csrf

        <div class="input-box">
            <i class="fa-solid fa-user"></i>

            <input
                type="text"
                name="admin_id"
                placeholder="Admin ID"
                autocomplete="off"
                required>
        </div>

        <div class="input-box">
            <i class="fa-solid fa-lock"></i>

            <input
                type="password"
                name="password"
                placeholder="Password"
                autocomplete="new-password"
                required>
        </div>

        <div class="options">

            <label>
                <input type="checkbox">
                Remember Me
            </label>

            <a href="{{ route('admin.forgot-password') }}">Forgot Password?</a>

        </div>

        <button id="btn1" type="submit">
            LOGIN
        </button>

    </form>

    <div class="signup">

        <a id="back" href="{{ route('home') }}">
            <span>
                <i class="fa-solid fa-arrow-left"></i>
            </span>
        </a>

        Back to Home Page

    </div>

</div>

<script src="{{ asset('js/admin.js') }}"></script>

</body>
</html>

