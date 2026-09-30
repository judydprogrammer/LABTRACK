/* =========================================================
   LABSTRACK - ADMIN DASHBOARD
   ========================================================= */


/* =========================================================
   PAGE TITLES
   ========================================================= */

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
    settings: "Setting"
};


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function goTo(pageId) {

    const pageRoutes = {
        dashboard: "/admin/dashboard",
        subjects: "/admin/subjects",
        schedule: "/admin/schedule",
        computers: "/admin/computers",
        attendance: "/admin/attendance",
        monitoring: "/admin/monitoring",
        violations: "/admin/violations",
        reports: "/admin/reports",
        announcement: "/admin/announcement",
        settings: "/admin/settings"
    };


    /*
     * If page has an actual Laravel route,
     * go directly to that page.
     */

    if (pageRoutes[pageId]) {
        window.location.href = pageRoutes[pageId];
        return;
    }


    /*
     * For pages inside the current dashboard,
     * show the selected section.
     */

    document.querySelectorAll(".page").forEach(function (page) {
        page.classList.remove("active");
    });


    const page =
        document.getElementById("page-" + pageId);


    if (page) {
        page.classList.add("active");
    }


    /*
     * Active sidebar navigation
     */

    document
        .querySelectorAll(".nav-item[data-page]")
        .forEach(function (nav) {
            nav.classList.remove("active");
        });


    const navBtn =
        document.querySelector(
            '.nav-item[data-page="' + pageId + '"]'
        );


    if (navBtn) {
        navBtn.classList.add("active");
    }


    /*
     * Change page title
     */

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


/* =========================================================
   PROFILE DROPDOWN
   ========================================================= */

function toggleProfile(event) {

    if (event) {
        event.stopPropagation();
    }


    closeNotif();


    const profileMenu =
        document.getElementById("profileMenu");


    if (!profileMenu) {
        console.warn(
            "Profile menu #profileMenu was not found."
        );

        return;
    }


    profileMenu.classList.toggle("open");
}


function closeProfile() {

    const profileMenu =
        document.getElementById("profileMenu");


    if (profileMenu) {
        profileMenu.classList.remove("open");
    }
}


/* =========================================================
   NOTIFICATIONS DROPDOWN
   ========================================================= */

function toggleNotif(event) {

    if (event) {
        event.stopPropagation();
    }


    closeProfile();


    const notifWrap =
        document.getElementById("notifWrap");


    if (!notifWrap) {
        console.warn(
            "Notification wrapper #notifWrap was not found."
        );

        return;
    }


    notifWrap.classList.toggle("open");
}


function closeNotif() {

    const notifWrap =
        document.getElementById("notifWrap");


    if (notifWrap) {
        notifWrap.classList.remove("open");
    }
}


/* =========================================================
   GLOBAL CLICK
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const profileMenu =
            document.getElementById("profileMenu");


        const notifWrap =
            document.getElementById("notifWrap");


        /*
         * Close profile when clicking outside.
         */

        if (
            profileMenu &&
            !profileMenu.contains(event.target)
        ) {
            closeProfile();
        }


        /*
         * Close notifications when clicking outside.
         */

        if (
            notifWrap &&
            !notifWrap.contains(event.target)
        ) {
            closeNotif();
        }

    }
);


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        closeProfile();
        closeNotif();


        if (
            typeof closeLogout === "function"
        ) {
            closeLogout();
        }


        if (
            typeof closeSubjectModal === "function"
        ) {
            closeSubjectModal();
        }


        if (
            typeof closeBlockAppModal === "function"
        ) {
            closeBlockAppModal();
        }

    }
);


/* =========================================================
   CLOCK
   ========================================================= */

function tickClock() {

    const now = new Date();


    const time =
        now.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    const date =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    const heroTime =
        document.getElementById("heroTime");


    const heroDate =
        document.getElementById("heroDate");


    if (heroTime) {
        heroTime.textContent = time;
    }


    if (heroDate) {
        heroDate.textContent = date;
    }

}


tickClock();


setInterval(
    tickClock,
    30000
);


