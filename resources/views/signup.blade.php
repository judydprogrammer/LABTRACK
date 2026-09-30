<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Student Attendance Monitoring System</title>

    <script src="https://kit.fontawesome.com/96bdbf5a1c.js" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="{{ asset('css copy/SignUp.css') }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>

<body>

<div class="login-box">

    <img src="{{ asset('images/logo.png') }}" class="logo">

    <h1>CREATE ACCOUNT</h1>

    <p>Sign up to get started.</p>

    <form action="{{ route('student.register') }}" method="POST" autocomplete="off">
        @csrf

        <div class="input-box">
            <i class="fa-solid fa-user"></i>

            <input
                type="text"
                name="full_name"
                value="{{ old('full_name') }}"
                placeholder="Full Name"
                autocomplete="off"
                required>
        </div>

        <div class="input-box">
            <i class="fa-regular fa-user"></i>

            <input
                type="text"
                name="student_id"
                placeholder="Student ID"
                autocomplete="off"
                value="{{ old('student_id') }}"
                required>
        </div>

        <div class="input-box">
            <i class="fa-solid fa-lock"></i>

            <input
                type="password"
                name="password"
                placeholder="Enter Password"
                autocomplete="new-password"
                required>
        </div>

        <div class="input-box">
            <i class="fa-solid fa-lock"></i>

            <input
                type="password"
                name="password_confirmation"
                placeholder="Confirm Password"
                autocomplete="new-password"
                required>
        </div>

        <button id="btn1" type="submit">
            SUBMIT
        </button>


       

    </form>

    <br>

    <div class="signup">

        <a id="back" href="{{ route('student.login') }}">
            <span>
                <i class="fa-solid fa-arrow-left"></i>
            </span>

            Already have an account?
            <span style="color: #7cc8ff;">Login</span>
        </a>

    </div>

</div>

</body>
</html>