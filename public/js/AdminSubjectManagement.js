// ==================== ADMIN NAVIGATION ====================

function goTo(pageId) {

    const pageRoutes = {
        dashboard: '/admin/dashboard',
        subjects: '/admin/subjects',
        schedule: '/admin/schedules',
        computers: '/admin/computers',
        attendance: '/admin/attendance',
        violations: '/admin/violations',
        reports: '/admin/reports',
        announcement: '/admin/announcements',
        settings: '/admin/settings'
    };

    if (pageRoutes[pageId]) {
        window.location.href = pageRoutes[pageId];
        return;
    }
}



// ==================== LOGOUT MODAL ====================

function openLogout() {
    const logoutModal = document.getElementById('logoutModal');

    if (!logoutModal) {
        console.error('Logout modal not found.');
        return;
    }

    logoutModal.classList.add('active');
}


// ==================== CLOSE LOGOUT ====================

function closeLogout() {
    const logoutModal = document.getElementById('logoutModal');

    if (logoutModal) {
        logoutModal.classList.remove('active');
    }
}


// ==================== CONFIRM LOGOUT ====================

async function confirmLogout() {

    const logoutForm = document.getElementById('logoutForm');

    if (!logoutForm) {
        console.error('Logout form not found.');
        alert('Logout form not found. Please refresh the page.');
        return;
    }

    try {

        // Get a fresh CSRF token from Laravel
        const csrfToken = await getCsrfToken();

        // Remove old token if there is one
        let tokenInput = logoutForm.querySelector('input[name="_token"]');

        if (!tokenInput) {
            tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_token';
            logoutForm.appendChild(tokenInput);
        }

        // Use fresh token
        tokenInput.value = csrfToken;

        // Submit logout
        logoutForm.submit();

    } catch (error) {

        console.error('Logout error:', error);

        alert('Unable to logout. Please refresh the page and try again.');
    }
}

// ==================== SUBJECT MANAGEMENT ====================

let subjects = [];
let editingSubjectId = null;
let currentSemester = '1st Semester';


// ==================== CSRF TOKEN ====================

async function getCsrfToken() {
    const response = await fetch('/csrf-token', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
        credentials: 'same-origin'
    });

    if (!response.ok) {
        throw new Error('Unable to get CSRF token.');
    }

    const data = await response.json();

    if (!data.token) {
        throw new Error('CSRF token not found.');
    }

    return data.token;
}



// ==================== LOAD SUBJECTS ====================

async function loadSubjects() {
    try {
        const response = await fetch('/admin/subjects/data', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to load subjects.');
        }

        subjects = data.subjects || [];

        renderSubjects();

    } catch (error) {
        console.error('Error loading subjects:', error);
        showToast('Failed to load subjects.');
    }
}


// ==================== FILTER SEMESTER ====================

function filterSubjectSemester(semester, button) {

    currentSemester = semester;

    document.querySelectorAll('.semester-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (button) {
        button.classList.add('active');
    }

    renderSubjects();
}

// ==================== RENDER SUBJECTS ====================

