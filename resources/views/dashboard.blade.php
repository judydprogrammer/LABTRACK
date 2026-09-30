
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>Student Dasboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
<link rel="stylesheet" href="css copy/student.css">

</head>


<body>

@php
    $profileImage = $student->profile_picture
        ? asset('storage/' . $student->profile_picture)
        : asset('images/PROFILE.jpg');
@endphp

<div class="app">

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-badge">
    <img src="{{ asset('images/white_logo.png') }}" alt="Logo">
</div>
      <h1>LABSTRACK</h1>
      <p>Computer Laboratory Monitoring system</p>
    </div>

    <div>
      <button class="nav-item active" data-page="dashboard" onclick="goTo('dashboard')"><i class="fa-solid fa-table-columns"></i> Dashboard</button>
      <button class="nav-item" data-page="schedule" onclick="goTo('schedule')"><i class="fa-regular fa-calendar-days"></i> My Schedule</button>
      <a href="{{ route('student.attendance') }}" class="nav-item">
          <i class="fa-solid fa-clipboard-check"></i>
          Attendance
      </a>
      <button class="nav-item" data-page="subjects" onclick="goTo('subjects')"><i class="fa-solid fa-book-open"></i> Subjects</button>
      <button class="nav-item" data-page="tasks" onclick="goTo('tasks')"><i class="fa-solid fa-list-check"></i> Activities / Tasks</button>
      <button class="nav-item" data-page="notifications" onclick="goTo('notifications')">
        <i class="fa-regular fa-bell"></i> Notifications
      </button>
    </div>

<button class="nav-item" data-page="announcements" onclick="goTo('announcements')">
  <i class="fa-solid fa-bullhorn"></i> Announcements
</button>
    <div class="nav-label">ACCOUNT</div>
    <div>
      <button class="nav-item" data-page="profile" onclick="goTo('profile')"><i class="fa-regular fa-user"></i> My Profile</button>
      <button class="nav-item" data-page="settings" onclick="goTo('settings')"><i class="fa-solid fa-gear"></i> Settings</button>
      <button class="nav-item" onclick="openLogout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
    </div>
  </aside>

  <!-- MAIN -->
  <div class="main">

    <header class="topbar">
      <div class="topbar-left">
      <button class="hamburger" id="hamburgerBtn" type="button"> <i class="fa-solid fa-bars"></i> </button>
        <h2 id="pageTitle">Student Dashboard</h2>
      </div>

      <div class="topbar-right">
        <div class="search-box" id="studentSearchBox">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        id="studentDashboardSearch"
                        name="student_dashboard_search"
                        placeholder="Search..."
                        autocomplete="off"
                        autocorrect="off"
                        autocapitalize="off"
                        spellcheck="false"
                        readonly
                    >

                    <div
                        class="student-search-results"
                        id="studentSearchResults"
                    ></div>

                </div>

        <div class="notif-wrap" id="notifWrap">
          <button class="bell" onclick="toggleNotif(event)">
            <i class="fa-regular fa-bell"></i>
            <span class="dot" id="bellDot">3</span>
          </button>
          <div class="notif-menu">
            <div class="notif-menu-title">Notifications <span class="link" onclick="goTo('notifications')">View All</span></div>
            <div class="notif-row unread" onclick="goTo('notifications')">
              <div class="dot-icon" style="background:var(--blue-soft); color:var(--blue);"><i class="fa-solid fa-bullhorn"></i></div>
              <div><div class="r-title">Midterm Examination schedule posted</div><div class="r-time">2 hours ago</div></div>
            </div>
            <div class="notif-row unread" onclick="goTo('notifications')">
              <div class="dot-icon" style="background:var(--orange-soft); color:var(--orange);"><i class="fa-solid fa-triangle-exclamation"></i></div>
              <div><div class="r-title">Problem Set 4 is due today, 5:00 PM</div><div class="r-time">5 hours ago</div></div>
            </div>
            <div class="notif-row unread" onclick="goTo('notifications')">
              <div class="dot-icon" style="background:var(--green-soft); color:var(--green);"><i class="fa-solid fa-circle-check"></i></div>
              <div><div class="r-title">Lab Report grade released — 92/100</div><div class="r-time">1 day ago</div></div>
            </div>
          </div>
        </div>

        <!-- PROFILE DROPDOWN -->
        <div class="profile" id="profileMenu">
          <button class="profile-trigger" onclick="toggleProfile(event)">
            
            <div class="avatar">
                <img
                    src="{{ $profileImage }}"
                    alt="Profile"
                >
            </div>
            <div class="profile-name">
                  <div class="name">{{ $student->fullname }}</div>
                  <div class="role">
                      {{ $student->course }} {{ $student->year_level }}-{{ $student->section }}
                  </div>
              </div>
            <i class="fa-solid fa-chevron-down chev"></i>
          </button>

          <div class="profile-menu">
          <div class="profile-menu-header">
              <div class="avatar">
                  <img
                      src="{{ $profileImage }}"
                      alt="Profile"
                  >
              </div>

              <div class="profile-name">
                  <div class="name">{{ $student->fullname }}</div>
                  <div class="role">
                      {{ $student->course }} {{ $student->year_level }}-{{ $student->section }}
                  </div>
              </div>
          </div>
            <button class="profile-menu-item" onclick="goTo('profile')"><i class="fa-regular fa-user"></i> View Profile</button>
            <button class="profile-menu-item" onclick="goTo('settings')"><i class="fa-solid fa-gear"></i> Settings</button>
            <button class="profile-menu-item" onclick="goTo('notifications')"><i class="fa-regular fa-bell"></i> Notifications</button>
            <div class="profile-menu-divider"></div>
            <button class="profile-menu-item danger" onclick="openLogout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
          </div>
        </div>
      </div>
    </header>

    <main class="content">

      <!-- ============ DASHBOARD ============ -->
      <section class="page active" id="page-dashboard">
        <section class="hero">
          <div>
            <h1>Welcome back, Jenise!</h1>
            <p>Here's an overview of your attendance, schedule, and tasks for today.</p>
          </div>
        </section>
