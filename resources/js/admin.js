function goTo(page) {

    // Hide all pages
    document.querySelectorAll('.page').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(`page-${page}`);

    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update active sidebar button
    document.querySelectorAll('.nav-item').forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(
        `.nav-item[data-page="${page}"]`
    );

    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Update page title
    const pageTitle = document.getElementById('pageTitle');

    const titles = {
        dashboard: 'Dashboard',
        subjects: 'Subject Management',
        schedule: 'Schedule Management',
        computers: 'Computer Management',
        attendance: 'Attendance Records',
        monitoring: 'Monitoring Applications',
        violations: 'Violation Logs',
        reports: 'Reports',
        announcement: 'Announcement',
        settings: 'Settings'
    };

    if (pageTitle) {
        pageTitle.textContent = titles[page] || 'Dashboard';
    }

    // Close dropdowns when changing page
    document.querySelectorAll('.profile-menu, .notif-menu').forEach(menu => {
        menu.style.display = '';
    });
}