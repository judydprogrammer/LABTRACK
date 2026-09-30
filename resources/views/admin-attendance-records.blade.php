<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>LABTRACK — Attendance Records</title>

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
        href="{{ asset('css copy/AdminAttendanceManagement.css') }}"
    >
</head>

<body>

<div class="app">

    <!-- =====================================================
         SIDEBAR
    ===================================================== -->

    <aside class="sidebar">

        <div class="brand">

            <div class="brand-badge">
                <img
                    src="{{ asset('images/white_logo.png') }}"
                    alt="LABTRACK Logo"
                >
            </div>

            <h1>LABTRACK</h1>

            <p>
                Computer Laboratory Monitoring<br>
                System
            </p>

        </div>


        <div class="navigation">

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
                class="nav-item active"
                data-page="attendance"
                onclick="window.location.href='{{ route('admin.attendance') }}'"
            >
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


            <!-- ANNOUNCEMENT -->
            <button class="nav-item" data-page="announcement"
                        onclick="window.location.href='{{ route('admin.announcements') }}'">
                    <i class="fa-solid fa-bullhorn"></i>
                    Announcement
                </button>

        </div>


        <div class="nav-label">
            ACCOUNT
        </div>


        <div>

            <!-- SETTINGS -->
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
    ===================================================== -->

    <div class="main">


        <!-- =================================================
             TOPBAR
        ================================================= -->

        <header class="topbar">

            <div class="topbar-left">

                <button class="hamburger" id="hamburgerBtn" type="button"> <i class="fa-solid fa-bars"></i> </button>

                <h2 id="pageTitle">
                    Attendance Records
                </h2>

            </div>


            <div class="topbar-right">


                <!-- SEARCH -->

                <div class="search-box">
                    <i class="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        id="globalAttendanceSearch"
                        placeholder="Search student..."
                        autocomplete="off"
                    >
                </div>

                <!-- NOTIFICATIONS -->

                <div
                    class="notif-wrap"
                    id="notifWrap"
                >

                    <button
                        class="bell"
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
                                onclick="goTo('violations')"
                            >
                                View All
                            </span>

                        </div>


                        <div
                            class="notif-row unread"
                            onclick="goTo('violations')"
                        >

                            <div
                                class="dot-icon"
                                style="background:var(--red-soft);color:var(--red);"
                            >
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


                        <div
                            class="notif-row unread"
                            onclick="goTo('computers')"
                        >

                            <div
                                class="dot-icon"
                                style="background:var(--orange-soft);color:var(--orange);"
                            >

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


                        <div
                            class="notif-row unread"
                            onclick="goTo('reports')"
                        >

                            <div
                                class="dot-icon"
                                style="background:var(--blue-soft);color:var(--blue);"
                            >

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


                <!-- PROFILE -->

                <div
                    class="profile"
                    id="profileMenu"
                >

                    <button
                        class="profile-trigger"
                        onclick="toggleProfile(event)"
                    >

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

            </div>

        </header>


        <!-- =================================================
             PAGE CONTENT
        ================================================= -->

        <main class="content">


            <!-- PAGE HEADER -->

            <div class="page-header">

                <div>

                    <h1>
                        Attendance Records
                    </h1>

                    <p>
                        Track daily student attendance across all subjects.
                    </p>

                </div>

            </div>


<!-- =================================================
     ATTENDANCE OVERVIEW
================================================= -->

