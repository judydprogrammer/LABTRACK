<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>LABSTRACK — Administrator Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{{ asset('css copy/AdminAnnoucement.css') }}">
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
            type="button"
            class="nav-item"
            onclick="window.location.href='{{ route('admin.dashboard') }}'"
        >
            <i class="fa-solid fa-table-columns"></i>
            Dashboard
        </button>

    
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

      <button class="nav-item"
            onclick="window.location.href='{{ route('admin.reports') }}'">
            <i class="fa-solid fa-chart-simple"></i> 
            Reports
        </button>
      <button class="nav-item  active" data-page="announcement" onclick="goTo('announcement')"><i class="fa-solid fa-bullhorn"></i> Announcement</button>
    </div>

    <div class="nav-label">ACCOUNT</div>
    <div>
      <button class="nav-item"
            onclick="window.location.href='{{ route('admin.settings') }}'">
            <i class="fa-solid fa-gear"></i> 
            Setting
        </button>
 
        <button
        type="button"
        class="nav-item logout-item"
        onclick="openLogout()"
    >
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Logout</span>
    </button>
       
    </div>
  </aside>

  <!-- MAIN -->
  <div class="main">

    <header class="topbar">
      <div class="topbar-left">
       <button class="hamburger" id="hamburgerBtn" type="button"> <i class="fa-solid fa-bars"></i> </button>
        <h2 id="pageTitle"> Announcement </h2>
      </div>

      <div class="topbar-right">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
         <input type="text" id="globalSearchInput" placeholder="Search students, PCs, logs..." autocomplete="off">
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
            <div class="avatar" id="topAdminAvatar">
    AD
</div>

<div class="profile-name">
    <div class="name" id="topAdminName">
        Admin Reyes
    </div>

    <div class="role" id="topAdminRole">
        Laboratory Administrator
    </div>
</div>
            <i class="fa-solid fa-chevron-down chev"></i>
          </button>

          <div class="profile-menu">
            <div class="profile-menu-header">

    <div class="avatar" id="dropdownAdminAvatar">
        AD
    </div>

    <div>
        <div class="name" id="dropdownAdminName">
            Admin Reyes
        </div>

        <div class="sub" id="dropdownAdminId">
            ID: ADM-0042
        </div>
    </div>

</div>
            <button
    type="button"
    class="profile-menu-item"
    onclick="openAdminProfile()"
>
    <i class="fa-regular fa-user"></i>
    <span>My Profile</span>
</button>

<button
    type="button"
    class="profile-menu-item"
    onclick="openAdminSettings()"
>
    <i class="fa-solid fa-gear"></i>
    <span>Settings</span>
</button>

<button
    type="button"
    class="profile-menu-item"
    onclick="openAdminNotifications()"
>
    <i class="fa-regular fa-bell"></i>
    <span>Notifications</span>
</button>

<div class="profile-menu-divider"></div>

<button
    type="button"
    class="profile-menu-item danger"
    onclick="openLogout()"
>
    <i class="fa-solid fa-right-from-bracket"></i>
    <span>Logout</span>
</button>
          </div>
        </div>
      </div>
    </header>

      <main class="content">
            <section class="page" id="page-announcement">

  <div class="page-header">
    <div>
      <h1>Announcement</h1>
      <p>Broadcast updates to all enrolled students.</p>
    </div>
  </div>

  <div class="grid-2">

    <!-- NEW ANNOUNCEMENT -->
    <div class="card">

      <div class="card-head">
        <h3>New Announcement</h3>
      </div>

      <div class="form-field">
        <label>Title</label>
        <input
          type="text"
          class="text-input"
          id="annTitle"
          placeholder="e.g. Midterm Examination Schedule"
        >
      </div>

      <div class="form-field">
        <label>Audience</label>
        <select class="text-input" id="annAudience">
          <option>All Students</option>
          <option>BSIT 2-A</option>
          <option>BSIT 2-B</option>
          <option>BSIT 3-A</option>
        </select>
      </div>

      <div class="form-field announcement-message">
        <label>Message</label>

        <div class="message-editor">

          <!-- TOOLBAR -->
          <div class="message-toolbar">

            <button type="button" onclick="formatMessage('bold')" title="Bold">
              <i class="fa-solid fa-bold"></i>
            </button>

            <button type="button" onclick="formatMessage('italic')" title="Italic">
              <i class="fa-solid fa-italic"></i>
            </button>

            <button type="button" onclick="formatMessage('underline')" title="Underline">
              <i class="fa-solid fa-underline"></i>
            </button>

            <span class="toolbar-divider"></span>

            <button type="button" onclick="formatMessage('insertUnorderedList')" title="Bullet List">
              <i class="fa-solid fa-list-ul"></i>
            </button>

            <button type="button" onclick="formatMessage('insertOrderedList')" title="Numbered List">
              <i class="fa-solid fa-list-ol"></i>
            </button>

            <span class="toolbar-divider"></span>

            <button type="button" onclick="insertAnnouncementLink()" title="Insert Link">
              <i class="fa-solid fa-link"></i>
            </button>
              <button
                  type="button"
                  onclick="openEmojiPicker()"
                  title="Insert Emoji"
              >
                  <i class="fa-regular fa-face-smile"></i>
              </button>

          </div>

          <!-- MESSAGE AREA -->
          <div
            id="annBody"
            class="message-content"
            contenteditable="true"
            data-placeholder="Write your announcement here..."
          ></div>

        </div>

        <div class="message-footer">
          <span id="messageCounter">0 / 1000 characters</span>
        </div>

      </div>

      <!-- SUBMIT BUTTON -->
      <div class="announcement-actions">
            <button
                type="button"
                class="btn-primary"
                id="postAnnouncementBtn"
                onclick="postAnnouncement()"
            >
                <i class="fa-solid fa-paper-plane"></i>
                <span>Post Announcement</span>
            </button>
        </div>

    </div>
    <!-- END NEW ANNOUNCEMENT CARD -->

    <!-- PUBLISHED -->
    <div class="card">
      <div class="card-head">
        <h3>Published</h3>
      </div>

      <div id="announcementList">
        <div class="announcement-empty">

        <div class="announcement-empty-icon">
            <i class="fa-regular fa-bell"></i>
        </div>

        <h4>No announcements made yet</h4>

        <p>Published announcements will appear here.</p>

    </div>
      </div>

    </div>
    <!-- END PUBLISHED CARD -->
  </div>
  <!-- END grid-2 -->
