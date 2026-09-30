<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>LABTRACK — Settings</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
    >

    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    >

    <!-- EXISTING DASHBOARD CSS -->
    <link
        rel="stylesheet"
        href="{{ asset('css copy/AdminDashboardFinal.css') }}"
    >

    <!-- SETTINGS CSS -->
    <link
        rel="stylesheet"
        href="{{ asset('css copy/AdminSetting.css') }}"
    >
</head>

<body>

<div class="app">

    <!-- ===================================================== -->
    <!-- SIDEBAR -->
    <!-- ===================================================== -->

    <aside class="sidebar">

        <!-- LOGO -->
             <div class="brand">
                <div class="brand-badge">
                <img src="{{ asset('images/white_logo.png') }}"
                     alt="LABTRACK Logo">
            </div>

            <h1>LABTRACK</h1>

            <p>
                Computer Laboratory Monitoring System
            </p>

        </div>


        <!-- NAVIGATION -->
        <nav class="sidebar-nav">

            <!-- MAIN -->
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

          
    <!-- ACCOUNT -->
    <div class="nav-label">
        ACCOUNT
    </div>

    <div>

        <button class="nav-item active"
                onclick="window.location.href='{{ route('admin.settings') }}'">
            <i class="fa-solid fa-gear"></i>
            Setting
        </button>

        <button class="nav-item"
        type="button"
        onclick="openLogout()">

    <i class="fa-solid fa-right-from-bracket"></i>

    Logout

</button>

    </div>

        </nav>

    </aside>


    <!-- ===================================================== -->
    <!-- MAIN -->
    <!-- ===================================================== -->

    <div class="main">


        <!-- ================================================= -->
        <!-- TOPBAR -->
        <!-- ================================================= -->

        <header class="topbar">

            <!-- LEFT -->
            <div class="topbar-left">
                <button class="hamburger" id="hamburgerBtn" type="button"> <i class="fa-solid fa-bars"></i> </button>
                <h2>
                    Settings
                </h2>

            </div>


            <!-- RIGHT -->
            <div class="topbar-right">


                <!-- SEARCH -->
                <div class="search-box">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <input type="text"
                           placeholder="Search students, PCs, logs..."
                           id="globalSearch">

                </div>


               <!-- NOTIFICATION -->
<div class="notif-wrap" id="notifWrap">

    <button type="button"
            class="bell"
            id="notificationBtn">

        <i class="fa-regular fa-bell"></i>

        <span
                class="dot"
                id="bellDot"
                style="display:none;"
            >
                0
            </span>
    </button>

    <div class="notif-menu" id="notifMenu">

    <div class="notif-menu-title">

        <span>
            Notifications
        </span>

        <div style="display:flex; gap:12px; align-items:center;">

            <button
                type="button"
                id="markNotificationsRead"
                class="notification-read-btn"
            >
                Mark all as read
            </button>

            <span
                class="link"
                onclick="goTo('violations')"
            >
                View All
            </span>

        </div>

    </div>


    <div id="notificationList">

        <div class="notification-empty">
            Loading notifications...
        </div>

    </div>

</div>

</div>


<!-- ADMIN PROFILE -->
<div class="profile">

    <button type="button"
            class="profile-trigger"
            id="profileTrigger">

        <div class="avatar">
            {{ strtoupper(substr($admin->name, 0, 2)) }}
        </div>

        <div class="profile-name">

            <div class="name">
                {{ $admin->name }}
            </div>

            <div class="role">
                Laboratory Administrator
            </div>

        </div>

        <i class="fa-solid fa-chevron-down chev"></i>

    </button>


    <!-- PROFILE DROPDOWN -->
    <div class="profile-menu"
         id="profileDropdown">

        <div class="profile-menu-header">

            <div class="avatar">
                {{ strtoupper(substr($admin->name, 0, 2)) }}
            </div>

            <div>

                <div class="name">
                    {{ $admin->name }}
                </div>

                <div class="sub">
                    ID: {{ $admin->admin_id }}
                </div>

            </div>

        </div>


        <button type="button"
                class="profile-menu-item"
                onclick="window.location.href='{{ route('admin.settings') }}'">

            <i class="fa-regular fa-user"></i>

            My Profile

        </button>


        <button type="button"
                class="profile-menu-item"
                onclick="window.location.href='{{ route('admin.settings') }}'">

            <i class="fa-solid fa-gear"></i>

            Settings

        </button>

            <button type="button"
                    class="profile-menu-item"
                    onclick="window.location.href='{{ route('admin.violations') }}'">

                <i class="fa-regular fa-bell"></i>

                Notifications

            </button>


        <div class="profile-menu-divider"></div>


       <button type="button"
        class="profile-menu-item danger"
        onclick="openLogout()">
        <i class="fa-solid fa-right-from-bracket"></i>
        Logout
        </button>

    </div>

