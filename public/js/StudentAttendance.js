
/* =========================================================
   LABSTRACK - STUDENT ATTENDANCE
   Laravel Database Version
========================================================= */


/* =========================================================
   PAGE NAVIGATION
========================================================= */

const pageTitles = {
    dashboard: "Student Dashboard",
    schedule: "My Schedule",
    subjects: "Subjects",
    tasks: "Activities / Tasks",
    notifications: "Notifications",
    profile: "My Profile",
    settings: "Settings",
    announcements: "Announcements"
};


function goTo(pageId) {

    const pages = {
    dashboard: "/dashboard",
    schedule: "/dashboard?page=schedule",
    subjects: "/dashboard?page=subjects",
    tasks: "/dashboard?page=tasks",
    notifications: "/dashboard?page=notifications",
    profile: "/dashboard?page=profile",
    settings: "/dashboard?page=settings",
    announcements: "/dashboard?page=announcements"
    };

    const pageElement =
        document.getElementById("page-" + pageId);

    if (pageElement) {

        document
            .querySelectorAll(".page")
            .forEach(function (page) {
                page.classList.remove("active");
            });

        pageElement.classList.add("active");

        document
            .querySelectorAll(".nav-item[data-page]")
            .forEach(function (nav) {
                nav.classList.remove("active");
            });

        const navButton =
            document.querySelector(
                '.nav-item[data-page="' +
                pageId +
                '"]'
            );

        if (navButton) {
            navButton.classList.add("active");
        }

        const pageTitle =
            document.getElementById("pageTitle");

        if (pageTitle) {
            pageTitle.textContent =
                pageTitles[pageId] ||
                "Dashboard";
        }

        closeProfile();
        closeNotif();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;
    }

    if (pages[pageId]) {
        window.location.href = pages[pageId];
    }
}


/* =========================================================
   PROFILE
========================================================= */

function toggleProfile(event) {

    if (event) {
        event.stopPropagation();
    }

    closeNotif();

    const profileMenu =
        document.getElementById("profileMenu");

    if (profileMenu) {
        profileMenu.classList.toggle("open");
    }
}


function closeProfile() {

    const profileMenu =
        document.getElementById("profileMenu");

    if (profileMenu) {
        profileMenu.classList.remove("open");
    }
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function toggleNotif(event) {

    if (event) {
        event.stopPropagation();
    }

    closeProfile();

    const notifWrap =
        document.getElementById("notifWrap");

    if (notifWrap) {
        notifWrap.classList.toggle("open");
    }
}


function closeNotif() {

    const notifWrap =
        document.getElementById("notifWrap");

    if (notifWrap) {
        notifWrap.classList.remove("open");
    }
}


/* =========================================================
   DROPDOWN CLOSE
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const profileMenu =
            document.getElementById("profileMenu");

        const notifWrap =
            document.getElementById("notifWrap");

        if (
            profileMenu &&
            !profileMenu.contains(event.target)
        ) {
            closeProfile();
        }

        if (
            notifWrap &&
            !notifWrap.contains(event.target)
        ) {
            closeNotif();
        }
    }
);


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeProfile();
            closeNotif();
            closeLogout();
        }
    }
);


/* =========================================================
   REALTIME STUDENT NOTIFICATIONS
========================================================= */

let attendanceNotificationTimer = null;
let attendanceNotifications = [];


/* =========================================================
   LOAD NOTIFICATIONS
========================================================= */

async function loadAttendanceNotifications() {

    try {

        const response = await fetch(
            "/student/dashboard/data",
            {
                method: "GET",

                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },

                cache: "no-store"
            }
        );


        if (!response.ok) {
            throw new Error(
                "Unable to load notifications."
            );
        }


        const data =
            await response.json();


        /*
         * The notification data must come
         * from the student dashboard API.
         */

        attendanceNotifications =
            Array.isArray(data.notifications)
                ? data.notifications
                : [];


        renderAttendanceNotifications();


    } catch (error) {

        console.error(
            "Notification loading error:",
            error
        );

    }

}


/* =========================================================
   RENDER NOTIFICATIONS
========================================================= */