function renderSubjects() {

    console.log('SUBJECTS DATA:', subjects);

    const container =
        document.getElementById('subjectTableContainer');

    if (!container) {
        console.error('subjectTableContainer not found.');
        return;
    }

    container.innerHTML = '';

    const searchInput =
        document.getElementById('globalSearchInput');

    const searchQuery =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : '';

    console.log('SEARCH QUERY:', searchQuery);
    console.log('FIRST SUBJECT CODE:', subjects[0]?.code);

    const filteredSubjects = subjects.filter(subject => {

        const matchesSemester =
            normalizeSemester(subject.semester) === currentSemester;

        if (!matchesSemester) {
            return false;
        }

        if (!searchQuery) {
            return true;
        }

        const searchableText = [
            subject.code,
            subject.name,
            subject.teacher,
            subject.course,
            subject.year_level
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return searchableText.includes(searchQuery);

    });

    if (filteredSubjects.length === 0) {

        container.innerHTML = `
            <div class="empty-subject-state">
                <i class="fa-solid fa-book-open"></i>
                <h3>No Subjects Found</h3>
                <p>
                    No subjects have been added for
                    ${escapeHtml(currentSemester)}.
                </p>
            </div>
        `;

        return;
    }

    // ==================== GROUP BY COURSE + YEAR ====================

    const groups = {};

    filteredSubjects.forEach(subject => {

        const course = subject.course || 'No Course';
        const yearLevel = subject.year_level || 'No Year Level';

        const groupName = `${course} - ${yearLevel}`;

        if (!groups[groupName]) {
            groups[groupName] = [];
        }

        groups[groupName].push(subject);
    });


    // ==================== CREATE GROUPS ====================

    Object.keys(groups)
        .sort()
        .forEach(groupName => {

            const section = document.createElement('div');

            section.className = 'subject-group-section';

            section.innerHTML = `

                <div class="subject-group-title">
                    ${escapeHtml(groupName)}
                </div>

                <div class="table-responsive">

                    <table class="data-table">

                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Subject</th>
                                <th>Teacher</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${groups[groupName]
                                .map(subject => createSubjectRow(subject))
                                .join('')}
                        </tbody>

                    </table>

                </div>
            `;

            container.appendChild(section);
        });
}


// ==================== NORMALIZE SEMESTER ====================

function normalizeSemester(semester) {

    if (!semester) {
        return '';
    }

    const value = String(semester)
        .trim()
        .toLowerCase();

    if (
        value === '1st semester' ||
        value === 'first semester' ||
        value === '1st'
    ) {
        return '1st Semester';
    }

    if (
        value === '2nd semester' ||
        value === 'second semester' ||
        value === '2nd'
    ) {
        return '2nd Semester';
    }

    return semester;
}


// ==================== CREATE SUBJECT ROW ====================

function createSubjectRow(subject) {

    return `
        <tr>

            <td>
                ${escapeHtml(subject.code || '')}
            </td>

            <td>
                ${escapeHtml(subject.name || '')}
            </td>

            <td>
                ${escapeHtml(subject.teacher || '—')}
            </td>

            <td>

                <div class="row-actions">

                    <button
                        type="button"
                        class="icon-btn edit"
                        onclick="openEditSubject(${subject.id})"
                        title="Edit Subject">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        type="button"
                        class="icon-btn delete"
                        onclick="deleteSubject(${subject.id})"
                        title="Delete Subject">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>
    `;
}


// ==================== OPEN ADD MODAL ====================

function openSubjectModal() {

    editingSubjectId = null;

    const modal = document.getElementById('subjectModal');

    if (!modal) {
        console.error('subjectModal not found.');
        return;
    }

    // Clear fields
    document.getElementById('fSubjCode').value = '';
    document.getElementById('fSubjName').value = '';
    document.getElementById('fSubjTeacher').value = '';
    document.getElementById('fSubjCourse').value = '';
    document.getElementById('fSubjYearLevel').value = '';

    // Default semester to currently selected semester
    document.getElementById('fSubjSemester').value = currentSemester;

    // Change modal title
    const title = document.getElementById('subjectModalTitle');

    if (title) {
        title.innerHTML = `
            <i class="fa-solid fa-book-open"></i>
            Add Subject
        `;
    }

    modal.classList.add('active');
}


// ==================== OPEN EDIT MODAL ====================

function openEditSubject(id) {

    const subject = subjects.find(item =>
        Number(item.id) === Number(id)
    );

    if (!subject) {
        showToast('Subject not found.');
        return;
    }

    editingSubjectId = subject.id;

    // Fill fields
    document.getElementById('fSubjCode').value =
        subject.code || '';

    document.getElementById('fSubjName').value =
        subject.name || '';

    document.getElementById('fSubjTeacher').value =
        subject.teacher || '';

    document.getElementById('fSubjCourse').value =
        subject.course || '';

    document.getElementById('fSubjYearLevel').value =
        subject.year_level || '';

    document.getElementById('fSubjSemester').value =
        subject.semester || '';

    // Change modal title
    const title = document.getElementById('subjectModalTitle');

    if (title) {
        title.innerHTML = `
            <i class="fa-solid fa-pen"></i>
            Edit Subject
        `;
    }

    const modal = document.getElementById('subjectModal');

    if (modal) {
        modal.classList.add('active');
    }
}


// ==================== SAVE SUBJECT ====================

async function saveSubject() {

    const code =
        document.getElementById('fSubjCode').value.trim();

    const name =
        document.getElementById('fSubjName').value.trim();

    const teacher =
        document.getElementById('fSubjTeacher').value.trim();

    const course =
        document.getElementById('fSubjCourse').value;

    const yearLevel =
        document.getElementById('fSubjYearLevel').value;

    const semester =
        document.getElementById('fSubjSemester').value;


    // ==================== VALIDATION ====================

    if (!code) {
        showToast('Please enter the subject code.');
        return;
    }

    if (!name) {
        showToast('Please enter the subject name.');
        return;
    }

    if (!course) {
        showToast('Please select a course.');
        return;
    }

    if (!yearLevel) {
        showToast('Please select a year level.');
        return;
    }

    if (!semester) {
        showToast('Please select a semester.');
        return;
    }


    // ==================== DATA ====================

    const payload = {
        code: code,
        name: name,
        teacher: teacher,
        course: course,
        year_level: yearLevel,
        semester: semester
    };


    const isEditing =
        editingSubjectId !== null;

    const url = isEditing
        ? `/admin/subjects/${editingSubjectId}`
        : '/admin/subjects';

    const method = isEditing
        ? 'PUT'
        : 'POST';


    try {

        const response = await fetch(url, {

            method: method,

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': await getCsrfToken()
            },
            credentials: 'same-origin',
            body: JSON.stringify(payload)

        });


        const data = await response.json();


        // ==================== ERROR ====================

        if (!response.ok || !data.success) {

            console.error('Server response:', data);

            if (data.errors) {
                console.error('Validation errors:', data.errors);
            }

            throw new Error(
                data.message || 'Failed to save subject.'
            );
        }


        // ==================== SUCCESS ====================

        closeSubjectModal();

        showToast(
            isEditing
                ? 'Subject updated successfully.'
                : 'Subject added successfully.'
        );

        editingSubjectId = null;

        await loadSubjects();


    } catch (error) {

        console.error('Error saving subject:', error);

        showToast(
            error.message || 'Failed to save subject.'
        );
    }
}