</section>
        </main>
    </div>
</div>
    <!-- DELETE ANNOUNCEMENT MODAL -->
<div class="delete-modal-overlay" id="deleteAnnouncementModal">

    <div class="delete-modal">

        <div class="delete-modal-icon">
            <i class="fa-solid fa-trash"></i>
        </div>

        <h3>Delete Announcement?</h3>

        <p>
            Are you sure you want to delete this announcement?
            This action cannot be undone.
        </p>

        <div class="delete-modal-actions">

            <button
                type="button"
                class="delete-cancel-btn"
                onclick="closeDeleteModal()"
            >
                Cancel
            </button>

            <button
                type="button"
                class="delete-confirm-btn"
                onclick="confirmDeleteAnnouncement()"
            >
                <i class="fa-solid fa-trash"></i>
                Delete
            </button>

        </div>

    </div>

</div>

<!-- =========================================================
     INSERT LINK MODAL
========================================================= -->
<div id="linkModal" class="modal-overlay">

    <div class="custom-input-modal">

        <!-- HEADER -->
        <div class="custom-modal-header">

            <div class="custom-modal-title">

                <div class="custom-modal-icon link-icon">
                    <i class="fa-solid fa-link"></i>
                </div>

                <div>
                    <h2>Insert Link</h2>
                    <p>Add a link to your announcement.</p>
                </div>

            </div>

            <button
                type="button"
                class="custom-modal-close"
                onclick="closeLinkModal()"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

        </div>


        <!-- BODY -->
        <div class="custom-modal-body">

            <label for="announcementLink">
                URL
            </label>

            <div class="link-input-wrapper">

                <i class="fa-solid fa-link"></i>

                <input
                    type="url"
                    id="announcementLink"
                    placeholder="https://example.com"
                    autocomplete="off"
                >

            </div>

            <p class="link-helper">
                Enter the complete website address.
            </p>

        </div>


        <!-- FOOTER -->
        <div class="custom-modal-actions">

            <button
                type="button"
                class="modal-cancel-btn"
                onclick="closeLinkModal()"
            >
                Cancel
            </button>

            <button
                type="button"
                class="modal-confirm-btn"
                onclick="confirmAnnouncementLink()"
            >
                <i class="fa-solid fa-link"></i>
                Insert Link
            </button>

        </div>

    </div>

</div>



<!-- =========================================================
     EMOJI PICKER
========================================================= -->