function renderAttendanceNotifications() {

    const list =
        document.getElementById(
            "attendanceNotificationList"
        );


    const bellDot =
        document.getElementById(
            "bellDot"
        );


    if (!list) {
        return;
    }


    if (
        !Array.isArray(
            attendanceNotifications
        ) ||
        attendanceNotifications.length === 0
    ) {

        list.innerHTML = `
            <div class="notification-empty">
                <i class="fa-regular fa-bell-slash"></i>
                <span>No new notifications.</span>
            </div>
        `;


        if (bellDot) {
            bellDot.style.display = "none";
        }

        return;
    }


    const unread =
        attendanceNotifications.filter(
            notification =>
                !notification.read
        );


    if (bellDot) {

        if (unread.length > 0) {

            bellDot.textContent =
                unread.length > 99
                    ? "99+"
                    : unread.length;

            bellDot.style.display =
                "flex";

        } else {

            bellDot.style.display =
                "none";

        }

    }


    list.innerHTML =
        attendanceNotifications
            .slice(0, 5)
            .map(function (notification) {

                return `
                    <div
                        class="notif-row ${
                            notification.read
                                ? ""
                                : "unread"
                        }"
                        onclick="goTo('notifications')"
                    >

                        <div class="dot-icon">
                            <i class="fa-solid fa-bell"></i>
                        </div>

                        <div>

                            <div class="r-title">
                                ${escapeHtml(
                                    notification.title ||
                                    "Notification"
                                )}
                            </div>

                            <div class="r-time">
                                ${escapeHtml(
                                    notification.created_at ||
                                    ""
                                )}
                            </div>

                        </div>

                    </div>
                `;

            })
            .join("");

}



/* =========================================================
   NOTIFICATION BADGE
========================================================= */

function markRead(element) {

    if (!element) {
        return;
    }

    element.classList.remove("unread");

    updateNotifBadge();
}


function updateNotifBadge() {

    const unreadNotifications =
        document.querySelectorAll(
            ".notif-row.unread, .notif-page-row.unread"
        );

    const count =
        unreadNotifications.length;

    const bellDot =
        document.getElementById("bellDot");

    const navBadge =
        document.getElementById("navNotifBadge");

    if (count === 0) {

        if (bellDot) {
            bellDot.style.display = "none";
        }

        if (navBadge) {
            navBadge.style.display = "none";
        }

    } else {

        if (bellDot) {

            bellDot.textContent =
                count;

            bellDot.style.display =
                "flex";
        }

        if (navBadge) {

            navBadge.textContent =
                count;

            navBadge.style.display =
                "flex";
        }
    }
}


/* =========================================================
   LOGOUT
========================================================= */

function openLogout() {

    closeProfile();
    closeNotif();

    const logoutModal =
        document.getElementById("logoutModal");

    if (logoutModal) {

        logoutModal.classList.add("open");

    } else {

        window.location.href =
            "/student-login";
    }
}


function closeLogout() {

    const logoutModal =
        document.getElementById("logoutModal");

    if (logoutModal) {

        logoutModal.classList.remove("open");
    }
}


function confirmLogout() {

    closeLogout();

    /*
       Use Laravel logout route.
    */

    const form =
        document.createElement("form");

    form.method = "POST";

    form.action =
        "/student/logout";

    const csrf =
        document.querySelector(
            'meta[name="csrf-token"]'
        );

    if (csrf) {

        const input =
            document.createElement("input");

        input.type = "hidden";

        input.name = "_token";

        input.value =
            csrf.getAttribute("content");

        form.appendChild(input);
    }

    document.body.appendChild(form);

    form.submit();
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
        ? meta.getAttribute("content")
        : "";
}


/* =========================================================
   ATTENDANCE STATE
========================================================= */

let attendanceRecords = [];

let currentRecord = null;

let currentSubject = null;

let currentInstructor = null;

let currentSchedule = null;

let instructorSelect = null;

let scheduleText = null;


// =====================================================
// STUDENT SCHEDULES FROM LARAVEL
// =====================================================

const schedules = Array.isArray(window.studentSchedules)
    ? window.studentSchedules
    : [];