<section class="grid-4">

    <!-- ATTENDANCE -->
    <div class="stat-card">
        <div class="stat-icon green" id="attendanceIcon">
            <i class="fa-solid fa-circle-check"></i>
        </div>

        <div>
            <div class="stat-label">Attendance Status</div>

            <div class="stat-value" id="dashboardAttendanceStatus">
                Loading...
            </div>

            <div class="stat-sub green" id="dashboardAttendanceTime">
                Checking attendance...
            </div>
        </div>
    </div>


    <!-- NEXT CLASS -->
    <div class="stat-card">
        <div class="stat-icon blue">
            <i class="fa-regular fa-clock"></i>
        </div>

        <div>
            <div class="stat-label">Next Class</div>

            <div class="stat-value" id="dashboardNextClass">
                Loading...
            </div>

            <div class="stat-sub blue" id="dashboardNextClassInfo">
                Checking schedule...
            </div>
        </div>
    </div>


    <!-- CURRENT SESSION -->
    <div class="stat-card">
        <div class="stat-icon orange">
            <i class="fa-solid fa-chalkboard-user"></i>
        </div>

        <div>
            <div class="stat-label">Current Session</div>

            <div class="stat-value" id="dashboardCurrentSession">
                No active class
            </div>

            <div class="stat-sub orange" id="dashboardCurrentSessionInfo">
                No ongoing session
            </div>
        </div>
    </div>


    <!-- SUBJECT COUNT -->
    <div class="stat-card">
        <div class="stat-icon purple">
            <i class="fa-solid fa-book"></i>
        </div>

        <div>
            <div class="stat-label">Subjects Enrolled</div>

            <div class="stat-value" id="dashboardSubjectCount">
                0
            </div>

            <div class="stat-sub muted">
                This semester
            </div>
        </div>
    </div>

</section>

        
      

