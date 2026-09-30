 /* ---------------- PAGE NAVIGATION ---------------- */
 
 const pageTitles = {
    dashboard: "Student Dashboard",
    schedule: "My Schedule",
    subjects: "Subjects",
    tasks: "Activities / Tasks",
    notifications: "Notifications",
    announcements: "Announcements",
    profile: "My Profile",
    settings: "Settings"
  };
async function goTo(pageId){

    // -----------------------------------------
    // SHOW SELECTED PAGE
    // -----------------------------------------

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById('page-' + pageId);

    if (!targetPage) {
        console.error('Page not found:', pageId);
        return;
    }

    targetPage.classList.add('active');


    // -----------------------------------------
    // UPDATE SIDEBAR ACTIVE STATE
    // -----------------------------------------

    document
        .querySelectorAll('.nav-item[data-page]')
        .forEach(nav => {
            nav.classList.remove('active');
        });

    const navBtn = document.querySelector(
        '.nav-item[data-page="' + pageId + '"]'
    );

    if (navBtn) {
        navBtn.classList.add('active');
    }


    // -----------------------------------------
    // UPDATE PAGE TITLE
    // -----------------------------------------

    const pageTitle = document.getElementById('pageTitle');

    if (pageTitle) {
        pageTitle.textContent =
            pageTitles[pageId] || "Dashboard";
    }


    // -----------------------------------------
    // CLOSE DROPDOWNS
    // -----------------------------------------

    closeProfile();
    closeNotif();


    // -----------------------------------------
    // LOAD PAGE DATA
    // -----------------------------------------

    if (pageId === 'schedule') {
        await loadStudentSchedulePage();
    }

    if (pageId === 'tasks') {
        await renderTasks();
    }

    if (pageId === 'announcements') {
        await loadStudentAnnouncements();
    }


    // -----------------------------------------
    // SCROLL TO TOP
    // -----------------------------------------

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

  /* ---------------- PROFILE DROPDOWN ---------------- */
  function toggleProfile(e){
    e.stopPropagation();
    closeNotif();
    document.getElementById('profileMenu').classList.toggle('open');
  }
  function closeProfile(){ document.getElementById('profileMenu').classList.remove('open'); }

  /* ---------------- NOTIFICATIONS DROPDOWN ---------------- */
  function toggleNotif(e){
    e.stopPropagation();
    closeProfile();
    document.getElementById('notifWrap').classList.toggle('open');
  }
  function closeNotif(){ document.getElementById('notifWrap').classList.remove('open'); }

  document.addEventListener('click', function(e){
    const pMenu = document.getElementById('profileMenu');
    const nMenu = document.getElementById('notifWrap');
    if(!pMenu.contains(e.target)) closeProfile();
    if(!nMenu.contains(e.target)) closeNotif();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeProfile(); closeNotif(); closeLogout(); }
  });

  /* mark a notification as read */
  function markRead(el){
    el.classList.remove('unread');
    updateNotifBadge();
  }
 function updateNotifBadge() {

    const unread =
        document.querySelectorAll(
            '#page-notifications .notif-page-row.unread'
        ).length;


    const bellDot =
        document.getElementById('bellDot');

    const navBadge =
        document.getElementById('navNotifBadge');


    // ==============================
    // BELL NOTIFICATION BADGE
    // ==============================

    if (bellDot) {

        if (unread === 0) {

            bellDot.style.display = 'none';

        } else {

            bellDot.textContent =
                unread > 99
                    ? '99+'
                    : unread;

            bellDot.style.display = 'flex';

        }

    }


    // ==============================
    // SIDEBAR NOTIFICATION BADGE
    // ==============================

    if (navBadge) {

        if (unread === 0) {

            navBadge.style.display = 'none';

        } else {

            navBadge.textContent =
                unread > 99
                    ? '99+'
                    : unread;

            navBadge.style.display = 'flex';

        }

    }

  }

  /* ---------------- TASKS ---------------- */

let apiTasks = [];
let taskFilter = 'all';


async function renderTasks() {

    const dashboardContainer =
        document.getElementById('dashTaskList');

    const fullContainer =
        document.getElementById('fullTaskList');

    try {

        if (dashboardContainer) {
            dashboardContainer.innerHTML = `
                <div class="list-row">
                    <div class="row-main">
                        <div class="row-title">
                            Loading tasks...
                        </div>
                        <div class="row-sub">
                            Please wait
                        </div>
                    </div>
                </div>
            `;
        }

        if (fullContainer) {
            fullContainer.innerHTML = `
                <div class="task-loading">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Loading tasks...
                </div>
            `;
        }


        const response = await fetch(
            '/student/tasks/data',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                cache: 'no-store'
            }
        );


        const data = await response.json();


        if (!response.ok || !data.success) {
            throw new Error(
                data.message || 'Failed to load tasks.'
            );
        }


        apiTasks = data.tasks || [];


        /*
         * UPDATE TASK COUNT
         */

        const pendingCount =
            apiTasks.filter(task => !task.completed).length;

        taskCountLabel.textContent =
            `${pendingCount} ${pendingCount === 1 ? 'pending task' : 'pending tasks'}`;


        /*
         * UPDATE DASHBOARD TASKS
         */

        renderDashboardTasks();


        /*
         * UPDATE FULL TASK PAGE
         */

        renderFullTasks();


    } catch (error) {

        console.error(
            'Task API Error:',
            error
        );


        if (dashboardContainer) {

            dashboardContainer.innerHTML = `
                <div class="list-row">
                    <div class="row-main">
                        <div class="row-title">
                            Unable to load tasks
                        </div>
                        <div class="row-sub">
                            Please try again later.
                        </div>
                    </div>
                </div>
            `;
        }


        if (fullContainer) {

            fullContainer.innerHTML = `
                <div class="task-error">

                    <div class="task-error-icon">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <h3>Unable to load tasks</h3>

                    <p>
                        Something went wrong while loading your activities.
                    </p>

                    <button
                        type="button"
                        onclick="renderTasks()"
                        class="task-retry-btn"
                    >
                        <i class="fa-solid fa-rotate-right"></i>
                        Try Again
                    </button>

                </div>
            `;
        }
    }
}