console.log(
    "Student Attendance Schedules:",
    schedules
);
/* =========================================================
   LOAD STUDENT ATTENDANCE
========================================================= */

async function loadAttendanceRecords() {

    try {

        const response =
            await fetch(
                "/student/attendance/records",
                {
                    method: "GET",
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            console.error(
                data.message ||
                "Unable to load attendance."
            );

            return;
        }

        attendanceRecords =
            data.records || [];

        renderCurrentAttendance();

        updateSelectedAttendance();

    } catch (error) {

        console.error(
            "Attendance loading error:",
            error
        );
    }
}


/* =========================================================
   GET TODAY
========================================================= */

function getTodayKey() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );
}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateKey) {

    if (!dateKey) {
        return "—";
    }

    const parts =
        dateKey.split("-");

    if (parts.length !== 3) {
        return dateKey;
    }

    const date =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );
}


/* =========================================================
   TODAY RECORDS
========================================================= */

function getTodayAttendanceRecords() {

    const today =
        getTodayKey();

    return attendanceRecords.filter(
        function (record) {

            return record.date === today;
        }
    );
}


/* =========================================================
   FIND RECORD
========================================================= */

function findTodayRecord(subject) {

    if (!subject) {
        return null;
    }

    const today = getTodayKey();

    const subjectCode = String(subject)
        .trim()
        .split(/\s+/)[0];

    return attendanceRecords.find(function (record) {

        const recordSubject = String(
            record.subject || ""
        ).trim();

        const recordSubjectCode = recordSubject
            .split(/\s+/)[0];

        return (
            record.date === today &&
            recordSubjectCode === subjectCode
        );

    }) || null;
}


/* =========================================================
   RENDER CURRENT ATTENDANCE
========================================================= */

function renderCurrentAttendance() {

    const attendanceResults =
        document.getElementById(
            "attendanceResults"
        );

    const attendanceDate =
        document.getElementById(
            "attendanceDate"
        );

    if (!attendanceResults) {
        return;
    }

    if (attendanceDate) {

        attendanceDate.textContent =
            formatDate(
                getTodayKey()
            );
    }

    attendanceResults
        .querySelectorAll(
            ".attendance-result.generated"
        )
        .forEach(function (row) {

            row.remove();

        });

    const todayRecords =
        getTodayAttendanceRecords();

    todayRecords.forEach(
        function (record) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "attendance-result generated";

            row.innerHTML = `

                <div class="result-item">
                    <strong>
                        ${escapeHtml(
                            record.subject
                        )}
                    </strong>
                </div>

                <div class="result-item">
                    <strong>
                        ${escapeHtml(
                            record.instructor || "—"
                        )}
                    </strong>
                </div>

                <div class="result-item">
                    <strong>
                        ${escapeHtml(
                            record.timeIn || "—"
                        )}
                    </strong>
                </div>

                <div class="result-item">
                    <strong>
                        ${escapeHtml(
                            record.timeOut || "—"
                        )}
                    </strong>
                </div>

                <div class="result-item">
                    <span class="
                        status-badge
                        status-${String(
                            record.status || ""
                        ).toLowerCase()}
                    ">
                        ${escapeHtml(
                            record.status || "—"
                        )}
                    </span>
                </div>

            `;

            attendanceResults.appendChild(
                row
            );
        }
    );
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


