
  /* ---------------- PAGE NAVIGATION ---------------- */

const pageTitles = {
    dashboard: "Dashboard",
    subjects: "Subject Management",
    schedule: "Schedule Management",
    computers: "Computer Management",
    attendance: "Attendance Records",
    monitoring: "Monitoring Applications",
    violations: "Violation Logs",
    reports: "Reports",
    announcement: "Announcement",
    settings: "Settings"
};


function goTo(pageId) {

    const pageRoutes = {
        dashboard: "/admin/dashboard",
        subjects: "/admin/subjects",
        schedule: "/admin/schedules",
        computers: "/admin/computers",
        attendance: "/admin/attendance",
        violations: "/admin/violations",
        reports: "/admin/reports",
        announcement: "/admin/announcements",
        settings: "/admin/settings"
    };


    /* Go to the actual Laravel page */

    if (pageRoutes[pageId]) {

        window.location.href =
            pageRoutes[pageId];

        return;
    }


    /* For pages inside the current page */

    document
        .querySelectorAll(".page")
        .forEach(function (page) {

            page.classList.remove("active");

        });


    const page =
        document.getElementById(
            "page-" + pageId
        );


    if (page) {

        page.classList.add("active");

    }


    const pageTitle =
        document.getElementById("pageTitle");


    if (pageTitle) {

        pageTitle.textContent =
            pageTitles[pageId] || "Dashboard";

    }


    closeProfile();
    closeNotif();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ---------------- LOGOUT MODAL ---------------- */

function openLogout() {

    const logoutModal =
        document.getElementById('logoutModal');

    if (!logoutModal) {

        console.error(
            'logoutModal not found.'
        );

        return;
    }

    logoutModal.classList.add('show');
}


/* ---------------- CLOSE LOGOUT ---------------- */

function closeLogout() {

    const logoutModal =
        document.getElementById('logoutModal');

    if (logoutModal) {

        logoutModal.classList.remove('show');

    }
}


/* ---------------- CONFIRM LOGOUT ---------------- */

function confirmLogout() {

    const csrf =
        document.querySelector(
            'meta[name="csrf-token"]'
        )?.content;

    if (!csrf) {

        console.error(
            'CSRF token not found.'
        );

        return;
    }

    const form =
        document.createElement('form');

    form.method = 'POST';

    form.action = '/admin/logout';

    form.style.display = 'none';


    const token =
        document.createElement('input');

    token.type = 'hidden';

    token.name = '_token';

    token.value = csrf;


    form.appendChild(token);

    document.body.appendChild(form);

    form.submit();
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
    if(e.key === 'Escape'){ closeProfile(); closeNotif(); closeLogout(); closeSubjectModal(); closeBlockAppModal(); }
  });

/* ---------------- SCHEDULE MANAGEMENT ---------------- */

let selectedSemester = '1st Semester';
let editingScheduleId = null;

/* Laravel schedules */
let schedules = window.schedules || [];


/* ---------------- SEMESTER FILTER ---------------- */

function filterSemester(semester, button) {

    selectedSemester = semester;

    document
        .querySelectorAll('#page-schedule .semester-btn')
        .forEach(btn => {
            btn.classList.remove('active');
        });

    button.classList.add('active');

    renderSchedules();
}


/* ---------------- OPEN ADD MODAL ---------------- */

function openScheduleModal() {

    editingScheduleId = null;

    const form = document.querySelector('.schedule-form');

    if (form) {
        form.reset();
    }

    document.querySelector('.modal-header h2').textContent =
        'Add Schedule';

    document.querySelector('.btn-save').innerHTML = `
        <i class="fa-solid fa-plus"></i>
        Save Schedule
    `;

    document.getElementById('scheduleModal').classList.add('show');
}


/* ---------------- CLOSE MODAL ---------------- */

function closeScheduleModal() {

    document
        .getElementById('scheduleModal')
        .classList.remove('show');

    editingScheduleId = null;
}


/* ---------------- SAVE / UPDATE ---------------- */