<section class="grid-2">

    <div class="card">

        <div class="card-head">
            <h3>Today's Schedule</h3>

            <button
                class="view-all"
                onclick="goTo('schedule')"
            >
                View All
            </button>
        </div>

        <div id="dashboardTodaySchedule">

            <div class="list-row">
                <div class="row-main">
                    <div class="row-title">
                        Loading schedule...
                    </div>

                    <div class="row-sub">
                        Please wait
                    </div>
                </div>
            </div>

        </div>

    </div>


    <div class="card">

        <div class="card-head">
            <h3>Tasks & Activities</h3>

            <button
                class="view-all"
                onclick="goTo('tasks')"
            >
                View All
            </button>
        </div>

        <div id="dashTaskList"></div>

    </div>

</section>
            


    <!-- ANNOUNCEMENTS -->
    <div class="card">

        <div class="card-head">
            <h3>Announcements</h3>

            <button
                class="view-all"
                onclick="goTo('announcements')"
            >
                View All
            </button>
        </div>

        <!-- REALTIME ANNOUNCEMENTS -->
        <div id="dashAnnouncementList">

            <div class="announce-card">

                <div class="announce-icon">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </div>

                <div>
                    <div class="announce-title">
                        Loading announcements...
                    </div>

                    <div class="announce-date">
                        Please wait
                    </div>
                </div>

            </div>

        </div>

    </div>


    <!-- LABORATORY RULES -->
    <div class="card">

        <div class="card-head">
            <h3>Laboratory Rules</h3>
        </div>

        <div class="rules-list">

            <div class="rule-item">
                <div class="rule-num">1</div>
                Do not hit, drop, or misuse any computer, keyboard, mouse, or other equipment.
            </div>

            <div class="rule-item">
                <div class="rule-num">2</div>
                Do not eat or drink near computers to prevent damage and accidents.
            </div>

            <div class="rule-item">
                <div class="rule-num">3</div>
                Avoid accessing inappropriate websites, installing unauthorized software, or changing system settings.
            </div>

            <div class="rule-item">
                <div class="rule-num">4</div>
                Keep passwords private and do not access another person's files or account without permission.
            </div>

            <div class="rule-item">
                <div class="rule-num">5</div>
                Return equipment properly and clean your workspace after use.
            </div>

        </div>

    </div>

</section>

<!-- ============ MY SCHEDULE ============ -->
<section class="page" id="page-schedule">
  <div class="page-header">
    <h1>Schedule Management</h1>
    <p>Select your year level and semester to view your class schedule.</p>
  </div>

  <!-- Finder card -->
  <div class="card finder-card">
    <div class="finder-head">
      <div class="icon-badge"><i class="fa-solid fa-magnifying-glass"></i></div>
      <h2>Find your schedule</h2>
    </div>
    <div class="finder-body">
      <div class="finder-row">
        <div class="field">
          <label for="scheduleYear">Year Level</label>
          <div class="select-wrap">
            <select id="scheduleYear">
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="scheduleSemester">Semester</label>
          <div class="select-wrap">
            <select id="scheduleSemester">
              <option>1st Semester</option>
              <option>2nd Semester</option>
            </select>
          </div>
        </div>
        <button class="btn-view" id="viewScheduleBtn" type="button">
          <i class="fa-solid fa-calendar-check"></i> View Schedule
        </button>
      </div>
    </div>
  </div>

  <!-- Result area: swaps between empty state and the schedule table -->
  <div id="scheduleResult">
    <div class="empty-state" id="scheduleEmptyState">
      <div class="empty-icon"><i class="fa-solid fa-calendar"></i></div>
      <h3>No schedule selected yet</h3>
      <p>Choose your year level and semester above, then select "View Schedule" to see your weekly classes.</p>
    </div>
  </div>
</section>


     <!-- ============ SUBJECTS ============ -->