/* =========================================================
   UPDATE SELECTED ATTENDANCE
========================================================= */
function updateSelectedAttendance() {

    const subjectSelect =
        document.getElementById("subjectSelect");

    if (!subjectSelect) {
        return;
    }

    const selectedOption =
        subjectSelect.options[
            subjectSelect.selectedIndex
        ];

    if (
        !selectedOption ||
        !subjectSelect.value
    ) {

        currentSubject = null;
        currentRecord = null;

        setButtonTimeIn();

        return;
    }

    if (currentSchedule) {

        currentSubject =
            currentSchedule.subject_code +
            " " +
            currentSchedule.subject_name;

    } else {

        currentSubject =
            selectedOption.textContent.trim();
    }

    currentRecord =
        findTodayRecord(currentSubject);

    console.log(
        "CURRENT SUBJECT:",
        currentSubject
    );

    console.log(
        "CURRENT ATTENDANCE RECORD:",
        currentRecord
    );

    if (!currentRecord) {

        setButtonTimeIn();

        return;
    }

    /*
     * TIME IN EXISTS
     * TIME OUT DOES NOT EXIST
     * → SHOW TIME OUT
     */

    if (
        currentRecord.timeIn &&
        (
            !currentRecord.timeOut ||
            currentRecord.timeOut === "—" ||
            currentRecord.timeOut === ""
        )
    ) {

        setButtonTimeOut();

        return;
    }

    /*
     * TIME IN + TIME OUT
     * → COMPLETED
     */

    if (
        currentRecord.timeIn &&
        currentRecord.timeOut &&
        currentRecord.timeOut !== "—"
    ) {

        setButtonCompleted();

        return;
    }

    setButtonTimeIn();
}


/* =========================================================
   TIME IN
========================================================= */

async function recordTimeIn() {

    if (!currentSubject) {
        alert("Please select a subject.");
        return;
    }

    const attendanceBtn =
        document.getElementById("attendanceBtn");

    if (attendanceBtn) {
        attendanceBtn.disabled = true;
    }

    const instructorSelect =
        document.getElementById("instructorSelect");

    try {

        const instructor =
            instructorSelect &&
            instructorSelect.selectedIndex >= 0
                ? instructorSelect.options[
                    instructorSelect.selectedIndex
                  ].textContent.trim()
                : "";

        const schedule =
            currentSchedule
                ? (
                    (currentSchedule.day || "") +
                    " • " +
                    (currentSchedule.time || "") +
                    (
                        currentSchedule.room
                            ? " • " +
                              currentSchedule.room
                            : ""
                    )
                  )
                : "";

        console.log("TIME IN DATA:", {
            subject: currentSubject,
            instructor: instructor,
            schedule: schedule
        });

        const response =
            await fetch(
                "/student/attendance/time-in",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json",

                        "X-CSRF-TOKEN":
                            getCsrfToken()
                    },

                    body: JSON.stringify({

                        subject:
                            currentSubject,

                        instructor:
                            instructor,

                        schedule:
                            schedule
                    })
                }
            );

        const data =
            await response.json();

        console.log(
            "TIME IN RESPONSE:",
            response.status,
            data
        );

        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Unable to record time in."
            );

            return;
        }

        alert(
            "Attendance recorded successfully!\n\n" +
            "Subject: " + currentSubject + "\n" +
            "Instructor: " + instructor

        );

        await loadAttendanceRecords();

    } catch (error) {

        console.error(
            "TIME IN error:",
            error
        );

        alert(
            "TIME IN ERROR:\n\n" +
            error.message
        );

    } finally {

        updateSelectedAttendance();

    }
}
/* =========================================================
   TIME OUT
========================================================= */

async function recordTimeOut() {

    if (!currentSubject) {
        return;
    }

    const attendanceBtn =
        document.getElementById(
            "attendanceBtn"
        );

    if (attendanceBtn) {
        attendanceBtn.disabled = true;
    }

    try {

        const response =
            await fetch(
                "/student/attendance/time-out",
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json",

                        "X-CSRF-TOKEN":
                            getCsrfToken()
                    },

                    body: JSON.stringify({

                        subject:
                            currentSubject
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Unable to record time out."
            );

            return;
        }

        alert(
            "Time out recorded successfully!\n\n" +
            "Subject: " + currentSubject
        );

        await loadAttendanceRecords();

    } catch (error) {

        console.error(
            "TIME OUT error:",
            error
        );

        alert(
            "Something went wrong while recording your time out."
        );

    } finally {

        updateSelectedAttendance();
    }
}


/* =========================================================
   BUTTON - TIME IN
========================================================= */