/* =========================================================
   DASHBOARD DATABASE DATA
   ========================================================= */

function loadDashboardData() {

    fetch(
        "/admin/dashboard/data",
        {
            method: "GET",

            headers: {
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },

            credentials: "same-origin",

            cache: "no-store"
        }
    )

    .then(function (response) {

        if (response.status === 401) {

            console.warn(
                "Admin session expired."
            );

            return null;
        }


        if (!response.ok) {

            throw new Error(
                "Dashboard request failed: " +
                response.status
            );

        }


        return response.json();

    })

    .then(function (data) {

        if (!data) {
            return;
        }


        if (!data.success) {

            console.warn(
                data.message ||
                "Unable to load dashboard data."
            );

            return;
        }


        /* -----------------------------------------
           REGISTERED STUDENTS
           ----------------------------------------- */

        const registeredStudents =
            document.getElementById(
                "registeredStudents"
            );


        if (
            registeredStudents &&
            data.students
        ) {

            registeredStudents.textContent =
                data.students.registered ?? 0;

        }


        /* -----------------------------------------
           STUDENTS PRESENT
           ----------------------------------------- */

        const studentsPresent =
            document.getElementById(
                "studentsPresent"
            );


        if (
            studentsPresent &&
            data.attendance
        ) {

            studentsPresent.textContent =
                data.attendance.present ?? 0;

        }


        /* -----------------------------------------
           ATTENDANCE PERCENTAGE
           ----------------------------------------- */

        const attendancePercentage =
            document.getElementById(
                "attendancePercentage"
            );


        if (
            attendancePercentage &&
            data.attendance
        ) {

            attendancePercentage.textContent =
                (data.attendance.percentage ?? 0) +
                "% of registered";

        }


        /* -----------------------------------------
           ACTIVE COMPUTERS
           ----------------------------------------- */

        const activeComputers =
            document.getElementById(
                "activeComputers"
            );


        const totalComputers =
            document.getElementById(
                "totalComputers"
            );


        if (
            activeComputers &&
            data.computers
        ) {

            activeComputers.textContent =
                data.computers.active ?? 0;

        }


        if (
            totalComputers &&
            data.computers
        ) {

            totalComputers.textContent =
                " / " +
                (data.computers.total ?? 0);

        }


        /* -----------------------------------------
           TODAY'S VIOLATIONS
           ----------------------------------------- */

        const todaysViolations =
            document.getElementById(
                "todaysViolations"
            );


        if (
            todaysViolations &&
            data.violations
        ) {

            todaysViolations.textContent =
                data.violations.today ?? 0;

        }


        /* -----------------------------------------
           UNRESOLVED VIOLATIONS
           ----------------------------------------- */

        const unresolvedViolations =
            document.getElementById(
                "unresolvedViolations"
            );


        if (
            unresolvedViolations &&
            data.violations
        ) {

            unresolvedViolations.textContent =
                (data.violations.unresolved ?? 0) +
                " unresolved";

        }

    })

    .catch(function (error) {

        console.error(
            "Error loading dashboard data:",
            error
        );

    });

}


/* =========================================================
   LIVE COMPUTER MONITORING
   ========================================================= */

let dashboardComputers = [];


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeDashboardHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;
}


/* =========================================================
   COMPUTER STATUS
   ========================================================= */

function getDashboardPcState(status) {

    const normalized =
        String(status || "offline")
            .toLowerCase()
            .replace(/\s+/g, "");


    /*
     * IN USE
     */

    if (normalized === "inuse") {

        return {
            className: "inuse",
            icon: "fa-user",
            label: "In Use"
        };

    }


    /*
     * ONLINE / IDLE
     */

    if (normalized === "online") {

        return {
            className: "online",
            icon: "fa-desktop",
            label: "Idle"
        };

    }


    /*
     * MAINTENANCE
     */

    if (
        normalized === "maintenance" ||
        normalized === "maint"
    ) {

        return {
            className: "maint",
            icon: "fa-screwdriver-wrench",
            label: "Maintenance"
        };

    }


    /*
     * LOCKED
     */

    if (normalized === "locked") {

        return {
            className: "offline",
            icon: "fa-lock",
            label: "Locked"
        };

    }


    /*
     * OFFLINE
     */

    return {
        className: "offline",
        icon: "fa-power-off",
        label: "Offline"
    };

}