<section class="page" id="page-subjects">

    <div class="page-header">
        <h1>Subjects</h1>
        <p>Select your year level and semester to view your subjects.</p>
    </div>

    <!-- FINDER CARD -->
    <div class="card finder-card">

        <div class="finder-head">
            <div class="icon-badge">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>

            <h2>Find your subjects</h2>
        </div>

        <div class="finder-body">

            <div class="finder-row">

                <!-- YEAR LEVEL -->
                <div class="field">

                    <label for="subjectYear">
                        Year Level
                    </label>

                    <div class="select-wrap">

                        <select id="subjectYear">

                                <option
                                    value="1st Year"
                                    {{ $student->year_level == '1st Year' ? 'selected' : '' }}
                                >
                                    1st Year
                                </option>

                                <option
                                    value="2nd Year"
                                    {{ $student->year_level == '2nd Year' ? 'selected' : '' }}
                                >
                                    2nd Year
                                </option>

                                <option
                                    value="3rd Year"
                                    {{ $student->year_level == '3rd Year' ? 'selected' : '' }}
                                >
                                    3rd Year
                                </option>

                                <option
                                    value="4th Year"
                                    {{ $student->year_level == '4th Year' ? 'selected' : '' }}
                                >
                                    4th Year
                                </option>

                        </select>

                    </div>

                </div>


                <!-- SEMESTER -->
                <div class="field">

                    <label for="subjectSemester">
                        Semester
                    </label>

                    <div class="select-wrap">

                        <select id="subjectSemester">

                            <option value="1st Semester">
                                1st Semester
                            </option>

                            <option value="2nd Semester">
                                2nd Semester
                            </option>

                        </select>

                    </div>

                </div>


                <!-- VIEW BUTTON -->
                <button
                    class="btn-view"
                    id="viewSubjectBtn"
                    type="button"
                >

                    <i class="fa-solid fa-book-open"></i>

                    View Subjects

                </button>

            </div>

        </div>

    </div>


    <!-- RESULT -->
    <div id="subjectResult">

        <div
            class="empty-state"
            id="subjectEmptyState"
        >

            <div class="empty-icon">

                <i class="fa-solid fa-book-open"></i>

            </div>

            <h3>No subjects selected yet</h3>

            <p>
                Choose your year level and semester,
                then click "View Subjects".
            </p>

        </div>

    </div>

</section>

      <!-- ============ TASKS ============ -->  
      <section class="page" id="page-tasks">

    <div class="page-header">

        <h1>Activities & Tasks</h1>

        <p>
            Click a checkbox to mark a task as complete.
        </p>

    </div>


    <div class="card">

        <div class="card-head">

            <h3 id="taskCountLabel">
                Loading tasks...
            </h3>

            <div style="display:flex; gap:8px;">

                <button
                    class="view-all"
                    onclick="filterTasks('all')"
                    id="filter-all"
                >
                    All
                </button>

                <button
                    class="view-all"
                    onclick="filterTasks('pending')"
                    id="filter-pending"
                >
                    Pending
                </button>

                <button
                    class="view-all"
                    onclick="filterTasks('done')"
                    id="filter-done"
                >
                    Completed
                </button>

            </div>

        </div>


        <div id="fullTaskList">

            <div class="task-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                Loading tasks...

            </div>

        </div>

    </div>

