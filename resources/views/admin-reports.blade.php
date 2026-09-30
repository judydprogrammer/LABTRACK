<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title> Reports </title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="{{ asset('css copy/Reports.css') }}">
</head>
<body>

<div class="app">

 <!-- ==================== SIDEBAR ==================== -->

<aside class="sidebar">

    <div class="brand">
        <div class="brand-badge">
            <img src="{{ asset('images/white_logo.png') }}" alt="LABTRACK Logo">
        </div>

        <h1>LABTRACK</h1>
        <p>Computer Laboratory Monitoring System</p>
    </div>


    <div class="navigation">

        <!-- DASHBOARD -->
        <button
            type="button"
            class="nav-item"
            onclick="window.location.href='{{ route('admin.dashboard') }}'"
        >
            <i class="fa-solid fa-table-columns"></i>
            Dashboard
        </button>


        <!-- SUBJECT MANAGEMENT -->
        <button
            type="button"
            class="nav-item"
            onclick="window.location.href='{{ route('admin.subjects.page') }}'"
        >
            <i class="fa-solid fa-book-open"></i>
            Subject Management
        </button>


        <!-- SCHEDULE MANAGEMENT -->
        <button
            type="button"
            class="nav-item"
            onclick="window.location.href='{{ route('admin.schedules') }}'"
        >
            <i class="fa-regular fa-calendar-days"></i>
            Schedule Management
        </button>


        <!-- COMPUTER MANAGEMENT -->
        <button
            type="button"
            class="nav-item"
            onclick="window.location.href='{{ route('admin.computers') }}'"
        >
            <i class="fa-solid fa-computer"></i>
            Computer Management
        </button>


        <!-- ATTENDANCE -->
        <button
            type="button"
            class="nav-item"
            onclick="window.location.href='{{ route('admin.attendance') }}'"
        >
            <i class="fa-solid fa-clipboard-check"></i>
            Attendance Records
        </button>


        <!-- VIOLATION LOGS -->
        <button class="nav-item"
            onclick="window.location.href='{{ route('admin.violations') }}'">
            <i class="fa-solid fa-triangle-exclamation"></i> 
            Violation Logs
        </button>


        <!-- REPORTS — ACTIVE -->
        <button
            type="button"
            class="nav-item active"
            onclick="window.location.href='{{ route('admin.reports') }}'"
        >
            <i class="fa-solid fa-chart-column"></i>
            Reports
        </button>


        <!-- ANNOUNCEMENT -->
        <button
            type="button"
            class="nav-item"
            onclick="window.location.href='{{ route('admin.announcements') }}'"
        >
            <i class="fa-solid fa-bullhorn"></i>
            Announcement
        </button>

    </div>


    <!-- ACCOUNT -->
    <div class="nav-label">
        ACCOUNT
    </div>

    <div>

        <!-- SETTING -->
        <button
            type="button"
            class="nav-item"
            onclick="window.location.href='{{ route('admin.settings') }}'"
        >
            <i class="fa-solid fa-gear"></i>
            Setting
        </button>


        <!-- LOGOUT -->
        <a href="javascript:void(0);"
            class="sidebar-item logout-sidebar-item"
            onclick="openLogout()">

                <i class="fa-solid fa-right-from-bracket"></i>

                <span>Logout</span>

            </a>

    </div>
<div class="logout-overlay" id="logoutModal" style="display:none;">

    <div class="logout-modal">

        <div class="logout-icon">
            <i class="fa-solid fa-right-from-bracket"></i>
        </div>

        <h2>Log out of LABTRACK?</h2>

        <p>
            You'll need to sign in again to access the
            administrator dashboard and lab controls.
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
</aside>

  <!-- MAIN -->
  <div class="main">

    <header class="topbar">
      <div class="topbar-left">
<button class="hamburger" id="hamburgerBtn" type="button"> <i class="fa-solid fa-bars"></i> </button>
        <!-- Fixed Title to Reports -->
        <h2 id="pageTitle">Reports</h2>
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

        <!-- NOTIFICATIONS -->