/* =========================================================
   DASHBOARD PC GRID
   ========================================================= */

function dashboardMonitorGridHTML(computers) {

    if (
        !computers ||
        computers.length === 0
    ) {

        return `
            <div class="dashboard-pc-empty">

                <i class="fa-solid fa-computer"></i>

                <span>
                    No computers registered yet.
                </span>

            </div>
        `;

    }


    return computers
        .slice(0, 8)
        .map(function (computer) {


            const state =
                getDashboardPcState(
                    computer.status
                );


            const pcName =
                escapeDashboardHTML(
                    computer.computer_name ||
                    computer.name ||
                    "Unnamed PC"
                );


            const lab =
                escapeDashboardHTML(
                    computer.lab ||
                    computer.lab_name ||
                    "Laboratory"
                );


            return `
                <div
                    class="pc-tile ${state.className}"
                    onclick="window.location.href='/admin/computers'"
                    title="Open Computer Management"
                >

                    <i
                        class="fa-solid ${state.icon}"
                    ></i>


                    <div class="pc-name">
                        ${pcName}
                    </div>


                    <div class="pc-state">
                        ${state.label}
                    </div>


                    <div class="dashboard-pc-lab">
                        ${lab}
                    </div>

                </div>
            `;

        })
        .join("");

}


/* =========================================================
   LOAD REAL COMPUTER DATA
   ========================================================= */

async function loadDashboardMonitorGrid() {

    const grid =
        document.getElementById(
            "dashMonitorGrid"
        );


    if (!grid) {
        return;
    }


    try {

        const response =
            await fetch(
                "/admin/computers/data",
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json",

                        "X-Requested-With":
                            "XMLHttpRequest"
                    },

                    credentials:
                        "same-origin",

                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load computer data: " +
                response.status
            );

        }


        const data =
            await response.json();


        dashboardComputers =
            data.computers || [];


        grid.innerHTML =
            dashboardMonitorGridHTML(
                dashboardComputers
            );


    }
    catch (error) {

        console.error(
            "Dashboard computer monitoring error:",
            error
        );


        grid.innerHTML = `
            <div
                class="dashboard-pc-empty error"
            >

                <i
                    class="fa-solid fa-triangle-exclamation"
                ></i>

                <span>
                    Unable to load computer status.
                </span>

            </div>
        `;

    }

}

/* =========================================
   REALTIME RECENT ACTIVITIES
   SOURCE: VIOLATION LOGS
========================================= */

function escapeDashboardHTML(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}

function formatActivityTime(dateValue) {
    if (!dateValue) {
        return "Unknown time";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return dateValue;
    }

    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) {
        return "Just now";
    }

    if (diffMinutes < 60) {
        return diffMinutes + (diffMinutes === 1 ? " minute ago" : " minutes ago");
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return diffHours + (diffHours === 1 ? " hour ago" : " hours ago");
    }

    const diffDays = Math.floor(diffHours / 24);

    return diffDays + (diffDays === 1 ? " day ago" : " days ago");
}


function getViolationIcon(violation) {

    const text = String(
        violation.violation_type ||
        violation.type ||
        violation.description ||
        violation.reason ||
        ""
    ).toLowerCase();

    if (
        text.includes("unauthorized") ||
        text.includes("blocked") ||
        text.includes("restricted")
    ) {
        return "fa-ban";
    }

    if (
        text.includes("warning") ||
        text.includes("violation")
    ) {
        return "fa-triangle-exclamation";
    }

    return "fa-circle-exclamation";
}


function getViolationColor(violation) {

    const status = String(
        violation.status ||
        ""
    ).toLowerCase();

    if (
        status.includes("resolved") ||
        status.includes("cleared")
    ) {
        return "green";
    }

    return "red";
}


