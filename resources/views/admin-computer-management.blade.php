<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>LABSTRACK — Administrator Dashboard</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
    >

    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    >

    <link
        rel="stylesheet"
        href="{{ asset('css copy/AdminComputerManagement.css') }}"
    >
</head>

<body>

<div class="app">

  <!-- =====================================================
       SIDEBAR
  ====================================================== -->
  <aside class="sidebar">

    <div class="brand">

      <div class="brand-badge">
        <img src="{{ asset('images/white_logo.png') }}" alt="Logo">
      </div>

      <h1>LABTRACK</h1>
      <p>Computer Laboratory Monitoring System</p>

    </div>


    <!-- MAIN NAVIGATION -->
    <div>

      <button
    class="nav-item"
    data-page="dashboard"
    onclick="window.location.href='{{ route('admin.dashboard') }}'"
>
    <i class="fa-solid fa-table-columns"></i>
    Dashboard
</button>


      <button class="nav-item"
                data-page="subjects"
                onclick="window.location.href='{{ route('admin.subjects.page') }}'">
            <i class="fa-solid fa-book-open"></i>
            Subject Management
        </button>


      <button class="nav-item"
                data-page="schedule"
                onclick="window.location.href='{{ route('admin.schedules') }}'">
            <i class="fa-regular fa-calendar-days"></i>
            Schedule Management
        </button>


      <button class="nav-item active"
              data-page="computers"
              onclick="window.location.href='{{ route('admin.computers') }}'">
        <i class="fa-solid fa-computer"></i>
        Computer Management
      </button>


      <button class="nav-item"
                data-page="attendance"
                onclick="goTo('attendance')">
            <i class="fa-solid fa-clipboard-check"></i>
            Attendance Records
        </button>


      <button class="nav-item"
        data-page="violations"
        onclick="goTo('violations')">

    <i class="fa-solid fa-triangle-exclamation"></i>
    Violation Logs