<div class="notif-wrap" id="notifWrap">

    <button class="bell" onclick="toggleNotif(event)">
        <i class="fa-regular fa-bell"></i>
        <span class="dot" id="bellDot" style="display:none;">0</span>
    </button>

    <div class="notif-menu">

        <div class="notif-menu-title">
            <span>Notifications</span>

            <span
                class="link"
                onclick="viewAllNotifications(event)"
            >
                View All
            </span>
        </div>

        <!-- REALTIME NOTIFICATIONS WILL APPEAR HERE -->
        <div id="notificationList">

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

      <!-- ============ REPORTS ============ -->
     <section class="page active" id="page-reports">
        <div class="page-header">
          <div>
            <h1>Reports</h1>
            <p>Generate and download reports for attendance, violations, and usage.</p>
          </div>
        </div>

        <div class="grid-2">
          <!-- Left Column Card -->
          <div class="card">
            <div class="card-head">
              <h3>Generate a Report</h3>
            </div>
            
            <div class="form-field">
              <label>Report Type</label>
              <select id="reportType" class="text-input">

                    <option value="Attendance Summary">
                        Attendance Summary
                    </option>

                    <option value="Violation Log Summary">
                        Violation Log Summary
                    </option>

                    <option value="Computer Usage Summary">
                        Computer Usage Summary
                    </option>

                    <option value="Subject Performance Summary">
                        Subject Performance Summary
                    </option>

                </select>
            </div>

            <div class="form-row">
              <div class="form-field">
                    <label>From</label>
                    <input
                        type="date"
                        class="text-input"
                        id="reportFrom"
                        value="2026-01-01"
                    >
                </div>

                <div class="form-field">
                    <label>To</label>
                    <input
                        type="date"
                        class="text-input"
                        id="reportTo"
                        value="2026-12-31"
                    >
                </div>
            </div>

            <div class="form-field">
              <label>Format</label>
              <select id="reportFormat" class="text-input">
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                    <option value="excel">Excel</option>
                </select>
            </div>

            <button class="btn-primary" onclick="generateReport()">
              <i class="fa-solid fa-file-arrow-down"></i> Generate Report
            </button>
          </div>

          <!-- Right Column Card -->
          <div class="card">
            <div class="recent-reports-head">
    <div>
        <h3>Recent Reports</h3>
    </div>

    <div class="recent-report-actions">

        <button
            type="button"
            class="recent-report-btn"
            onclick="refreshReportHistory()"
            title="Refresh Reports">

            <i class="fa-solid fa-rotate"></i>
            Refresh

        </button>

        <button
            type="button"
            class="recent-report-btn danger"
            onclick="deleteSelectedReport()"
            title="Delete Selected Report">

            <i class="fa-solid fa-trash"></i>
            Delete

        </button>

    </div>
</div>
            <div id="reportHistoryList" class="report-list">
              
              <div class="report-item">
                <div class="report-icon pdf-icon">
                  <i class="fa-solid fa-file-pdf"></i>
                </div>
                <div class="report-details">
                  <h4>Attendance Summary — Aug 4–10</h4>
                  <p>Generated Aug 11, 2026</p>
                </div>
                <button class="btn-icon"><i class="fa-solid fa-download"></i></button>
              </div>

              <div class="report-item">
                <div class="report-icon csv-icon">
                  <i class="fa-solid fa-file-csv"></i>
                </div>
                <div class="report-details">
                  <h4>Violation Log Summary — July</h4>
                  <p>Generated Aug 1, 2026</p>
                </div>
                <button class="btn-icon"><i class="fa-solid fa-download"></i></button>
              </div>

              <div class="report-item">
                <div class="report-icon excel-icon">
                  <i class="fa-solid fa-file-excel"></i>
                </div>
                <div class="report-details">
                  <h4>Computer Usage — Q3</h4>
                  <p>Generated Jul 20, 2026</p>
                </div>
                <button class="btn-icon"><i class="fa-solid fa-download"></i></button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</div>


<div
    id="deleteReportModal"
    class="report-delete-modal">

    <div class="report-delete-card">

        <div class="report-delete-icon">
            <i class="fa-solid fa-trash"></i>
        </div>

        <h2>
            Delete Report?
        </h2>

        <p id="deleteReportMessage">
            Are you sure you want to delete this report?
        </p>

        <div class="report-delete-actions">

            <button
                type="button"
                class="report-delete-cancel"
                onclick="closeDeleteReportModal()">

                Cancel

            </button>

            <button
                type="button"
                class="report-delete-confirm"
                onclick="confirmDeleteReport()">

                <i class="fa-solid fa-trash"></i>
                Delete

            </button>

        </div>

    </div>