</section>
    

      <!-- ============ NOTIFICATIONS ============ -->
      <section class="page" id="page-notifications">
        <div class="page-header">
          <h1>Notifications</h1>
          <p>Stay updated on announcements, deadlines, and grades.</p>
        </div>
        <div>
          <div class="notif-page-row unread" onclick="markRead(this)">
            <div class="notif-page-icon" style="background:var(--blue-soft); color:var(--blue);"><i class="fa-solid fa-bullhorn"></i></div>
            <div style="flex:1;">
              <div class="row-title">Midterm Examination schedule posted</div>
              <div class="row-sub">Exams run May 20–24. Check the portal for your personal schedule.</div>
              <div class="task-meta" style="margin-top:6px;">2 hours ago</div>
            </div>
          </div>
          <div class="notif-page-row unread" onclick="markRead(this)">
            <div class="notif-page-icon" style="background:var(--orange-soft); color:var(--orange);"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <div style="flex:1;">
              <div class="row-title">Problem Set 4 is due today, 5:00 PM</div>
              <div class="row-sub">Pre-Calculus · Submit through the Tasks page before the deadline.</div>
              <div class="task-meta" style="margin-top:6px;">5 hours ago</div>
            </div>
          </div>
          <div class="notif-page-row unread" onclick="markRead(this)">
            <div class="notif-page-icon" style="background:var(--green-soft); color:var(--green);"><i class="fa-solid fa-circle-check"></i></div>
            <div style="flex:1;">
              <div class="row-title">Lab Report grade released — 92/100</div>
              <div class="row-sub">General Chemistry · Great work on the titration experiment.</div>
              <div class="task-meta" style="margin-top:6px;">1 day ago</div>
            </div>
          </div>
          <div class="notif-page-row" onclick="markRead(this)">
            <div class="notif-page-icon" style="background:var(--purple-soft); color:var(--purple);"><i class="fa-solid fa-calendar-check"></i></div>
            <div style="flex:1;">
              <div class="row-title">Perfect attendance streak — 5 days</div>
              <div class="row-sub">Keep it up! You're on track for the monthly attendance award.</div>
              <div class="task-meta" style="margin-top:6px;">3 days ago</div>
            </div>
          </div>
        </div>
      </section>


<!-- ============ ANNOUNCEMENTS ============ -->

<section class="page" id="page-announcements">

    <div class="page-header">

        <h1>Announcements</h1>

        <p>
            Stay updated with the latest announcements
            and important notices.
        </p>

    </div>

<div class="announcement-card">

    <div class="announcement-page-head">

        <h2>Published</h2>

        <span id="announcementCount">
            0 announcements
        </span>

    </div>

    <div id="announcementList">

        <div class="announcement-empty">

            <div class="announcement-empty-icon">
                <i class="fa-solid fa-spinner fa-spin"></i>
            </div>

            <h4>Loading announcements...</h4>

            <p>Please wait.</p>

        </div>

    </div>

</div>
</section>


