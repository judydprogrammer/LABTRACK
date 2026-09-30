<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Student Attendance Monitoring System</title>
<script src="https://kit.fontawesome.com/96bdbf5a1c.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="{{ asset('css copy/adminpage.css') }}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">


</head>

<body>

<div class="login-box">

<img src="{{ asset('images/logo.png') }}" class="logo" alt="Logo">

<h1>FORGOT PASSWORD</h1>

<p>Enter your Admin ID to reset your password.</p>


<form action="{{ route('admin.reset-password') }}" method="POST">
    @csrf

    <div class="input-box">
        <i class="fa-solid fa-user"></i>

        <input
            type="text"
            name="username"
            placeholder="Admin ID"
            required>
    </div>

<div class="input-box">
    <i class="fa-solid fa-lock"></i>
<input
type="password"
name="password"
placeholder="New Password"
required>

</div>

<div class="input-box">
    <i class="fa-solid fa-lock"></i>
<input
type="password"
name="password"
placeholder="Confirm Password"
required>

</div>


<button id="btn1" type="submit">

SUBMIT

</button>

</form>

<br>


<div class="signup">

<a id="back" href="{{ route('home') }}">
            <span>
                <i class="fa-solid fa-arrow-left"></i>
            </span>

     Back to Home Page
</a>

</div>

</div>

</body>
</html>