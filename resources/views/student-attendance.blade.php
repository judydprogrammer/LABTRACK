<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>Attendance Dasboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
<link rel="stylesheet" href="{{ asset('css copy/StudentAttendance.css') }}">


</head>
<body>

<div class="app">

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-badge">
    <img src="{{ asset('images/logo.png') }}" alt="Logo">
</div>
      <h1>LABSTRACK</h1>
      <p>Computer Laboratory Monitoring system</p>
    </div>

    <div>
      <a href="{{ route('student.dashboard') }}" class="nav-item">
        <i class="fa-solid fa-table-columns"></i>
        Dashboard
    </a>

    <a href="{{ route('student.dashboard', ['page' => 'schedule']) }}" class="nav-item">
    <i class="fa-regular fa-calendar-days"></i> 
    My Schedule
    </a>
    


      <a href="{{ route('student.attendance') }}" class="nav-item active">
        <i class="fa-solid fa-clipboard-check"></i>
        Attendance
    </a>

    <a href="{{ route('student.dashboard', ['page' => 'subjects']) }}" class="nav-item">
    <i class="fa-solid fa-book-open"></i>
    Subjects
    </a>

    <a href="{{ route('student.dashboard', ['page' => 'tasks']) }}" class="nav-item">
    <i class="fa-solid fa-list-check"></i> 
    Activities / Tasks
    </a>

    <a href="{{ route('student.dashboard', ['page' => 'notifications']) }}" class="nav-item">
    <i class="fa-regular fa-bell"></i> 
    Notifications
    </a>

    
    </div>

    <a href="{{ route('student.dashboard', ['page' => 'announcements']) }}" class="nav-item">
    <i class="fa-solid fa-bullhorn"></i> 
    Announcements
    </a>
    
    <div class="nav-label">ACCOUNT</div>
    <div>

    <a href="{{ route('student.dashboard', ['page' => 'profile']) }}" class="nav-item">
    <i class="fa-regular fa-user"></i> 
    My Profile
    </a>

    <a href="{{ route('student.dashboard', ['page' => 'settings']) }}" class="nav-item">
    <i class="fa-solid fa-gear"></i> 
    Settings
    </a>

    
      
      
      <button class="nav-item" onclick="openLogout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
    </div>
  </aside>

  <!-- MAIN -->
  <div class="main">

  <header class="topbar">

    <!-- LEFT -->
    <div class="topbar-left">

        <button
            class="hamburger"
            id="hamburgerBtn"
            type="button"
        >
            <i class="fa-solid fa-bars"></i>
        </button>

        <h2 id="pageTitle">
            Attendance Dashboard
        </h2>

    </div>


    <!-- RIGHT -->
    <div class="topbar-right">

        <!-- SEARCH -->
        <div class="search-box">

            <i class="fa-solid fa-magnifying-glass"></i>

            <input
                type="text"
                id="attendanceSearch"
                placeholder="Search..."
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
            >

        </div>


        <!-- NOTIFICATIONS -->
        <div
            class="notif-wrap"
            id="notifWrap"
        >

            <button
                class="bell"
                type="button"
                onclick="toggleNotif(event)"
            >

                <i class="fa-regular fa-bell"></i>

                <span
                    class="dot"
                    id="bellDot"
                >
                    3
                </span>

            </button>


            <div class="notif-menu">

                <div class="notif-menu-title">

                    <span>
                        Notifications
                    </span>

                    <span
                        class="link"
                        onclick="goTo('notifications')"
                    >
                        View All
                    </span>

                </div>


                <div id="attendanceNotificationList">

                    <div class="notif-row unread">

                        <div class="dot-icon">
                            <i class="fa-solid fa-bell"></i>
                        </div>

                        <div>

                            <div class="r-title">
                                Loading notifications...
                            </div>

                            <div class="r-time">
                                Please wait
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>


        <!-- PROFILE -->
        <div
            class="profile"
            id="profileMenu"
        >

            <button
                class="profile-trigger"
                type="button"
                onclick="toggleProfile(event)"
            >

                <div class="avatar">

                    <img
                        src="{{ $profileImage }}"
                        alt="Profile"
                    >

                </div>


                <div class="profile-name">

                    <div class="name">
                        {{ $student->fullname }}
                    </div>

                    <div class="role">
                        {{ $student->course }}
                        {{ $student->year_level }}-{{ $student->section }}
                    </div>

                </div>


                <i class="fa-solid fa-chevron-down chev"></i>

            </button>


            <!-- PROFILE DROPDOWN -->
            <div class="profile-menu">

                <div class="profile-menu-header">

                    <div class="avatar">

                        <img
                            src="{{ $profileImage }}"
                            alt="Profile"
                        >

                    </div>


                    <div class="profile-name">

                        <div class="name">
                            {{ $student->fullname }}
                        </div>

                        <div class="role">
                            {{ $student->course }}
                            {{ $student->year_level }}-{{ $student->section }}
                        </div>

                    </div>

                </div>


                <div class="profile-menu-item" onclick="goTo('profile')">
    <i class="fa-regular fa-user"></i>
    <span>View Profile</span>