async function loadRecentActivities() {

    const container =
        document.getElementById("recentActivityList");

    if (!container) {
        return;
    }

    try {

        const response = await fetch(
            "/admin/violations/data",
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
                "Failed to load violations: " +
                response.status
            );
        }

        const data = await response.json();

        const violations =
            data.violations || [];

        if (violations.length === 0) {

            container.innerHTML = `
                <div class="list-row">
                    <div class="row-icon">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>

                    <div class="row-main">
                        <div class="row-title">
                            No recent violations
                        </div>

                        <div class="row-sub">
                            Everything looks clear.
                        </div>
                    </div>
                </div>
            `;

            return;
        }


        /*
         * Latest violations first
         */
        const latestViolations =
            violations.slice(0, 5);


        container.innerHTML =
            latestViolations.map(function (violation) {

                const icon =
                    getViolationIcon(violation);

                const color =
                    getViolationColor(violation);


                const pc =
                    escapeDashboardHTML(
                        violation.computer_name ||
                        violation.pc_name ||
                        violation.computer ||
                        violation.pc ||
                        ""
                    );


                const student =
                    escapeDashboardHTML(
                        violation.student_name ||
                        violation.fullname ||
                        violation.student ||
                        ""
                    );


                const type =
                    escapeDashboardHTML(
                        violation.violation_type ||
                        violation.type ||
                        violation.description ||
                        violation.reason ||
                        "Violation detected"
                    );


                const timestamp =
                    violation.created_at ||
                    violation.violation_time ||
                    violation.time ||
                    violation.date;


                let title = type;

                if (pc) {
                    title += " on " + pc;
                }

                if (student) {
                    title += " — " + student;
                }


                return `
                    <div class="list-row">

                        <div
                            class="row-icon"
                            style="
                                background:var(--${color}-soft);
                                color:var(--${color});
                            "
                        >
                            <i class="fa-solid ${icon}"></i>
                        </div>

                        <div class="row-main">

                            <div class="row-title">
                                ${title}
                            </div>

                            <div class="row-sub">
                                ${formatActivityTime(timestamp)}
                            </div>

                        </div>

                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "Error loading recent activities:",
            error
        );

        container.innerHTML = `
            <div class="list-row">

                <div class="row-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>

                <div class="row-main">

                    <div class="row-title">
                        Unable to load recent activities
                    </div>

                    <div class="row-sub">
                        Please try again.
                    </div>

                </div>

            </div>
        `;
    }
}


/* =========================================================
   SYSTEM STATUS
   ========================================================= */

const systemStatus = [

    {
        name: "Monitoring Server",
        state: "ok",
        val: "Operational"
    },

    {
        name: "Attendance Sync",
        state: "ok",
        val: "Operational"
    },

    {
        name: "Lab Network — CLAB1–3",
        state: "ok",
        val: "Stable"
    },

    {
        name: "Lab Network — CLAB4",
        state: "warn",
        val: "Degraded"
    },

    {
        name: "Backup Service",
        state: "ok",
        val: "Last backup 2h ago"
    }

];


function renderSystemStatus() {

    const container =
        document.getElementById(
            "systemStatusList"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        systemStatus
            .map(function (s) {

                return `
                    <div class="status-item">

                        <span
                            class="status-dot ${s.state}"
                        ></span>


                        <span class="status-name">
                            ${s.name}
                        </span>


                        <span class="status-val">
                            ${s.val}
                        </span>

                    </div>
                `;

            })
            .join("");

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMsg =
        document.getElementById(
            "toastMsg"
        );


    if (
        !toast ||
        !toastMsg
    ) {
        return;
    }


    toastMsg.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2400
        );

}


/* =========================================================
   LOGOUT MODAL
   ========================================================= */

function openLogout() {

    closeProfile();
    closeNotif();


    const logoutModal =
        document.getElementById(
            "logoutModal"
        );


    if (logoutModal) {

        logoutModal.classList.add(
            "open"
        );

    }

}


function closeLogout() {

    const logoutModal =
        document.getElementById(
            "logoutModal"
        );


    if (logoutModal) {

        logoutModal.classList.remove(
            "open"
        );

    }

}


/* =========================================================
   CONFIRM LOGOUT
   ========================================================= */

function confirmLogout() {

    closeLogout();


    const logoutForm =
        document.getElementById(
            "logoutForm"
        );


    if (logoutForm) {

        logoutForm.submit();

        return;
    }


    /*
     * Fallback logout
     */

    const csrf =
        getCsrfToken();


    fetch(
        "/admin/logout",
        {
            method: "POST",

            headers: {
                "X-CSRF-TOKEN": csrf,
                "Accept": "application/json",
                "X-Requested-With":
                    "XMLHttpRequest"
            },

            credentials:
                "same-origin"
        }
    )

    .then(function () {

        window.location.href =
            "/admin";

    })

    .catch(function (error) {

        console.error(
            "Logout failed:",
            error
        );

    });

}


/* =========================================================
   CSRF
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
   GLOBAL SEARCH
========================================================= */

let globalSearchTimer = null;
let globalSearchRequest = null;


function escapeSearchHTML(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


/*
|--------------------------------------------------------------------------
| SHOW SEARCH RESULTS
|--------------------------------------------------------------------------
*/

function renderGlobalSearchResults(results) {

    const container =
        document.getElementById("globalSearchResults");

    if (!container) return;


    if (!results || results.length === 0) {

        container.innerHTML = `
            <div class="global-search-empty">
                <i class="fa-solid fa-magnifying-glass"></i>

                <span>
                    No results found
                </span>
            </div>
        `;

        container.classList.add("show");

        return;
    }


    container.innerHTML = results.map(function (result) {

        return `
            <div
                class="global-search-result"
                onclick="openGlobalSearchResult('${result.url}')"
            >

                <div class="global-search-icon ${result.type}">
                    <i class="fa-solid ${escapeSearchHTML(result.icon)}"></i>
                </div>

                <div class="global-search-text">

                    <div class="global-search-title">
                        ${escapeSearchHTML(result.title)}
                    </div>

                    <div class="global-search-subtitle">
                        ${escapeSearchHTML(result.subtitle)}
                    </div>

                </div>

            </div>
        `;

    }).join("");


    container.classList.add("show");
}


/*
|--------------------------------------------------------------------------
| SEARCH DATABASE
|--------------------------------------------------------------------------
*/

async function performGlobalSearch(query) {

    const container =
        document.getElementById("globalSearchResults");

    if (!container) return;


    if (!query.trim()) {

        container.innerHTML = "";

        container.classList.remove("show");

        return;
    }


    container.innerHTML = `
        <div class="global-search-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Searching...</span>
        </div>
    `;

    container.classList.add("show");


    try {

        if (globalSearchRequest) {
            globalSearchRequest.abort();
        }


        globalSearchRequest =
            new AbortController();


        const response = await fetch(
            `/admin/global-search?q=${encodeURIComponent(query)}`,
            {
                method: "GET",

                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },

                credentials: "same-origin",

                signal: globalSearchRequest.signal,

                cache: "no-store"
            }
        );


        if (!response.ok) {
            throw new Error(
                "Search request failed: " +
                response.status
            );
        }


        const data =
            await response.json();

        console.log("GLOBAL SEARCH DATA:", data);
        console.log("SEARCH RESULTS:", data.results);

        if (!data.success) {
            throw new Error(
                data.message ||
                "Search failed."
            );
        }


        renderGlobalSearchResults(
            data.results || []
        );


    } catch (error) {

        if (error.name === "AbortError") {
            return;
        }

        console.error(
            "Global search error:",
            error
        );

        container.innerHTML = `
            <div class="global-search-empty error">
                <i class="fa-solid fa-triangle-exclamation"></i>

            </div>
        `;

        container.classList.add("show");
    }
}


/*
|--------------------------------------------------------------------------
| OPEN RESULT
|--------------------------------------------------------------------------
*/

function openGlobalSearchResult(url) {

    const input =
        document.getElementById("globalSearchInput");

    const results =
        document.getElementById("globalSearchResults");


    if (input) {
        input.value = "";
    }


    if (results) {

        results.innerHTML = "";

        results.classList.remove("show");
    }


    window.location.href = url;
}


/*
|--------------------------------------------------------------------------
| INITIALIZE GLOBAL SEARCH
|--------------------------------------------------------------------------
*/

function initGlobalSearch() {

    const input =
        document.getElementById("globalSearchInput");

    const searchBox =
        document.getElementById("globalSearchBox");

    const results =
        document.getElementById("globalSearchResults");


    if (!input || !searchBox || !results) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            const query =
                this.value.trim();


            clearTimeout(
                globalSearchTimer
            );


            globalSearchTimer =
                setTimeout(
                    function () {

                        performGlobalSearch(
                            query
                        );

                    },
                    250
                );
        }
    );


    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                this.value = "";

                results.innerHTML = "";

                results.classList.remove(
                    "show"
                );
            }


            if (
                event.key === "Enter" &&
                results.classList.contains("show")
            ) {

                const firstResult =
                    results.querySelector(
                        ".global-search-result"
                    );

                if (firstResult) {
                    firstResult.click();
                }
            }
        }
    );


    document.addEventListener(
        "click",
        function (event) {

            if (
                !searchBox.contains(
                    event.target
                )
            ) {

                results.classList.remove(
                    "show"
                );
            }
        }
    );
}




/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* -----------------------------------------
           LIVE MONITORING
           ----------------------------------------- */

        loadDashboardMonitorGrid();


        /* -----------------------------------------
           DASHBOARD DATA
           ----------------------------------------- */

        loadDashboardData();


        /* -----------------------------------------
           RECENT ACTIVITIES
           ----------------------------------------- */

        loadRecentActivities();


        /* -----------------------------------------
           SYSTEM STATUS
           ----------------------------------------- */

        renderSystemStatus();


        /* -----------------------------------------
           GLOBAL SEARCH
           ----------------------------------------- */

        initGlobalSearch();


        /* -----------------------------------------
           LOGOUT MODAL
           ----------------------------------------- */

        const logoutModal =
            document.getElementById(
                "logoutModal"
            );


        if (logoutModal) {

            logoutModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        this
                    ) {

                        closeLogout();

                    }

                }
            );

        }


        /* -----------------------------------------
           HAMBURGER
           ----------------------------------------- */

        const app =
            document.querySelector(
                ".app"
            );


        const hamburgerBtn =
            document.getElementById(
                "hamburgerBtn"
            );


        if (
            hamburgerBtn &&
            app
        ) {

            hamburgerBtn.addEventListener(
                "click",
                function () {

                    app.classList.toggle(
                        "sidebar-closed"
                    );

                }
            );

        }

    }
);
/* =========================================================
   LOGOUT
========================================================= */

function openLogout() {

    const modal = document.getElementById('logoutModal');

    if (!modal) {
        console.error('logoutModal not found.');
        return;
    }

    modal.style.display = 'flex';

    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}


function closeLogout() {

    const modal = document.getElementById('logoutModal');

    if (!modal) return;

    modal.classList.remove('show');

    setTimeout(() => {
        modal.style.display = 'none';
    }, 200);
}

function confirmLogout() {

    const csrf =
        document.querySelector('meta[name="csrf-token"]')?.content;

    if (!csrf) {
        console.error('CSRF token not found.');
        showToast('CSRF token not found. Please refresh the page.');
        return;
    }

    if (!adminRoutes.logout) {
        console.error('Admin logout route not found.');
        showToast('Logout route not found.');
        return;
    }

    const form = document.createElement('form');

    form.method = 'POST';
    form.action = adminRoutes.logout;
    form.style.display = 'none';

    const token = document.createElement('input');

    token.type = 'hidden';
    token.name = '_token';
    token.value = csrf;

    form.appendChild(token);

    document.body.appendChild(form);

    form.submit();
}




/* =========================================================
   REALTIME REFRESH
   ========================================================= */
setInterval(function () {
    loadDashboardData();
    loadDashboardMonitorGrid();
    loadRecentActivities();
}, 5000);