function saveSchedule() {

    const data = {

        subject_code:
            document.getElementById('subjectCode').value.trim(),

        subject_name:
            document.getElementById('subjectName').value.trim(),

        room:
            document.getElementById('room').value.trim(),

        teacher:
            document.getElementById('teacher').value.trim(),

        course:
            document.getElementById('scheduleCourse').value,

        year_level:
            document.getElementById('scheduleYearLevel').value,

        block:
            document.getElementById('scheduleBlock').value,

        semester:
            document.getElementById('scheduleSemester').value,

        day:
            document.getElementById('day').value.trim(),

        time:
            document.getElementById('time').value.trim()
    };


    /* VALIDATION */

    if (!data.subject_code || !data.subject_name) {

        showToast(
            'Please fill in Subject Code and Subject Name'
        );

        return;
    }


    /* CHECK IF EDITING */

    const isEditing =
        editingScheduleId !== null;


    const url = isEditing
        ? `/admin/schedules/${editingScheduleId}`
        : `/admin/schedules`;

    const method = isEditing
        ? 'PUT'
        : 'POST';


    /* CSRF */

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');

    if (!csrfToken) {

        console.error('CSRF token not found.');

        showToast('CSRF token not found.');

        return;
    }


    /* SEND TO LARAVEL */

    fetch(url, {

        method: method,

        headers: {

            'Content-Type': 'application/json',

            'Accept': 'application/json',

            'X-CSRF-TOKEN': csrfToken

        },

        body: JSON.stringify(data)

    })

    .then(response => {

        return response.json().then(result => {

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    'Failed to save schedule.'
                );

            }

            return result;

        });

    })

    .then(result => {

        console.log('Schedule saved:', result);

        showToast(result.message);

        closeScheduleModal();

        /*
         * Reload the page so Laravel gets
         * the latest records from database.
         */
        setTimeout(() => {

            window.location.reload();

        }, 800);

    })

    .catch(error => {

        console.error('Save Schedule Error:', error);

        showToast(
            error.message ||
            'Something went wrong while saving the schedule.'
        );

    });
}


/* ---------------- EDIT ---------------- */

function editSchedule(id) {

    const schedule = schedules.find(
        s => Number(s.id) === Number(id)
    );

    if (!schedule) {

        console.error(
            'Schedule not found:',
            id,
            schedules
        );

        showToast('Schedule not found.');

        return;
    }


    editingScheduleId = schedule.id;


    document.getElementById('subjectCode').value =
        schedule.subject_code || '';

    document.getElementById('subjectName').value =
        schedule.subject_name || '';

    document.getElementById('room').value =
        schedule.room || '';

    document.getElementById('teacher').value =
        schedule.teacher || '';

    document.getElementById('scheduleCourse').value =
        schedule.course || '';

    document.getElementById('scheduleYearLevel').value =
        schedule.year_level || '';

    document.getElementById('scheduleBlock').value =
        schedule.block || '';

    document.getElementById('scheduleSemester').value =
        schedule.semester || '';

    document.getElementById('day').value =
        schedule.day || '';

    document.getElementById('time').value =
        schedule.time || '';


    document.querySelector('.modal-header h2').textContent =
        'Edit Schedule';

    document.querySelector('.btn-save').innerHTML = `
        <i class="fa-solid fa-pen"></i>
        Update Schedule
    `;


    document
        .getElementById('scheduleModal')
        .classList.add('show');
}


/* ---------------- DELETE ---------------- */

function deleteSchedule(id) {

    if (!confirm(
        'Are you sure you want to delete this schedule?'
    )) {
        return;
    }


    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');


    fetch(`/admin/schedules/${id}`, {

        method: 'DELETE',

        headers: {

            'Accept': 'application/json',

            'X-CSRF-TOKEN': csrfToken

        }

    })

    .then(response => {

        return response.json().then(result => {

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    'Failed to delete schedule.'
                );

            }

            return result;

        });

    })

    .then(result => {

        showToast(result.message);

        setTimeout(() => {

            window.location.reload();

        }, 800);

    })

    .catch(error => {

        console.error(
            'Delete Schedule Error:',
            error
        );

        showToast(
            error.message ||
            'Something went wrong while deleting.'
        );

    });
}