function setButtonTimeIn() {

    const attendanceBtn =
        document.getElementById(
            "attendanceBtn"
        );

    const attendanceBtnText =
        document.getElementById(
            "attendanceBtnText"
        );

    if (!attendanceBtn) {
        return;
    }

    attendanceBtn.disabled =
        false;

    attendanceBtn.classList.remove(
        "time-out",
        "completed"
    );

    attendanceBtn.classList.add(
        "time-in"
    );

    if (attendanceBtnText) {

        attendanceBtnText.textContent =
            "TIME IN";
    }
}


/* =========================================================
   BUTTON - TIME OUT
========================================================= */

function setButtonTimeOut() {

    const attendanceBtn =
        document.getElementById(
            "attendanceBtn"
        );

    const attendanceBtnText =
        document.getElementById(
            "attendanceBtnText"
        );

    if (!attendanceBtn) {
        return;
    }

    attendanceBtn.disabled =
        false;

    attendanceBtn.classList.remove(
        "time-in",
        "completed"
    );

    attendanceBtn.classList.add(
        "time-out"
    );

    if (attendanceBtnText) {

        attendanceBtnText.textContent =
            "TIME OUT";
    }
}


/* =========================================================
   BUTTON - COMPLETED
========================================================= */

function setButtonCompleted() {

    const attendanceBtn =
        document.getElementById(
            "attendanceBtn"
        );

    const attendanceBtnText =
        document.getElementById(
            "attendanceBtnText"
        );

    if (!attendanceBtn) {
        return;
    }

    attendanceBtn.disabled =
        true;

    attendanceBtn.classList.remove(
        "time-in",
        "time-out"
    );

    attendanceBtn.classList.add(
        "completed"
    );

    if (attendanceBtnText) {

        attendanceBtnText.textContent =
            "ATTENDANCE COMPLETED";
    }
}


/* =========================================================
   GLOBAL PC SEARCH
========================================================= */

let dashboardSearchComputers = [];
let dashboardSearchTimer = null;


/* ---------------------------------------------------------
   ESCAPE HTML
--------------------------------------------------------- */

function escapeSearchHTML(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}


/* ---------------------------------------------------------
   LOAD COMPUTER DATA FOR SEARCH
--------------------------------------------------------- */

async function loadSearchComputerData() {

    try {

        const response = await fetch(
            "/admin/computers/data",
            {
                method: "GET",

                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },

                credentials: "same-origin",

                cache: "no-store"
            }
        );


        if (!response.ok) {
            throw new Error(
                "Computer data request failed: " +
                response.status
            );
        }


        const data = await response.json();


        dashboardSearchComputers =
            data.computers || [];


        console.log(
            "Search computer data loaded:",
            dashboardSearchComputers
        );


    } catch (error) {

        console.error(
            "Unable to load computers for search:",
            error
        );

        dashboardSearchComputers = [];
    }
}


/* ---------------------------------------------------------
   RENDER SEARCH RESULTS
--------------------------------------------------------- */

function renderDashboardSearchResults(results) {

    const resultsBox =
        document.getElementById(
            "globalSearchResults"
        );


    if (!resultsBox) return;


    if (!results.length) {

        resultsBox.innerHTML = `
            <div class="global-search-empty">

                <i class="fa-solid fa-magnifying-glass"></i>

                <span>
                    No computers found.
                </span>

            </div>
        `;

        resultsBox.classList.add("show");

        return;
    }


    resultsBox.innerHTML = results
        .slice(0, 8)
        .map(function (computer) {

            const computerName =
                escapeSearchHTML(
                    computer.computer_name ||
                    computer.name ||
                    "Unnamed PC"
                );


            const lab =
                escapeSearchHTML(
                    computer.lab ||
                    "Laboratory"
                );


            const status =
                escapeSearchHTML(
                    computer.status ||
                    "Unknown"
                );


            let statusText =
                String(
                    computer.status || "offline"
                )
                .toLowerCase()
                .replace(/\s+/g, "");


            if (statusText === "inuse") {
                statusText = "In Use";
            }
            else if (statusText === "online") {
                statusText = "Online";
            }
            else if (
                statusText === "maintenance" ||
                statusText === "maint"
            ) {
                statusText = "Maintenance";
            }
            else if (statusText === "locked") {
                statusText = "Locked";
            }
            else {
                statusText = "Offline";
            }


            return `
                <div
                    class="global-search-result"
                    onclick="openDashboardComputerResult(${Number(computer.id)})"
                >

                    <div class="global-search-icon computer">

                        <i class="fa-solid fa-computer"></i>

                    </div>


                    <div class="global-search-text">

                        <div class="global-search-title">
                            ${computerName}
                        </div>

                        <div class="global-search-subtitle">
                            ${lab} • ${statusText}
                        </div>

                    </div>

                </div>
            `;

        })
        .join("");


    resultsBox.classList.add("show");
}