</div>
                

        </header>


        <!-- ================================================= -->
        <!-- CONTENT -->
        <!-- ================================================= -->

        <main class="content">


            <!-- PAGE TITLE -->
            <div class="page-title">

                <h1>
                    Settings
                </h1>

            </div>

<!-- ================================================= -->
<!-- ADMINISTRATOR PROFILE -->
<!-- ================================================= -->
<section class="card profile-card administrator-profile-card">

    <div class="card-header">
        <div>
            <h2>Administrator Profile</h2>
            <p>Manage your administrator account information.</p>
        </div>

        <button type="button" class="edit-profile-btn" id="editProfileBtn">
            <i class="fa-solid fa-pen"></i>
            Edit Profile
        </button>
    </div>

    <div class="info-grid">

    <div class="info-field">

        <label>FULL NAME</label>

        <div class="profile-display" id="displayName">
            {{ $admin->name }}
        </div>

        <input
            type="text"
            id="editName"
            class="profile-edit-input"
            value="{{ $admin->name }}"
            style="display:none;"
        >

    </div>


    <div class="info-field">

        <label>ROLE</label>

        <div class="profile-display" id="displayRole">
            {{ $admin->role ?? 'Laboratory Administrator' }}
        </div>

        <input
            type="text"
            id="editRole"
            class="profile-edit-input"
            value="{{ $admin->role ?? 'Laboratory Administrator' }}"
            style="display:none;"
        >

    </div>


    <div class="info-field">

        <label>EMAIL ADDRESS</label>

        <div class="profile-display" id="displayEmail">
            {{ $admin->email }}
        </div>

        <input
            type="email"
            id="editEmail"
            class="profile-edit-input"
            value="{{ $admin->email }}"
            style="display:none;"
        >

    </div>


    <div class="info-field">

        <label>ASSIGNED LABORATORIES</label>

        <div class="profile-display" id="displayLabs">
            {{ $admin->assigned_laboratories ?? 'CLAB1, CLAB2, CLAB3, CLAB4' }}
        </div>

        <input
            type="text"
            id="editLabs"
            class="profile-edit-input"
            value="{{ $admin->assigned_laboratories ?? 'CLAB1, CLAB2, CLAB3, CLAB4' }}"
            style="display:none;"
        >

    </div>

</div>


    {{-- BUTTONS --}}
    <div class="profile-actions" id="profileActions" style="display:none;">

        <button
            type="button"
            class="cancel-profile-btn"
            id="cancelProfileBtn"
        >
            Cancel
        </button>

        <button
            type="button"
            class="save-profile-btn"
            id="saveProfileBtn"
        >
            <i class="fa-solid fa-check"></i>
            Save Profile
        </button>

    </div>

</section>


            <!-- ================================================= -->
            <!-- NOTIFICATION PREFERENCES -->
            <!-- ================================================= -->
<section class="card">

    <div class="card-head">
        <h3>Notification Preferences</h3>
    </div>


    <!-- VIOLATION ALERTS -->
    <div class="notification-row">

    <div class="notification-info">
        <div class="notification-title">
            Violation alerts
        </div>

        <div class="notification-description">
            Get notified the moment a rule violation is detected.
        </div>
    </div>

    <label class="switch">
        <input
            type="checkbox"
            id="violationAlerts"
            {{ ($admin->notification_preferences['violation_alerts'] ?? true) ? 'checked' : '' }}
        >

        <span class="slider"></span>
    </label>