<section class="attendance-overview">

    <!-- TOP ROW -->

    <div class="overview-top">

        <div class="overview-title">

            <h2 id="attendanceDateTitle">
                Today · {{ now()->format('F j, Y') }}
            </h2>

        </div>


        <!-- DATE + SUBJECT -->

        <div class="attendance-controls">

            <div class="date-control">

                <input
                    type="date"
                    id="attendanceDate"
                    value="{{ now()->format('Y-m-d') }}"
                >

                

            </div>


            <div class="subject-control">

                <select id="subjectFilter">

                    <option value="all">
                        All Subjects
                    </option>

                </select>

            </div>

        </div>

    </div>


    <!-- =================================================
         SUMMARY CARDS
    ================================================= -->

    <div class="attendance-summary">


        <!-- TOTAL -->

        <div class="summary-box">

            <div class="summary-icon total-icon">

                <i class="fa-solid fa-users"></i>

            </div>

            <div class="summary-info">

                <span>
                    Total
                </span>

                <strong id="totalCount">
                    0
                </strong>

            </div>

        </div>


        <!-- PRESENT -->

        <div class="summary-box">

            <div class="summary-icon present-icon">

                <i class="fa-solid fa-circle-check"></i>

            </div>

            <div class="summary-info">

                <span>
                    Present
                </span>

                <strong id="presentCount">
                    0
                </strong>

            </div>

        </div>


        <!-- LATE -->

        <div class="summary-box">

            <div class="summary-icon late-icon">

                <i class="fa-solid fa-clock"></i>

            </div>

            <div class="summary-info">

                <span>
                    Late
                </span>

                <strong id="lateCount">
                    0
                </strong>

            </div>

        </div>


        <!-- ABSENT -->

        <div class="summary-box">

            <div class="summary-icon absent-icon">

                <i class="fa-solid fa-circle-xmark"></i>

            </div>

            <div class="summary-info">

                <span>
                    Absent
                </span>

                <strong id="absentCount">
                    0
                </strong>

            </div>

        </div>


    </div>

</section>


<!-- =================================================
     ATTENDANCE RATE
================================================= -->

<div class="attendance-rate">

    <div class="attendance-rate-label">

        <span>
            Attendance Rate
        </span>

        <strong id="attendanceRate">
            0%
        </strong>

    </div>


    <div class="attendance-rate-bar">

        <div
            class="attendance-rate-fill"
            id="attendanceRateFill"
        ></div>

    </div>

</div>


            <!-- =================================================
                 DAILY ATTENDANCE RECORDS
            ================================================= -->

            <section class="attendance-records-card">


                <!-- RECORD HEADER -->

                <div class="records-header">

                    <div>
                        <h2>
                            <i class="fa-solid fa-clipboard-check"></i>
                            Daily Attendance
                        </h2>

                        <p>
                            Attendance records for selected date
                        </p>

                    </div>


                    <div class="record-count">

                        <strong id="recordCount">
                            0
                        </strong>

                        Records

                    </div>

                </div>


                <div class="attendance-actions">

                    <button
                        type="button"
                        class="attendance-action-btn"
                        onclick="refreshAttendance()"
                    >
                        <i class="fa-solid fa-rotate"></i>
                        Refresh
                    </button>


                    <div class="export-wrapper">

                        <button
                            type="button"
                            class="attendance-action-btn primary"
                            onclick="toggleExportMenu()"
                        >
                            <i class="fa-solid fa-download"></i>
                            Export
                            <i class="fa-solid fa-chevron-down export-chevron"></i>
                        </button>


                        <div
                            class="export-menu"
                            id="exportMenu"
                        >

                            <div class="export-menu-title">
                                EXPORT ATTENDANCE
                            </div>

                            <button
                                type="button"
                                onclick="exportAttendance('csv')"
                            >
                                <i class="fa-solid fa-file-csv"></i>

                                <span>
                                    <strong>CSV</strong>
                                    <small>Download spreadsheet data</small>
                                </span>
                            </button>


                            <button
                                type="button"
                                onclick="exportAttendance('print')"
                            >
                                <i class="fa-solid fa-print"></i>

                                <span>
                                    <strong>Print / PDF</strong>
                                    <small>Print attendance report</small>
                                </span>
                            </button>

                        </div>

                    </div>

                </div>


<!-- =================================================
     ATTENDANCE FILTERS
================================================= -->

<div class="attendance-filters">

    <!-- SEARCH -->

    <div class="attendance-search">

        <i class="fa-solid fa-magnifying-glass"></i>

        <input
            type="text"
            id="attendanceSearch"
            placeholder="Search student, ID, block, subject..."
            autocomplete="off"
        >

    </div>


    <!-- BLOCK FILTER -->

    <select
        id="blockFilter"
        class="attendance-filter-select"
    >

        <option value="all">
            All Blocks
        </option>

    </select>


    <!-- STATUS FILTER -->

    <select
        id="statusFilter"
        class="attendance-filter-select"
    >

        <option value="all">
            All Status
        </option>

        <option value="Present">
            Present
        </option>

        <option value="Late">
            Late
        </option>

        <option value="Absent">
            Absent
        </option>

    </select>