<!-- ============ PROFILE ============ -->
<section class="page" id="page-profile">

    <div class="page-header">
        <h1>My Profile</h1>
        <p>Your personal and academic information.</p>
    </div>

    {{-- SUCCESS MESSAGE --}}
  

    {{-- ERROR MESSAGE --}}
    @if($errors->any())
        <div class="profile-alert error">
            <i class="fa-solid fa-circle-exclamation"></i>

            <div>
                <strong>Please check the following:</strong>

                <ul>
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        </div>
    @endif


    {{-- PROFILE HEADER --}}
    <div class="profile-header">

        <div class="avatar-lg">
            <img
                src="{{ $profileImage }}"
                alt="Profile"
            >
        </div>

        <form
            action="{{ route('student.profile.picture') }}"
            method="POST"
            enctype="multipart/form-data"
        >
            @csrf

            <label
                for="profile_picture"
                class="change-photo-btn"
            >
                <i class="fa-solid fa-camera"></i>
                Change Profile Picture
            </label>

            <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onchange="this.form.submit()"
            >
        </form>

        <div>
            <h2>{{ $student->fullname }}</h2>

            <div class="p-meta">
                Student ID: {{ $student->student_id }}
                &nbsp;·&nbsp;
                {{ $student->course }} –
                {{ $student->year_level }}-{{ $student->section }}
                &nbsp;·&nbsp;
                Status: Active
            </div>
        </div>

    </div>


    {{-- EDIT PROFILE FORM --}}
    <form
        action="{{ route('student.profile.update') }}"
        method="POST"
    >

        @csrf
        @method('PUT')


        <!-- PERSONAL INFORMATION -->
        <div class="card" style="margin-bottom:20px;">

            <div class="card-head">
                <h3>Personal Information</h3>
            </div>

            <div class="info-grid">

                <div class="info-field">
                    <label>FULL NAME</label>

                    <input
                        type="text"
                        name="fullname"
                        class="val profile-edit"
                        value="{{ $student->fullname }}"
                        required
                    >
                </div>


                <div class="info-field">
                    <label>DATE OF BIRTH</label>

                    <input
                        type="date"
                        name="date_of_birth"
                        class="val profile-edit"
                        value="{{ $student->date_of_birth }}"
                    >
                </div>


                <div class="info-field">
                    <label>GENDER</label>

                    <select
                        name="gender"
                        class="val profile-edit"
                    >
                        <option value="">Not provided</option>

                        <option
                            value="Male"
                            {{ $student->gender == 'Male' ? 'selected' : '' }}
                        >
                            Male
                        </option>

                        <option
                            value="Female"
                            {{ $student->gender == 'Female' ? 'selected' : '' }}
                        >
                            Female
                        </option>
                    </select>
                </div>


                <div class="info-field">
                    <label>EMAIL ADDRESS</label>

                    <input
                        type="email"
                        name="email"
                        class="val profile-edit"
                        value="{{ $student->email }}"
                    >
                </div>


                <div class="info-field">
                    <label>CONTACT NUMBER</label>

                    <input
                        type="text"
                        name="contact"
                        class="val profile-edit"
                        value="{{ $student->contact }}"
                    >
                </div>


                <div class="info-field">
                    <label>ADDRESS</label>

                    <input
                        type="text"
                        name="address"
                        class="val profile-edit"
                        value="{{ $student->address }}"
                    >
                </div>

            </div>

        </div>


        <!-- ACADEMIC INFORMATION -->
        <div class="card">

            <div class="card-head">
                <h3>Academic Information</h3>
            </div>

            <div class="info-grid">

                <div class="info-field">
                    <label>COURSE-YEAR-BLOCK</label>

                    <select
                        name="course"
                        class="val profile-edit"
                    >
                        <option
                            value="BSIT"
                            {{ $student->course == 'BSIT' ? 'selected' : '' }}
                        >
                            BSIT
                        </option>

                        <option
                            value="BSCS"
                            {{ $student->course == 'BSCS' ? 'selected' : '' }}
                        >
                            BSCS
                        </option>
                    </select>
                </div>


                <div class="info-field">
                    <label>STUDENT ID</label>

                    <input
                        type="text"
                        name="student_id"
                        class="val profile-edit"
                        value="{{ $student->student_id }}"
                        required
                    >
                </div>


                <div class="info-field">
                    <label>YEAR LEVEL</label>

                    <select
                        name="year_level"
                        class="val profile-edit"
                    >
                        <option
                            value="1st Year"
                            {{ $student->year_level == '1st Year' ? 'selected' : '' }}
                        >
                            1st Year
                        </option>

                        <option
                            value="2nd Year"
                            {{ $student->year_level == '2nd Year' ? 'selected' : '' }}
                        >
                            2nd Year
                        </option>

                        <option
                            value="3rd Year"
                            {{ $student->year_level == '3rd Year' ? 'selected' : '' }}
                        >
                            3rd Year
                        </option>

                        <option
                            value="4th Year"
                            {{ $student->year_level == '4th Year' ? 'selected' : '' }}
                        >
                            4th Year
                        </option>
                    </select>
                </div>


                <div class="info-field">
                    <label>SECTION</label>

                    <select
                        name="section"
                        class="val profile-edit"
                    >
                        <option
                            value="A"
                            {{ $student->section == 'A' ? 'selected' : '' }}
                        >
                            A
                        </option>

                        <option
                            value="B"
                            {{ $student->section == 'B' ? 'selected' : '' }}
                        >
                            B
                        </option>

                        <option
                            value="C"
                            {{ $student->section == 'C' ? 'selected' : '' }}
                        >
                            C
                        </option>
                    </select>
                </div>

            </div>


 <!-- SAVE PROFILE CHANGES -->
    <div class="profile-save-area">

        <button
            type="submit"
            class="btn-primary"
        >
            <i class="fa-solid fa-floppy-disk"></i>
            Save Changes
        </button>

    </div>

</div>

</form>
            

