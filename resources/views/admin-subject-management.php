<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="csrf-token" content="{{ csrf_token() }}">
    <title>LABSTRACK — Subject Management</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" type="text/css" href="/css%20copy/AdminSubjectsManagement.css">
</head>

<body>
<div class="app">

    <!-- SIDEBAR -->
    <aside class="sidebar">
        <div class="brand">
            <div class="brand-badge">
                <img src="/images/white_logo.png" alt="Logo">
            </div>
            <h1>LABTRACK</h1>
            <p>Computer Laboratory Monitoring System</p>
        </div>

        <div>
            <button class="nav-item"
                    type="button"
                    onclick="window.location.href='/admin/dashboard'">
                <i class="fa-solid fa-table-columns"></i>
                Dashboard
            </button>
            <button class="nav-item active" data-page="subjects" onclick="goTo('subjects')"> <i class="fa-solid fa-book-open"></i> Subject Management </button>
            <button class="nav-item"
                    type="button"
                    onclick="window.location.href='/admin/schedules'">
                <i class="fa-regular fa-calendar-days"></i>
                Schedule Management
            </button>
            

            <button class="nav-item"
                    type="button"
                    onclick="window.location.href='/admin/computers'">
                <i class="fa-solid fa-computer"></i>
                Computer Management
            </button>


            <button class="nav-item"
                    type="button"
                    onclick="window.location.href='/admin/attendance'">
                <i class="fa-solid fa-clipboard-check"></i> 
                Attendance Records
            </button>


            <button class="nav-item"
                    type="button"
                    onclick="window.location.href='/admin/violations'">
                <i class="fa-solid fa-triangle-exclamation"></i> 
                Violation Logs
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

            <button class="profile-menu-item danger" onclick="openLogout()">
                <i class="fa-solid fa-right-from-bracket"></i>
                Logout
            </button>
        </div>
    </aside>
    <!-- MAIN -->
    <div class="main">

        <!-- TOPBAR -->
        <header class="topbar">
            <div class="topbar-left">
                <button class="hamburger" id="hamburgerBtn" type="button"> <i class="fa-solid fa-bars"></i> </button>
                <h2 id="pageTitle"> Dashboard </h2>
            </div>

            <div class="topbar-right">

                <!-- SEARCH -->
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
                        <span class="dot" id="bellDot">3</span>
                    </button>

                    <div class="notif-menu">
                        <div class="notif-menu-title">
                            Notifications
                            <span class="link" onclick="goTo('violations')">View All</span>
                        </div>

                        <div class="notif-row unread" onclick="goTo('violations')">
                            <div class="dot-icon" style="background:var(--red-soft); color:var(--red);">
                                <i class="fa-solid fa-ban"></i>
                            </div>
                            <div>
                                <div class="r-title">Unauthorized app blocked — PC-14, CLAB1</div>
                                <div class="r-time">8 minutes ago</div>
                            </div>
                        </div>

                        <div class="notif-row unread" onclick="goTo('computers')">
                            <div class="dot-icon" style="background:var(--orange-soft); color:var(--orange);">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <div class="r-title">PC-22 went offline unexpectedly</div>
                                <div class="r-time">22 minutes ago</div>
                            </div>
                        </div>
                        <div class="notif-row unread" onclick="goTo('reports')">
                            <div class="dot-icon" style="background:var(--blue-soft); color:var(--blue);">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <div>
                                <div class="r-title">Weekly attendance report is ready</div>
                                <div class="r-time">1 hour ago</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PROFILE -->
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

                        <button class="profile-menu-item" onclick="goTo('settings')">
                            <i class="fa-regular fa-user"></i> My Profile
                        </button>

                        <button class="profile-menu-item" onclick="goTo('settings')">
                            <i class="fa-solid fa-gear"></i> Settings
                        </button>

                        <button class="profile-menu-item" onclick="goTo('violations')">
                            <i class="fa-regular fa-bell"></i> Notifications
                        </button>

                        <div class="profile-menu-divider"></div>

                        <button class="profile-menu-item danger" onclick="openLogout()">
                            <i class="fa-solid fa-right-from-bracket"></i> Logout
                        </button>
                    </div>
                </div>

            </div>
        </header>

        <!-- CONTENT -->
        <main class="content">

            <!-- SUBJECT MANAGEMENT -->
            <section class="page active" id="page-subjects">

                <div class="page-header">
                    <div>
                        <h1>Subject Management</h1>
                        <p>Add, edit, or remove subjects offered in the laboratory program.</p>
                    </div>
                </div>

                <!-- SEMESTER + ADD SUBJECT -->
                <div class="card">
                    <div class="card-head">

                        <div class="semester-tabs">
                            <button
                                class="semester-btn active"
                                onclick="filterSubjectSemester('1st Semester', this)">
                                1st Semester
                            </button>

                            <button
                                class="semester-btn"
                                onclick="filterSubjectSemester('2nd Semester', this)">
                                2nd Semester
                            </button>
                        </div>

                        <button class="btn-primary" onclick="openSubjectModal()">
                            <i class="fa-solid fa-plus"></i>&nbsp; Add Subject
                        </button>

                    </div>
                </div>

                <!-- SUBJECT TABLE -->
                <div id="subjectTableContainer"></div>

            </section>

        </main>
                   <!-- LOGOUT MODAL -->
