<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Student Attendance Monitoring System</title>

    <link rel="stylesheet" href="{{ asset('css copy/HomePage.css') }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>

<body>

<div class="login-box">

    <img 
        src="{{ asset('images/logo.png') }}" 
        class="logo" 
        alt="Laboratory Monitoring System Logo"
    >

    <h1>LABORATORY MONITORING SYSTEM</h1>

    <p>College of Computer Studies</p>

    <!-- ADMINISTRATOR -->
    <a href="{{ route('admin') }}" class="home-btn">
        ADMINISTRATOR
    </a>

    <!-- STUDENT -->
    <a href="{{ route('student.login') }}" class="home-btn">
        STUDENT
    </a>

</div>

</body>
</html>