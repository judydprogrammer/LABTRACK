// =========================================================
// LABTRACK ADMIN - VIOLATION JAVASCRIPT
// =========================================================


// =========================================================
// PAGE TITLES
// =========================================================

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


// =========================================================
// PAGE NAVIGATION
// =========================================================

function goTo(pageId) {

    const routes = window.adminRoutes || {};

    // External / Laravel pages
    if (routes[pageId]) {
        window.location.href = routes[pageId];
        return;
    }

    // Internal page fallback
    const page = document.getElementById("page-" + pageId);

    if (!page) {
        console.warn("Page not found:", pageId);
        return;
    }

    document.querySelectorAll(".page").forEach(function (p) {
        p.classList.remove("active");
    });

    page.classList.add("active");

    document.querySelectorAll(".nav-item[data-page]").forEach(function (nav) {
        nav.classList.remove("active");
    });

    const navButton = document.querySelector(
        '.nav-item[data-page="' + pageId + '"]'
    );

    if (navButton) {
        navButton.classList.add("active");
    }

    const pageTitle = document.getElementById("pageTitle");

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

    if (pageId === "violations") {
        loadViolations();
    }
}

// =========================================================
// PROFILE DROPDOWN
// =========================================================

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


// =========================================================
// NOTIFICATIONS
// =========================================================

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


// =========================================================
// CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
// =========================================================

document.addEventListener("click", function (event) {

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

});


// =========================================================
// ESCAPE KEY
// =========================================================

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeProfile();
        closeNotif();

        // Do NOT call closeSubjectModal()
        // because this page does not contain
        // the subject modal function.
    }

});


// =========================================================
// VIOLATIONS
// =========================================================

let violations = [];

let violationFilter = "all";


// =========================================================
// GLOBAL TOP SEARCH
// =========================================================

let globalViolationSearch = "";

function initGlobalSearch() {

    const searchInput =
        document.getElementById("globalSearchInput");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", function () {

        globalViolationSearch =
            this.value.trim().toLowerCase();

        renderViolations();
    });

}

// =========================================================
// LOAD VIOLATIONS
// =========================================================

async function loadViolations() {

    const tableBody =
        document.getElementById("violationTableBody");


    try {

        if (!window.adminRoutes) {
            throw new Error(
                "adminRoutes is not defined."
            );
        }


        if (!window.adminRoutes.violationsData) {
            throw new Error(
                "Violation data route is missing."
            );
        }


        // Show loading
        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7"
                        style="
                            text-align:center;
                            padding:24px;
                        ">
                        Loading violations...
                    </td>
                </tr>
            `;

        }


        const response = await fetch(
            window.adminRoutes.violationsData,
            {
                method: "GET",

                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },

                credentials: "same-origin"
            }
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }


        const data = await response.json();


        console.log(
            "Violation database response:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to load violation records."
            );

        }


        violations =
            Array.isArray(data.violations)
                ? data.violations
                : [];


        renderViolations();


    } catch (error) {

        console.error(
            "Load Violations Error:",
            error
        );


        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7"
                        style="
                            text-align:center;
                            padding:24px;
                            color:var(--ink-soft);
                        ">
                        Unable to load violation records.
                    </td>
                </tr>
            `;

        }

    }

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================================
// NORMALIZE RESOLVED VALUE
// =========================================================

function isViolationResolved(violation) {

    return (
        violation.resolved === true ||
        violation.resolved === 1 ||
        violation.resolved === "1" ||
        violation.resolved === "true"
    );

}


// =========================================================
// FORMAT SEVERITY
// =========================================================

function getSeverityClass(severity) {

    const value =
        String(severity || "Low")
            .toLowerCase();


    if (value === "high") {
        return "high";
    }


    if (value === "medium") {
        return "medium";
    }


    return "low";

}


// =========================================================
// RENDER VIOLATIONS
// =========================================================