</div>


    <!-- PC OFFLINE -->
    <div class="notification-row">

    <div class="notification-info">
        <div class="notification-title">
            PC offline alerts
        </div>

        <div class="notification-description">
            Notify when a lab computer disconnects unexpectedly.
        </div>
    </div>

    <label class="switch">
        <input
            type="checkbox"
            id="pcOfflineAlerts"
            {{ ($admin->notification_preferences['pc_offline_alerts'] ?? true) ? 'checked' : '' }}
        >

        <span class="slider"></span>
    </label>

</div>


    <!-- ATTENDANCE -->
   <div class="notification-row">

    <div class="notification-info">
        <div class="notification-title">
            Daily attendance summary
        </div>

        <div class="notification-description">
            Receive a daily digest of attendance across all labs.
        </div>
    </div>

    <label class="switch">
        <input
            type="checkbox"
            id="dailyAttendanceSummary"
            {{ ($admin->notification_preferences['daily_attendance_summary'] ?? true) ? 'checked' : '' }}
        >

        <span class="slider"></span>
    </label>

</div>


    <!-- EMAIL -->
    <div class="notification-row">

    <div class="notification-info">
        <div class="notification-title">
            Email notifications
        </div>

        <div class="notification-description">
            Also receive these updates by email.
        </div>
    </div>

    <label class="switch">
        <input
            type="checkbox"
            id="emailNotifications"
            {{ ($admin->notification_preferences['email_notifications'] ?? false) ? 'checked' : '' }}
        >

        <span class="slider"></span>
    </label>

</div>

</section>

<!-- ================================================= -->
<!-- CHANGE PASSWORD -->
<!-- ================================================= -->
<section class="card change-password-card">

    <h2>Change Password</h2>

    <form id="passwordForm"
          action="{{ route('admin.settings.password.update') }}"
          method="POST">

        @csrf
        @method('PUT')

        <!-- CURRENT PASSWORD -->
        <div class="password-group password-full">

            <label>Current Password</label>

            <div class="password-input-wrapper">

                <input type="password"
                       name="current_password"
                       id="currentPassword"
                       required>

                <button type="button"
                        class="password-toggle"
                        data-target="currentPassword">

                    <i class="fa-regular fa-eye"></i>

                </button>

            </div>

        </div>


        <!-- NEW + CONFIRM -->
        <div class="password-row">

            <!-- NEW PASSWORD -->
            <div class="password-group">

                <label>New Password</label>

                <div class="password-input-wrapper">

                    <input type="password"
                           name="new_password"
                           id="newPassword"
                           required>

                    <button type="button"
                            class="password-toggle"
                            data-target="newPassword">

                        <i class="fa-regular fa-eye"></i>

                    </button>

                </div>

            </div>


            <!-- CONFIRM PASSWORD -->
            <div class="password-group">

                <label>Confirm New Password</label>

                <div class="password-input-wrapper">

                    <input type="password"
                           name="new_password_confirmation"
                           id="confirmPassword"
                           required>

                    <button type="button"
                            class="password-toggle"
                            data-target="confirmPassword">

                        <i class="fa-regular fa-eye"></i>

                    </button>

                </div>

            </div>

        </div>


        <!-- SAVE -->
        <button type="submit" class="save-password-btn">
            Save Changes
        </button>

    </form>

</section>

<!-- =====================================================
     LOGOUT MODAL
===================================================== -->

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


<!-- LOGOUT FORM -->
<form
    id="logoutForm"
    action="{{ route('admin.logout') }}"
    method="POST"
    style="display:none;"
>
    @csrf
</form>


<!-- ===================================================== -->
<!-- JAVASCRIPT ROUTES -->
<!-- ===================================================== -->

<script>
window.adminRoutes = {

    dashboard: "{{ route('admin.dashboard') }}",

    subjects: "{{ route('admin.subjects.page') }}",

    schedules: "{{ route('admin.schedules') }}",

    computers: "{{ route('admin.computers') }}",

    attendance: "{{ route('admin.attendance') }}",

    violations: "{{ route('admin.violations') }}",

    reports: "{{ route('admin.reports') }}",

    announcements: "{{ route('admin.announcements') }}",

    settings: "{{ route('admin.settings') }}",

    profileUpdate: "{{ route('admin.settings.profile.update') }}",

    passwordUpdate: "{{ route('admin.settings.password.update') }}"

};
</script>


<script src="{{ asset('js/AdminSetting.js') }}"></script>

</body>

</html>