```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Edit Student</title>

    <script src="https://kit.fontawesome.com/96bdbf5a1c.js"
        crossorigin="anonymous"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
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
            max-width: 1100px;
            margin: auto;
        }

        .page-header {
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

        .card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group.full {
            grid-column: span 2;
        }

        label {
            font-size: 13px;
            font-weight: 500;
            color: #444;
            margin-bottom: 7px;
        }

        input,
        select,
        textarea {
            width: 100%;
            padding: 11px 13px;
            border: 1px solid #ddd;
            border-radius: 8px;
            outline: none;
            font-size: 14px;
            color: #333;
            background: white;
        }

        input:focus,
        select:focus,
        textarea:focus {
            border-color: #7cc8ff;
        }

        textarea {
            resize: vertical;
            min-height: 90px;
        }

        .error {
            color: #d93025;
            font-size: 12px;
            margin-top: 5px;
        }

        .password-note {
            color: #999;
            font-size: 11px;
            margin-top: 5px;
        }

        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 30px;
        }

        .btn {
            padding: 11px 20px;
            border-radius: 8px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
        }

        .cancel-btn {
            background: #eee;
            color: #555;
        }

        .update-btn {
            background: #ff652f;
            color: white;
        }

        .required {
            color: #d93025;
        }

        @media (max-width: 700px) {

            .form-grid {
                grid-template-columns: 1fr;
            }

            .form-group.full {
                grid-column: span 1;
            }

        }

    </style>

</head>

<body>

<div class="container">

    <!-- HEADER -->

    <div class="page-header">

        <h1>Edit Student</h1>

        <p>
            Update the student's information below.
        </p>

    </div>


    <div class="card">

        <!-- UPDATE FORM -->

        <form
            action="{{ route('students.update', $student->id) }}"
            method="POST">

            @csrf
            @method('PUT')


            <div class="form-grid">


                <!-- STUDENT ID -->

                <div class="form-group">

                    <label>
                        Student ID <span class="required">*</span>
                    </label>

                    <input
                        type="text"
                        name="student_id"
                        value="{{ old('student_id', $student->student_id) }}"
                        placeholder="Enter Student ID"
                        required>

                    @error('student_id')
                        <span class="error">{{ $message }}</span>
                    @enderror

                </div>


                <!-- FULL NAME -->

                <div class="form-group">

                    <label>
                        Full Name <span class="required">*</span>
                    </label>

                    <input
                        type="text"
                        name="fullname"
                        value="{{ old('fullname', $student->fullname) }}"
                        placeholder="Enter full name"
                        required>

                    @error('fullname')
                        <span class="error">{{ $message }}</span>
                    @enderror

                </div>


                <!-- DATE OF BIRTH -->

                <div class="form-group">

                    <label>Date of Birth</label>

                    <input
                        type="date"
                        name="date_of_birth"
                        value="{{ old('date_of_birth', optional($student->date_of_birth)->format('Y-m-d')) }}">

                    @error('date_of_birth')
                        <span class="error">{{ $message }}</span>
                    @enderror

                </div>


                <!-- GENDER -->

                <div class="form-group">

                    <label>Gender</label>

                    <select name="gender">

                        <option value="">Select Gender</option>

                        <option value="Male"
                            {{ old('gender', $student->gender) == 'Male' ? 'selected' : '' }}>
                            Male
                        </option>

                        <option value="Female"
                            {{ old('gender', $student->gender) == 'Female' ? 'selected' : '' }}>
                            Female
                        </option>

                    </select>

                    @error('gender')
                        <span class="error">{{ $message }}</span>
                    @enderror

                </div>


                <!-- CONTACT -->

                <div class="form-group">

                    <label>Contact Number</label>

                    <input
                        type="text"
                        name="contact"
                        value="{{ old('contact', $student->contact) }}"
                        placeholder="09XXXXXXXXX">

                    @error('contact')
                        <span class="error">{{ $message }}</span>
                    @enderror

                </div>


                <!-- EMAIL -->

                <div class="form-group">

                    <label>
                        Email <span class="required">*</span>
                    </label>

                    <input
                        type="email"
                        name="email"
                        value="{{ old('email', $student->email) }}"
                        placeholder="student@email.com"
                        required>

                    @error('email')
                        <span class="error">{{ $message }}</span>
                    @enderror

                </div>


                <!-- COURSE -->

                <div class="form-group">

                    <label>Course</label>

                    <select name="course">

                        <option value="">Select Course</option>

                        <option value="BSIT"
                            {{ old('course', $student->course) == 'BSIT' ? 'selected' : '' }}>
                            BSIT
                        </option>

                        <option value="BSCS"
                            {{ old('course', $student->course) == 'BSCS' ? 'selected' : '' }}>
                            BSCS
                        </option>

                    </select>

                    @error('course')
                        <span class="error">{{ $message }}</span>
                    @enderror

                </div>


                <!-- YEAR LEVEL -->

                <div class="form-group">

                    <label>Year Level</label>

                    <select name="year_level">

                        <option value="">Select Year Level</option>

                        <option value="1st Year"
                            {{ old('year_level', $student->year_level) == '1st Year' ? 'selected' : '' }}>
                            1st Year
                        </option>

                        <option value="2nd Year"
                            {{ old('year_level', $student->year_level) == '2nd Year' ? 'selected' : '' }}>
                            2nd Year
                        </option>

                        <option value="3rd Year"
                            {{ old('year_level', $student->year_level) == '3rd Year' ? 'selected' : '' }}>
                            3rd Year
                        </option>

                        <option value="4th Year"
                            {{ old('year_level', $student->year_level) == '4th Year' ? 'selected' : '' }}>
                            4th Year
                        </option>

                    </select>

                    @error('year_level')
                        <span class="error">{{ $message }}</span>
                    @enderror

                </div>


                <!-- SECTION -->

                <div class="form-group">

                    <label>Section</label>

                    <select name="section">

                        <option value="">Select Section</option>

                        <option value="A"
                            {{ old('section', $student->section) == 'A' ? 'selected' : '' }}>
                            A
                        </option>

                        <option value="B"
                            {{ old('section', $student->section) == 'B' ? 'selected' : '' }}>
                            B
                        </option>

                        <option value="C"
                            {{ old('section', $student->section) == 'C' ? 'selected' : '' }}>
                            C
                        </option>

                    </select>

                    @error('section')
                        <span class="error">{{ $message }}</span>
                    @enderror

                </div>


                <!-- ADDRESS -->

                <div class="form-group full">

                    <label>Address</label>

                    <textarea
                        name="address"
                        placeholder="Enter complete address">{{ old('address', $student->address) }}</textarea>

                    @error('address')
                        <span class="error">{{ $message }}</span>
                    @enderror

                </div>


                <!-- NEW PASSWORD -->

                <div class="form-group">

                    <label>New Password</label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Leave blank to keep current password">

                    <span class="password-note">
                        Leave blank if you don't want to change the password.
                    </span>

                    @error('password')
                        <span class="error">{{ $message }}</span>
                    @enderror

                </div>


                <!-- CONFIRM PASSWORD -->

                <div class="form-group">

                    <label>Confirm New Password</label>

                    <input
                        type="password"
                        name="password_confirmation"
                        placeholder="Confirm new password">

                </div>


            </div>


            <!-- ACTION BUTTONS -->

            <div class="form-actions">

                <a
                    href="{{ route('students.index') }}"
                    class="btn cancel-btn">

                    Cancel

                </a>


                <button
                    type="submit"
                    class="btn update-btn">

                    <i class="fa-solid fa-pen"></i>
                    Update Student

                </button>

            </div>

        </form>

    </div>

</div>

</body>

</html>
```