/* ---------------------------------------------------------
   SEARCH COMPUTERS
--------------------------------------------------------- */

function searchDashboardComputers(query) {

    const resultsBox =
        document.getElementById(
            "globalSearchResults"
        );


    if (!resultsBox) return;


    query =
        String(query || "")
            .trim()
            .toLowerCase();


    if (!query) {

        resultsBox.innerHTML = "";

        resultsBox.classList.remove("show");

        return;
    }


    const results =
        dashboardSearchComputers.filter(
            function (computer) {

                const computerName =
                    String(
                        computer.computer_name || ""
                    ).toLowerCase();


                const lab =
                    String(
                        computer.lab || ""
                    ).toLowerCase();


                const ip =
                    String(
                        computer.ip_address || ""
                    ).toLowerCase();


                const mac =
                    String(
                        computer.mac_address || ""
                    ).toLowerCase();


                const status =
                    String(
                        computer.status || ""
                    ).toLowerCase();


                return (
                    computerName.includes(query) ||
                    lab.includes(query) ||
                    ip.includes(query) ||
                    mac.includes(query) ||
                    status.includes(query)
                );
            }
        );


    renderDashboardSearchResults(
        results
    );
}


/* ---------------------------------------------------------
   OPEN COMPUTER RESULT
--------------------------------------------------------- */

function openDashboardComputerResult(computerId) {

    const input =
        document.getElementById(
            "globalSearchInput"
        );


    const resultsBox =
        document.getElementById(
            "globalSearchResults"
        );


    if (input) {
        input.value = "";
    }


    if (resultsBox) {

        resultsBox.innerHTML = "";

        resultsBox.classList.remove(
            "show"
        );
    }


    /*
     * Go directly to Computer Management.
     *
     * The existing Computer Management page
     * will handle the computer list.
     */

    window.location.href =
        "/admin/computers";
}


/* ---------------------------------------------------------
   INITIALIZE SEARCH
--------------------------------------------------------- */

function initDashboardSearch() {

    const input =
        document.getElementById(
            "globalSearchInput"
        );


    const searchBox =
        document.getElementById(
            "globalSearchBox"
        );


    const resultsBox =
        document.getElementById(
            "globalSearchResults"
        );


    if (
        !input ||
        !searchBox ||
        !resultsBox
    ) {

        console.warn(
            "Global search elements not found."
        );

        return;
    }


    /*
     * Load computer data immediately.
     */

    loadSearchComputerData();


    /*
     * Search while typing.
     */

    input.addEventListener(
        "input",
        function () {

            const query =
                this.value;


            clearTimeout(
                dashboardSearchTimer
            );


            dashboardSearchTimer =
                setTimeout(
                    function () {

                        searchDashboardComputers(
                            query
                        );

                    },
                    200
                );
        }
    );


    /*
     * ENTER
     */

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                this.value = "";

                resultsBox.innerHTML = "";

                resultsBox.classList.remove(
                    "show"
                );

                return;
            }


            if (event.key === "Enter") {

                const firstResult =
                    resultsBox.querySelector(
                        ".global-search-result"
                    );


                if (firstResult) {
                    firstResult.click();
                }
            }
        }
    );


    /*
     * CLOSE WHEN CLICKING OUTSIDE
     */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !searchBox.contains(
                    event.target
                )
            ) {

                resultsBox.classList.remove(
                    "show"
                );
            }
        }
    );
}