</button>


      <button class="nav-item"
            onclick="window.location.href='{{ route('admin.reports') }}'">
            <i class="fa-solid fa-chart-simple"></i> 
            Reports
        </button>


      <button class="nav-item"
              data-page="announcement"
               onclick="goTo('announcement')">

        <i class="fa-solid fa-bullhorn"></i>
        Announcement

      </button>

    </div>


    <!-- ACCOUNT -->
    <div class="nav-label">
      ACCOUNT
    </div>

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



  <!-- =====================================================
       MAIN
  ====================================================== -->
  <div class="main">


    <!-- =====================================================
         TOPBAR
    ====================================================== -->
    <header class="topbar">

      <div class="topbar-left">
          <button class="hamburger" id="hamburgerBtn" type="button"> <i class="fa-solid fa-bars"></i> </button>
        <h2 id="pageTitle">
          Computer Management
        </h2>

      </div>



      <div class="topbar-right">

        <!-- SEARCH -->
        <div class="search-box">

          <i class="fa-solid fa-magnifying-glass"></i>

          <input
              type="text"
              id="globalSearchInput"
              placeholder="Search students, PCs, logs..."
              autocomplete="off"
          >

        </div>



        <!-- NOTIFICATIONS -->
        <div class="notif-wrap" id="notifWrap">

          <button class="bell"
                  onclick="toggleNotif(event)">

            <i class="fa-regular fa-bell"></i>

            <span class="dot" id="bellDot">
              3
            </span>

          </button>


          <div class="notif-menu">

            <div class="notif-menu-title">

              Notifications

              <span class="link"
                     onclick="goTo('view-all-notifications')">
                View All
              </span>

            </div>


            <div class="notif-row unread"
                onclick="goTo('violations')">
              <div class="dot-icon"
                   style="background:var(--red-soft); color:var(--red);">

                <i class="fa-solid fa-ban"></i>

              </div>

              <div>

                <div class="r-title">
                  Unauthorized app blocked — PC-14, CLAB1
                </div>

                <div class="r-time">
                  8 minutes ago
                </div>

              </div>

            </div>


            <div class="notif-row unread"
                 onclick="goTo('computers')">

              <div class="dot-icon"
                   style="background:var(--orange-soft); color:var(--orange);">

                <i class="fa-solid fa-triangle-exclamation"></i>

              </div>

              <div>

                <div class="r-title">
                  PC-22 went offline unexpectedly
                </div>

                <div class="r-time">
                  22 minutes ago
                </div>

              </div>

            </div>


            <div class="notif-row unread"
                 onclick="goTo('reports')">

              <div class="dot-icon"
                   style="background:var(--blue-soft); color:var(--blue);">

                <i class="fa-solid fa-circle-check"></i>

              </div>

              <div>

                <div class="r-title">
                  Weekly attendance report is ready
                </div>

                <div class="r-time">
                  1 hour ago
                </div>

              </div>

            </div>

          </div>

        </div>



        <!-- =================================================
             PROFILE
        ================================================== -->
        <div class="profile" id="profileMenu">

          <button class="profile-trigger"
                  onclick="toggleProfile(event)">

            <div class="avatar">
              AD
            </div>

            <div class="profile-name">

              <div class="name">
                Admin Reyes
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
                AD
              </div>

              <div>

                <div class="name">
                  Admin Reyes
                </div>

                <div class="sub">
                  ID: ADM-0042
                </div>

              </div>

            </div>


            <button class="profile-menu-item"
                    onclick="goTo('settings')">

              <i class="fa-regular fa-user"></i>
              My Profile

            </button>


            <button class="profile-menu-item"
                    onclick="goTo('settings')">

              <i class="fa-solid fa-gear"></i>
              Settings

            </button>


            <button class="profile-menu-item"
                    onclick="goTo('violations')">

              <i class="fa-regular fa-bell"></i>
              Notifications

            </button>


            <div class="profile-menu-divider"></div>


            <button class="profile-menu-item danger"
                    onclick="openLogout()">

              <i class="fa-solid fa-right-from-bracket"></i>
              Logout

            </button>

          </div>

        </div>

      </div>

    </header>
      <main class="content">

  <!-- ============ COMPUTER MANAGEMENT ============ -->
  <section class="page" id="page-computers">

    <div class="page-header">
      <div>
        <h1>Computer Management</h1>
        <p>Monitor and control every PC unit across the laboratories.</p>
      </div>

      <button type="button" class="btn-primary scan-devices-btn" onclick="scanDevices()">
            <i class="fa-solid fa-radar"></i>
            Scan Devices
        </button>
    </div>

    <!-- LAB TABS -->
    <div class="lab-tabs" id="labTabs"></div>

    <!-- COMPUTER MANAGEMENT CARD -->
    <div class="card">

      <div class="card-head">
        <h3 id="pcCountLabel">CLAB1 · 24 units</h3>

        <div class="toolbar">
          <button
                type="button"
                class="btn-secondary"
                onclick="restartAllComputers()">

                <i class="fa-solid fa-rotate"></i>
                Restart All

            </button>

          <button
                type="button"
                class="btn-secondary"
                onclick="lockAllComputers()">

                <i class="fa-solid fa-lock"></i>
                Lock All

            </button>
        </div>
      </div>

      <!-- PC GRID -->
      <div class="pc-grid" id="pcGrid"></div>

      <!-- LEGEND -->
      <div class="legend">
        <span>
          <span class="dot" style="background:var(--green);"></span>
          Online / Idle
        </span>

        <span>
          <span class="dot" style="background:var(--blue);"></span>
          In Use
        </span>

        <span>
          <span class="dot" style="background:var(--orange);"></span>
          Maintenance
        </span>

        <span>
          <span class="dot" style="background:#9aa3b5;"></span>
          Offline
        </span>
      </div>

    </div>


    <div id="scanDevicesModal" class="modal-overlay">

    <div class="modal-card">

        <div class="modal-header">

            <div>
                <h2>Scan Devices</h2>

                <p>
                    Scan available devices on the network
                </p>
            </div>

            <button
                type="button"
                class="modal-close"
                onclick="closeScanDevicesModal()">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>


        <div class="modal-body">

            <div id="scanDeviceList">

                <div class="scan-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <span>Scanning devices...</span>
                </div>

            </div>

        </div>


        <div class="modal-footer">

            <button
                type="button"
                class="btn-secondary"
                onclick="closeScanDevicesModal()">

                Cancel

            </button>

            <button
                type="button"
                class="btn-primary"
                onclick="addSelectedDevices()">

                <i class="fa-solid fa-plus"></i>
                Add Selected

            </button>

        </div>

    </div>