</div>

                <!-- =================================================
                     ATTENDANCE TABLE
                ================================================= -->

                <div class="attendance-table-container">

                    <table class="attendance-table">

                        <thead>

                            <tr>

                                <th>
                                    Student ID
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Block
                                </th>

                                <th>
                                    Subject
                                </th>

                                <th>
                                    Time In
                                </th>

                                <th>
                                    Time Out
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody id="attendanceTableBody">

                            <!--
                                Attendance records are loaded
                                from Laravel through JavaScript.
                            -->

                        </tbody>

                    </table>

                </div>


                <!-- =================================================
                     EMPTY STATE
                ================================================= -->

                <div
                    class="attendance-empty"
                    id="attendanceEmpty"
                >

                    <div class="empty-icon">

                        <i class="fa-regular fa-calendar-xmark"></i>

                    </div>

                    <h3>
                        No Attendance Records
                    </h3>

                    <p>
                        There are no attendance records for the selected date.
                    </p>

                </div>


                <!-- =================================================
                     FOOTER
                ================================================= -->

                <div class="attendance-footer">

                    Showing

                    <strong id="footerRecordCount">
                        0
                    </strong>

                    records

                </div>

            </section>

        </main>

    </div>

</div>



<!-- =====================================================
     ATTENDANCE DETAILS MODAL
===================================================== -->

<div
    id="attendanceDetailsModal"
    class="attendance-modal"
>

    <div class="attendance-modal-card">

        <div class="attendance-modal-header">

            <div>

                <h2>
                    Attendance Details
                </h2>

                <p>
                    Student attendance information
                </p>

            </div>

            <button
                type="button"
                onclick="closeAttendanceDetails()"
                class="attendance-modal-close"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

        </div>


        <div class="attendance-detail-grid">

            <div class="detail-item">
                <span>Student ID</span>
                <strong id="detailStudentId">—</strong>
            </div>

            <div class="detail-item">
                <span>Student Name</span>
                <strong id="detailStudentName">—</strong>
            </div>

            <div class="detail-item">
                <span>Block</span>
                <strong id="detailBlock">—</strong>
            </div>

            <div class="detail-item">
                <span>Subject</span>
                <strong id="detailSubject">—</strong>
            </div>

            <div class="detail-item">
                <span>Computer Used</span>
                <strong id="detailComputer">—</strong>
            </div>

            <div class="detail-item">
                <span>Date</span>
                <strong id="detailDate">—</strong>
            </div>

            <div class="detail-item">
                <span>Time In</span>
                <strong id="detailTimeIn">—</strong>
            </div>

            <div class="detail-item">
                <span>Time Out</span>
                <strong id="detailTimeOut">—</strong>
            </div>

            <div class="detail-item full">
                <span>Status</span>
                <strong id="detailStatus">—</strong>
            </div>

        </div>


        <div class="attendance-modal-footer">

            <button
                type="button"
                class="attendance-secondary-btn"
                onclick="closeAttendanceDetails()"
            >
                Close
            </button>

            <button
                type="button"
                class="attendance-edit-btn"
                onclick="editCurrentAttendance()"
            >
                <i class="fa-solid fa-pen"></i>
                Edit
            </button>

            <button
                type="button"
                class="attendance-delete-btn"
                onclick="deleteCurrentAttendance()"
            >
                <i class="fa-solid fa-trash"></i>
                Delete
            </button>

        </div>

    </div>

</div>


<!-- =====================================================
     EDIT ATTENDANCE MODAL
===================================================== -->

<div
    id="attendanceEditModal"
    class="attendance-modal"