</section>
      <!-- ============ SETTINGS ============ -->
      <section class="page" id="page-settings">
        <div class="page-header">
          <h1>Settings</h1>
          <p>Manage your notification preferences and account security.</p>
        </div>

        <div class="card" style="margin-bottom:20px;">
          <div class="card-head"><h3>Notification Preferences</h3></div>
          <div class="settings-row">
            <div><div class="s-title">Announcement alerts</div><div class="s-desc">Get notified about school-wide announcements.</div></div>
            <button class="toggle on" onclick="this.classList.toggle('on')"></button>
          </div>
          <div class="settings-row">
            <div><div class="s-title">Task deadline reminders</div><div class="s-desc">Reminders before an assignment is due.</div></div>
            <button class="toggle on" onclick="this.classList.toggle('on')"></button>
          </div>
          <div class="settings-row">
            <div><div class="s-title">Grade updates</div><div class="s-desc">Get notified when a new grade is posted.</div></div>
            <button class="toggle on" onclick="this.classList.toggle('on')"></button>
          </div>
          <div class="settings-row">
            <div><div class="s-title">Email notifications</div><div class="s-desc">Also receive these updates by email.</div></div>
            <button class="toggle" onclick="this.classList.toggle('on')"></button>
          </div>
        </div>

        <div class="card">
    <div class="card-head">
        <h3>Change Password</h3>
    </div>

    <div class="info-grid" style="margin-bottom:16px;">

        <!-- CURRENT PASSWORD -->
<div class="info-field" style="grid-column:1 / -1;">
    <label>Current Password</label>

    <div class="password-wrapper">
        <input
            type="password"
            id="currentPassword"
            name="current_password"
            class="text-input"
            placeholder="••••••••"
            required
        >

        <button
            type="button"
            class="password-toggle"
            onclick="togglePassword('currentPassword', this)"
        >
            <i class="fa-regular fa-eye"></i>
        </button>
    </div>
</div>
</div>

<!-- NEW PASSWORD -->
<div class="info-field">
    <label>New Password</label>

    <div class="password-wrapper">
        <input
            type="password"
            id="newPassword"
            name="new_password"
            class="text-input"
            placeholder="••••••••"
            required
        >

        <button
            type="button"
            class="password-toggle"
            onclick="togglePassword('newPassword', this)"
        >
            <i class="fa-regular fa-eye"></i>
        </button>
    </div>
</div>

<!-- CONFIRM NEW PASSWORD -->
<div class="info-field">
    <label>Confirm New Password</label>

    <div class="password-wrapper">
        <input
            type="password"
            id="confirmPassword"
            name="new_password_confirmation"
            class="text-input"
            placeholder="••••••••"
            required
        >

        <button
            type="button"
            class="password-toggle"
            onclick="togglePassword('confirmPassword', this)"
        >
            <i class="fa-regular fa-eye"></i>
        </button>
    </div>
</div>

    <button
        type="button"
        class="btn-primary"
        onclick="changePassword()"
    >
        <i class="fa-solid fa-floppy-disk"></i>
        Save Changes
    </button>
</div>
</section>

    </main>
  </div>
</div>

<!-- LOGOUT MODAL -->
<div class="modal-overlay" id="logoutModal">
  <div class="modal-box">
    <div class="modal-icon"><i class="fa-solid fa-right-from-bracket"></i></div>
    <h3>Log out of LABSTRACK?</h3>
    <p>You'll need to sign in again to access your dashboard, schedule, and tasks.</p>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeLogout()">Cancel</button>
      <button class="btn-danger" onclick="confirmLogout()">Logout</button>
    </div>
  </div>
</div>


<!-- PROFILE SUCCESS MODAL -->
<div class="success-modal-overlay" id="profileSuccessModal">
    <div class="success-modal">

        <div class="success-icon">
            <i class="fa-solid fa-check"></i>
        </div>

        <h3>Profile picture updated successfully.</h3>

        <p>Your profile picture has been updated.</p>

        <button type="button" onclick="closeProfileSuccessModal()">
            OK
        </button>

    </div>
</div>

<script src="{{ asset('js/StudentDashboard.js') }}"></script>
</body>
</html>