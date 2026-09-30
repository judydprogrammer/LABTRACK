
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LABSTRACK — Administrator Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="{{ asset('css copy/AdminDashboardFinal.css') }}">
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
      <button class="nav-item active" data-page="dashboard" onclick="goTo('dashboard')"><i class="fa-solid fa-table-columns"></i> Dashboard</button>
      
      <button class="nav-item" data-page="subjects"
          onclick="window.location.href='{{ route('admin.subjects.page') }}'">
          <i class="fa-solid fa-book-open"></i>
          Subject Management
      </button>
      

      <button class="nav-item"
        onclick="window.location.href='{{ route('admin.schedules') }}'">
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

      <button class="nav-item" data-page="reports" onclick="goTo('reports')"><i class="fa-solid fa-chart-simple"></i> Reports</button>
  
      <button class="nav-item"
        onclick="window.location.href='{{ route('admin.announcements') }}'">
        <i class="fa-solid fa-bullhorn"></i> 
        Announcement
      </button>


    
    </div>

    <div class="nav-label">ACCOUNT</div>
    <div>
      <button class="nav-item" data-page="settings" onclick="goTo('settings')"><i class="fa-solid fa-gear"></i> Setting</button>
      
      <a href="#" class="nav-item logout-item" onclick="openLogout(); return false;">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Logout</span>
    </a>
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
        <div class="search-box" id="globalSearchBox">

            <i class="fa-solid fa-magnifying-glass"></i>

            <input
                type="text"
                id="globalSearchInput"
                placeholder="Search students, PCs, logs..."
                autocomplete="off"
            >

            <div
                class="global-search-results"
                id="globalSearchResults"
            ></div>

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

    <button
        class="profile-trigger"
        onclick="toggleProfile(event)"
    >

        <div class="avatar">
            {{ collect(explode(' ', trim(session('admin_name', 'Admin'))))
                ->filter()
                ->map(fn($word) => strtoupper(substr($word, 0, 1)))
                ->take(2)
                ->implode('') }}
        </div>

        <div class="profile-name">

            <div class="name">
                {{ session('admin_name', 'Administrator') }}
            </div>

            <div class="role">
                Laboratory Administrator
            </div>

        </div>

        <i class="fa-solid fa-chevron-down chev"></i>

    </button>


    <div class="profile-menu">

        <div class="profile-menu-header">

            <div class="avatar">
                {{ collect(explode(' ', trim(session('admin_name', 'Admin'))))
                    ->filter()
                    ->map(fn($word) => strtoupper(substr($word, 0, 1)))
                    ->take(2)
                    ->implode('') }}
            </div>

            <div>

                <div class="name">
                    {{ session('admin_name', 'Administrator') }}
                </div>

                <div class="sub">
                    ID: {{ session('admin_code', 'N/A') }}
                </div>

            </div>

        </div>


        <button
            class="profile-menu-item"
            onclick="goTo('settings')"
        >
            <i class="fa-regular fa-user"></i>
            My Profile
        </button>


        <button
            class="profile-menu-item"
            onclick="goTo('settings')"
        >
            <i class="fa-solid fa-gear"></i>
            Settings
        </button>


        <button
            class="profile-menu-item"
            onclick="goTo('violations')"
        >
            <i class="fa-regular fa-bell"></i>
            Notifications
        </button>


        <div class="profile-menu-divider"></div>


        <button
            class="profile-menu-item danger"
            onclick="openLogout()"
        >
            <i class="fa-solid fa-right-from-bracket"></i>
            Logout
        </button>

    </div>