<div class="modal-overlay" id="logoutModal">

    <div class="modal-box">

        <div class="modal-icon">
            <i class="fa-solid fa-right-from-bracket"></i>
        </div>

        <h3>Log out of LABSTRACK?</h3>

        <p>
            You'll need to sign in again to access the administrator dashboard and lab controls.
        </p>

        <div class="modal-actions">

            <button
                type="button"
                class="btn-cancel"
                onclick="closeLogout()">
                Cancel
            </button>

            <button
                type="button"
                class="btn-danger"
                onclick="confirmLogout()">
                Logout
            </button>

        </div>

    </div>

</div>

<!-- LOGOUT FORM -->
<form id="logoutForm" action="/admin/logout" method="POST" style="display:none;">
    @csrf
</form>

        <!-- ADD / EDIT SUBJECT MODAL -->
        <div class="modal-overlay" id="subjectModal">
            <div class="modal-box subject-modal">

                <h2 id="subjectModalTitle">
                    <i class="fa-solid fa-book-open"></i>
                    Add Subject
                </h2>

                <!-- SUBJECT CODE + NAME -->
                <div class="form-row">
                    <div class="form-field">
                        <label>Subject Code</label>
                        <input
                            type="text"
                            class="text-input"
                            id="fSubjCode"
                            placeholder="e.g. ITE101">
                    </div>

                    <div class="form-field">
                        <label>Subject Name</label>
                        <input
                            type="text"
                            class="text-input"
                            id="fSubjName"
                            placeholder="e.g. Introduction to Computing">
                    </div>
                </div>

                <!-- TEACHER + COURSE -->
                <div class="form-row">
                    <div class="form-field">
                        <label>Teacher</label>
                        <input
                            type="text"
                            class="text-input"
                            id="fSubjTeacher"
                            placeholder="e.g. Juan Dela Cruz">
                    </div>

                    <div class="form-field">
                        <label>Course</label>
                        <select class="text-input" id="fSubjCourse">
                            <option value="">Select Course</option>
                            <option value="BSIT">BSIT</option>
                            <option value="BSCS">BSCS</option>
                        </select>
                    </div>
                </div>

                <!-- YEAR LEVEL + SEMESTER -->
                <div class="form-row">
                    <div class="form-field">
                        <label>Year Level</label>
                        <select class="text-input" id="fSubjYearLevel">
                            <option value="">Select Year Level</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                    </div>

                    <div class="form-field">
                        <label>Semester</label>
                        <select class="text-input" id="fSubjSemester">
                            <option value="">Select Semester</option>
                            <option value="1st Semester">1st Semester</option>
                            <option value="2nd Semester">2nd Semester</option>
                        </select>
                    </div>
                </div>

                <!-- MODAL ACTIONS -->
                <div class="modal-actions">
                    <button class="btn-cancel" onclick="closeSubjectModal()">
                        <i class="fa-solid fa-xmark"></i>
                        Cancel
                    </button>

                    <button class="btn-primary" onclick="saveSubject()">
                        <i class="fa-solid fa-plus"></i>
                        Save Subject
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="toast" id="toast">
    <i class="fa-solid fa-circle-check"></i>
    <span id="toastMessage"></span>
</div>

<form id="logoutForm"
      action="/admin/logout"
      method="POST"
      style="display:none;">

    @csrf

</form>

<script src="/js/GlobalAdminProfile.js"></script>
<script src="/js/AdminSubjectManagement.js"></script>



</body>
</html>