/* =========================================================
   DASHBOARD TASKS
   ========================================================= */

function renderDashboardTasks() {

    const container =
        document.getElementById('dashTaskList');

    if (!container) {
        return;
    }


    if (apiTasks.length === 0) {

        container.innerHTML = `
            <div class="list-row">

                <div class="row-main">

                    <div class="row-title">
                        No tasks yet
                    </div>

                    <div class="row-sub">
                        You currently have no assigned activities.
                    </div>

                </div>

            </div>
        `;

        return;
    }


    /*
     * Show only the first 4 tasks
     * on the dashboard.
     */

    const dashboardTasks =
        apiTasks.slice(0, 4);


    container.innerHTML =
        dashboardTasks
            .map(task => {

                const dueText =
                    task.due_date
                        ? `Due ${formatTaskDueDate(task.due_date)}`
                        : 'No due date';


                return `

                    <div class="task-row">

                        <div
                            class="task-check ${task.completed ? 'done' : ''}"
                            onclick="toggleTask(${task.id}, this)"
                        >
                            ${
                                task.completed
                                    ? '<i class="fa-solid fa-check"></i>'
                                    : ''
                            }
                        </div>


                        <div class="task-main">

                            <div
                                class="task-title ${task.completed ? 'done' : ''}"
                            >
                                ${escapeHTML(task.title)}
                            </div>


                            <div class="task-meta">

                                ${
                                    task.subject_code
                                        ? escapeHTML(task.subject_code) + ' · '
                                        : ''
                                }

                                ${
                                    task.completed
                                        ? 'Completed'
                                        : dueText
                                }

                            </div>

                        </div>

                    </div>

                `;

            })
            .join('');
}


/* =========================================================
   FULL TASK PAGE
   ========================================================= */