</div>

<!-- ================= REPORT PREVIEW MODAL ================= -->
<div id="reportPreviewModal" class="report-preview-overlay">
    <div class="report-preview-card">

        <div class="report-preview-header">
            <div>
                <h2 id="previewReportTitle">Attendance Summary</h2>
                <p id="previewReportSubtitle">
                    Generated from Laravel database
                </p>
            </div>

            <button type="button"
                    class="report-close-btn"
                    onclick="closeReportPreview()">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <div class="report-preview-body">

            <!-- SUMMARY -->
            <div class="report-summary-grid" id="reportSummaryGrid">
            </div>

            <!-- RECORDS -->
            <div class="report-table-wrapper">
                <table class="report-preview-table">
                    <thead id="reportPreviewHead">
                    </thead>

                    <tbody id="reportPreviewBody">
                    </tbody>
                </table>
            </div>

        </div>

        <div class="report-preview-footer">
            <button type="button"
                    class="report-modal-btn secondary"
                    onclick="closeReportPreview()">
                <i class="fa-solid fa-xmark"></i>
                Close
            </button>

            <button type="button"
                    class="report-modal-btn primary"
                    onclick="downloadGeneratedReport()">
                <i class="fa-solid fa-download"></i>
                Download Report
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

<!-- DOWNLOAD REPORT CONFIRMATION MODAL -->
<div class="download-confirm-overlay" id="downloadConfirmModal">
    <div class="download-confirm-modal">

        <button
            type="button"
            class="download-confirm-close"
            onclick="closeDownloadConfirm()"
            aria-label="Close"
        >
            <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="download-confirm-icon">
            <i class="fa-solid fa-file-arrow-down"></i>
        </div>

        <h2>Download Report?</h2>

        <p class="download-confirm-message">
            Are you sure you want to download this report?
        </p>

        <div class="download-confirm-details">

            <div class="download-confirm-row">
                <i class="fa-solid fa-file-lines"></i>

                <div>
                    <span>Report</span>
                    <strong id="downloadConfirmName">
                        Report
                    </strong>
                </div>
            </div>

            <div class="download-confirm-row">
                <i class="fa-regular fa-calendar"></i>

                <div>
                    <span>Generated</span>
                    <strong id="downloadConfirmDate">
                        —
                    </strong>
                </div>
            </div>

        </div>

        <div class="download-confirm-actions">

            <button
                type="button"
                class="download-confirm-cancel"
                onclick="closeDownloadConfirm()"
            >
                Cancel
            </button>

            <button
                type="button"
                class="download-confirm-download"
                id="confirmDownloadBtn"
            >
                <i class="fa-solid fa-download"></i>
                Download
            </button>

        </div>

    </div>
</div>

<meta name="csrf-token" content="{{ csrf_token() }}">

 <form
    id="logoutForm"
    action="{{ route('admin.logout') }}"
    method="POST"
    style="display: none;"
>
    @csrf
</form>

<script>
    window.adminRoutes = {
        dashboard: "{{ route('admin.dashboard') }}",
        subjects: "{{ route('admin.subjects.page') }}",
        schedules: "{{ route('admin.schedules') }}",
        computers: "{{ route('admin.computers') }}",
        attendance: "{{ route('admin.attendance') }}",
        violations: "{{ route('admin.violations') }}",
        reports: "{{ route('admin.reports') }}",

        reportsData: "{{ route('admin.reports.data') }}",
        reportsHistory: "{{ route('admin.reports.history') }}",
        reportsStore: "{{ route('admin.reports.store') }}",
        reportsDelete: "{{ route('admin.reports.destroy', ['id' => '__ID__']) }}",

        settings: "{{ route('admin.settings') }}",

        globalSearch: "{{ route('admin.global.search') }}",

        logout: "{{ route('admin.logout') }}"
    };
</script>



<script src="{{ asset('js/GlobalAdminProfile.js') }}"></script>
<script src="{{ asset('js/Reports.js') }}"></script>

</body>
</html>