/* ---------------- RENDER ---------------- */

function renderSchedules() {

    const container =
        document.getElementById('scheduleContainer');

    if (!container) {
        return;
    }


    container.innerHTML = '';


    const searchInput =
    document.getElementById('globalSearchInput');

const searchQuery =
    searchInput
        ? searchInput.value.trim().toLowerCase()
        : '';

const filteredSchedules =
    schedules.filter(schedule => {

        /* Semester filter */
        if (schedule.semester !== selectedSemester) {
            return false;
        }

        /* Search filter */
        if (searchQuery) {

            const searchableText = [
                schedule.subject_code,
                schedule.subject_name,
                schedule.teacher,
                schedule.course,
                schedule.year_level,
                schedule.block,
                schedule.day,
                schedule.time,
                schedule.room
            ]
                .filter(value => value !== null && value !== undefined)
                .join(' ')
                .toLowerCase();

            if (!searchableText.includes(searchQuery)) {
                return false;
            }
        }

        return true;
    });


    /* EMPTY STATE */

    if (filteredSchedules.length === 0) {

        container.innerHTML = `
            <div class="empty-schedule-state">

                <div class="empty-schedule-icon">
                    <i class="fa-solid fa-calendar-days"></i>
                </div>

                <h3>No schedules added yet</h3>

                <p>
                    Click Add Schedule to get started
                </p>

            </div>
        `;

        return;
    }


    /* GROUP */

    const grouped = {};


    filteredSchedules.forEach(schedule => {

        const section =
            `${schedule.course} ${schedule.year_level} ${schedule.block}`;


        if (!grouped[section]) {

            grouped[section] = [];

        }


        grouped[section].push(schedule);

    });


    /* RENDER GROUPS */

    Object.keys(grouped).forEach(section => {

        const rows =
            grouped[section]
                .map(schedule => {

                    return `
                        <tr>

                            <td>
                                ${schedule.subject_code}
                            </td>

                            <td>
                                ${schedule.subject_name}
                            </td>

                            <td>
                                ${schedule.teacher}
                            </td>

                            <td>
                                ${schedule.day}
                            </td>

                            <td>
                                ${schedule.time}
                            </td>

                            <td>
                                ${schedule.room}
                            </td>

                            <td class="action-buttons">

                                <button
                                    class="icon-btn"
                                    onclick="editSchedule(${schedule.id})">

                                    <i class="fa-solid fa-pen"></i>

                                </button>

                                <button
                                    class="icon-btn danger"
                                    onclick="deleteSchedule(${schedule.id})">

                                    <i class="fa-solid fa-trash"></i>

                                </button>

                            </td>

                        </tr>
                    `;

                })
                .join('');


        container.innerHTML += `

            <div class="card" style="margin-top:20px;">

                <h3>${section}</h3>

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>Code</th>
                            <th>Subject</th>
                            <th>Teacher</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Room</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        `;

    });

}


/* ---------------- INITIAL RENDER ---------------- */

document.addEventListener('DOMContentLoaded', function () {

    renderSchedules();

    const searchInput =
        document.getElementById('globalSearchInput');

    if (searchInput) {

        searchInput.addEventListener('input', function () {

            renderSchedules();

        });

    }

});


/* ---------------- TOAST ---------------- */

function showToast(message) {

    const toast =
        document.createElement('div');

    toast.className = 'toast';

    toast.textContent = message;

    document.body.appendChild(toast);


    setTimeout(() => {

        toast.classList.add('show');

    }, 10);


    setTimeout(() => {

        toast.classList.remove('show');

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);
}


// ==========================================
// SIDEBAR TOGGLE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const app = document.querySelector(".app");
    const hamburgerBtn = document.getElementById("hamburgerBtn");

    if (hamburgerBtn) {

        hamburgerBtn.addEventListener("click", function () {

            app.classList.toggle("sidebar-closed");

        });

    }

});