</div>
    </header>

    <main class="content">

      <!-- ============ DASHBOARD ============ -->
      <section class="page active" id="page-dashboard">
        <section class="hero">
          <div>
            <h1>
              Welcome back, {{ session('admin_name', 'Administrator') }}!
          </h1>
            <p>Here's a live overview of registered students, lab sessions, and today's monitoring activity.</p>
          </div>
          <div class="hero-clock">
            <div class="time" id="heroTime">--:--</div>
            <div class="date" id="heroDate">Loading date...</div>
          </div>
        </section>

        <section class="grid-4">

    <!-- Registered Students -->
    <div class="stat-card">
        <div class="stat-icon blue">
            <i class="fa-solid fa-user-graduate"></i>
        </div>

        <div>
            <div class="stat-label">Registered Students</div>
            <span class="stat-value" id="registeredStudents">0</span>
            <div class="stat-sub blue">+12 this semester</div>
        </div>
    </div>


    <!-- Students Present -->
    <div class="stat-card">
        <div class="stat-icon green">
            <i class="fa-solid fa-circle-check"></i>
        </div>

        <div>
            <div class="stat-label">Students Present</div>
            <span class="stat-value" id="studentsPresent">0</span>

            <div class="stat-sub muted">
                <span id="attendancePercentage">
                    0% of registered
                </span>
            </div>
        </div>
    </div>


    <!-- Active Sessions / PC -->
    <div class="stat-card">
        <div class="stat-icon purple">
            <i class="fa-solid fa-computer"></i>
        </div>

        <div>
            <div class="stat-label">Active Sessions / PC</div>

            <span class="stat-value">
                <span id="activeComputers">0</span>
                /
                <span id="totalComputers">0</span>
            </span>

            <div class="stat-sub muted">
                Across 4 laboratories
            </div>
        </div>
    </div>


    <!-- Today's Violations -->
    <div class="stat-card">
        <div class="stat-icon red">
            <i class="fa-solid fa-triangle-exclamation"></i>
        </div>

        <div>
            <div class="stat-label">Today's Violations</div>

            <span class="stat-value" id="todaysViolations">
                0
            </span>

            <div class="stat-sub muted">
                <span id="unresolvedViolations">
                    0 unresolved
                </span>
            </div>
        </div>
    </div>

</section>
        <section class="grid-2">
          <div class="card">
            <div class="card-head"><h3>Live Monitoring</h3><button class="view-all" onclick="goTo('computers')">
              Open Monitoring
          </button>
</div>
            <div class="pc-grid dashboard-pc-grid" id="dashMonitorGrid"></div>
          </div>

          <div class="card">
            <div class="card-head"><h3>Recent Activities</h3><button class="view-all" onclick="goTo('violations')">View All</button></div>
            <div id="recentActivityList"></div>
          </div>
        </section>

        <section class="grid-2">
          <div class="card">
            <div class="card-head"><h3>System Status</h3></div>
            <div class="status-list" id="systemStatusList"></div>
          </div>

          <div class="card">
            <div class="card-head"><h3>Quick Actions</h3></div>
            <div class="quick-grid">
              <button class="quick-btn" onclick="goTo('computers')">
                <i class="fa-solid fa-power-off" style="color:var(--blue);"></i>
                <div class="q-title">Manage PCs</div>
                <div class="q-desc">Lock, restart, or check lab computers</div>
              </button>
              <button class="quick-btn" onclick="goTo('announcement')">
                <i class="fa-solid fa-bullhorn" style="color:var(--purple);"></i>
                <div class="q-title">Post Announcement</div>
                <div class="q-desc">Notify all students instantly</div>
              </button>
              <button class="quick-btn" onclick="goTo('reports')">
                <i class="fa-solid fa-file-arrow-down" style="color:var(--green);"></i>
                <div class="q-title">Generate Report</div>
                <div class="q-desc">Export attendance or violation data</div>
              </button>
              <button class="quick-btn" onclick="goTo('violations')">
                <i class="fa-solid fa-shield-halved" style="color:var(--red);"></i>
                <div class="q-title">Review Violations</div>
                <div class="q-desc">Resolve today's flagged incidents</div>
              </button>
            </div>
          </div>
        </section>
      </section>
      
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


      <script src="{{ asset('js/AdminDashboardFinal.js') }}"></script>
</body>