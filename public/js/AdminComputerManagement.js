/* =========================================================
   PAGE NAVIGATION
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
    settings: "Settings"
};


/* =========================================================
   LARAVEL ROUTES
========================================================= */

const adminRoutes = window.adminRoutes || {};

/* =========================================================
   PAGE NAVIGATION
========================================================= */

function goTo(pageId) {

    // Laravel routes for separate admin pages
    const routePages = {
        dashboard: adminRoutes.dashboard,
        subjects: adminRoutes.subjects,
        schedule: adminRoutes.schedules,
        computers: adminRoutes.computers,
        attendance: adminRoutes.attendance,
        violations: adminRoutes.violations,
        reports: adminRoutes.reports,
        announcement: adminRoutes.announcement,
        settings: adminRoutes.settings
    };

    // Go to the actual Laravel page
    if (routePages[pageId]) {

        window.location.href = routePages[pageId];

        return;
    }

    console.warn('Route not found for:', pageId);
}

/* =========================================================
   PROFILE DROPDOWN
========================================================= */

function toggleProfile(e) {

    e.stopPropagation();

    closeNotif();

    const profile = document.getElementById('profileMenu');

    if (profile) {
        profile.classList.toggle('open');
    }
}


function closeProfile() {

    const profile =
        document.getElementById('profileMenu');

    if (profile) {
        profile.classList.remove('open');
    }
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function toggleNotif(e) {

    e.stopPropagation();

    closeProfile();

    const notif =
        document.getElementById('notifWrap');

    if (notif) {
        notif.classList.toggle('open');
    }
}


function closeNotif() {

    const notif =
        document.getElementById('notifWrap');

    if (notif) {
        notif.classList.remove('open');
    }
}


/* =========================================================
   CLOSE DROPDOWNS
========================================================= */

document.addEventListener('click', function(e) {

    const profile =
        document.getElementById('profileMenu');

    const notification =
        document.getElementById('notifWrap');

    if (
        profile &&
        !profile.contains(e.target)
    ) {
        closeProfile();
    }

    if (
        notification &&
        !notification.contains(e.target)
    ) {
        closeNotif();
    }
});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener('keydown', function(e) {

    if (e.key !== 'Escape') return;

    closeProfile();
    closeNotif();

    if (typeof closeLogout === 'function') {
        closeLogout();
    }

    if (typeof closeComputerModal === 'function') {
        closeComputerModal();
    }

    if (typeof closeScanDevicesModal === 'function') {
        closeScanDevicesModal();
    }

    if (typeof closeActionConfirm === 'function') {
        closeActionConfirm();
    }
});


/* =========================================================
   COMPUTER MANAGEMENT
========================================================= */

const labs = [
    "CLAB1",
    "CLAB2",
    "CLAB3",
    "CLAB4"
];

let activeLab = "CLAB1";


const pcStates = [
    "online",
    "inuse",
    "inuse",
    "offline",
    "maint",
    "inuse",
    "online",
    "inuse"
];


/* =========================================================
   LAB TABS
========================================================= */

function renderLabTabs() {

    const labTabs =
        document.getElementById('labTabs');

    if (!labTabs) return;

    labTabs.innerHTML = labs.map(lab => `
        <button
            class="lab-tab ${lab === activeLab ? 'active' : ''}"
            onclick="switchLab('${lab}')">

            ${lab}

        </button>
    `).join('');
}


function switchLab(lab) {

    activeLab = lab;

    renderLabTabs();
    renderPcGrid();
}


/* =========================================================
   PC GRID
========================================================= */

async function renderPcGrid() {

    const pcGrid = document.getElementById('pcGrid');
    const pcCountLabel = document.getElementById('pcCountLabel');

    if (!pcGrid) return;

    pcGrid.innerHTML = `
        <div class="scan-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Loading computers...</span>
        </div>
    `;

    try {

        const response = await fetch('/admin/computers/data');

        if (!response.ok) {
            throw new Error('Failed to load computers.');
        }

        const data = await response.json();

        const computers = data.computers || [];

        const searchInput =
    document.getElementById('globalSearchInput');

const searchQuery =
    searchInput
        ? searchInput.value.trim().toLowerCase()
        : '';

const labComputers = computers.filter(computer => {

    // Current laboratory filter
    if (computer.lab !== activeLab) {
        return false;
    }

    // Search filter
    if (searchQuery) {

        const searchableText = [
            computer.computer_name,
            computer.student_id,
            computer.lab,
            computer.ip_address,
            computer.mac_address,
            computer.status,
            computer.operating_system,
            computer.last_seen
        ]
            .filter(value =>
                value !== null &&
                value !== undefined
            )
            .join(' ')
            .toLowerCase();

        if (!searchableText.includes(searchQuery)) {
            return false;
        }
    }

    return true;
});

        if (labComputers.length === 0) {

            pcGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-computer"></i>
                    <p>No computers registered in ${activeLab}.</p>
                </div>
            `;

            if (pcCountLabel) {
                pcCountLabel.textContent =
                    `${activeLab} · 0 units · 0 online`;
            }

            return;
        }

        let online = 0;

        const html = labComputers.map(computer => {

            const status = String(computer.status || 'offline')
                .toLowerCase();

            if (status === 'online') {
                online++;
            }

            let icon = 'fa-power-off';

            if (status === 'online') {
                icon = 'fa-desktop';
            }
            else if (status === 'inuse') {
                icon = 'fa-user';
            }
            else if (status === 'maintenance' || status === 'maint') {
                icon = 'fa-screwdriver-wrench';
            }
            else if (status === 'locked') {
                icon = 'fa-lock';
            }

            let label = 'Offline';

            if (status === 'online') {
                label = 'Idle';
            }
            else if (status === 'inuse') {
                label = 'In Use';
            }
            else if (
                status === 'maintenance' ||
                status === 'maint'
            ) {
                label = 'Maintenance';
            }
            else if (status === 'locked') {
                label = 'Locked';
            }

            return `
                <div
                    class="pc-tile ${status}"
                    onclick="viewComputer(${computer.id})">

                    <i class="fa-solid ${icon}"></i>

                    <div class="pc-name">
                        ${escapeHtml(computer.computer_name)}
                    </div>

                    <div class="pc-state">
                        ${label}
                    </div>

                </div>
            `;

        }).join('');

        pcGrid.innerHTML = html;

        if (pcCountLabel) {
            pcCountLabel.textContent =
                `${activeLab} · ${labComputers.length} units · ${online} online`;
        }

    }
    catch (error) {

        console.error(error);

        pcGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>Unable to load computers.</p>
            </div>
        `;

        showToast('Failed to load computers.');
    }
}


/* =========================================================
   PC ACTION
========================================================= */

function pcAction(lab, num, state) {

    const pcName = `PC-${String(num).padStart(2, '0')}`;

    openPcViewModal({
        id: null,
        computer_name: pcName,
        lab: lab,
        ip_address: 'Not assigned',
        mac_address: 'Not assigned',
        status: state.toLowerCase().replace(' ', ''),
        operating_system: 'Not specified',
        last_seen: 'Not available'
    });
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    let toast =
        document.getElementById('toast');

    if (!toast) {

        toast =
            document.createElement('div');

        toast.id = 'toast';
        toast.className = 'toast';

        toast.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <span></span>
        `;

        document.body.appendChild(toast);
    }


    const text =
        toast.querySelector('span');

    if (text) {
        text.textContent = message;
    }


    toast.classList.add('show');


    clearTimeout(window.toastTimer);


    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove('show');

        }, 3000);
}


/* =========================================================
   RESTART ALL COMPUTERS
========================================================= */

function restartAllComputers() {

    openActionConfirm(
        "Restart All Computers",
        `Are you sure you want to restart all online computers in ${activeLab}?`,
        "restart"
    );
}


/* =========================================================
   LOCK ALL COMPUTERS
========================================================= */

function lockAllComputers() {

    openActionConfirm(
        "Lock All Computers",
        `Are you sure you want to lock all computers in ${activeLab}?`,
        "lock"
    );
}

/* =========================================================
   ACTION CONFIRMATION
========================================================= */

let pendingAction = null;

function openActionConfirm(title, message, action) {

    const modal = document.getElementById('actionConfirmModal');
    const titleElement = document.getElementById('actionConfirmTitle');
    const messageElement = document.getElementById('actionConfirmMessage');
    const button = document.getElementById('actionConfirmButton');

    if (!modal) {
        console.error('actionConfirmModal not found.');
        return;
    }

    pendingAction = action;

    if (titleElement) {
        titleElement.textContent = title;
    }

    if (messageElement) {
        messageElement.textContent = message;
    }

    if (button) {

        if (action === 'restart') {

            button.innerHTML =
                '<i class="fa-solid fa-rotate"></i> Restart';

        } else if (action === 'lock') {

            button.innerHTML =
                '<i class="fa-solid fa-lock"></i> Lock';

        }
    }

    modal.classList.add('show');
}


function closeActionConfirm() {

    const modal =
        document.getElementById('actionConfirmModal');

    if (modal) {
        modal.classList.remove('show');
    }

    pendingAction = null;
}


async function confirmAction() {

    if (!pendingAction) {
        return;
    }

    const action = pendingAction;

    const csrf =
        document.querySelector(
            'meta[name="csrf-token"]'
        )?.content;

    if (!csrf || csrf.includes('{{')) {

        showToast(
            'CSRF token not found. Please refresh the page.'
        );

        return;
    }

    try {

        let url = '';

        if (action === 'restart') {

            url = '/admin/computers/restart-all';

        } else if (action === 'lock') {

            url = '/admin/computers/lock-all';

        } else {

            closeActionConfirm();
            return;
        }


        const response = await fetch(url, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrf,
                'X-Requested-With': 'XMLHttpRequest'
            },

            body: JSON.stringify({
                lab: activeLab
            })

        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || 'Action failed.'
            );
        }


        closeActionConfirm();

        showToast(
            data.message ||
            (
                action === 'restart'
                    ? `Restart command sent to ${activeLab}.`
                    : `All PCs in ${activeLab} have been locked.`
            )
        );


        await renderPcGrid();


    } catch (error) {

        console.error(
            'Computer action error:',
            error
        );

        closeActionConfirm();

        showToast(
            error.message ||
            'Unable to complete the action.'
        );
    }
}

/* =========================================================
   COMPUTER MODAL
========================================================= */
function openComputerModal() {

    const modal =
        document.getElementById('computerModal');

    if (!modal) return;


    const form =
        document.getElementById('computerForm');

    if (form) {
        form.reset();
    }


    delete modal.dataset.editId;


    const title =
        document.getElementById('computerModalTitle');

    if (title) {
        title.textContent = 'Add Computer';
    }


    const saveBtn =
        document.getElementById('computerSaveBtn');

    if (saveBtn) {

        saveBtn.innerHTML = `
            <i class="fa-solid fa-plus"></i>
            Add Computer
        `;
    }


    modal.classList.add('show');
}

/* =========================================================
   CLOSE COMPUTER MODAL
========================================================= */
function closeComputerModal() {
    const modal = document.getElementById('computerModal');

    if (!modal) {
        console.error('computerModal not found.');
        return;
    }

    modal.classList.remove('show');
    delete modal.dataset.editId;
}


function closeScanDevicesModal() {
    const modal = document.getElementById('scanDevicesModal');

    if (!modal) {
        console.error('scanDevicesModal not found.');
        return;
    }

    modal.classList.remove('show');
}


/* =========================================================
   SAVE COMPUTER - ADD / EDIT
========================================================= */

async function saveComputer(event) {

    event.preventDefault();

    const modal =
        document.getElementById('computerModal');

    const name =
        document.getElementById('computerName')?.value.trim();

    const lab =
        document.getElementById('computerLab')?.value;

    const ip =
        document.getElementById('computerIp')?.value.trim();

    const mac =
        document.getElementById('computerMac')?.value.trim();

    const status =
        document.getElementById('computerStatus')?.value;

    const os =
        document.getElementById('computerOs')?.value.trim();


    if (!name || !lab || !status) {

        showToast(
            'Please complete all required information.'
        );

        return;
    }


    const editId =
        modal?.dataset.editId;

    const payload = {
        student_id: studentId,
        computer_name: name,
        lab: lab,
        ip_address: ip || null,
        mac_address: mac || null,
        status: status,
        operating_system: os || null
    };


    const csrf =
        document.querySelector(
            'meta[name="csrf-token"]'
        )?.content;


    try {

        const url = editId
            ? `/admin/computers/${editId}`
            : '/admin/computers';


        const method =
            editId ? 'PUT' : 'POST';


        const response = await fetch(url, {

            method: method,

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrf
            },

            body: JSON.stringify(payload)
        });


        const data =
            await response.json();


        if (!response.ok) {

            console.error(data);

            if (data.errors) {

                const firstError =
                    Object.values(data.errors)[0]?.[0];

                showToast(
                    firstError ||
                    'Please check the computer information.'
                );

            } else {

                showToast(
                    data.message ||
                    'Unable to save computer.'
                );
            }

            return;
        }


        showToast(
            data.message ||
            (
                editId
                    ? 'Computer updated successfully.'
                    : 'Computer added successfully.'
            )
        );


        delete modal.dataset.editId;

        closeComputerModal();

        await renderPcGrid();

    }
    catch (error) {

        console.error(error);

        showToast(
            'Something went wrong while saving the computer.'
        );
    }
}


/* =========================================================
   SCAN REAL NETWORK DEVICES
========================================================= */

async function scanDevices() {

    const modal =
        document.getElementById('scanDevicesModal');

    const list =
        document.getElementById('scanDeviceList');

    if (!modal || !list) {
        console.error('Scan Devices modal not found.');
        return;
    }

    modal.classList.add('show');

    list.innerHTML = `
        <div class="scan-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Scanning local network...</span>
        </div>
    `;

    try {

        const csrf =
            document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

        const response = await fetch(
            '/admin/computers/scan',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },

                body: JSON.stringify({
                    lab: activeLab
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || 'Network scan failed.'
            );
        }

        const devices = data.devices || [];

        if (devices.length === 0) {

            list.innerHTML = `
                <div class="scan-empty">
                    <i class="fa-solid fa-network-wired"></i>

                    <strong>
                        No devices found
                    </strong>

                    <span>
                        Make sure the devices are connected
                        to the same network.
                    </span>
                </div>
            `;

            return;
        }


        list.innerHTML = devices.map(
            (device, index) => {

                const deviceName =
                    device.hostname ||
                    `Device-${String(index + 1).padStart(2, '0')}`;

                const deviceType =
                    device.device_type ||
                    'Unknown Device';

                const ip =
                    device.ip_address ||
                    'Unknown IP';

                const mac =
                    device.mac_address ||
                    'Unknown MAC';


                return `
                    <label class="scan-device-item">

                        <input
                            type="checkbox"
                            class="scan-device-checkbox"

                            value="${escapeHtml(ip)}"

                            data-ip="${escapeHtml(ip)}"
                            data-mac="${escapeHtml(mac)}"
                            data-hostname="${escapeHtml(deviceName)}"
                            data-type="${escapeHtml(deviceType)}"
                            data-lab="${escapeHtml(activeLab)}"
                        >

                        <div class="scan-device-info">

                            <div class="scan-device-main">

                                <i class="fa-solid ${
                                    deviceType.includes('Android') ||
                                    deviceType.includes('iOS')
                                        ? 'fa-mobile-screen'
                                        : 'fa-computer'
                                }"></i>

                                <div>

                                    <strong>
                                        ${escapeHtml(deviceName)}
                                    </strong>

                                    <span>
                                        ${escapeHtml(deviceType)}
                                    </span>

                                </div>

                            </div>

                            <div class="scan-device-network">

                                <span>
                                    <i class="fa-solid fa-network-wired"></i>
                                    ${escapeHtml(ip)}
                                </span>

                                <span>
                                    <i class="fa-solid fa-fingerprint"></i>
                                    ${escapeHtml(mac)}
                                </span>

                            </div>

                        </div>

                    </label>
                `;

            }
        ).join('');


    } catch (error) {

        console.error('Scan error:', error);

        list.innerHTML = `
            <div class="scan-empty error">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <strong>
                    Network scan failed
                </strong>

                <span>
                    ${escapeHtml(error.message)}
                </span>

            </div>
        `;

        showToast(
            'Unable to scan the local network.'
        );
    }
}

/* =========================================================
   ADD SELECTED DEVICES
========================================================= */

async function addSelectedDevices() {

    const selected =
        document.querySelectorAll(
            '.scan-device-checkbox:checked'
        );

    if (selected.length === 0) {

        showToast(
            'Please select at least one device.'
        );

        return;
    }


    const devices = Array.from(selected).map(
        checkbox => {

            return {
                computer_name:
                    checkbox.dataset.hostname ||
                    `PC-${checkbox.dataset.ip.replaceAll('.', '-')}`,

                lab:
                    checkbox.dataset.lab ||
                    activeLab,

                ip_address:
                    checkbox.dataset.ip,

                mac_address:
                    checkbox.dataset.mac,

                device_type:
                    checkbox.dataset.type ||
                    'Unknown Device',

                status:
                    'online'
            };
        }
    );


    try {

        const csrf =
            document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;


        for (const device of devices) {

            const response = await fetch(
                '/admin/computers',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrf || '',
                        'X-Requested-With': 'XMLHttpRequest'
                    },

                    body: JSON.stringify(device)
                }
            );


            if (!response.ok) {

                const errorData =
                    await response.json().catch(
                        () => ({})
                    );

                throw new Error(
                    errorData.message ||
                    'Failed to save device.'
                );
            }
        }


        showToast(
            `${devices.length} device(s) added successfully.`
        );


        closeScanDevicesModal();

        /*
         * Refresh PC/device grid.
         */
        await renderPcGrid();


    } catch (error) {

        console.error(error);

        showToast(
            'Failed to add selected devices.'
        );
    }
}
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
   INITIALIZATION
========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    function() {

        renderLabTabs();
        renderPcGrid();
        loadApplications();
        loadApplicationActivities();

        const searchInput =
    document.getElementById('globalSearchInput');

if (searchInput) {

    searchInput.addEventListener('input', function () {

        renderPcGrid();

    });

}


        const computerPage =
            document.getElementById(
                'page-computers'
            );


        if (computerPage) {

            computerPage.classList.add(
                'active'
            );

        }

    }
);


/* =========================================================
   VIEW COMPUTER
========================================================= */

async function viewComputer(id) {

    try {

        const response = await fetch('/admin/computers/data');

        if (!response.ok) {
            throw new Error('Failed to load computer.');
        }

        const data = await response.json();

        const computer = (data.computers || []).find(
            item => Number(item.id) === Number(id)
        );

        if (!computer) {
            showToast('Computer not found.');
            return;
        }

        openPcViewModal(computer);

    } catch (error) {

        console.error(error);

        showToast('Unable to load computer details.');
    }
}


/* =========================================================
   VIEW COMPUTER MODAL
========================================================= */
function openPcViewModal(computer) {

    let modal = document.getElementById('pcViewModal');

    if (!modal) {

        modal = document.createElement('div');

        modal.id = 'pcViewModal';
        modal.className = 'modal-overlay';

        modal.innerHTML = `
            <div class="modal-card">

                <div class="modal-header">

                    <div>
                        <h2>Computer Details</h2>
                        <p>View and edit computer information</p>
                    </div>

                    <button
                        type="button"
                        class="modal-close"
                        onclick="closePcViewModal()">

                        <i class="fa-solid fa-xmark"></i>

                    </button>

                </div>


                <div class="computer-details">

    <!-- STUDENT ID -->
    <div class="detail-item">
        <span>Student ID</span>

        <select
            id="viewComputerStudentId"
            class="detail-input">

            <option value="">Not Assigned</option>

            ${
                (window.computerStudents || [])
                    .map(student => `
                        <option value="${escapeHtml(student.student_id)}">
                            ${escapeHtml(student.student_id)}
                            — 
                            ${escapeHtml(student.fullname)}
                        </option>
                    `)
                    .join('')
            }

        </select>
    </div>


    <!-- COMPUTER NAME -->
    <div class="detail-item">
        <span>Computer Name</span>

        <input
            type="text"
            id="viewComputerName"
            class="detail-input"
        >
    </div>


    <!-- LABORATORY -->
    <div class="detail-item">
        <span>Laboratory</span>

        <select
            id="viewComputerLab"
            class="detail-input">

            <option value="CLAB1">CLAB1</option>
            <option value="CLAB2">CLAB2</option>
            <option value="CLAB3">CLAB3</option>
            <option value="CLAB4">CLAB4</option>

        </select>
    </div>


    <!-- IP ADDRESS -->
    <div class="detail-item">
        <span>IP Address</span>

        <input
            type="text"
            id="viewComputerIp"
            class="detail-input"
            placeholder="Enter IP address"
        >
    </div>


    <!-- MAC ADDRESS -->
    <div class="detail-item">
        <span>MAC Address</span>

        <input
            type="text"
            id="viewComputerMac"
            class="detail-input"
            placeholder="Enter MAC address"
        >
    </div>


    <!-- OPERATING SYSTEM -->
    <div class="detail-item">
        <span>Operating System</span>

        <input
            type="text"
            id="viewComputerOs"
            class="detail-input"
            placeholder="Enter operating system"
        >
    </div>


    <!-- LAST SEEN -->
    <div class="detail-item">
        <span>Last Seen</span>

        <input
            type="text"
            id="viewComputerLastSeen"
            class="detail-input"
            readonly
        >
    </div>


    <!-- STATUS -->
    <div class="detail-item">
        <span>Status</span>

        <select
            id="viewComputerStatus"
            class="detail-input">

            <option value="online">Online</option>
            <option value="inuse">In Use</option>
            <option value="maint">Maintenance</option>
            <option value="offline">Offline</option>
            <option value="locked">Locked</option>

        </select>
    </div>

</div>


                <div class="modal-footer">

                    <button
                        type="button"
                        class="btn-secondary"
                        onclick="closePcViewModal()">

                        Cancel

                    </button>


                    <button
                        type="button"
                        class="btn-primary"
                        id="viewComputerSaveBtn">

                        <i class="fa-solid fa-pen"></i>
                        Edit Computer

                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(modal);
    }


    /* ================================
       LOAD COMPUTER DATA
    ================================= */
    document.getElementById('viewComputerStudentId').value =
    computer.student_id || '';

    document.getElementById('viewComputerName').value =
        computer.computer_name || '';

    document.getElementById('viewComputerLab').value =
        computer.lab || 'CLAB1';

    document.getElementById('viewComputerIp').value =
        computer.ip_address || '';

    document.getElementById('viewComputerMac').value =
        computer.mac_address || '';

    document.getElementById('viewComputerStatus').value =
        computer.status || 'offline';

    document.getElementById('viewComputerOs').value =
        computer.operating_system || '';

    document.getElementById('viewComputerLastSeen').value =
        computer.last_seen || 'Not available';


    /* ================================
       EDIT / SAVE BUTTON
    ================================= */

    const saveButton =
        document.getElementById('viewComputerSaveBtn');


    if (saveButton) {

        saveButton.innerHTML = `
            <i class="fa-solid fa-save"></i>
            Save Changes
        `;


        saveButton.onclick = function () {

            updateComputerFromView(computer.id);

        };
    }


    modal.classList.add('show');
}

async function updateComputerFromView(id) {

    const studentId =
    document.getElementById('viewComputerStudentId')?.value || null;

    const computerName =
        document.getElementById('viewComputerName')?.value.trim();

    const lab =
        document.getElementById('viewComputerLab')?.value;

    const ipAddress =
        document.getElementById('viewComputerIp')?.value.trim();

    const macAddress =
        document.getElementById('viewComputerMac')?.value.trim();

    const status =
        document.getElementById('viewComputerStatus')?.value;

    const operatingSystem =
        document.getElementById('viewComputerOs')?.value.trim();


    /* ================================
       VALIDATION
    ================================= */

    if (!computerName || !lab || !status) {

        showToast(
            'Please complete the required computer information.'
        );

        return;
    }


    /* ================================
       CSRF TOKEN
    ================================= */

    const csrf =
        document.querySelector(
            'meta[name="csrf-token"]'
        )?.content;


    if (!csrf || csrf.includes('{{')) {

        showToast(
            'CSRF token not found. Please refresh the page.'
        );

        return;
    }


    /* ================================
       UPDATE REQUEST
    ================================= */

    try {

        const response = await fetch(
            `/admin/computers/${id}`,
            {
                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf
                },
                body: JSON.stringify({
                    student_id: studentId,
                    computer_name: computerName,
                    lab: lab,
                    ip_address: ipAddress || null,
                    mac_address: macAddress || null,
                    status: status,
                    operating_system: operatingSystem || null
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(data);

            throw new Error(
                data.message ||
                'Failed to update computer.'
            );
        }


        /* ================================
           SUCCESS
        ================================= */

        showToast(
            data.message ||
            'Computer updated successfully.'
        );


        closePcViewModal();


        /* Reload PC grid */
        renderPcGrid();


    }
    catch (error) {

        console.error(error);

        showToast(
            error.message ||
            'Unable to update computer.'
        );
    }
}

/* =========================================================
   CLOSE VIEW MODAL
========================================================= */

function closePcViewModal() {

    const modal =
        document.getElementById('pcViewModal');

    if (modal) {
        modal.classList.remove('show');
    }
}


/* =========================================================
   EDIT COMPUTER
========================================================= */

function editComputer(computer) {

    const modal =
        document.getElementById('computerModal');

    if (!modal) {
        showToast('Computer edit modal not found.');
        return;
    }


    const form =
        document.getElementById('computerForm');

    if (form) {
        form.reset();
    }


    const title =
        document.getElementById('computerModalTitle');

    if (title) {
        title.textContent = 'Edit Computer';
    }


    const studentId =
    document.getElementById('computerStudentId');


    const name =
        document.getElementById('computerName');

    const lab =
        document.getElementById('computerLab');

    const ip =
        document.getElementById('computerIp');

    const mac =
        document.getElementById('computerMac');

    const status =
        document.getElementById('computerStatus');

    const os =
        document.getElementById('computerOs');

    if (studentId) {
        studentId.value = computer.student_id || '';
    }


    if (name) {
        name.value = computer.computer_name || '';
    }

    if (lab) {
        lab.value = computer.lab || '';
    }

    if (ip) {
        ip.value = computer.ip_address || '';
    }

    if (mac) {
        mac.value = computer.mac_address || '';
    }

    if (status) {
        status.value = computer.status || 'offline';
    }

    if (os) {
        os.value = computer.operating_system || '';
    }


    modal.dataset.editId = computer.id;


    const saveButton =
        document.getElementById('computerSaveBtn');

    if (saveButton) {

        saveButton.innerHTML = `
            <i class="fa-solid fa-save"></i>
            Save Changes
        `;
    }


    modal.classList.add('show');
}


/* =========================================================
   COMPUTER STATUS FORMAT
========================================================= */

function formatComputerStatus(status) {

    const value =
        String(status || '')
            .toLowerCase();

    if (value === 'online') {
        return 'Idle';
    }

    if (value === 'inuse') {
        return 'In Use';
    }

    if (
        value === 'maint' ||
        value === 'maintenance'
    ) {
        return 'Maintenance';
    }

    if (value === 'offline') {
        return 'Offline';
    }

    return status || 'Unknown';
}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(value) {

    if (!value) {
        return 'Not available';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    const div =
        document.createElement('div');

    div.textContent =
        value ?? '';

    return div.innerHTML;
}


function openApplicationMenu(applicationId, button) {

    // Close any existing menu
    document.querySelectorAll('.application-action-menu')
        .forEach(menu => menu.remove());

    // Create menu
    const menu = document.createElement('div');

    menu.className = 'application-action-menu';

    menu.innerHTML = `
        <button type="button"
                onclick="editApplication(${applicationId})">
            <i class="fa-solid fa-pen"></i>
            Edit
        </button>

        <button type="button"
                onclick="toggleApplicationStatus(${applicationId})">
            <i class="fa-solid fa-power-off"></i>
            Activate / Deactivate
        </button>

        <button type="button"
                class="danger"
                onclick="deleteApplication(${applicationId})">
            <i class="fa-solid fa-trash"></i>
            Delete
        </button>
    `;

    button.parentElement.appendChild(menu);
}


function closeApplicationMenus() {

    document.querySelectorAll('.application-action-menu')
        .forEach(menu => menu.remove());
}




function openApplicationModal() {

    const modal = document.getElementById('applicationModal');
    const form = document.getElementById('applicationForm');

    if (!modal) return;

    if (form) {
        form.reset();
    }

    delete modal.dataset.editId;

    document.getElementById('applicationModalTitle').textContent =
        'Add Application';

    document.getElementById('applicationSaveBtn').innerHTML =
        '<i class="fa-solid fa-plus"></i> Add Application';

    modal.classList.add('show');
}

function closeApplicationModal() {

    const modal = document.getElementById('applicationModal');

    if (!modal) return;

    modal.classList.remove('show');

    delete modal.dataset.editId;
}

async function saveApplication(event) {
    event.preventDefault();

    const modal = document.getElementById('applicationModal');

    const name = document
        .getElementById('applicationName')
        ?.value.trim();

    const scope = document
        .getElementById('applicationScope')
        ?.value;

    const restriction = document
        .getElementById('applicationRestriction')
        ?.value;

    const status = document
        .getElementById('applicationStatus')
        ?.value;

    if (!name || !scope || !restriction || !status) {
        showToast('Please complete all application information.');
        return;
    }

    const editId = modal?.dataset.editId;

    const payload = {
        application_name: name,
        scope: scope,
        restriction: restriction,
        status: status
    };

    const csrf = document
        .querySelector('meta[name="csrf-token"]')
        ?.content;

    try {

        const url = editId
            ? `/admin/applications/${editId}`
            : '/admin/applications';

        const method = editId
            ? 'PUT'
            : 'POST';

        const response = await fetch(url, {
            method: method,

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrf
            },

            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {

            console.error(data);

            showToast(
                data.message ||
                'Unable to save application.'
            );

            return;
        }

        showToast(
            data.message ||
            'Application saved successfully.'
        );

        delete modal.dataset.editId;

        closeApplicationModal();

        await loadApplications();

    } catch (error) {

        console.error(error);

        showToast(
            'An error occurred while saving the application.'
        );
    }
}


async function loadApplications() {

    const tableBody = document.getElementById('applicationTableBody');

    if (!tableBody) return;

    try {

        const response = await fetch('/admin/applications/data', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load applications.');
        }

        const data = await response.json();

        renderApplications(data.applications || []);

    } catch (error) {

        console.error('Application loading error:', error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center; padding:30px; color:#dc2626;">
                    Unable to load applications.
                </td>
            </tr>
        `;
    }
}



function renderApplications(applications) {

    const tableBody = document.getElementById('applicationTableBody');

    if (!tableBody) return;

    if (!applications.length) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center; padding:30px; color:#64748b;">
                    No applications found.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = applications.map(application => {

        const name = escapeHtml(application.application_name);
        const scope = escapeHtml(application.scope);
        const restriction = escapeHtml(application.restriction);
        const status = escapeHtml(application.status);

        const icon = getApplicationIcon(application.application_name);

        const statusClass =
            application.status === 'Active'
                ? 'active'
                : 'inactive';

        return `
            <tr>

                <!-- APPLICATION -->
                <td>
                    <div class="application-name">

                        <span class="app-icon">
                            <i class="${icon}"></i>
                        </span>

                        <strong>${name}</strong>

                    </div>
                </td>


                <!-- SCOPE -->
                <td>
                    ${scope}
                </td>


                <!-- RESTRICTION -->
                <td>
                    ${restriction}
                </td>


                <!-- STATUS -->
                <td>
                    <span class="status ${statusClass}">
                        ${status}
                    </span>
                </td>


                <!-- ACTION -->
                <td class="application-action-cell">

                    <button
                        type="button"
                        class="more-btn application-menu-btn"
                        onclick="openApplicationMenu(${application.id}, this)">

                        <i class="fa-solid fa-ellipsis-vertical"></i>

                    </button>

                </td>

            </tr>
        `;

    }).join('');
}


function getApplicationIcon(name) {
    const app = name.toLowerCase();

    if (app.includes('steam')) {
        return 'fa-brands fa-steam';
    }

    if (app.includes('discord')) {
        return 'fa-brands fa-discord';
    }

    if (app.includes('youtube')) {
        return 'fa-brands fa-youtube';
    }

    if (
        app.includes('social') ||
        app.includes('facebook') ||
        app.includes('instagram')
    ) {
        return 'fa-solid fa-users';
    }

    if (
        app.includes('torrent') ||
        app.includes('download')
    ) {
        return 'fa-solid fa-download';
    }

    return 'fa-solid fa-cube';
}

function editApplication(id) {

    const application = window.applications?.find(
        app => Number(app.id) === Number(id)
    );

    if (!application) return;

    const modal = document.getElementById('applicationModal');

    document.getElementById('applicationName').value =
        application.application_name;

    document.getElementById('applicationScope').value =
        application.scope;

    document.getElementById('applicationRestriction').value =
        application.restriction;

    document.getElementById('applicationStatus').value =
        application.status;

    modal.dataset.editId = application.id;

    document.getElementById('applicationModalTitle').textContent =
        'Edit Application';

    document.getElementById('applicationSaveBtn').innerHTML =
        '<i class="fa-solid fa-save"></i> Save Changes';

    modal.classList.add('show');

    document.querySelectorAll('.application-action-menu')
        .forEach(menu => menu.remove());
}

async function editApplication(applicationId) {

    closeApplicationMenus();

    try {

        const response = await fetch('/admin/applications/data');

        const data = await response.json();

        const application = data.applications.find(
            app => Number(app.id) === Number(applicationId)
        );

        if (!application) {
            showToast('Application not found.');
            return;
        }

        const modal = document.getElementById('applicationModal');

        if (!modal) return;

        document.getElementById('applicationName').value =
            application.application_name;

        document.getElementById('applicationScope').value =
            application.scope;

        document.getElementById('applicationRestriction').value =
            application.restriction;

        document.getElementById('applicationStatus').value =
            application.status;

        modal.dataset.editId = application.id;

        document.getElementById('applicationModalTitle').textContent =
            'Edit Application';

        document.getElementById('applicationSaveBtn').innerHTML = `
            <i class="fa-solid fa-save"></i>
            Save Changes
        `;

        modal.classList.add('show');

    } catch (error) {

        console.error(error);

        showToast('Unable to load application.');
    }
}


async function toggleApplicationStatus(applicationId) {

    closeApplicationMenus();

    try {

        const csrf = document
            .querySelector('meta[name="csrf-token"]')
            ?.content;

        const response = await fetch(
            `/admin/applications/${applicationId}/toggle-status`,
            {
                method: 'POST',

                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update status.');
        }

        showToast(data.message);

        await loadApplications();

    } catch (error) {

        console.error(error);

        showToast(
            error.message ||
            'Unable to update application status.'
        );
    }
}


async function confirmDeleteApplication() {
    if (!pendingDeleteApplicationId) return;

    const applicationId = pendingDeleteApplicationId;

    try {
        const csrf =
            document.querySelector('meta[name="csrf-token"]')?.content;

        const response = await fetch(
            `/admin/applications/${applicationId}`,
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'Failed to delete application.'
            );
        }

        closeDeleteApplicationModal();

        showToast(
            data.message || 'Application deleted successfully.'
        );

        await loadApplications();

    } catch (error) {
        console.error(error);

        showToast(
            error.message ||
            'Unable to delete application.'
        );
    }
}

function closeDeleteApplicationModal() {
    const modal =
        document.getElementById('deleteApplicationModal');

    if (modal) {
        modal.classList.remove('show');
    }

    pendingDeleteApplicationId = null;
}


function closeApplicationMenus() {

    document
        .querySelectorAll('.application-action-menu')
        .forEach(menu => menu.remove());
}

document.addEventListener('click', function (event) {

    if (
        !event.target.closest('.more-btn') &&
        !event.target.closest('.application-action-menu')
    ) {
        closeApplicationMenus();
    }

});

function openApplicationMenu(applicationId, button) {

    document.querySelectorAll('.application-action-menu')
        .forEach(menu => menu.remove());

    const menu = document.createElement('div');

    menu.className = 'application-action-menu';

    menu.innerHTML = `
        <button type="button"
                onclick="editApplication(${applicationId})">
            <i class="fa-solid fa-pen"></i>
            Edit
        </button>

        <button type="button"
                onclick="toggleApplicationStatus(${applicationId})">
            <i class="fa-solid fa-power-off"></i>
            Activate / Deactivate
        </button>

        <button type="button"
                class="danger"
                onclick="deleteApplication(${applicationId})">
            <i class="fa-solid fa-trash"></i>
            Delete
        </button>
    `;

    button.parentElement.appendChild(menu);
}


function closeApplicationMenus() {

    document.querySelectorAll('.application-action-menu')
        .forEach(menu => menu.remove());
}


/* =========================================================
   APPLICATION ACTIVITY
========================================================= */

let applicationActivities = [];


/* ================================
   LOAD ACTIVITIES
================================ */

async function loadApplicationActivities() {

    const tableBody =
        document.getElementById(
            'applicationActivityTableBody'
        );

    if (!tableBody) return;


    tableBody.innerHTML = `
        <tr>
            <td
                colspan="6"
                style="text-align:center; padding:30px;">

                <i class="fa-solid fa-spinner fa-spin"></i>
                Loading activity...

            </td>
        </tr>
    `;


    try {

        const response = await fetch(
            '/admin/application-activities/data',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );


        if (!response.ok) {
            throw new Error(
                'Failed to load application activities.'
            );
        }


        const data =
            await response.json();


        applicationActivities =
            data.activities || [];


        populateActivityApplicationFilter();

        renderApplicationActivities(
            applicationActivities
        );

    }
    catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#dc2626;
                    ">

                    Unable to load application activity.

                </td>
            </tr>
        `;
    }
}

function renderApplicationActivities(activities) {

    const tableBody =
        document.getElementById(
            'applicationActivityTableBody'
        );

    if (!tableBody) return;


    if (!activities.length) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#64748b;
                    ">

                    No application activity found.

                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML =
        activities.map(activity => {

            const statusClass =
                activity.status === 'Violation'
                    ? 'violation'
                    : 'allowed';


            return `
                <tr
                    class="activity-row"
                    onclick="viewApplicationActivity(
                        ${activity.id}
                    )">

                    <td>
                        ${escapeHtml(activity.time)}
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(activity.pc_name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(activity.student_name)}
                    </td>

                    <td>

                        <div class="application-name">

                            <span class="app-icon">
                                <i class="${getApplicationIcon(
                                    activity.application_name
                                )}"></i>
                            </span>

                            <span>
                                ${escapeHtml(
                                    activity.application_name
                                )}
                            </span>

                        </div>

                    </td>

                    <td>
                        ${escapeHtml(activity.action)}
                    </td>

                    <td>

                        <span
                            class="activity-status ${statusClass}">

                            ${escapeHtml(
                                activity.status
                            )}

                        </span>

                    </td>

                </tr>
            `;

        }).join('');
}



function filterApplicationActivities() {

    const search =
        document.getElementById(
            'activitySearch'
        )?.value
        .toLowerCase()
        .trim() || '';


    const lab =
        document.getElementById(
            'activityLabFilter'
        )?.value || 'all';


    const application =
        document.getElementById(
            'activityApplicationFilter'
        )?.value || 'all';


    const status =
        document.getElementById(
            'activityStatusFilter'
        )?.value || 'all';


    const filtered =
        applicationActivities.filter(activity => {

            const searchable = `
                ${activity.pc_name}
                ${activity.student_name}
                ${activity.application_name}
            `.toLowerCase();


            const matchesSearch =
                !search ||
                searchable.includes(search);


            const matchesLab =
                lab === 'all' ||
                activity.lab === lab;


            const matchesApplication =
                application === 'all' ||
                activity.application_name === application;


            const matchesStatus =
                status === 'all' ||
                activity.status === status;


            return (
                matchesSearch &&
                matchesLab &&
                matchesApplication &&
                matchesStatus
            );

        });


    renderApplicationActivities(filtered);
}



function populateActivityApplicationFilter() {

    const select =
        document.getElementById(
            'activityApplicationFilter'
        );

    if (!select) return;


    const applications =
        [
            ...new Set(
                applicationActivities.map(
                    activity =>
                        activity.application_name
                )
            )
        ].sort();


    select.innerHTML = `
        <option value="all">
            All Applications
        </option>
    `;


    applications.forEach(application => {

        const option =
            document.createElement('option');

        option.value = application;
        option.textContent = application;

        select.appendChild(option);

    });
}


function viewApplicationActivity(activityId) {

    const activity =
        applicationActivities.find(
            item =>
                Number(item.id) === Number(activityId)
        );


    if (!activity) return;


    document.getElementById(
        'detailActivityTime'
    ).textContent =
        activity.time || '—';


    document.getElementById(
        'detailActivityPc'
    ).textContent =
        activity.pc_name || '—';


    document.getElementById(
        'detailActivityStudent'
    ).textContent =
        activity.student_name || '—';


    document.getElementById(
        'detailActivityLab'
    ).textContent =
        activity.lab || '—';


    document.getElementById(
        'detailActivityApplication'
    ).textContent =
        activity.application_name || '—';


    document.getElementById(
        'detailActivityAction'
    ).textContent =
        activity.action || '—';


    document.getElementById(
        'detailActivityStatus'
    ).textContent =
        activity.status || '—';


    document.getElementById(
        'detailActivityReason'
    ).textContent =
        activity.reason ||
        'No additional information.';


    document.getElementById(
        'activityDetailsModal'
    ).classList.add('show');
}


function closeActivityDetails() {

    const modal =
        document.getElementById(
            'activityDetailsModal'
        );

    if (modal) {
        modal.classList.remove('show');
    }
}


function exportApplicationActivities() {

    if (!applicationActivities.length) {

        showToast(
            'No application activity to export.'
        );

        return;
    }


    const headers = [
        'Time',
        'PC',
        'Student',
        'Laboratory',
        'Application',
        'Action',
        'Status'
    ];


    const rows =
        applicationActivities.map(activity => [

            activity.time,
            activity.pc_name,
            activity.student_name,
            activity.lab,
            activity.application_name,
            activity.action,
            activity.status

        ]);


    const csv = [
        headers,
        ...rows
    ]
        .map(row =>
            row.map(value =>
                `"${String(value ?? '')
                    .replace(/"/g, '""')}"`
            ).join(',')
        )
        .join('\n');


    const blob =
        new Blob(
            [csv],
            {
                type: 'text/csv;charset=utf-8;'
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement('a');

    link.href = url;
    link.download =
        'application-activity.csv';

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
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