/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        const subjectSelect =
            document.getElementById(
                "subjectSelect"
            );

        const instructorSelect =
            document.getElementById(
                "instructorSelect"
            );

        const scheduleText =
            document.getElementById(
                "scheduleText"
            );

                    /* -----------------------------------------------
           SUBJECT CHANGE
        ----------------------------------------------- */

        if (subjectSelect) {

            subjectSelect.addEventListener(
                "change",
                function () {

                    const selectedSubject =
                        this.value;


                    // RESET
                    currentSubject = null;
                    currentInstructor = null;
                    currentSchedule = null;
                    currentRecord = null;


                    if (instructorSelect) {

                        instructorSelect.innerHTML = `
                            <option value="">
                                Select Instructor
                            </option>
                        `;

                        instructorSelect.disabled = true;
                    }


                    if (scheduleText) {

                        scheduleText.textContent =
                            "—";
                    }


                    // NO SUBJECT SELECTED
                    if (!selectedSubject) {

                        setButtonTimeIn();

                        return;
                    }


                    // FIND SCHEDULES FOR SUBJECT
                    const matches =
                        schedules.filter(
                            function (schedule) {

                                return (
                                    schedule.subject_code ===
                                    selectedSubject
                                );

                            }
                        );


                    console.log(
                        "Selected Subject:",
                        selectedSubject
                    );

                    console.log(
                        "Matching Schedules:",
                        matches
                    );


                    // NO SCHEDULE
                    if (!matches.length) {

                        if (scheduleText) {

                            scheduleText.textContent =
                                "No schedule available";
                        }

                        setButtonTimeIn();

                        return;
                    }


                    // ======================================
                    // LOAD INSTRUCTORS
                    // ======================================

                    const teachers = [];


                    matches.forEach(
                        function (schedule) {

                            const teacher =
                                String(
                                    schedule.teacher ||
                                    ""
                                ).trim();


                            if (
                                teacher &&
                                !teachers.includes(
                                    teacher
                                )
                            ) {

                                teachers.push(
                                    teacher
                                );

                            }

                        }
                    );


                    if (instructorSelect) {

                        teachers.forEach(
                            function (teacher) {

                                const option =
                                    document.createElement(
                                        "option"
                                    );

                                option.value =
                                    teacher;

                                option.textContent =
                                    teacher;

                                instructorSelect.appendChild(
                                    option
                                );

                            }
                        );


                        instructorSelect.disabled =
                            false;


                        // AUTO SELECT IF ONLY ONE
                        if (
                            teachers.length === 1
                        ) {

                            instructorSelect.value =
                                teachers[0];

                            instructorSelect.dispatchEvent(
                                new Event("change")
                            );

                        }

                    }

                }
            );

        }

        const attendanceBtn =
            document.getElementById(
                "attendanceBtn"
            );


        /* -----------------------------------------------
           INITIAL
        ----------------------------------------------- */

        if (scheduleText) {
            scheduleText.textContent =
                "—";
        }

       if (attendanceBtn) {

                attendanceBtn.disabled = true;

                attendanceBtn.addEventListener(
                    "click",
                    async function () {

                        if (!currentSubject) {
                            return;
                        }

                        const hasTimeIn =
                            currentRecord &&
                            currentRecord.timeIn &&
                            currentRecord.timeIn !== "—";

                        const hasTimeOut =
                            currentRecord &&
                            currentRecord.timeOut &&
                            currentRecord.timeOut !== "—" &&
                            currentRecord.timeOut !== "";

                        /*
                        * TIME IN exists but TIME OUT does not
                        * → RECORD TIME OUT
                        */
                        const isTimeOut =
                            hasTimeIn && !hasTimeOut;

                        if (isTimeOut) {

                            await recordTimeOut();

                        } else if (!currentRecord) {

                            await recordTimeIn();

                        } else if (hasTimeIn && hasTimeOut) {

                            setButtonCompleted();

                        } else {

                            await recordTimeIn();
                        }
                    }
                );
            }

        loadAttendanceNotifications();

            if (attendanceNotificationTimer) {
                clearInterval(attendanceNotificationTimer);
            }

            attendanceNotificationTimer =
                setInterval(
                    loadAttendanceNotifications,
                    5000
                );
    

        /* -----------------------------------------------
           LOAD DATABASE RECORDS
        ----------------------------------------------- */

        loadAttendanceRecords();

            