>

    <div class="attendance-modal-card">

        <div class="attendance-modal-header">

            <div>

                <h2>
                    Edit Attendance
                </h2>

                <p>
                    Update attendance information
                </p>

            </div>

            <button
                type="button"
                onclick="closeAttendanceEdit()"
                class="attendance-modal-close"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

        </div>


        <form
            id="attendanceEditForm"
            onsubmit="saveAttendanceEdit(event)"
        >

            <div class="attendance-edit-grid">

                <div class="attendance-form-group">

                    <label>
                        Student ID
                    </label>

                    <input
                        type="text"
                        id="editStudentId"
                        required
                    >

                </div>


                <div class="attendance-form-group">

                    <label>
                        Student Name
                    </label>

                    <input
                        type="text"
                        id="editStudentName"
                        required
                    >

                </div>


                <div class="attendance-form-group">

                    <label>
                        Block
                    </label>

                    <input
                        type="text"
                        id="editBlock"
                        required
                    >

                </div>


                <div class="attendance-form-group">

                    <label>
                        Subject
                    </label>

                    <input
                        type="text"
                        id="editSubject"
                        required
                    >

                </div>


                <div class="attendance-form-group">

                    <label>
                        Computer Used
                    </label>

                    <input
                        type="text"
                        id="editComputer"
                        placeholder="e.g. PC-01"
                    >

                </div>


                <div class="attendance-form-group">

                    <label>
                        Date
                    </label>

                    <input
                        type="date"
                        id="editDate"
                        required
                    >

                </div>


                <div class="attendance-form-group">

                    <label>
                        Time In
                    </label>

                    <input
                        type="time"
                        id="editTimeIn"
                    >

                </div>


                <div class="attendance-form-group">

                    <label>
                        Time Out
                    </label>

                    <input
                        type="time"
                        id="editTimeOut"
                    >

                </div>


                <div class="attendance-form-group">

                    <label>
                        Status
                    </label>

                    <select
                        id="editStatus"
                        required
                    >

                        <option value="Present">
                            Present
                        </option>

                        <option value="Late">
                            Late
                        </option>

                        <option value="Absent">
                            Absent
                        </option>

                    </select>

                </div>

            </div>


            <div class="attendance-modal-footer">

                <button
                    type="button"
                    class="attendance-secondary-btn"
                    onclick="closeAttendanceEdit()"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="attendance-edit-btn"
                >
                    <i class="fa-solid fa-check"></i>
                    Save Changes
                </button>

            </div>

        </form>

    </div>

</div>


<!-- SAVE SUCCESS MODAL -->
<div id="saveSuccessModal" class="modal-overlay">

    <div class="save-success-card">

        <div class="save-success-icon">
            <i class="fa-solid fa-check"></i>
        </div>

        <h2>Changes Saved!</h2>

        <p id="saveSuccessMessage">
            Attendance record has been updated successfully.
        </p>

        <button
            type="button"
            class="save-success-btn"
            onclick="closeSaveSuccess()"
        >
            OK
        </button>

    </div>

</div>


<!-- =====================================================
     LOGOUT MODAL
===================================================== -->
<div class="logout-overlay" id="logoutModal">
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
                onclick="closeLogout()"
            >
                Cancel
            </button>

            <button
                type="button"
                class="logout-confirm"
                onclick="confirmLogout()"
            >
                Logout
            </button>

        </div>

    </div>
</div>


<!-- =====================================================
     LOGOUT FORM
===================================================== -->
<form
    id="logoutForm"
    action="{{ route('admin.logout') }}"
    method="POST"
    style="display: none;"
>
    @csrf
</form>

<!-- =====================================================
     JAVASCRIPT ROUTES
===================================================== -->
<script>
    window.adminRoutes = {

        dashboard:
            "{{ route('admin.dashboard') }}",

        subjects:
            "{{ route('admin.subjects.page') }}",

        schedules:
            "{{ route('admin.schedules') }}",

        computers:
            "{{ route('admin.computers') }}",

        attendance:
            "{{ route('admin.attendance') }}",

        attendanceData:
            "{{ route('admin.attendance.data') }}",

        violations:
            "{{ route('admin.violations') }}",

        reports:
            "{{ route('admin.reports') }}",

        announcement:
            "{{ route('admin.announcements') }}",

        settings:
            "{{ url('/admin/settings') }}"

    };
</script>

<script src="{{ asset('js/GlobalAdminProfile.js') }}"></script>
<script src="{{ asset('js/AdminAttendanceManagement.js') }}"></script>


</body>
</html>