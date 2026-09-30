document.addEventListener("DOMContentLoaded", function () {


    if (searchInput) {
    searchInput.addEventListener("input", function () {
        renderAttendance();
    });
}

if (blockFilter) {
    blockFilter.addEventListener("change", function () {
        renderAttendance();
    });
}

if (statusFilter) {
    statusFilter.addEventListener("change", function () {
        renderAttendance();
    });
}
    // =========================
    // DASHBOARD
    // =========================

    renderDashboard();

});


function renderDashboard() {


    // =========================
// PAGE NAVIGATION
// =========================

function goTo(page) {

    // Hide all pages
    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active");
    });

    // Show selected page
    const selectedPage = document.getElementById("page-" + page);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    // Update active sidebar button
    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.remove("active");
    });

    const activeButton = document.querySelector(
        `.nav-item[data-page="${page}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }

    // Update page title
    const pageTitle = document.getElementById("pageTitle");

    const titles = {
        dashboard: "Dashboard",
        subjects: "Subject Management",
        schedule: "Schedule Management",
        computers: "Computer Management",
        attendance: "Attendance Records",
        violations: "Violation Logs",
        reports: "Reports",
        announcement: "Announcement",
        settings: "Settings"
    };

    if (pageTitle) {
        pageTitle.textContent = titles[page] || "Dashboard";
    }

    // Optional: render schedule when opened
    if (page === "schedule" && typeof renderSchedules === "function") {
        renderSchedules();
    }
}
    // =========================
    // LIVE MONITORING
    // =========================

    const monitorGrid = document.getElementById("dashMonitorGrid");

    if (monitorGrid) {

        monitorGrid.innerHTML = `
            <div class="monitor-card">
                <div class="monitor-screen">
                    <span class="live-badge">● LIVE</span>
                    <i class="fa-solid fa-desktop"></i>
                </div>

                <div class="monitor-info">
                    <strong>PC-03</strong>
                    <span>VS Code — index.html</span>
                </div>
            </div>

            <div class="monitor-card">
                <div class="monitor-screen">
                    <span class="live-badge">● LIVE</span>
                    <i class="fa-solid fa-desktop"></i>
                </div>

                <div class="monitor-info">
                    <strong>PC-07</strong>
                    <span>Google Chrome — Docs</span>
                </div>
            </div>

            <div class="monitor-card">
                <div class="monitor-screen">
                    <span class="live-badge">● LIVE</span>
                    <i class="fa-solid fa-desktop"></i>
                </div>

                <div class="monitor-info">
                    <strong>PC-11</strong>
                    <span>MySQL Workbench</span>
                </div>
            </div>

            <div class="monitor-card">
                <div class="monitor-screen">
                    <span class="live-badge">● LIVE</span>
                    <i class="fa-solid fa-desktop"></i>
                </div>

                <div class="monitor-info">
                    <strong>PC-14</strong>
                    <span>Unauthorized: Steam</span>
                </div>
            </div>
        `;
    }


    // =========================
    // RECENT ACTIVITIES
    // =========================

    const activityList =
        document.getElementById("recentActivityList");

    if (activityList) {

        activityList.innerHTML = `
            <div class="activity-row">
                <div class="activity-icon">
                    <i class="fa-solid fa-user-check"></i>
                </div>

                <div>
                    <strong>Student logged in</strong>
                    <p>Juan Dela Cruz · PC-03</p>
                </div>

                <span>5 min ago</span>
            </div>

            <div class="activity-row">
                <div class="activity-icon">
                    <i class="fa-solid fa-computer"></i>
                </div>

                <div>
                    <strong>PC started</strong>
                    <p>PC-07 · CLAB1</p>
                </div>

                <span>12 min ago</span>
            </div>

            <div class="activity-row">
                <div class="activity-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>

                <div>
                    <strong>Violation detected</strong>
                    <p>Unauthorized application · PC-14</p>
                </div>

                <span>20 min ago</span>
            </div>
        `;
    }


    // =========================
    // SYSTEM STATUS
    // =========================

    const systemStatus =
        document.getElementById("systemStatusList");

    if (systemStatus) {

        systemStatus.innerHTML = `
            <div class="status-item">
                <div>
                    <strong>Database</strong>
                    <span>Connected</span>
                </div>

                <span class="status-online">Online</span>
            </div>

            <div class="status-item">
                <div>
                    <strong>Monitoring Service</strong>
                    <span>Running normally</span>
                </div>

                <span class="status-online">Online</span>
            </div>

            <div class="status-item">
                <div>
                    <strong>Laboratory Network</strong>
                    <span>90 computers detected</span>
                </div>

                <span class="status-online">Online</span>
            </div>
        `;
    }

}