function renderFullTasks() {

    const container =
        document.getElementById('fullTaskList');

    if (!container) {
        return;
    }


    let filteredTasks = [...apiTasks];


    if (taskFilter === 'pending') {

        filteredTasks =
            filteredTasks.filter(
                task => !task.completed
            );

    }


    if (taskFilter === 'done') {

        filteredTasks =
            filteredTasks.filter(
                task => task.completed
            );

    }


    if (filteredTasks.length === 0) {

        container.innerHTML = `
            <div class="task-empty">

                <div class="task-empty-icon">
                    <i class="fa-solid fa-clipboard-list"></i>
                </div>

                <h3>
                    ${
                        taskFilter === 'done'
                            ? 'No completed tasks'
                            : taskFilter === 'pending'
                                ? 'No pending tasks'
                                : 'No tasks yet'
                    }
                </h3>

                <p>
                    ${
                        taskFilter === 'done'
                            ? 'You have not completed any tasks yet.'
                            : taskFilter === 'pending'
                                ? 'You have no pending tasks.'
                                : 'You currently have no assigned activities.'
                    }
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        filteredTasks
            .map(task => {

                const dueDate =
                    task.due_date
                        ? formatTaskDueDate(task.due_date)
                        : 'No due date';


                return `

                    <div
                        class="task-item ${task.completed ? 'completed' : ''}"
                        data-task-id="${task.id}"
                    >

                        <div class="task-check">

                            <button
                                type="button"
                                class="task-complete-btn ${task.completed ? 'checked' : ''}"
                                onclick="toggleTask(${task.id}, this)"
                                aria-label="${
                                    task.completed
                                        ? 'Mark task as pending'
                                        : 'Mark task as completed'
                                }"
                            >

                                ${
                                    task.completed
                                        ? '<i class="fa-solid fa-check"></i>'
                                        : ''
                                }

                            </button>

                        </div>


                        <div class="task-content">

                            <div class="task-top">

                                <h3>
                                    ${escapeHTML(task.title)}
                                </h3>


                                <span
                                    class="task-status ${
                                        task.completed
                                            ? 'completed'
                                            : 'pending'
                                    }"
                                >

                                    <i
                                        class="fa-solid ${
                                            task.completed
                                                ? 'fa-circle-check'
                                                : 'fa-clock'
                                        }"
                                    ></i>

                                    ${
                                        task.completed
                                            ? 'Completed'
                                            : 'Pending'
                                    }

                                </span>

                            </div>


                            ${
                                task.subject_code
                                    ? `
                                        <div class="task-subject">

                                            <i class="fa-solid fa-book"></i>

                                            ${escapeHTML(
                                                task.subject_code
                                            )}

                                        </div>
                                    `
                                    : ''
                            }


                            ${
                                task.description
                                    ? `
                                        <p class="task-description">

                                            ${escapeHTML(
                                                task.description
                                            )}

                                        </p>
                                    `
                                    : ''
                            }


                            <div class="task-meta">

                                <span>

                                    <i class="fa-regular fa-calendar"></i>

                                    Due: ${dueDate}

                                </span>

                            </div>


                        </div>

                    </div>

                `;

            })
            .join('');
}


/* =========================================================
   TOGGLE TASK
   ========================================================= */

async function toggleTask(taskId, button) {

    if (button) {
        button.disabled = true;
    }


    try {

        const response =
            await fetch(
                `/student/tasks/${taskId}/toggle`,
                {
                    method: 'POST',

                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                'Unable to update task.'
            );
        }


        await renderTasks();


        if (typeof showToast === 'function') {

            showToast(
                data.message
            );

        }


    } catch (error) {

        console.error(
            'Toggle Task Error:',
            error
        );


        if (typeof showToast === 'function') {

            showToast(
                'Unable to update task.'
            );

        } else {

            alert(
                'Unable to update task.'
            );
        }


        if (button) {
            button.disabled = false;
        }
    }
}


/* =========================================================
   FILTER TASKS
   ========================================================= */

function filterTasks(filter) {

    taskFilter = filter;


    /*
     * Update filter button appearance
     */

    document
        .querySelectorAll(
            '#filter-all, #filter-pending, #filter-done'
        )
        .forEach(button => {

            button.classList.remove('active');

        });


    const activeButton =
        document.getElementById(
            filter === 'all'
                ? 'filter-all'
                : filter === 'pending'
                    ? 'filter-pending'
                    : 'filter-done'
        );


    if (activeButton) {

        activeButton.classList.add('active');

    }


    renderFullTasks();
}


/* =========================================================
   TASK DATE FORMAT
   ========================================================= */

function formatTaskDueDate(dateString) {

    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleString(
        'en-US',
        {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }
    );
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement('div');


    div.textContent =
        value ?? '';


    return div.innerHTML;
}


/* =========================================================
   CSRF TOKEN
   ========================================================= */

function getCsrfToken() {

    const meta =
        document.querySelector(
            'meta[name="csrf-token"]'
        );


    return meta
        ? meta.getAttribute('content')
        : '';
}


/* =========================================================
   ANNOUNCEMENTS
   ========================================================= */

let studentAnnouncements = [];


/* =========================================================
   LOAD ANNOUNCEMENTS
   ========================================================= */

async function loadStudentAnnouncements() {

    const fullList =
        document.getElementById('announcementList');

    const dashboardList =
        document.getElementById('dashAnnouncementList');


    try {

        if (fullList) {

            fullList.innerHTML = `
                <div class="announcement-empty">

                    <div class="announcement-empty-icon">
                        <i class="fa-solid fa-spinner fa-spin"></i>
                    </div>

                    <h4>Loading announcements...</h4>

                    <p>Please wait.</p>

                </div>
            `;

        }


        if (dashboardList) {

            dashboardList.innerHTML = `
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
            `;

        }


        const response =
            await fetch(
                '/student/announcements/data',
                {
                    method: 'GET',

                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },

                    cache: 'no-store'
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                'Unable to load announcements.'
            );

        }


        studentAnnouncements =
            Array.isArray(data.announcements)
                ? data.announcements
                : [];


        renderStudentAnnouncements();

        renderDashboardAnnouncement();


    } catch (error) {

        console.error(
            'Announcement API Error:',
            error
        );


        if (fullList) {

            fullList.innerHTML = `
                <div class="announcement-empty">

                    <div class="announcement-empty-icon">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <h4>
                        Unable to load announcements
                    </h4>

                    <p>
                        Please refresh the page and try again.
                    </p>

                </div>
            `;

        }


        if (dashboardList) {

            dashboardList.innerHTML = `
                <div class="announce-card">

                    <div class="announce-icon">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <div>

                        <div class="announce-title">
                            Unable to load announcements
                        </div>

                        <div class="announce-date">
                            Please try again later.
                        </div>

                    </div>

                </div>
            `;

        }

    }

}


/* =========================================================
   FULL ANNOUNCEMENT PAGE
   ========================================================= */

function renderStudentAnnouncements() {

    const list =
        document.getElementById(
            'announcementList'
        );


    const count =
        document.getElementById(
            'announcementCount'
        );


    if (!list) {
        return;
    }


    if (count) {

        const total =
            studentAnnouncements.length;

        count.textContent =
            `${total} ${
                total === 1
                    ? 'announcement'
                    : 'announcements'
            }`;

    }


    if (
        !Array.isArray(studentAnnouncements) ||
        studentAnnouncements.length === 0
    ) {

        list.innerHTML = `
            <div class="announcement-empty">

                <div class="announcement-empty-icon">
                    <i class="fa-regular fa-bell"></i>
                </div>

                <h4>
                    No announcements published yet
                </h4>

                <p>
                    Published announcements will appear here.
                </p>

            </div>
        `;

        return;
    }


    list.innerHTML =
        studentAnnouncements
            .map(function (announcement) {

                return `

                    <div class="announcement-item">

                        <div class="announcement-icon">
                            <i class="fa-solid fa-bullhorn"></i>
                        </div>


                        <div class="announcement-content">

                            <h4>
                                ${escapeHTML(
                                    announcement.title || ''
                                )}
                            </h4>


                            <div class="announcement-meta">

                                ${escapeHTML(
                                    announcement.date || ''
                                )}

                                ${
                                    announcement.audience
                                        ? ' · ' +
                                          escapeHTML(
                                              announcement.audience
                                          )
                                        : ''
                                }

                            </div>


                            <div class="announcement-message">

                                ${sanitizeAnnouncementForStudent(
                                    announcement.body || ''
                                )}

                            </div>

                        </div>

                    </div>

                `;

            })
            .join('');

}


/* =========================================================
   DASHBOARD - LATEST ANNOUNCEMENT
   ========================================================= */

function renderDashboardAnnouncement() {

    const container =
        document.getElementById(
            'dashAnnouncementList'
        );


    if (!container) {
        return;
    }


    if (
        !Array.isArray(studentAnnouncements) ||
        studentAnnouncements.length === 0
    ) {

        container.innerHTML = `

            <div class="announce-card">

                <div class="announce-icon">
                    <i class="fa-regular fa-bell"></i>
                </div>

                <div>

                    <div class="announce-title">
                        No announcements yet
                    </div>

                    <div class="announce-date">
                        No published announcements.
                    </div>

                </div>

            </div>

        `;

        return;
    }


    /*
     * First announcement = latest announcement
     */

    const announcement =
        studentAnnouncements[0];


    container.innerHTML = `

        <div class="announce-card">

            <div class="announce-icon">

                <i class="fa-solid fa-bullhorn"></i>

            </div>


            <div>

                <div class="announce-title">

                    ${escapeHTML(
                        announcement.title || ''
                    )}

                </div>


                <div class="announce-date">

                    ${escapeHTML(
                        announcement.date || ''
                    )}

                    ${
                        announcement.audience
                            ? ' · ' +
                              escapeHTML(
                                  announcement.audience
                              )
                            : ''
                    }

                </div>


                <div class="announce-body">

                    ${escapeHTML(
                        stripHTML(
                            announcement.body || ''
                        )
                    )}

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   STRIP HTML
   ========================================================= */