// ==================== DELETE SUBJECT ====================

async function deleteSubject(id) {

    const subject = subjects.find(item =>
        Number(item.id) === Number(id)
    );

    if (!subject) {
        showToast('Subject not found.');
        return;
    }


    const confirmed = confirm(
        `Are you sure you want to delete "${subject.name}"?`
    );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `/admin/subjects/${id}`,
            {
                method: 'DELETE',

                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                }
            }
        );


        const data = await response.json();


        if (!response.ok || !data.success) {
            throw new Error(
                data.message || 'Failed to delete subject.'
            );
        }


        showToast('Subject deleted successfully.');

        await loadSubjects();


    } catch (error) {

        console.error('Error deleting subject:', error);

        showToast(
            error.message || 'Failed to delete subject.'
        );
    }
}


// ==================== CLOSE SUBJECT MODAL ====================

function closeSubjectModal() {

    const modal = document.getElementById('subjectModal');

    if (modal) {
        modal.classList.remove('active');
    }

    editingSubjectId = null;
}


// ==================== ESCAPE HTML ====================

function escapeHtml(value) {

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


// ==================== TOAST ====================

function showToast(message) {

    const toast =
        document.getElementById('toast');

    const toastMessage =
        document.getElementById('toastMessage');


    if (!toast || !toastMessage) {
        console.log(message);
        return;
    }


    toastMessage.textContent = message;

    toast.classList.add('show');


    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}



// ==================== PROFILE DROPDOWN ====================

function toggleProfile(event) {

    if (event) {
        event.stopPropagation();
    }

    const profile = document.getElementById('profileMenu');

    if (!profile) {
        return;
    }

    profile.classList.toggle('open');

    const notifWrap = document.getElementById('notifWrap');

    if (notifWrap) {
        notifWrap.classList.remove('open');
    }
}


// ==================== NOTIFICATION DROPDOWN ====================

function toggleNotif(event) {

    if (event) {
        event.stopPropagation();
    }

    const notifWrap = document.getElementById('notifWrap');

    if (!notifWrap) {
        return;
    }

    notifWrap.classList.toggle('open');

    const profile = document.getElementById('profileMenu');

    if (profile) {
        profile.classList.remove('open');
    }
}


// ==================== CLOSE DROPDOWNS ====================

document.addEventListener('click', function () {

    const profile = document.getElementById('profileMenu');

    const notifWrap = document.getElementById('notifWrap');

    if (profile) {
        profile.classList.remove('open');
    }

    if (notifWrap) {
        notifWrap.classList.remove('open');
    }

});
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

// ==================== INITIALIZE ====================

document.addEventListener('DOMContentLoaded', function () {

    // Initial load
    loadSubjects();


    // ==================== SUBJECT SEARCH ====================

    const searchInput =
        document.getElementById('globalSearchInput');


    if (!searchInput) {

        console.error(
            'globalSearchInput not found.'
        );

        return;
    }


    console.log(
        'Subject search initialized.'
    );


    searchInput.addEventListener(
        'input',
        function () {

            console.log(
                'Subject search:',
                this.value
            );

            renderSubjects();

        }
    );


    // ==================== REALTIME REFRESH ====================

    setInterval(function () {

        // Huwag mag-refresh habang nag-e-edit
        if (editingSubjectId !== null) {
            return;
        }

        loadSubjects();

    }, 3000);

});