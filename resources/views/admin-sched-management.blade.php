<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>LABSTRACK — Administrator Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="{{ asset('css copy/AdminSchedManagement.css') }}">
</head>
<body>

<div class="app">

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-badge">
         <img src="{{ asset('images/white_logo.png') }}" alt="Logo">
      </i></div>
      <h1>LABTRACK</h1>
      <p>Computer Laboratory Monitoring System</p>
    </div>

    <div>
        <button class="nav-item"
            onclick="window.location.href='{{ route('admin.dashboard') }}'">
            <i class="fa-solid fa-table-columns"></i>
            Dashboard
        </button>

        <button class="nav-item"
            onclick="window.location.href='{{ route('admin.subjects.page') }}'">
            <i class="fa-solid fa-book-open"></i>
            Subject Management
        </button>

        <button class="nav-item active">
            <i class="fa-regular fa-calendar-days"></i>
            Schedule Management
        </button>
      
        <button class="nav-item"
            onclick="window.location.href='{{ route('admin.computers') }}'">
            <i class="fa-solid fa-computer"></i>
            Computer Management
        </button>

        <button class="nav-item"
            onclick="window.location.href='{{ route('admin.attendance') }}'">
            <i class="fa-solid fa-clipboard-check"></i> 
            Attendance Records
        </button>

        <button class="nav-item"
            onclick="window.location.href='{{ route('admin.violations') }}'">
            <i class="fa-solid fa-triangle-exclamation"></i> 
            Violation Logs
        </button>

        <button class="nav-item"
            onclick="window.location.href='{{ route('admin.reports') }}'">
            <i class="fa-solid fa-chart-simple"></i> 
            Reports
        </button>

        <button class="nav-item"
            onclick="window.location.href='{{ route('admin.announcements') }}'">
            <i class="fa-solid fa-bullhorn"></i> 
            Announcement
        </button>
    </div>

    <div class="nav-label">ACCOUNT</div>
    <div>

        <button class="nav-item"
            onclick="window.location.href='{{ route('admin.settings') }}'">
            <i class="fa-solid fa-gear"></i> 
            Setting
        </button>

      <button class="nav-item" onclick="openLogout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
    </div>
  </aside>

  <!-- MAIN -->
  <div class="main">

    <header class="topbar">
      <div class="topbar-left">
        <button class="hamburger" id="hamburgerBtn" type="button"> <i class="fa-solid fa-bars"></i> </button>
        <h2 id="pageTitle">Dashboard</h2>
      </div>

      <div class="topbar-right">
        <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>

            <input
                type="text"
                id="globalSearchInput"
                placeholder="Search students, PCs, logs..."
                autocomplete="off"
            >
        </div>

        <div class="notif-wrap" id="notifWrap">
          <button class="bell" onclick="toggleNotif(event)">
            <i class="fa-regular fa-bell"></i>
            <span class="dot" id="bellDot">3</span>
          </button>
          <div class="notif-menu">
            <div class="notif-menu-title">Notifications <span class="link" onclick="goTo('violations')">View All</span></div>
            <div class="notif-row unread" onclick="goTo('violations')">
              <div class="dot-icon" style="background:var(--red-soft); color:var(--red);"><i class="fa-solid fa-ban"></i></div>
              <div><div class="r-title">Unauthorized app blocked — PC-14, CLAB1</div><div class="r-time">8 minutes ago</div></div>
            </div>
            <div class="notif-row unread" onclick="goTo('computers')">
              <div class="dot-icon" style="background:var(--orange-soft); color:var(--orange);"><i class="fa-solid fa-triangle-exclamation"></i></div>
              <div><div class="r-title">PC-22 went offline unexpectedly</div><div class="r-time">22 minutes ago</div></div>
            </div>
            <div class="notif-row unread" onclick="goTo('reports')">
              <div class="dot-icon" style="background:var(--blue-soft); color:var(--blue);"><i class="fa-solid fa-circle-check"></i></div>
              <div><div class="r-title">Weekly attendance report is ready</div><div class="r-time">1 hour ago</div></div>
            </div>
          </div>
        </div>

        <!-- PROFILE DROPDOWN -->
        <div class="profile" id="profileMenu">
          <button class="profile-trigger" onclick="toggleProfile(event)">
            <div class="avatar">AD</div>
            <div class="profile-name">
              <div class="name">Admin Reyes</div>
              <div class="role">Laboratory Administrator</div>
            </div>
            <i class="fa-solid fa-chevron-down chev"></i>
          </button>

          <div class="profile-menu">
            <div class="profile-menu-header">
              <div class="avatar">AD</div>
              <div>
                <div class="name">Admin Reyes</div>
                <div class="sub">ID: ADM-0042</div>
              </div>
            </div>
            <button class="profile-menu-item" onclick="goTo('settings')"><i class="fa-regular fa-user"></i> My Profile</button>
            <button class="profile-menu-item" onclick="goTo('settings')"><i class="fa-solid fa-gear"></i> Settings</button>
            <button class="profile-menu-item" onclick="goTo('violations')"><i class="fa-regular fa-bell"></i> Notifications</button>
            <div class="profile-menu-divider"></div>
            <button class="profile-menu-item danger" onclick="openLogout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
          </div>
        </div>
      </div>
    </header>

      <main class="content">
      <!-- ============ SCHEDULE MANAGEMENT ============ -->
  <section class="page" id="page-schedule">
    <div class="page-header">
        <div>
            <h1>Schedule Management</h1>
            <p>Manage weekly laboratory and classroom schedules.</p>
        </div>
    </div>
    <div class="card">
        <div class="card-head">
            <div class="semester-tabs">
                <button class="semester-btn active"
                    onclick="filterSemester('1st Semester', this)">
                    1st Semester
                </button>

                <button class="semester-btn"
                    onclick="filterSemester('2nd Semester', this)">
                    2nd Semester
                </button>
            </div>
            <button class="btn-primary" onclick="openScheduleModal()">
                <i class="fa-solid fa-plus"></i>&nbsp; Add Schedule
            </button>
        </div>
    </div>
    <!-- SEPARATE SCHEDULE DATA CONTAINER -->
    <div id="scheduleContainer"></div>
    </section>
    </main>