function stripHTML(html) {

    const temp =
        document.createElement('div');

    temp.innerHTML = html;

    return temp.textContent ||
           temp.innerText ||
           '';

}


/* =========================================================
   SAFE ANNOUNCEMENT BODY
   ========================================================= */

function sanitizeAnnouncementForStudent(html) {

    const temp =
        document.createElement('div');

    temp.innerHTML = html;


    /*
     * Remove unsafe elements
     */

    temp
        .querySelectorAll(
            'script, iframe, object, embed, style'
        )
        .forEach(element => {
            element.remove();
        });


    /*
     * Remove inline event handlers
     */

    temp
        .querySelectorAll('*')
        .forEach(element => {

            [...element.attributes]
                .forEach(attribute => {

                    if (
                        attribute.name
                            .toLowerCase()
                            .startsWith('on')
                    ) {

                        element.removeAttribute(
                            attribute.name
                        );

                    }

                });

        });


    return temp.innerHTML;
}



  /* ---------------- LOGOUT MODAL ---------------- */
  function openLogout(){
    closeProfile();
    closeNotif();
    document.getElementById('logoutModal').classList.add('open');
  }
  function closeLogout(){
    document.getElementById('logoutModal').classList.remove('open');
  }
  function confirmLogout(){
    closeLogout();
    showToast("You've been logged out");
    setTimeout(()=>{ goTo('dashboard'); }, 900);
  }
  document.getElementById('logoutModal').addEventListener('click', function(e){
    if(e.target === this) closeLogout();
  });

  /* ---------------- TOAST ---------------- */
  let toastTimer;
  function showToast(msg){
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toast.classList.remove('show'), 2400);
  }


  /* =========================================================
   PROFILE SUCCESS MODAL
   ========================================================= */

function showProfileSuccessModal() {

    const modal = document.getElementById('profileSuccessModal');

    if (!modal) return;

    modal.classList.add('show');
}


function closeProfileSuccessModal() {

    const modal = document.getElementById('profileSuccessModal');

    if (!modal) return;

    modal.classList.remove('show');
}


/* =========================================================
   REALTIME STUDENT DASHBOARD
   ========================================================= */

let dashboardRefreshTimer = null;


/*
 * LOAD DASHBOARD DATA
 */
async function loadDashboardData() {

    try {

        const response = await fetch('/student/dashboard/data', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            cache: 'no-store'
        });


        if (!response.ok) {

            throw new Error(
                'Unable to load dashboard data.'
            );

        }


        const data = await response.json();


        if (!data.success) {

            throw new Error(
                data.message || 'Unable to load dashboard data.'
            );

        }


        /*
         * UPDATE ALL DASHBOARD PARTS
         */

        updateDashboardAttendance(data);

        updateDashboardNextClass(data);

        updateDashboardCurrentSession(data);

        updateDashboardSubjectCount(data);

        updateDashboardTodaySchedule(data);

        updateDashboardStudent(data);


    } catch (error) {

        console.error(
            'Dashboard Data Error:',
            error
        );

    }
}


/* =========================================================
   ATTENDANCE
   ========================================================= */

function updateDashboardAttendance(data) {

    const status =
        document.getElementById(
            'dashboardAttendanceStatus'
        );

    const time =
        document.getElementById(
            'dashboardAttendanceTime'
        );


    if (!status || !time) {
        return;
    }


    const attendance =
        data.attendance || {};


    const attendanceStatus =
        attendance.status || 'Not Checked In';


    status.textContent =
        attendanceStatus;


    if (attendance.time_in) {

        time.textContent =
            'Checked in at ' +
            attendance.time_in;

    } else {

        time.textContent =
            'No attendance recorded today';

    }


    /*
     * Change color depending on attendance status
     */

    if (
        attendanceStatus.toLowerCase() === 'present'
    ) {

        time.className =
            'stat-sub green';

    } else if (
        attendanceStatus.toLowerCase() === 'late'
    ) {

        time.className =
            'stat-sub orange';

    } else {

        time.className =
            'stat-sub muted';

    }
}


/* =========================================================
   NEXT CLASS
   ========================================================= */

function updateDashboardNextClass(data) {

    const title =
        document.getElementById(
            'dashboardNextClass'
        );

    const info =
        document.getElementById(
            'dashboardNextClassInfo'
        );


    if (!title || !info) {
        return;
    }


    const today =
        data.schedule?.today || [];


    const nextClass =
        findNextClass(today);


    if (!nextClass) {

        title.textContent =
            'No more classes';

        info.textContent =
            'No upcoming class today';

        return;
    }


    title.textContent =
        nextClass.subject_code ||
        nextClass.subject_name ||
        'Next Class';


    info.textContent =
        `${nextClass.time} · ${nextClass.room || 'No room'}`;
}


/* =========================================================
   CURRENT SESSION
   ========================================================= */

function updateDashboardCurrentSession(data) {

    const title =
        document.getElementById(
            'dashboardCurrentSession'
        );

    const info =
        document.getElementById(
            'dashboardCurrentSessionInfo'
        );


    if (!title || !info) {
        return;
    }


    const today =
        data.schedule?.today || [];


    const currentClass =
        findCurrentClass(today);


    if (!currentClass) {

        title.textContent =
            'No active class';

        info.textContent =
            'No ongoing session';

        return;
    }


    title.textContent =
        currentClass.subject_code ||
        currentClass.subject_name ||
        'Current Class';


    info.textContent =
        `Ongoing · ${currentClass.room || 'No room'}`;
}


/* =========================================================
   SUBJECT COUNT
   ========================================================= */

function updateDashboardSubjectCount(data) {

    const element =
        document.getElementById(
            'dashboardSubjectCount'
        );


    if (!element) {
        return;
    }


    const count =
        data.summary?.subjects ?? 0;


    element.textContent =
        count;
}


