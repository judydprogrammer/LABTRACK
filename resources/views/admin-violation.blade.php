<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title> Violation </title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="{{ asset('css copy/AdminViolation.css') }}">
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


    <!-- DASHBOARD -->
            <button
                class="nav-item"
                data-page="dashboard"
                onclick="window.location.href='{{ route('admin.dashboard') }}'"
            >
                <i class="fa-solid fa-table-columns"></i>
                Dashboard
            </button>


            <!-- SUBJECT MANAGEMENT -->
            <button
                class="nav-item"
                data-page="subjects"
                onclick="window.location.href='{{ route('admin.subjects.page') }}'"
            >
                <i class="fa-solid fa-book-open"></i>
                Subject Management
            </button>


            <!-- SCHEDULE MANAGEMENT -->
            <button
                class="nav-item"
                data-page="schedule"
                onclick="window.location.href='{{ route('admin.schedules') }}'"
            >
                <i class="fa-regular fa-calendar-days"></i>
                Schedule Management
            </button>


            <!-- COMPUTER MANAGEMENT -->
            <button
                class="nav-item"
                data-page="computers"
                onclick="window.location.href='{{ route('admin.computers') }}'"
            >
                <i class="fa-solid fa-computer"></i>
                Computer Management
            </button>


            <!-- ATTENDANCE RECORDS -->
            <button
            type="button"
            class="nav-item"
            onclick="window.location.href='{{ route('admin.attendance') }}'"
            >
                <i class="fa-solid fa-clipboard-check"></i>
                Attendance Records
            </button>
      
      <button class="nav-item active" data-page="violations" onclick="goTo('violations')">
        <i class="fa-solid fa-triangle-exclamation"></i> Violation Logs
        
      </button>


      <button class="nav-item"
                    type="button"
                    onclick="window.location.href='/admin/reports'">
                <i class="fa-solid fa-chart-simple"></i> 
                Reports
            </button>

            <button class="nav-item"
                    type="button"
                    onclick="window.location.href='/admin/announcements'">
                <i class="fa-solid fa-bullhorn"></i> 
                Announcement
            </button>

    </div>

    <div class="nav-label">ACCOUNT</div>
    <div>

    <button class="nav-item"
                    type="button"
                    onclick="window.location.href='/admin/settings'">
                <i class="fa-solid fa-gear"></i> 
                Setting
            </button>

            

            <button class="nav-item" onclick="openLogout()">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
    
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

  <!-- ============ VIOLATION LOGS ============ -->
  <section class="page" id="page-violations">

    <!-- PAGE HEADER -->
    <div class="page-header">
      <div>
        <h1>Violation Logs</h1>
        <p>Review and resolve flagged laboratory rule violations.</p>
      </div>
    </div>

    <!-- VIOLATION CARD -->
    <div class="card">

      <!-- CARD HEADER -->
      <div class="card-head">

        <h3 id="violationCountLabel">
          3 logged violations
        </h3>

        <div class="filter-buttons">

          <button
                type="button"
                class="view-all active"
                id="vfilter-all"
                onclick="filterViolations('all')"
            >
                All
            </button>

            <button
                type="button"
                class="view-all"
                id="vfilter-open"
                onclick="filterViolations('open')"
            >
                Unresolved
            </button>

            <button
                type="button"
                class="view-all"
                id="vfilter-resolved"
                onclick="filterViolations('resolved')"
            >
                Resolved
            </button>

        </div>

      </div>

      <!-- VIOLATION TABLE -->
      <div class="table-wrapper">

        <table>
    <thead>
        <tr>
            <th>STUDENT</th>
            <th>PC</th>
            <th>VIOLATION</th>
            <th>SEVERITY</th>
            <th>TIME</th>
            <th>STATUS</th>
            <th>ACTION</th>
        </tr>
    </thead>

            <tbody id="violationTableBody">
                <tr>
                    <td colspan="7" style="text-align:center; padding:24px;">
                        Loading violations...
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  </section>
</main>
        </div>
    </div>
  
<!-- =========================================================
     LOGOUT MODAL
========================================================== -->
<div class="logout-overlay"
     id="logoutModal"
     style="display:none;">

  <div class="logout-modal">


    <div class="logout-icon">

      <i class="fa-solid fa-right-from-bracket"></i>

    </div>


    <h2>
      Log out of LABSTRACK?
    </h2>


    <p>
      You'll need to sign in again to access the
      administrator dashboard and lab controls.
    </p>


    <div class="logout-actions">

      <button class="logout-cancel"
              onclick="closeLogout()">

        Cancel

      </button>


      <button class="logout-confirm"
              onclick="confirmLogout()">

        Logout

      </button>

    </div>


  </div>

</div>
     <script>
    window.adminRoutes = {

        dashboard: "{{ route('admin.dashboard') }}",

        subjects: "{{ route('admin.subjects.page') }}",

        schedules: "{{ route('admin.schedules') }}",

        computers: "{{ route('admin.computers') }}",

        attendance: "{{ route('admin.attendance') }}",

        violations: "{{ route('admin.violations') }}",

        violationsData: "{{ route('admin.violations.data') }}",

        violationsToggle: "{{ url('/admin/violations') }}",

        reports: "{{ route('admin.reports') }}",

        announcement: "{{ url('/admin/announcements') }}",

        settings: "{{ url('/admin/settings') }}",

        logout: "{{ route('admin.logout') }}"
    };
</script>

<script src="{{ asset('js/GlobalAdminProfile.js') }}"></script>
<script src="{{ asset('js/Violation.js') }}"></script>
</body>
</html>