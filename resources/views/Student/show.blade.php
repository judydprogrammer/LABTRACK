<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>View Student</title>

    <script
        src="https://kit.fontawesome.com/96bdbf5a1c.js"
        crossorigin="anonymous">
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">

    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">


    <style>

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background: #f5f7fb;
            padding: 30px;
        }

        .container {
            max-width: 1000px;
            margin: auto;
        }

        /* =========================
           HEADER
        ========================= */

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .page-header h1 {
            font-size: 28px;
            color: #222;
        }

        .page-header p {
            color: #777;
            font-size: 14px;
            margin-top: 5px;
        }

        .back-btn {
            text-decoration: none;
            color: #555;
            background: #eee;
            padding: 10px 18px;
            border-radius: 8px;
            font-size: 13px;
        }

        .back-btn i {
            margin-right: 6px;
        }


        /* =========================
           PROFILE CARD
        ========================= */

        .profile-card {
            background: white;
            border-radius: 14px;
            padding: 30px;
            box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
        }


        /* =========================
           PROFILE HEADER
        ========================= */

        .profile-header {
            display: flex;
            align-items: center;
            gap: 20px;
            padding-bottom: 25px;
            border-bottom: 1px solid #eee;
        }

        .profile-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #e8f5ff;
            color: #1685c7;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 35px;
        }

        .profile-name h2 {
            font-size: 22px;
            color: #222;
        }

        .profile-name p {
            color: #777;
            font-size: 13px;
            margin-top: 4px;
        }


        /* =========================
           INFORMATION
        ========================= */

        .section-title {
            font-size: 16px;
            color: #333;
            margin: 25px 0 15px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
        }

        .info-item {
            background: #f8f9fb;
            border-radius: 8px;
            padding: 15px;
        }

        .info-label {
            display: block;
            font-size: 11px;
            color: #999;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .info-value {
            font-size: 14px;
            color: #333;
            font-weight: 500;
        }


        /* =========================
           ACTIONS
        ========================= */

        .actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 30px;
        }

        .btn {
            padding: 11px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 13px;
            border: none;
            cursor: pointer;
        }

        .edit-btn {
            background: #fff4df;
            color: #d98b00;
        }

        .edit-btn i {
            margin-right: 6px;
        }

        .back-btn-bottom {
            background: #eee;
            color: #555;
        }

        .back-btn-bottom i {
            margin-right: 6px;
        }


        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 700px) {

            .info-grid {
                grid-template-columns: 1fr;
            }

            .page-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
            }

            .profile-header {
                align-items: flex-start;
            }

        }

    </style>

</head>


<body>


<div class="container">


    <!-- =========================
         PAGE HEADER
    ========================= -->

    <div class="page-header">

        <div>

            <h1>Student Details</h1>

            <p>
                View complete student information.
            </p>

        </div>


        <a
            href="{{ route('students.index') }}"
            class="back-btn">

            <i class="fa-solid fa-arrow-left"></i>

            Back to Students

        </a>

    </div>



    <!-- =========================
         PROFILE CARD
    ========================= -->

    <div class="profile-card">


        <!-- PROFILE HEADER -->

        <div class="profile-header">

            <div class="profile-icon">

                <i class="fa-solid fa-user"></i>

            </div>


            <div class="profile-name">

                <h2>
                    {{ $student->fullname }}
                </h2>

                <p>
                    Student ID:
                    <strong>{{ $student->student_id }}</strong>
                </p>

            </div>

        </div>



        <!-- =========================
             PERSONAL INFORMATION
        ========================= -->

        <h3 class="section-title">
            Personal Information
        </h3>


        <div class="info-grid">


            <!-- FULL NAME -->

            <div class="info-item">

                <span class="info-label">
                    Full Name
                </span>

                <span class="info-value">
                    {{ $student->fullname }}
                </span>

            </div>


            <!-- STUDENT ID -->

            <div class="info-item">

                <span class="info-label">
                    Student ID
                </span>

                <span class="info-value">
                    {{ $student->student_id }}
                </span>

            </div>


            <!-- DATE OF BIRTH -->

            <div class="info-item">

                <span class="info-label">
                    Date of Birth
                </span>

                <span class="info-value">

                    @if($student->date_of_birth)

                        {{ \Carbon\Carbon::parse($student->date_of_birth)->format('F d, Y') }}

                    @else

                        -

                    @endif

                </span>

            </div>


            <!-- GENDER -->

            <div class="info-item">

                <span class="info-label">
                    Gender
                </span>

                <span class="info-value">
                    {{ $student->gender ?? '-' }}
                </span>

            </div>


            <!-- CONTACT -->

            <div class="info-item">

                <span class="info-label">
                    Contact Number
                </span>

                <span class="info-value">
                    {{ $student->contact ?? '-' }}
                </span>

            </div>


            <!-- EMAIL -->

            <div class="info-item">

                <span class="info-label">
                    Email
                </span>

                <span class="info-value">
                    {{ $student->email }}
                </span>

            </div>


        </div>



        <!-- =========================
             ACADEMIC INFORMATION
        ========================= -->

        <h3 class="section-title">
            Academic Information
        </h3>


        <div class="info-grid">


            <!-- COURSE -->

            <div class="info-item">

                <span class="info-label">
                    Course
                </span>

                <span class="info-value">
                    {{ $student->course ?? '-' }}
                </span>

            </div>


            <!-- YEAR LEVEL -->

            <div class="info-item">

                <span class="info-label">
                    Year Level
                </span>

                <span class="info-value">
                    {{ $student->year_level ?? '-' }}
                </span>

            </div>


            <!-- SECTION -->

            <div class="info-item">

                <span class="info-label">
                    Section
                </span>

                <span class="info-value">
                    {{ $student->section ?? '-' }}
                </span>

            </div>


            <!-- DATE REGISTERED -->

            <div class="info-item">

                <span class="info-label">
                    Date Registered
                </span>

                <span class="info-value">

                    {{ $student->created_at->format('F d, Y') }}

                </span>

            </div>


        </div>



        <!-- =========================
             ADDRESS
        ========================= -->

        <h3 class="section-title">
            Address
        </h3>


        <div class="info-item">

            <span class="info-label">
                Complete Address
            </span>

            <span class="info-value">
                {{ $student->address ?? '-' }}
            </span>

        </div>



        <!-- =========================
             ACTION BUTTONS
        ========================= -->

        <div class="actions">


            <a
                href="{{ route('students.index') }}"
                class="btn back-btn-bottom">

                <i class="fa-solid fa-arrow-left"></i>

                Back

            </a>


            <a
                href="{{ route('students.edit', $student->id) }}"
                class="btn edit-btn">

                <i class="fa-solid fa-pen"></i>

                Edit Student

            </a>


        </div>


    </div>


</div>


</body>

</html>