/* =========================================================
   TODAY'S SCHEDULE
   ========================================================= */

function updateDashboardTodaySchedule(data) {

    const container =
        document.getElementById(
            'dashboardTodaySchedule'
        );


    if (!container) {
        return;
    }


    const schedules =
        data.schedule?.today || [];


    if (schedules.length === 0) {

        container.innerHTML = `

            <div class="list-row">

                <div class="row-main">

                    <div class="row-title">
                        No classes today
                    </div>

                    <div class="row-sub">
                        You have no scheduled classes today.
                    </div>

                </div>

            </div>

        `;

        return;
    }


    container.innerHTML =
        schedules
            .map((schedule, index) => {

                const state =
                    getScheduleState(schedule);


                const icon =
                    getScheduleIcon(schedule);


                return `

                    <div class="list-row">

                        <div class="time-chip">
                            ${escapeHTML(schedule.time || '')}
                        </div>


                        <div class="row-icon ${icon.class}">
                            <i class="${icon.icon}"></i>
                        </div>


                        <div class="row-main">

                            <div class="row-title">
                                ${escapeHTML(
                                    schedule.subject_code ||
                                    schedule.subject_name ||
                                    'Subject'
                                )}
                            </div>

                            <div class="row-sub">
                                ${escapeHTML(
                                    schedule.teacher || 'No teacher'
                                )}
                                ·
                                ${escapeHTML(
                                    schedule.room || 'No room'
                                )}
                            </div>

                        </div>


                        <span class="badge ${state.class}">
                            ${state.label}
                        </span>

                    </div>

                `;

            })
            .join('');
}
/* =========================================================
   FULL STUDENT SCHEDULE PAGE
   ========================================================= */