/* -----------------------------------------------
   INSTRUCTOR CHANGE
----------------------------------------------- */

if (instructorSelect) {

    instructorSelect.addEventListener(
        "change",
        function () {

            const subject =
                subjectSelect.value;

            const instructor =
                this.value;


            // RESET
            if (scheduleText) {

                scheduleText.textContent =
                    "—";
            }


            currentSubject = null;
            currentInstructor = null;
            currentSchedule = null;
            currentRecord = null;


            if (
                !subject ||
                !instructor
            ) {

                setButtonTimeIn();

                return;
            }


            // FIND MATCHING SCHEDULE
            const schedule =
                schedules.find(
                    function (item) {

                        return (
                            item.subject_code ===
                                subject &&

                            item.teacher ===
                                instructor
                        );

                    }
                );


            console.log(
                "Selected schedule:",
                schedule
            );


            if (!schedule) {

                if (scheduleText) {

                    scheduleText.textContent =
                        "No schedule available";
                }

                setButtonTimeIn();

                return;
            }


            // SAVE CURRENT DATA
            currentSchedule =
                schedule;

            currentInstructor =
                schedule.teacher;


            // ==========================================
            // DISPLAY SCHEDULE
            // ==========================================

            if (scheduleText) {

                let displaySchedule = "";


                if (schedule.day) {

                    displaySchedule +=
                        schedule.day;
                }


                if (schedule.time) {

                    if (displaySchedule) {

                        displaySchedule +=
                            " • ";

                    }

                    displaySchedule +=
                        schedule.time;
                }


                if (schedule.room) {

                    if (displaySchedule) {

                        displaySchedule +=
                            " • ";

                    }

                    displaySchedule +=
                        schedule.room;
                }


                scheduleText.textContent =
                    displaySchedule || "—";
            }


            // ==========================================
            // IMPORTANT
            // SAVE SUBJECT CODE + NAME
            // ==========================================

            currentSubject =
                schedule.subject_code +
                " " +
                schedule.subject_name;


            currentRecord =
                findTodayRecord(
                    currentSubject
                );


            updateSelectedAttendance();

        }
    );

}


console.log(
    "LABSTRACK Student Attendance connected to Laravel."
);

function showAttendanceSuccess(message) {

    const existing =
        document.getElementById(
            "attendanceSuccessModal"
        );

    if (existing) {
        existing.remove();
    }

    const modal =
        document.createElement("div");

    modal.id =
        "attendanceSuccessModal";

    modal.innerHTML = `
        <div class="attendance-success-overlay">

            <div class="attendance-success-card">

                <div class="attendance-success-icon">
                    <i class="fa-solid fa-check"></i>
                </div>

                <h2>
                    Time In Successful!
                </h2>

                <p>
                    ${escapeHtml(
                        message ||
                        "Your attendance has been recorded successfully."
                    )}
                </p>

                <button
                    type="button"
                    class="attendance-success-btn"
                    onclick="closeAttendanceSuccess()"
                >
                    OK
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    requestAnimationFrame(function () {
        modal.classList.add("show");
    });
}


function closeAttendanceSuccess() {

    const modal =
        document.getElementById(
            "attendanceSuccessModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

    setTimeout(function () {

        modal.remove();

    }, 250);
}

// ==========================================
// SIDEBAR TOGGLE
// ==========================================
document.addEventListener("DOMContentLoaded", function () {

    const app = document.querySelector(".app");
    const hamburgerBtn =
        document.getElementById("hamburgerBtn");

    // SIDEBAR TOGGLE
    if (hamburgerBtn) {

        hamburgerBtn.addEventListener("click", function () {

            app.classList.toggle("sidebar-closed");

        });

    }


    // VIEW SCHEDULE BUTTON
    const viewScheduleBtn =
        document.getElementById('viewScheduleBtn');

    if (viewScheduleBtn) {

        viewScheduleBtn.addEventListener(
            'click',
            function () {

                loadStudentSchedulePage();

            }
        );

    }
}
    )});