</div>

<div class="profile-menu-item" onclick="goTo('settings')">
    <i class="fa-solid fa-gear"></i>
    <span>Settings</span>
</div>

<div class="profile-menu-item" onclick="goTo('notifications')">
    <i class="fa-regular fa-bell"></i>
    <span>Notifications</span>
</div>


                <div class="profile-menu-divider"></div>


                <button
                    class="profile-menu-item danger"
                    type="button"
                    onclick="openLogout()"
                >

                    <i class="fa-solid fa-right-from-bracket"></i>

                    Logout

                </button>

            </div>

        </div>

    </div>

</header>

      

  <!-- PAGE TITLE -->
  <div class="page-header">
    <div>
      <h1>Attendance</h1>
      <p>Record your attendance for your laboratory class.</p>
    </div>
  </div>

  <!-- ATTENDANCE CARD -->
  <section class="attendance-card">

    <div class="card-header">
      <div class="header-icon">
        <i class="fa-solid fa-clipboard-check"></i>
      </div>

      <div>
        <h3>Select Laboratory Class</h3>
        <p>Choose your subject and instructor to record your attendance.</p>
      </div>
    </div>

    <!-- SELECTIONS -->
        <div class="attendance-selection">

  <!-- SUBJECT -->
  <div class="form-group">
    <label for="subjectSelect">Subject</label>

    <div class="select-wrapper">
      <i class="fa-solid fa-book-open"></i>

      <select id="subjectSelect">
            <option value="">Select Subject</option>

            @foreach($schedules as $schedule)
                <option value="{{ $schedule->subject_code }}">
                    {{ $schedule->subject_code }} {{ $schedule->subject_name }}
                </option>
            @endforeach
        </select>

      <i class="fa-solid fa-chevron-down select-arrow"></i>
    </div>
  </div>


  <!-- INSTRUCTOR -->
  <div class="form-group">
    <label for="instructorSelect">Instructor</label>

    <div class="select-wrapper">
      <i class="fa-regular fa-user"></i>

      <select id="instructorSelect">
            <option value="">Select Instructor</option>
        </select>

      <i class="fa-solid fa-chevron-down select-arrow"></i>
    </div>
  </div>


  <!-- SCHEDULE -->
  <div class="form-group">
    <label>Schedule</label>

    <div class="schedule-field" id="scheduleInfo">

      <i class="fa-regular fa-calendar-days"></i>

      <div class="schedule-details">
        <strong id="scheduleText">—</strong>
      </div>

    </div>
  </div>
</div>


    <!-- ATTENDANCE ACTION -->
    <div class="attendance-action">

      <button
        type="button"
        class="time-btn"
        id="attendanceBtn"
        disabled
      >
        <i class="fa-regular fa-clock"></i>
        <span id="attendanceBtnText">TIME IN</span>
      </button>

    </div>

  </section>

<!-- CURRENT ATTENDANCE -->
<section class="attendance-card current-attendance-card">

    <div class="current-header">
        <div class="current-icon">
            <i class="fa-solid fa-clock"></i>
        </div>

        <div>
            <h3>Current Attendance</h3>
            <p>Your attendance for today's laboratory classes.</p>
        </div>
    </div>

    <!-- CURRENT DATE -->
    <div class="attendance-date" id="attendanceDate"></div>

    <!-- ATTENDANCE TABLE -->
    <div class="attendance-results" id="attendanceResults">

        <!-- Header -->
        <div class="attendance-result attendance-result-header">
            <div class="result-item">
                <span>SUBJECT</span>
            </div>

            <div class="result-item">
                <span>INSTRUCTOR</span>
            </div>

            <div class="result-item">
                <span>TIME IN</span>
            </div>

            <div class="result-item">
                <span>TIME OUT</span>
            </div>

            <div class="result-item">
                <span>STATUS</span>
            </div>
        </div>

        <!-- Attendance rows will be generated by JS -->

    </div>

</section>
</main>

        </div>
    </div>

    <script>
        window.studentSchedules =
            @json($schedules);
    </script>
        <script src="{{ asset('js/StudentAttendance.js') }}"></script>
</body>