async function loadStudentSchedulePage() {

    const result =
        document.getElementById('scheduleResult');

    if (!result) {
        return;
    }

    const semesterElement =
        document.getElementById('scheduleSemester');

    const semester =
        semesterElement
            ? semesterElement.value
            : '1st Semester';

    try {

        const url =
            `/student/schedule/data?semester=${encodeURIComponent(semester)}`;

        const response =
            await fetch(url, {
                method: 'GET',

                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },

                credentials: 'same-origin',
                cache: 'no-store'
            });

        const data =
            await response.json().catch(() => null);

        console.log('Schedule API status:', response.status);
        console.log('Schedule API response:', data);

        /* ERROR */

        if (!response.ok || !data || !data.success) {

            console.error(
                data?.message ||
                'Unable to load schedule.'
            );

            return;
        }

        const schedules =
            Array.isArray(data.schedules)
                ? data.schedules
                : [];

        /* NO SCHEDULE */

        if (schedules.length === 0) {

            result.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fa-solid fa-calendar-xmark"></i>
                    </div>

                    <h3>No schedule available</h3>

                    <p>
                        No class schedule matches your
                        course, year level, block, and semester.
                    </p>
                </div>
            `;

            return;
        }

        /* SHOW SCHEDULE */

        result.innerHTML = `
            <div class="card schedule-result-card">

                <div class="schedule-result-head">

                    <div class="schedule-title-group">
                        <div class="schedule-title-icon">
                            <i class="fa-regular fa-calendar-days"></i>
                        </div>

                        <div>
                            <h3>My Class Schedule</h3>
                            <p>
                                Here are the classes you are enrolled in
                                for ${escapeHTML(semester)}.
                            </p>
                        </div>
                    </div>

                    <span class="schedule-count">
                        ${schedules.length}
                        ${schedules.length === 1 ? 'class' : 'classes'}
                    </span>

                </div>

                <div class="schedule-table-wrapper">

                    <table class="student-schedule-table">

                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Subject Code</th>
                                <th>Subject Details</th>
                                <th>Teacher</th>
                                <th>Day</th>
                                <th>Room</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${schedules.map((schedule, index) => `
                                <tr>

                                    <!-- TIME -->
                                    <td>
                                        <div class="schedule-time-box time-${index % 3}">
                                            <i class="fa-regular fa-clock"></i>
                                            <span>
                                                ${escapeHTML(schedule.time || 'TBA')}
                                            </span>
                                        </div>
                                    </td>

                                    <!-- SUBJECT CODE -->
                                    <td>
                                        <span class="schedule-code">
                                            ${escapeHTML(schedule.subject_code || 'N/A')}
                                        </span>
                                    </td>

                                    <!-- SUBJECT DETAILS -->
                                    <td>
                                        <div class="schedule-subject-name">
                                            ${escapeHTML(schedule.subject_name || 'N/A')}
                                        </div>
                                    </td>

                                    <!-- TEACHER -->
                                    <td>
                                        <div class="schedule-instructor">
                                            ${escapeHTML(schedule.teacher || 'No teacher assigned')}
                                        </div>
                                    </td>

                                    <!-- DAY -->
                                    <td>
                                        <span class="schedule-day day-${index % 3}">
                                            ${escapeHTML(schedule.day || 'N/A')}
                                        </span>
                                    </td>

                                    <!-- ROOM -->
                                    <td>
                                        <span class="schedule-room">
                                            <i class="fa-solid fa-building"></i>
                                            ${escapeHTML(schedule.room || 'TBA')}
                                        </span>
                                    </td>

                                </tr>
                            `).join('')}
                        </tbody>

                    </table>

                </div>

            </div>
        `;

    } catch (error) {

        console.error(
            'Schedule Page Error:',
            error
        );

        /*
        Huwag palitan ang existing schedule
        kapag temporary error lang.
        */

    }
}

/* =========================================================
   FIND CURRENT CLASS
   ========================================================= */

function findCurrentClass(schedules) {

    for (const schedule of schedules) {

        const range =
            parseTimeRange(schedule.time);


        if (!range) {
            continue;
        }


        const now =
            getCurrentMinutes();


        if (
            now >= range.start &&
            now < range.end
        ) {

            return schedule;
        }
    }


    return null;
}


/* =========================================================
   FIND NEXT CLASS
   ========================================================= */

function findNextClass(schedules) {

    const now =
        getCurrentMinutes();


    const upcoming =
        schedules
            .map(schedule => {

                const range =
                    parseTimeRange(schedule.time);


                return {
                    schedule,
                    range
                };

            })
            .filter(item => {

                return item.range &&
                       item.range.start > now;

            })
            .sort((a, b) => {

                return a.range.start -
                       b.range.start;

            });


    return upcoming.length
        ? upcoming[0].schedule
        : null;
}


/* =========================================================
   SCHEDULE STATE
   ========================================================= */

function getScheduleState(schedule) {

    const range =
        parseTimeRange(schedule.time);


    if (!range) {

        return {
            label: 'Upcoming',
            class: 'blue'
        };

    }


    const now =
        getCurrentMinutes();


    if (
        now >= range.start &&
        now < range.end
    ) {

        return {
            label: 'Ongoing',
            class: 'orange'
        };

    }


    if (now >= range.end) {

        return {
            label: 'Done',
            class: 'green'
        };

    }


    return {
        label: 'Upcoming',
        class: 'blue'
    };
}


/* =========================================================
   TIME PARSER
   ========================================================= */

function parseTimeRange(timeString) {

    if (!timeString) {
        return null;
    }


    const parts =
        timeString
            .split(/\s*[-–]\s*/);


    if (parts.length < 2) {
        return null;
    }


    const start =
        parseSingleTime(parts[0]);


    const end =
        parseSingleTime(parts[1]);


    if (
        start === null ||
        end === null
    ) {

        return null;
    }


    return {
        start,
        end
    };
}


function parseSingleTime(timeString) {

    const match =
        timeString
            .trim()
            .match(
                /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
            );


    if (!match) {
        return null;
    }


    let hour =
        parseInt(match[1], 10);

    const minute =
        parseInt(match[2], 10);

    const period =
        match[3].toUpperCase();


    if (hour === 12) {
        hour = 0;
    }


    if (period === 'PM') {
        hour += 12;
    }


    return (
        hour * 60 +
        minute
    );
}


/* =========================================================
   CURRENT TIME
   ========================================================= */

function getCurrentMinutes() {

    const now =
        new Date();


    return (
        now.getHours() * 60 +
        now.getMinutes()
    );
}


/* =========================================================
   STUDENT INFO
   ========================================================= */

function updateDashboardStudent(data) {

    const student =
        data.student;


    if (!student) {
        return;
    }


    /*
     * Update welcome name
     */

    const welcome =
        document.querySelector(
            '#page-dashboard .hero h1'
        );


    if (welcome) {

        welcome.textContent =
            `Welcome back, ${student.fullname}!`;

    }
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement('div');

    div.textContent =
        value ?? '';

    return div.innerHTML;
}


/* =========================================================
   SCHEDULE ICON
   ========================================================= */

function getScheduleIcon(schedule) {

    const subject =
        (
            schedule.subject_name ||
            schedule.subject_code ||
            ''
        ).toLowerCase();


    if (
        subject.includes('web') ||
        subject.includes('program') ||
        subject.includes('code')
    ) {

        return {
            icon: 'fa-solid fa-code',
            class: 'green'
        };

    }


    if (
        subject.includes('database') ||
        subject.includes('data')
    ) {

        return {
            icon: 'fa-solid fa-database',
            class: 'orange'
        };

    }


    if (
        subject.includes('network') ||
        subject.includes('networking')
    ) {

        return {
            icon: 'fa-solid fa-network-wired',
            class: 'blue'
        };

    }


    return {
        icon: 'fa-solid fa-book',
        class: 'purple'
    };
}


/* =========================================================
   REALTIME REFRESH
   ========================================================= */
function startDashboardRealtime() {

    /*
     * Load immediately
     */

    loadDashboardData();

    renderTasks();

    loadStudentAnnouncements();


    /*
     * Refresh every 10 seconds
     */

    if (dashboardRefreshTimer) {

        clearInterval(
            dashboardRefreshTimer
        );

    }

}
/* ---------------- INIT ---------------- */

const urlParams =
    new URLSearchParams(window.location.search);

const saved =
    urlParams.get('saved');



/* =========================================
   OPEN REQUESTED PAGE ON PAGE LOAD
========================================= */

const requestedPage = urlParams.get('page');

const allowedPages = [
    'dashboard',
    'schedule',
    'subjects',
    'tasks',
    'notifications',
    'announcements',
    'profile',
    'settings'
];

if (requestedPage && allowedPages.includes(requestedPage)) {
    goTo(requestedPage);
} else {
    goTo('dashboard');
}

updateNotifBadge();

startDashboardRealtime();
initGlobalSearch();

/* =========================================
   PROFILE SAVE SUCCESS
========================================= */

if (saved === 'profile') {

    goTo('profile');

    setTimeout(() => {
        showProfileSuccessModal();
    }, 100);

    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );
}


  /* =========================================================
   LOGOUT
   ========================================================= */

function openLogout() {
    const modal = document.getElementById('logoutModal');

    if (modal) {
        modal.classList.add('open');
    }
}


function closeLogout() {
    const modal = document.getElementById('logoutModal');

    if (modal) {
        modal.classList.remove('open');
    }
}


function confirmLogout() {

    const button = document.querySelector('.btn-danger');

    if (button) {
        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Logging out...
        `;
    }

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content');

    fetch('/student/logout', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        }
    })

    .then(response => {

        if (!response.ok) {
            throw new Error('Logout failed.');
        }

        return response.json();
    })

    .then(result => {

        if (result.success) {

            window.location.href = result.redirect;

        } else {

            throw new Error(
                result.message || 'Unable to logout.'
            );
        }
    })

    .catch(error => {

        console.error('Logout Error:', error);

        if (button) {
            button.disabled = false;

            button.innerHTML = `
                Logout
            `;
        }

        showToast(
            error.message || 'Unable to logout.'
        );
    });
}
function changePassword() {

    const currentPassword =
        document.getElementById('currentPassword').value.trim();

    const newPassword =
        document.getElementById('newPassword').value.trim();

    const confirmPassword =
        document.getElementById('confirmPassword').value.trim();


    if (!currentPassword) {
        showToast('Please enter your current password.');
        return;
    }

    if (!newPassword) {
        showToast('Please enter your new password.');
        return;
    }

    if (newPassword.length < 8) {
        showToast('New password must be at least 8 characters.');
        return;
    }

    if (!confirmPassword) {
        showToast('Please confirm your new password.');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match.');
        return;
    }


    // TEMPORARY SUCCESS
    showToast('Password updated successfully.');

    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');

    if (!input) return;

    if (input.type === 'password') {
        // SHOW PASSWORD
        input.type = 'text';

        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        // HIDE PASSWORD
        input.type = 'password';

        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}



function initGlobalSearch() {

    const searchInput =
        document.getElementById('studentDashboardSearch');

    const resultsContainer =
        document.getElementById('studentSearchResults');

    const searchBox =
        document.getElementById('studentSearchBox');

    if (
        !searchInput ||
        !resultsContainer
    ) {
        return;
    }


    const pageNames = {

        dashboard: 'Dashboard',
        schedule: 'My Schedule',
        subjects: 'Subjects',
        tasks: 'Activities / Tasks',
        notifications: 'Notifications',
        announcements: 'Announcements',
        profile: 'My Profile',
        settings: 'Settings'

    };


    function getSearchableItems() {

        const results = [];

        const pages =
            document.querySelectorAll('.page');


        pages.forEach(page => {

            const pageId =
                page.id.replace(
                    'page-',
                    ''
                );

            const pageName =
                pageNames[pageId] ||
                pageId;


            const blocks =
                page.querySelectorAll(
                    '.card, ' +
                    '.task-row, ' +
                    '.task-item, ' +
                    '.list-row, ' +
                    '.announcement-item, ' +
                    '.announce-card, ' +
                    '.stat-card'
                );


            blocks.forEach(block => {

                const text =
                    block.textContent
                        .replace(/\s+/g, ' ')
                        .trim();


                if (!text) return;


                results.push({

                    pageId: pageId,

                    pageName: pageName,

                    text: text,

                    element: block

                });

            });


            if (blocks.length === 0) {

                const text =
                    page.textContent
                        .replace(/\s+/g, ' ')
                        .trim();


                if (text) {

                    results.push({

                        pageId: pageId,

                        pageName: pageName,

                        text: text,

                        element: page

                    });

                }

            }

        });


        return results;

    }


    function escapeHTML(text) {

        const div =
            document.createElement('div');

        div.textContent = text;

        return div.innerHTML;

    }


    function highlightText(
        text,
        keyword
    ) {

        const escapedText =
            escapeHTML(text);

        const escapedKeyword =
            escapeHTML(keyword);


        const regex =
            new RegExp(
                '(' +
                escapedKeyword.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&'
                ) +
                ')',
                'gi'
            );


        return escapedText.replace(
            regex,
            '<span class="student-search-highlight">$1</span>'
        );

    }


    function performSearch(keyword) {

        const search =
            keyword
                .trim()
                .toLowerCase();


        if (!search) {

            resultsContainer.innerHTML = '';

            resultsContainer.classList.remove(
                'show'
            );

            return;

        }


        const items =
            getSearchableItems();


        const matches =
            items.filter(item => {

                return item.text
                    .toLowerCase()
                    .includes(search);

            });


        if (matches.length === 0) {

            resultsContainer.innerHTML = `

                <div class="student-search-empty">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <div>
                        No results found for
                        <strong>
                            "${escapeHTML(keyword)}"
                        </strong>
                    </div>

                </div>

            `;

            resultsContainer.classList.add(
                'show'
            );

            return;

        }


        const uniqueMatches = [];

        const seen = new Set();


        matches.forEach(item => {

            const key =
                item.pageId +
                '|' +
                item.text;


            if (!seen.has(key)) {

                seen.add(key);

                uniqueMatches.push(item);

            }

        });


        const limitedResults =
            uniqueMatches.slice(0, 10);


        resultsContainer.innerHTML =
            limitedResults
                .map((item, index) => {

                    const preview =
                        item.text.length > 140
                            ? item.text.substring(
                                0,
                                140
                              ) + '...'
                            : item.text;


                    return `

                        <button
                            type="button"
                            class="student-search-result"
                            data-index="${index}"
                        >

                            <div class="student-search-result-icon">
                                <i class="fa-solid fa-file-lines"></i>
                            </div>


                            <div class="student-search-result-content">

                                <div class="student-search-result-title">
                                    ${highlightText(
                                        preview,
                                        keyword
                                    )}
                                </div>

                                <div class="student-search-result-text">
                                    ${highlightText(
                                        preview,
                                        keyword
                                    )}
                                </div>

                            </div>


                            <span class="student-search-result-page">
                                ${escapeHTML(
                                    item.pageName
                                )}
                            </span>

                        </button>

                    `;

                })
                .join('');


        resultsContainer.classList.add(
            'show'
        );


        resultsContainer
            .querySelectorAll(
                '.student-search-result'
            )
            .forEach((button, index) => {

                button.addEventListener(
                    'click',
                    function () {

                        const result =
                            limitedResults[index];


                        if (!result) return;


                        resultsContainer.classList.remove(
                            'show'
                        );


                        searchInput.value = '';


                        goTo(
                            result.pageId
                        );


                        setTimeout(() => {

                            if (
                                result.element &&
                                result.element.scrollIntoView
                            ) {

                                result.element.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center'
                                });

                            }

                        }, 150);

                    }
                );

            });

    }


    /* =========================================
       INPUT
    ========================================= */

    searchInput.addEventListener(
        'input',
        function () {

            performSearch(
                this.value
            );

        }
    );


    /* =========================================
       ENTER
    ========================================= */

    searchInput.addEventListener(
        'keydown',
        function (event) {

            if (event.key === 'Enter') {

                const firstResult =
                    resultsContainer.querySelector(
                        '.student-search-result'
                    );


                if (firstResult) {

                    firstResult.click();

                }

            }


            if (event.key === 'Escape') {

                resultsContainer.classList.remove(
                    'show'
                );

                this.value = '';

                this.blur();

            }

        }
    );


    /* =========================================
       CLICK OUTSIDE
    ========================================= */

    document.addEventListener(
        'click',
        function (event) {

            if (
                searchBox &&
                !searchBox.contains(
                    event.target
                )
            ) {

                resultsContainer.classList.remove(
                    'show'
                );

            }

        }
    );

}