</div>



<!-- ================= APPLICATION MODAL ================= -->
<div id="applicationModal" class="modal-overlay">

    <div class="modal-card application-modal-card">

        <div class="modal-header">
            <div>
                <h2 id="applicationModalTitle">Add Application</h2>
                <p>Add an application restriction</p>
            </div>

            <button type="button"
                    class="modal-close"
                    onclick="closeApplicationModal()">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <form id="applicationForm" onsubmit="saveApplication(event)">

            <div class="modal-body">

                <div class="form-group">
                    <label for="applicationName">
                        Application Name
                    </label>

                    <input
                        type="text"
                        id="applicationName"
                        class="text-input"
                        placeholder="e.g. Discord"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="applicationScope">
                        Scope
                    </label>

                    <select
                        id="applicationScope"
                        class="text-input"
                        required
                    >
                        <option value="">Select Scope</option>
                        <option value="All Laboratories">
                            All Laboratories
                        </option>
                        <option value="CLAB1">CLAB1</option>
                        <option value="CLAB2">CLAB2</option>
                        <option value="CLAB3">CLAB3</option>
                        <option value="CLAB4">CLAB4</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="applicationRestriction">
                        Restriction
                    </label>

                    <select
                        id="applicationRestriction"
                        class="text-input"
                        required
                    >
                        <option value="Blocked">Blocked</option>
                        <option value="Restricted">Restricted</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="applicationStatus">
                        Status
                    </label>

                    <select
                        id="applicationStatus"
                        class="text-input"
                        required
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

            </div>

            <div class="modal-footer">

                <button
                    type="button"
                    class="btn-secondary"
                    onclick="closeApplicationModal()">
                    Cancel
                </button>

                <button
                    type="submit"
                    class="btn-primary"
                    id="applicationSaveBtn">
                    <i class="fa-solid fa-plus"></i>
                    Add Application
                </button>

            </div>

        </form>

    </div>

</div>


    <!-- ================================================= -->
    <!-- BLOCKED APPLICATIONS -->
    <!-- ================================================= -->

    <div class="card application-card">

      <div class="card-head">

        <div>
          <h3>
            <i class="fa-solid fa-ban"></i>
            Blocked Applications
          </h3>

          <p class="card-subtitle">
            Applications restricted in the laboratories
          </p>
        </div>

        <button type="button" class="btn-primary" onclick="openApplicationModal()">
            <i class="fa-solid fa-plus"></i>
            Add Application
        </button>

      </div>

      <div class="table-wrapper">

        <table class="application-table">

          <thead>
            <tr>
              <th>APPLICATION</th>
              <th>SCOPE</th>
              <th>RESTRICTION</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>



          <tbody id="applicationTableBody">
                <tbody id="applicationTableBody"></tbody>
            </tbody>
        </table>

      </div>

    </div>


    <!-- ================================================= -->
    <!-- RECENT APPLICATION ACTIVITY -->
    <!-- ================================================= -->

    <div class="section-card application-activity-card">

    <div class="section-header">
        <div>
            <h2>
                <i class="fa-regular fa-clock"></i>
                Recent Application Activity
            </h2>

            <p>
                Recent application activity across this laboratory
            </p>
        </div>

        <div class="activity-header-actions">

            <button
                type="button"
                class="btn-secondary"
                onclick="loadApplicationActivities()">

                <i class="fa-solid fa-rotate"></i>
                Refresh
            </button>

            <button
                type="button"
                class="btn-primary"
                onclick="exportApplicationActivities()">

                <i class="fa-solid fa-download"></i>
                Export
            </button>

        </div>
    </div>


    <!-- FILTERS -->

    <div class="activity-filters">

        <div class="activity-search">

            <i class="fa-solid fa-magnifying-glass"></i>

            <input
                type="text"
                id="activitySearch"
                class="text-input"
                placeholder="Search PC, student, or application..."
                oninput="filterApplicationActivities()">

        </div>


        <select
            id="activityLabFilter"
            class="text-input"
            onchange="filterApplicationActivities()">

            <option value="all">
                All Laboratories
            </option>

            <option value="CLAB1">CLAB1</option>
            <option value="CLAB2">CLAB2</option>
            <option value="CLAB3">CLAB3</option>
            <option value="CLAB4">CLAB4</option>

        </select>


        <select
            id="activityApplicationFilter"
            class="text-input"
            onchange="filterApplicationActivities()">

            <option value="all">
                All Applications
            </option>

        </select>


        <select
            id="activityStatusFilter"
            class="text-input"
            onchange="filterApplicationActivities()">

            <option value="all">
                All Status
            </option>

            <option value="Allowed">
                Allowed
            </option>

            <option value="Violation">
                Violation
            </option>

        </select>

    </div>


    <!-- TABLE -->

    <div class="table-container">

        <table class="data-table">

            <thead>
                <tr>

                    <th>TIME</th>
                    <th>PC</th>
                    <th>STUDENT</th>
                    <th>APPLICATION</th>
                    <th>ACTION</th>
                    <th>STATUS</th>

                </tr>
            </thead>

            <tbody id="applicationActivityTableBody">

                <tr>
                    <td
                        colspan="6"
                        style="text-align:center; padding:30px;">

                        <i class="fa-solid fa-spinner fa-spin"></i>
                        Loading activity...

                    </td>
                </tr>

            </tbody>

        </table>

    </div>