<!-- LOGOUT CONFIRMATION MODAL -->

<div id="logoutModal" class="modal-overlay">

    <div class="logout-modal-box">

        <div class="logout-icon">
            <i class="fa-solid fa-right-from-bracket"></i>
        </div>

        <h3>Log out of LABSTRACK?</h3>

        <p>
            You'll need to sign in again to access
            the administrator dashboard and lab controls.
        </p>

        <div class="logout-actions">

            <button
                type="button"
                class="logout-cancel"
                onclick="closeLogout()">

                Cancel

            </button>

            <button
                type="button"
                class="logout-confirm"
                onclick="confirmLogout()">

                Logout

            </button>

        </div>

    </div>

</div>



            
<!-- ADD SCHEDULE MODAL -->
<div id="scheduleModal" class="modal-overlay">
    <div class="schedule-modal">

        <div class="modal-header">
            <div class="header-left">
                <div class="icon-circle">
                    <i class="fa-solid fa-calendar-days"></i>
                </div>
                <h2>Add Schedule</h2>
            </div>
            <button class="close-btn" onclick="closeScheduleModal()">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <form class="schedule-form">
              <!-- Row 1 -->
<div class="form-row">
    <div class="form-group">
        <label>SUBJECT CODE</label>
        <input type="text" placeholder="e.g. ITE111" id="subjectCode">
    </div>

    <div class="form-group">
        <label>ROOM</label>
        <input type="text" placeholder="e.g. Lab 3" id="room">
    </div>
</div>

<!-- Row 2 -->
<div class="form-group">
    <label>SUBJECT</label>
    <input type="text" placeholder="e.g. Computer Architecture & Organization" id="subjectName">
</div>

<!-- Row 3 -->
<div class="form-group">
    <label>TEACHER</label>
    <input type="text" placeholder="e.g. Mr. Balon" id="teacher">
</div>

<!-- Row 4 -->
<div class="form-row three-cols">
    <div class="form-group">
        <label>COURSE</label>
        <select id="scheduleCourse">
            <option>BSIT</option>
            <option>BSCS</option>
        </select>
    </div>

    <div class="form-group">
        <label>YEAR LEVEL</label>
        <select id="scheduleYearLevel">
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
        </select>
    </div>

    <div class="form-group">
        <label>SECTION</label>
        <select id="scheduleBlock">
            <option>A</option>
            <option>B</option>
            <option>C</option>
        </select>
    </div>
</div>

<!-- Row 5 -->
<div class="form-row">
    <div class="form-group">
        <label>SEMESTER</label>
        <select id="scheduleSemester">
            <option>1st Semester</option>
            <option>2nd Semester</option>
        </select>
    </div>

    <div class="form-group">
        <label>DAY PATTERN</label>
        <input type="text" placeholder="MWF or TTH" id="day">
    </div>
</div>

<!-- Row 6 -->
<div class="form-row">
    <div class="form-group">
        <label>TIME</label>
        <input 
            type="text" 
            id="time"
            placeholder="e.g. 3:30 PM - 5:00 PM"
        >
    </div>
</div>
    <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeScheduleModal()">
                    Cancel
                </button>

            <button type="button" class="btn-save" onclick="saveSchedule()">
              <i class="fa-solid fa-plus"></i>
              Save Schedule
          </button>
            </div>

        </form>
    </div>
</div>
</div>
</div>
    <script>
        window.schedules = @json($schedules);
    </script>

<script src="/js/GlobalAdminProfile.js"></script>
<script src="{{ asset('js/AdminSchedManagement.js') }}"></script>


<form
    id="logoutForm"
    action="{{ route('admin.logout') }}"
    method="POST"
    style="display: none;"
>
    @csrf
</form>

</body>
</html>