/* =========================================================
   SIDEBAR TOGGLE + SEARCH RESET
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const app =
        document.querySelector(".app");

    const hamburgerBtn =
        document.getElementById("hamburgerBtn");

    const searchInput =
        document.getElementById("studentDashboardSearch");


    /* ================================
       SIDEBAR TOGGLE
    ================================= */

    if (hamburgerBtn) {

        hamburgerBtn.addEventListener(
            "click",
            function () {

                app.classList.toggle(
                    "sidebar-closed"
                );

            }
        );

    }


    /* ================================
       SEARCH FIELD
    ================================= */

    if (searchInput) {

        // Clear immediately
        searchInput.value = "";

        // Clear browser-restored value
        searchInput.defaultValue = "";

        // Clear again after browser autofill
        setTimeout(function () {

            searchInput.value = "";
            searchInput.defaultValue = "";

        }, 100);

        setTimeout(function () {

            searchInput.value = "";
            searchInput.defaultValue = "";

        }, 500);


        /* ============================
           WHEN USER CLICKS SEARCH
        ============================ */

        searchInput.addEventListener(
            "focus",
            function () {
                this.removeAttribute("readonly");
                this.value = "";
            }
        );

    }

});


/* =========================================================
   CLEAR SEARCH WHEN RETURNING TO PAGE
========================================================= */