<div id="emojiModal">

    <div id="emojiPickerBox">

        <!-- HEADER -->
        <div class="emoji-picker-header">

            <div class="emoji-picker-title">

                <div class="emoji-picker-icon">
                    😊
                </div>

                <div>
                    <h2>Insert Emoji</h2>
                    <p>Choose an emoji for your announcement.</p>
                </div>

            </div>

            <button
                type="button"
                class="emoji-picker-close"
                onclick="closeEmojiPicker()"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

        </div>


        <!-- SEARCH -->
        <div class="emoji-search">

            <i class="fa-solid fa-magnifying-glass"></i>

            <input
                type="text"
                id="emojiSearch"
                placeholder="Search emojis..."
                autocomplete="off"
            >

        </div>


        <!-- CATEGORIES -->
        <div class="emoji-categories">

            <button
                type="button"
                class="emoji-category active"
                onclick="filterEmojiCategory('recent', this)"
            >
                <i class="fa-regular fa-clock"></i>
                <span>Recent</span>
            </button>

            <button
                type="button"
                class="emoji-category"
                onclick="filterEmojiCategory('smileys', this)"
            >
                <i class="fa-regular fa-face-smile"></i>
                <span>Smileys</span>
            </button>

            <button
                type="button"
                class="emoji-category"
                onclick="filterEmojiCategory('people', this)"
            >
                <i class="fa-solid fa-users"></i>
                <span>People</span>
            </button>

            <button
                type="button"
                class="emoji-category"
                onclick="filterEmojiCategory('animals', this)"
            >
                <i class="fa-solid fa-paw"></i>
                <span>Animals</span>
            </button>

            <button
                type="button"
                class="emoji-category"
                onclick="filterEmojiCategory('food', this)"
            >
                <i class="fa-solid fa-utensils"></i>
                <span>Food</span>
            </button>

            <button
                type="button"
                class="emoji-category"
                onclick="filterEmojiCategory('travel', this)"
            >
                <i class="fa-solid fa-plane"></i>
                <span>Travel</span>
            </button>

            <button
                type="button"
                class="emoji-category"
                onclick="filterEmojiCategory('activities', this)"
            >
                <i class="fa-solid fa-basketball"></i>
                <span>Activities</span>
            </button>

            <button
                type="button"
                class="emoji-category"
                onclick="filterEmojiCategory('objects', this)"
            >
                <i class="fa-regular fa-lightbulb"></i>
                <span>Objects</span>
            </button>

            <button
                type="button"
                class="emoji-category"
                onclick="filterEmojiCategory('symbols', this)"
            >
                <i class="fa-solid fa-star"></i>
                <span>Symbols</span>
            </button>

        </div>


        <!-- SECTION -->
        <div class="emoji-section-header">

            <div>
                <i class="fa-regular fa-clock"></i>
                <span id="emojiSectionTitle">
                    Recent
                </span>
            </div>

            <span id="emojiCount">
                50 emojis
            </span>

        </div>


        <!-- GRID -->
        <div id="emojiIconGrid"></div>


        <!-- NO RESULTS -->
        <div id="emojiNoResults">

            <div>
                😕
            </div>

            <h4>No emojis found</h4>

            <p>Try searching for another emoji.</p>

        </div>


        <!-- FOOTER -->
        <div class="emoji-picker-footer">

            <span>
                <i class="fa-solid fa-circle-info"></i>
                Click an emoji to insert it into your message.
            </span>

            <button
                type="button"
                onclick="closeEmojiPicker()"
            >
                Close
            </button>

        </div>

    </div>

</div>



<!-- ANNOUNCEMENT NOTIFICATION POPUP -->
<div id="announcementNotificationModal" class="announcement-notification-overlay">
    <div class="announcement-notification-card">

        <div class="notification-icon" id="notificationIcon">
            <i class="fa-solid fa-check"></i>
        </div>

        <h2 id="notificationTitle">Success!</h2>

        <p id="notificationMessage">
            Action completed successfully.
        </p>

        <button type="button" onclick="closeAnnouncementNotification()">
            OK
        </button>

    </div>
</div>

<!-- =====================================================
     LOGOUT MODAL
===================================================== -->

<div
    id="logoutModal"
    class="logout-overlay"
    style="display:none;"
>

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

    announcementsData:
        "{{ route('admin.announcements.data') }}",

    announcementsStore:
        "{{ route('admin.announcements.store') }}",

    announcementsUpdate:
        "{{ url('/admin/announcements') }}",

    announcementsDelete:
        "{{ url('/admin/announcements') }}",

    settings: "{{ route('admin.settings') }}",

    profileUpdate:
        "{{ route('admin.settings.profile.update') }}",

    passwordUpdate:
        "{{ route('admin.settings.password.update') }}"
};
</script>
<script src="{{ asset('js/AdminAnnoucement.js') }}"></script>


<script>
document.addEventListener("input", function (event) {

    if (event.target.id !== "globalSearchInput") {
        return;
    }

    const searchValue = event.target.value
        .trim()
        .toLowerCase();

    const announcementItems = document.querySelectorAll(
        "#announcementList .announcement-item"
    );

    console.log("SEARCH:", searchValue);
    console.log("ITEMS:", announcementItems.length);

    announcementItems.forEach(function (item) {

        const text = item.textContent.toLowerCase();

        if (
            searchValue === "" ||
            text.includes(searchValue)
        ) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }

    });

});
</script>
</body>
</html>