function renderViolations() {

    const tableBody =
        document.getElementById(
            "violationTableBody"
        );


    if (!tableBody) {

        console.error(
            "violationTableBody not found."
        );

        return;
    }


    // Filter
   const filtered =
    violations.filter(function (violation) {

        const resolved =
            isViolationResolved(violation);

        // -----------------------------------------
        // STATUS FILTER
        // -----------------------------------------

        if (violationFilter === "open" && resolved) {
            return false;
        }

        if (violationFilter === "resolved" && !resolved) {
            return false;
        }

        // -----------------------------------------
        // TOP SEARCH FILTER
        // -----------------------------------------

        if (globalViolationSearch) {

            const student =
                String(
                    violation.student ||
                    violation.student_name ||
                    ""
                ).toLowerCase();

            const pc =
                String(
                    violation.pc ||
                    violation.pc_name ||
                    ""
                ).toLowerCase();

            const type =
                String(
                    violation.type ||
                    violation.violation ||
                    violation.violation_type ||
                    ""
                ).toLowerCase();

            const severity =
                String(
                    violation.severity ||
                    ""
                ).toLowerCase();

            const time =
                String(
                    violation.time ||
                    violation.created_at ||
                    ""
                ).toLowerCase();

            const status =
                resolved
                    ? "resolved"
                    : "unresolved";

            const searchableText = [
                student,
                pc,
                type,
                severity,
                time,
                status
            ].join(" ");

            if (!searchableText.includes(globalViolationSearch)) {
                return false;
            }
        }

        return true;
    });


    // Count label
    const countLabel =
        document.getElementById(
            "violationCountLabel"
        );


    if (countLabel) {

        countLabel.textContent =
            violations.length +
            (
                violations.length === 1
                    ? " logged violation"
                    : " logged violations"
            );

    }


    // No records
    if (filtered.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7"
                    style="
                        text-align:center;
                        padding:24px;
                    ">
                    No violations in this view.
                </td>
            </tr>
        `;


        updateViolationBadge();

        return;
    }


    // Render records
    tableBody.innerHTML =
        filtered.map(function (violation) {

            const resolved =
                isViolationResolved(violation);


            const severity =
                violation.severity || "Low";


            const severityClass =
                getSeverityClass(severity);


            const statusClass =
                resolved
                    ? "resolved"
                    : "unresolved";


            const student =
                violation.student ||
                violation.student_name ||
                "—";


            const pc =
                violation.pc ||
                violation.pc_name ||
                "—";


            const type =
                violation.type ||
                violation.violation ||
                violation.violation_type ||
                "—";


            const time =
                violation.time ||
                violation.created_at ||
                "—";


            return `
                <tr>

                    <td>
                        ${escapeHtml(student)}
                    </td>


                    <td>
                        ${escapeHtml(pc)}
                    </td>


                    <td>
                        ${escapeHtml(type)}
                    </td>


                    <td>
                        <span class="severity ${severityClass}">
                            ${escapeHtml(severity)}
                        </span>
                    </td>


                    <td>
                        ${escapeHtml(time)}
                    </td>


                    <td>
                        <span class="status ${statusClass}">
                            ${
                                resolved
                                    ? "Resolved"
                                    : "Unresolved"
                            }
                        </span>
                    </td>


                    <td>

                        <div class="row-actions">

                            <button
                                type="button"
                                class="violation-action ${
                                    resolved
                                        ? ""
                                        : "resolve"
                                }"
                                onclick="toggleViolation(${Number(violation.id)})"
                                title="${
                                    resolved
                                        ? "Reopen violation"
                                        : "Resolve violation"
                                }"
                            >

                                <i class="fa-solid ${
                                    resolved
                                        ? "fa-rotate-left"
                                        : "fa-check"
                                }"></i>

                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");


    updateViolationBadge();

}


// =========================================================
// FILTER VIOLATIONS
// =========================================================

function filterViolations(filter) {

    console.log(
        "Violation filter:",
        filter
    );


    violationFilter = filter;


    // Remove active
    document
        .querySelectorAll(
            "#page-violations .view-all"
        )
        .forEach(function (button) {

            button.classList.remove("active");

        });


    // Find active button
    let activeButton = null;


    if (filter === "all") {

        activeButton =
            document.getElementById(
                "vfilter-all"
            );

    }


    if (filter === "open") {

        activeButton =
            document.getElementById(
                "vfilter-open"
            );

    }


    if (filter === "resolved") {

        activeButton =
            document.getElementById(
                "vfilter-resolved"
            );

    }


    if (activeButton) {

        activeButton.classList.add(
            "active"
        );

    }


    renderViolations();

}


// =========================================================
// RESOLVE / REOPEN VIOLATION
// =========================================================

async function toggleViolation(id) {

    if (!id) {

        console.error(
            "Invalid violation ID."
        );

        return;
    }


    try {

        const csrfToken =
            document
                .querySelector(
                    'meta[name="csrf-token"]'
                )
                ?.getAttribute("content") || "";


        if (!window.adminRoutes) {

            throw new Error(
                "adminRoutes is not defined."
            );

        }


        if (!window.adminRoutes.violationsToggle) {

            throw new Error(
                "Violation toggle route is missing."
            );

        }


        const response =
            await fetch(
                `${window.adminRoutes.violationsToggle}/${id}/toggle`,
                {
                    method: "PUT",

                    headers: {
                        "X-CSRF-TOKEN": csrfToken,
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    },

                    credentials: "same-origin"
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Toggle HTTP Error:",
                errorText
            );


            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Toggle violation response:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to update violation."
            );

        }


        // Reload database records
        await loadViolations();


        // Toast
        if (
            typeof showToast ===
            "function"
        ) {

            showToast(
                data.message ||
                "Violation status updated."
            );

        }


    } catch (error) {

        console.error(
            "Toggle Violation Error:",
            error
        );


        if (
            typeof showToast ===
            "function"
        ) {

            showToast(
                "Unable to update violation."
            );

        } else {

            alert(
                "Unable to update violation."
            );

        }

    }

}


// =========================================================
// VIOLATION BADGE
// =========================================================

function updateViolationBadge() {

    const open =
        violations.filter(function (violation) {

            return !isViolationResolved(
                violation
            );

        }).length;


    const navBadge =
        document.getElementById(
            "navViolationBadge"
        );


    if (!navBadge) {
        return;
    }


    if (open === 0) {

        navBadge.style.display =
            "none";

    } else {

        navBadge.style.display =
            "flex";

        navBadge.textContent =
            open;

    }

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


// =========================================================
// INITIALIZE
// =========================================================
document.addEventListener(
    "DOMContentLoaded",
    function () {

        const violationPage =
            document.getElementById(
                "page-violations"
            );

        if (violationPage) {
            violationPage.classList.add("active");
        }

        // Initialize top search
        initGlobalSearch();

        // Load violation records
        loadViolations();

    }
);