</div>




<div id="activityDetailsModal" class="modal-overlay">

    <div class="modal-card activity-details-card">

        <div class="modal-header">

            <div>
                <h2>Application Activity</h2>
                <p>Activity details</p>
            </div>

            <button
                type="button"
                class="modal-close"
                onclick="closeActivityDetails()">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>


        <div class="activity-details">

            <div class="activity-detail-item">
                <span>Time</span>
                <strong id="detailActivityTime">—</strong>
            </div>

            <div class="activity-detail-item">
                <span>Computer</span>
                <strong id="detailActivityPc">—</strong>
            </div>

            <div class="activity-detail-item">
                <span>Student</span>
                <strong id="detailActivityStudent">—</strong>
            </div>

            <div class="activity-detail-item">
                <span>Laboratory</span>
                <strong id="detailActivityLab">—</strong>
            </div>

            <div class="activity-detail-item">
                <span>Application</span>
                <strong id="detailActivityApplication">—</strong>
            </div>

            <div class="activity-detail-item">
                <span>Action</span>
                <strong id="detailActivityAction">—</strong>
            </div>

            <div class="activity-detail-item">
                <span>Status</span>
                <strong id="detailActivityStatus">—</strong>
            </div>

            <div class="activity-detail-reason">

                <span>Reason</span>

                <p id="detailActivityReason">
                    —
                </p>

            </div>

        </div>


        <div class="modal-footer">

            <button
                type="button"
                class="btn-secondary"
                onclick="closeActivityDetails()">

                Close

            </button>

        </div>

    </div>

</div>




<!-- ACTION CONFIRMATION MODAL -->
<div id="actionConfirmModal" class="modal-overlay">

    <div class="action-confirm-card">

        <div class="action-confirm-icon">
            <i class="fa-solid fa-circle-exclamation"></i>
        </div>

        <h2 id="actionConfirmTitle">
            Confirm Action
        </h2>

        <p id="actionConfirmMessage">
            Are you sure you want to continue?
        </p>

        <div class="action-confirm-actions">

            <button
                type="button"
                class="action-cancel-btn"
                onclick="closeActionConfirm()">
                Cancel
            </button>

            <button
                type="button"
                id="actionConfirmButton"
                class="action-confirm-btn"
                onclick="confirmAction()">
                Confirm
            </button>

        </div>

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
    computers: "{{ url('/admin/computers') }}",
    attendance: "{{ url('/admin/attendance') }}",
    violations: "{{ url('/admin/violations') }}",
    reports: "{{ route('admin.reports') }}",
    announcement: "{{ url('/admin/announcements') }}",
    settings: "{{ url('/admin/settings') }}",
    logout: "{{ route('admin.logout') }}"
};

    window.computers = @json($computers ?? []);

    window.computerStudents = @json($students ?? []);
</script>

<script src="{{ asset('js/GlobalAdminProfile.js') }}"></script>
<script src="{{ asset('js/AdminComputerManagement.js') }}"></script>

</body>
</html>