window.addEventListener(
    "pageshow",
    function () {

        const searchInput =
            document.getElementById(
                "studentDashboardSearch"
            );

        if (!searchInput) return;

        searchInput.value = "";
        searchInput.defaultValue = "";

    }
);

// ======================================================
// STUDENT SUBJECTS
// ======================================================

async function loadStudentSubjects() {

    const semesterElement =
        document.getElementById('subjectSemester');

    const result =
        document.getElementById('subjectResult');


    if (!semesterElement || !result) {
        console.error('Subject elements not found.');
        return;
    }


    const semester =
        semesterElement.value || '1st Semester';


    try {

        const url =
            `/student/subjects/data`
            + `?semester=${encodeURIComponent(semester)}`;


        const response =
            await fetch(url, {
                method: 'GET',

                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },

                credentials: 'same-origin',
                cache: 'no-store'
            });


        // Read response
        const data =
            await response.json().catch(() => null);


        console.log(
            'Subject API status:',
            response.status
        );

        console.log(
            'Subject API response:',
            data
        );


        // ==============================================
        // DO NOT CLEAR EXISTING DATA ON ERROR
        // ==============================================

        if (!response.ok) {

            console.error(
                data?.message ||
                data?.error ||
                `HTTP error: ${response.status}`
            );

            return;
        }


        if (!data || !data.success) {

            console.error(
                data?.message ||
                data?.error ||
                'Unable to load subjects.'
            );

            return;
        }


        // ==============================================
        // ONLY UPDATE WHEN VALID DATA IS RECEIVED
        // ==============================================

        if (Array.isArray(data.subjects)) {

            console.log(
                'Student subjects:',
                data.subjects
            );


            renderStudentSubjects(
                data.subjects
            );

        }

    } catch (error) {

        console.error(
            'Subject loading error:',
            error
        );

        // IMPORTANT:
        // Do NOT replace subjectResult with an error screen.
        // Existing subjects will remain visible.

    }
}

function renderStudentSubjects(subjects) {

    const result =
        document.getElementById('subjectResult');


    if (!subjects.length) {

        result.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    <i class="fa-solid fa-book-open"></i>
                </div>

                <h3>No subjects found</h3>

                <p>
                    No subjects are available for the
                    selected year level and semester.
                </p>

            </div>

        `;

        return;
    }


    let rows = '';


    subjects.forEach(subject => {

        rows += `

            <tr>

                <td>
                    <strong>
                        ${escapeSubjectHtml(subject.code)}
                    </strong>
                </td>

                <td>
                    ${escapeSubjectHtml(subject.name)}
                </td>

                <td>
                    ${escapeSubjectHtml(subject.teacher || '—')}
                </td>

                <td>
                    ${escapeSubjectHtml(subject.course)}
                </td>

                <td>
                    <span class="subject-year-level">
                         ${escapeSubjectHtml(subject.year_level)}
                    </span>
                </td>

                <td>
                    <span class="subject-semester">
                        ${escapeSubjectHtml(subject.semester)}
                    </span>
                </td>

            </tr>

        `;

    });


    result.innerHTML = `

        <div class="card">

            <div class="card-head">

                <h3>
                    ${subjects.length} Subject${subjects.length !== 1 ? 's' : ''}
                </h3>

            </div>


            <div style="overflow-x:auto;">

                <table class="student-subject-table">

                    <thead>

                        <tr>

                            <th>Subject Code</th>

                            <th>Subject Name</th>

                            <th>Teacher</th>

                            <th>Course</th>

                            <th>Year Level</th>

                            <th>Semester</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        </div>

    `;
}

function escapeSubjectHtml(value) {

    if (value === null || value === undefined) {
        return '';
    }

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', function () {

    const viewSubjectBtn =
        document.getElementById('viewSubjectBtn');


    if (viewSubjectBtn) {

        viewSubjectBtn.addEventListener(
            'click',
            loadStudentSubjects
        );

    }

});

