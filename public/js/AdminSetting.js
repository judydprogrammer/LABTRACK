document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       CSRF TOKEN
    ===================================================== */

    const csrfMeta = document.querySelector(
        'meta[name="csrf-token"]'
    );

    const csrfToken = csrfMeta
        ? csrfMeta.getAttribute("content")
        : "";


    /* =====================================================
       SIDEBAR / HAMBURGER
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");

    if (menuToggle) {

        menuToggle.addEventListener("click", function () {

            if (window.innerWidth <= 800) {

                document.body.classList.toggle("sidebar-open");

            } else {

                document.body.classList.toggle("sidebar-collapsed");

            }

        });

    }


    /* =====================================================
       NOTIFICATION DROPDOWN
    ===================================================== */

    const notificationBtn =
        document.getElementById("notificationBtn");

    const notificationMenu =
        document.getElementById("notificationMenu");

    const notifWrap =
        notificationBtn
            ? notificationBtn.closest(".notif-wrap")
            : null;


    if (notificationBtn && notificationMenu && notifWrap) {

        notificationBtn.addEventListener("click", function (event) {

            event.stopPropagation();

            const profile =
                document.querySelector(".profile");

            if (profile) {
                profile.classList.remove("open");
            }

            notifWrap.classList.toggle("open");

        });


        notificationMenu.addEventListener("click", function (event) {

            event.stopPropagation();

        });

    }


    /* =====================================================
       PROFILE DROPDOWN
    ===================================================== */

    const profileTrigger =
        document.getElementById("profileTrigger");

    const profileDropdown =
        document.getElementById("profileDropdown");

    const profile =
        profileTrigger
            ? profileTrigger.closest(".profile")
            : null;


    if (
        profileTrigger &&
        profileDropdown &&
        profile
    ) {

        profileTrigger.addEventListener("click", function (event) {

            event.stopPropagation();

            const notif =
                document.querySelector(".notif-wrap");

            if (notif) {
                notif.classList.remove("open");
            }

            profile.classList.toggle("open");

        });


        profileDropdown.addEventListener("click", function (event) {

            event.stopPropagation();

        });

    }


    /* =====================================================
       CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener("click", function () {

        const notif =
            document.querySelector(".notif-wrap");

        const prof =
            document.querySelector(".profile");

        if (notif) {
            notif.classList.remove("open");
        }

        if (prof) {
            prof.classList.remove("open");
        }

    });


    /* =====================================================
       MARK NOTIFICATIONS AS READ
    ===================================================== */

    const markRead =
        document.getElementById("markNotificationsRead");

    if (markRead) {

        markRead.addEventListener("click", function (event) {

            event.stopPropagation();

            document
                .querySelectorAll(".notif-row.unread")
                .forEach(function (row) {

                    row.classList.remove("unread");

                });


            const notificationBadge =
                document.querySelector(".bell .dot");

            if (notificationBadge) {

                notificationBadge.style.display = "none";

            }

        });

    }


    /* =====================================================
   NOTIFICATION PREFERENCES
   DATABASE SAVING
===================================================== */

document
    .querySelectorAll(".toggle[data-setting]")
    .forEach(function (toggle) {

        toggle.addEventListener("click", async function () {

            toggle.classList.toggle("on");

            toggle.setAttribute(
                "aria-pressed",
                toggle.classList.contains("on")
                    ? "true"
                    : "false"
            );


            const violationToggle =
                document.querySelector(
                    '.toggle[data-setting="violation_alerts"]'
                );

            const pcOfflineToggle =
                document.querySelector(
                    '.toggle[data-setting="pc_offline_alerts"]'
                );

            const attendanceToggle =
                document.querySelector(
                    '.toggle[data-setting="daily_attendance"]'
                );

            const emailToggle =
                document.querySelector(
                    '.toggle[data-setting="email_notifications"]'
                );


            try {

                const response = await fetch(
                    "/admin/settings/notifications",
                    {
                        method: "POST",

                        headers: {
                            "X-CSRF-TOKEN": csrfToken,
                            "Accept": "application/json",
                            "X-Requested-With": "XMLHttpRequest"
                        },

                        body: new URLSearchParams({

                            violation_alerts:
                                violationToggle?.classList.contains("on")
                                    ? 1
                                    : 0,

                            pc_offline_alerts:
                                pcOfflineToggle?.classList.contains("on")
                                    ? 1
                                    : 0,

                            daily_attendance_summary:
                                attendanceToggle?.classList.contains("on")
                                    ? 1
                                    : 0,

                            email_notifications:
                                emailToggle?.classList.contains("on")
                                    ? 1
                                    : 0,

                            _method: "PUT"
                        })
                    }
                );


                const data =
                    await response.json();


                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message ||
                        "Failed to save notification settings."
                    );
                }


                showToast(
                    "Notification preference updated."
                );


            } catch (error) {

                console.error(
                    "Notification setting error:",
                    error
                );

                // Revert toggle if saving failed
                toggle.classList.toggle("on");

                toggle.setAttribute(
                    "aria-pressed",
                    toggle.classList.contains("on")
                        ? "true"
                        : "false"
                );

                showToast(
                    "Unable to save notification preference."
                );
            }

        });

    });

    /* =====================================================
       GLOBAL SEARCH
    ===================================================== */

    const globalSearch =
        document.getElementById("globalSearch");


    if (globalSearch) {

        globalSearch.addEventListener("input", function () {

            const keyword =
                globalSearch.value
                    .trim()
                    .toLowerCase();


            const cards =
                document.querySelectorAll(".content .card");


            cards.forEach(function (card) {

                const text =
                    card.textContent.toLowerCase();


                if (
                    keyword === "" ||
                    text.includes(keyword)
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });


        globalSearch.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                globalSearch.value = "";

                globalSearch.dispatchEvent(
                    new Event("input")
                );

                globalSearch.blur();

            }

        });

    }


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    document
        .querySelectorAll(".password-toggle")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const targetId =
                    button.getAttribute("data-target");

                const input =
                    document.getElementById(targetId);


                if (!input) {
                    return;
                }


                if (input.type === "password") {

                    input.type = "text";

                    button.innerHTML =
                        '<i class="fa-regular fa-eye-slash"></i>';

                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    input.type = "password";

                    button.innerHTML =
                        '<i class="fa-regular fa-eye"></i>';

                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            });

        });


    /* =====================================================
       PASSWORD FORM
    ===================================================== */

    const passwordForm =
        document.getElementById("passwordForm");


    if (passwordForm) {

        passwordForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const formData =
                    new FormData(passwordForm);


                try {

                    const response =
                        await fetch(
                            passwordForm.action,
                            {
                                method: "POST",

                                headers: {
                                    "X-CSRF-TOKEN":
                                        csrfToken,

                                    "Accept":
                                        "application/json",

                                    "X-Requested-With":
                                        "XMLHttpRequest"
                                },

                                body: formData
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        if (data.errors) {

                            const firstError =
                                Object.values(data.errors)[0];

                            if (
                                firstError &&
                                firstError[0]
                            ) {

                                throw new Error(
                                    firstError[0]
                                );

                            }

                        }

                        throw new Error(
                            data.message ||
                            "Unable to update password."
                        );

                    }


                    if (data.success) {

                        passwordForm.reset();

                        showToast(
                            data.message ||
                            "Password updated successfully."
                        );

                    }

                } catch (error) {

                    console.error(
                        "Password update error:",
                        error
                    );

                    showToast(
                        error.message ||
                        "Unable to update password.",
                        true
                    );

                }

            }
        );

    }

// =========================================
// ADMINISTRATOR PROFILE EDIT
// =========================================

const editProfileBtn =
    document.getElementById("editProfileBtn");

const cancelProfileBtn =
    document.getElementById("cancelProfileBtn");

const saveProfileBtn =
    document.getElementById("saveProfileBtn");

const profileActions =
    document.getElementById("profileActions");

const displayName =
    document.getElementById("displayName");

const displayRole =
    document.getElementById("displayRole");

const displayEmail =
    document.getElementById("displayEmail");

const displayLabs =
    document.getElementById("displayLabs");

const editName =
    document.getElementById("editName");

const editRole =
    document.getElementById("editRole");

const editEmail =
    document.getElementById("editEmail");

const editLabs =
    document.getElementById("editLabs");


// =========================================
// EDIT PROFILE
// =========================================

if (
    editProfileBtn &&
    displayName &&
    displayRole &&
    displayEmail &&
    displayLabs &&
    editName &&
    editRole &&
    editEmail &&
    editLabs
) {

    editProfileBtn.addEventListener("click", function () {

    const profileCard =
        document.querySelector(".administrator-profile-card");

    if (profileCard) {
        profileCard.classList.add("editing");
    }

    // Copy current values
    editName.value = displayName.textContent.trim();
    editRole.value = displayRole.textContent.trim();
    editEmail.value = displayEmail.textContent.trim();
    editLabs.value = displayLabs.textContent.trim();

    editProfileBtn.style.display = "none";

    if (profileActions) {
        profileActions.style.display = "flex";
    }

});
}
    


// =========================================
// CANCEL
// =========================================

if (cancelProfileBtn) {
cancelProfileBtn.addEventListener("click", function () {

    const profileCard =
        document.querySelector(".administrator-profile-card");

    if (profileCard) {
        profileCard.classList.remove("editing");
    }

    

    editProfileBtn.style.display = "inline-flex";

    if (profileActions) {
        profileActions.style.display = "none";
    }

});
}


// =========================================
// SAVE PROFILE
// =========================================

if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        async function () {

            const formData = new FormData();

            formData.append(
                "name",
                editName.value
            );

            formData.append(
                "role",
                editRole.value
            );

            formData.append(
                "email",
                editEmail.value
            );

            formData.append(
                "assigned_laboratories",
                editLabs.value
            );

            // Laravel PUT
            formData.append(
                "_method",
                "PUT"
            );


            try {

                saveProfileBtn.disabled = true;


                const response = await fetch(
                    "/admin/settings/profile",
                    {
                        method: "POST",

                        headers: {
                            "X-CSRF-TOKEN": csrfToken,
                            "Accept": "application/json",
                            "X-Requested-With":
                                "XMLHttpRequest"
                        },

                        body: formData
                    }
                );


                const data =
                    await response.json();


                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message ||
                        "Failed to update profile."
                    );

                }


                // =================================
                // UPDATE TEXT
                // =================================

                displayName.textContent =
                    data.admin.name;

                displayRole.textContent =
                    data.admin.role ||
                    editRole.value;

                displayEmail.textContent =
                    data.admin.email;

                displayLabs.textContent =
                    data.admin.assigned_laboratories ||
                    editLabs.value;


                // =================================
                // BACK TO DISPLAY MODE
                // =================================

                editName.style.display = "none";
                editRole.style.display = "none";
                editEmail.style.display = "none";
                editLabs.style.display = "none";


                displayName.style.display = "block";
                displayRole.style.display = "block";
                displayEmail.style.display = "block";
                displayLabs.style.display = "block";


                editProfileBtn.style.display =
                    "inline-flex";


                if (profileActions) {
                    profileActions.style.display =
                        "none";
                }


                showToast(
                    "Administrator profile updated successfully."
                );


            } catch (error) {

                console.error(
                    "Profile update error:",
                    error
                );

                showToast(
                    error.message ||
                    "Unable to update profile.",
                    true
                );


            } finally {

                saveProfileBtn.disabled = false;

            }

        }
    );

}

    /* =====================================================
       TOAST FUNCTION
    ===================================================== */

    function showToast(
        message,
        error = false
    ) {

        let toast =
            document.getElementById(
                "settingsToast"
            );


        if (!toast) {

            toast =
                document.createElement("div");

            toast.id =
                "settingsToast";

            toast.className =
                "toast";


            toast.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                <span id="settingsToastMessage"></span>
            `;


            document.body.appendChild(toast);

        }


        const toastMessage =
            document.getElementById(
                "settingsToastMessage"
            );


        if (toastMessage) {

            toastMessage.textContent =
                message;

        }


        toast.classList.toggle(
            "error",
            error
        );


        toast.classList.add("show");


        setTimeout(
            function () {

                toast.classList.remove("show");

            },
            3000
        );

    }

});

// =========================================
// NOTIFICATION PREFERENCES
// =========================================

const violationAlerts =
    document.getElementById("violationAlerts");

const pcOfflineAlerts =
    document.getElementById("pcOfflineAlerts");

const dailyAttendanceSummary =
    document.getElementById("dailyAttendanceSummary");

const emailNotifications =
    document.getElementById("emailNotifications");


async function saveNotificationPreferences() {

    const csrfToken =
        document.querySelector(
            'meta[name="csrf-token"]'
        )?.getAttribute("content");


    const preferences = {

        violation_alerts:
            violationAlerts?.checked ? 1 : 0,

        pc_offline_alerts:
            pcOfflineAlerts?.checked ? 1 : 0,

        daily_attendance_summary:
            dailyAttendanceSummary?.checked ? 1 : 0,

        email_notifications:
            emailNotifications?.checked ? 1 : 0

    };


    try {

        const response = await fetch(
            "/admin/settings/notifications",
            {
                method: "POST",

                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },

                body: new URLSearchParams({
                    ...preferences,
                    _method: "PUT"
                })
            }
        );


        const data = await response.json();


        if (!response.ok || !data.success) {
            throw new Error(
                data.message ||
                "Failed to save notification preferences."
            );
        }


        showToast(
            "Notification preferences updated successfully."
        );


    } catch (error) {

        console.error(
            "Notification preference error:",
            error
        );

        showToast(
            "Unable to save notification preferences."
        );

    }

}


// =========================================
// TOGGLE EVENTS
// =========================================

if (violationAlerts) {

    violationAlerts.addEventListener(
        "change",
        saveNotificationPreferences
    );

}


if (pcOfflineAlerts) {

    pcOfflineAlerts.addEventListener(
        "change",
        saveNotificationPreferences
    );

}


if (dailyAttendanceSummary) {

    dailyAttendanceSummary.addEventListener(
        "change",
        saveNotificationPreferences
    );

}


if (emailNotifications) {

    emailNotifications.addEventListener(
        "change",
        saveNotificationPreferences
    );

}

/* =====================================================
   LOAD DATABASE NOTIFICATIONS
===================================================== */

const notificationList =
    document.getElementById("notificationList");

const bellDot =
    document.getElementById("bellDot");

const notifMenu =
    document.getElementById("notifMenu");

const markNotificationsRead =
    document.getElementById("markNotificationsRead");


function getNotificationIcon(type) {

    if (type === "violation") {

        return `
            <div
                class="dot-icon"
                style="
                    background:var(--red-soft);
                    color:var(--red);
                "
            >
                <i class="fa-solid fa-ban"></i>
            </div>
        `;

    }


    if (type === "pc_offline") {

        return `
            <div
                class="dot-icon"
                style="
                    background:var(--orange-soft);
                    color:var(--orange);
                "
            >
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
        `;

    }


    if (type === "attendance") {

        return `
            <div
                class="dot-icon"
                style="
                    background:var(--blue-soft);
                    color:var(--blue);
                "
            >
                <i class="fa-solid fa-user-check"></i>
            </div>
        `;

    }


    return `
        <div
            class="dot-icon"
            style="
                background:#eef2ff;
                color:#4f46e5;
            "
        >
            <i class="fa-solid fa-bell"></i>
        </div>
    `;
}


async function loadNotifications() {

    if (!notificationList) {
        return;
    }


    try {

        const response = await fetch(
            "/admin/settings/notifications",
            {
                method: "GET",

                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok || !data.success) {
            throw new Error(
                data.message ||
                "Unable to load notifications."
            );
        }


        /* ==========================================
           UPDATE BADGE
        ========================================== */

        const unreadCount =
            Number(data.unread_count || 0);


        if (bellDot) {

            if (unreadCount > 0) {

                bellDot.textContent =
                    unreadCount > 99
                        ? "99+"
                        : unreadCount;

                bellDot.style.display =
                    "flex";

            } else {

                bellDot.style.display =
                    "none";

            }

        }


        /* ==========================================
           EMPTY
        ========================================== */

        if (
            !data.notifications ||
            data.notifications.length === 0
        ) {

            notificationList.innerHTML = `
                <div class="notification-empty">
                    <i
                        class="fa-regular fa-bell-slash"
                        style="
                            font-size:22px;
                            margin-bottom:8px;
                            display:block;
                        "
                    ></i>

                    No notifications yet.
                </div>
            `;

            return;
        }


        /* ==========================================
           RENDER
        ========================================== */

        notificationList.innerHTML =
            data.notifications.map(function (notification) {

                return `
                    <div
                        class="notif-row ${
                            notification.read
                                ? ""
                                : "unread"
                        }"
                        data-notification-id="${notification.id}"
                    >

                        ${getNotificationIcon(
                            notification.type
                        )}

                        <div>

                            <div class="r-title">
                                ${escapeHtml(
                                    notification.title
                                )}
                            </div>

                            <div
                                class="r-message"
                                style="
                                    font-size:12px;
                                    color:#64748b;
                                    margin-top:2px;
                                "
                            >
                                ${escapeHtml(
                                    notification.message
                                )}
                            </div>

                            <div class="r-time">
                                ${escapeHtml(
                                    notification.created_at
                                )}
                            </div>

                        </div>

                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "Notification loading error:",
            error
        );

        notificationList.innerHTML = `
            <div class="notification-empty">
                Unable to load notifications.
            </div>
        `;
    }
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


/* =====================================================
   MARK ALL AS READ
===================================================== */

if (markNotificationsRead) {

    markNotificationsRead.addEventListener(
        "click",
        async function (event) {

            event.stopPropagation();


            try {

                const response =
                    await fetch(
                        "/admin/settings/notifications/read",
                        {
                            method: "POST",

                            headers: {
                                "X-CSRF-TOKEN":
                                    csrfToken,

                                "Accept":
                                    "application/json",

                                "X-Requested-With":
                                    "XMLHttpRequest"
                            },

                            body:
                                new URLSearchParams({
                                    _method: "PUT"
                                })
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {
                    throw new Error(
                        data.message ||
                        "Unable to mark notifications as read."
                    );
                }


                await loadNotifications();


                showToast(
                    "All notifications marked as read."
                );


            } catch (error) {

                console.error(error);

                showToast(
                    "Unable to update notifications."
                );

            }

        }
    );

}
/* =========================================================
   LOGOUT MODAL
========================================================= */

function openLogout() {

    const modal = document.getElementById("logoutModal");

    if (!modal) {
        console.error("logoutModal NOT FOUND!");
        return;
    }

    /* Make sure the modal card exists */
    let card = modal.querySelector(":scope > .logout-modal");

    if (!card) {

        card = document.createElement("div");
        card.className = "logout-modal";

        while (modal.firstChild) {
            card.appendChild(modal.firstChild);
        }

        modal.appendChild(card);
    }

    /* Make sure the icon has the correct class */
    const icon = card.querySelector(".logout-icon");

    if (icon) {
        icon.classList.add("logout-icon");
        icon.classList.remove("logout-modal");
    }

    modal.classList.add("show");

    modal.style.setProperty("display", "flex", "important");

    document.body.style.overflow = "hidden";
}


function closeLogout() {

    const modal = document.getElementById("logoutModal");

    if (!modal) {
        console.error("logoutModal NOT FOUND!");
        return;
    }

    modal.classList.remove("show");

    modal.style.setProperty("display", "none", "important");

    document.body.style.overflow = "";
}


function confirmLogout() {

    const form = document.getElementById("logoutForm");

    if (!form) {
        console.error("logoutForm NOT FOUND!");
        return;
    }

    form.submit();
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


/* =====================================================
   INITIAL LOAD
===================================================== */

loadNotifications();


/* =====================================================
   AUTO REFRESH
   Checks for new notifications every 10 seconds.
===================================================== */

setInterval(
    loadNotifications,
    10000
);

/* =========================================================
   EDIT PROFILE
========================================================= */

const editProfileBtn = document.getElementById("editProfileBtn");
const profileActions = document.getElementById("profileActions");

const displayName = document.getElementById("displayName");
const displayRole = document.getElementById("displayRole");
const displayEmail = document.getElementById("displayEmail");
const displayLabs = document.getElementById("displayLabs");

const editName = document.getElementById("editName");
const editRole = document.getElementById("editRole");
const editEmail = document.getElementById("editEmail");
const editLabs = document.getElementById("editLabs");

const cancelProfileBtn = document.getElementById("cancelProfileBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");


function enableProfileEdit() {

    // Hide displayed values
    displayName.style.display = "none";
    displayRole.style.display = "none";
    displayEmail.style.display = "none";
    displayLabs.style.display = "none";

    // Show input fields
    editName.style.display = "block";
    editRole.style.display = "block";
    editEmail.style.display = "block";
    editLabs.style.display = "block";

    // Show action buttons
    profileActions.style.display = "flex";

    // Hide Edit Profile button
    editProfileBtn.style.display = "none";
}


function cancelProfileEdit() {

    // Restore original values
    editName.value = displayName.textContent.trim();
    editRole.value = displayRole.textContent.trim();
    editEmail.value = displayEmail.textContent.trim();
    editLabs.value = displayLabs.textContent.trim();

    // Show displayed values
    displayName.style.display = "flex";
    displayRole.style.display = "flex";
    displayEmail.style.display = "flex";
    displayLabs.style.display = "flex";

    // Hide inputs
    editName.style.display = "none";
    editRole.style.display = "none";
    editEmail.style.display = "none";
    editLabs.style.display = "none";

    // Hide action buttons
    profileActions.style.display = "none";

    // Show Edit Profile button
    editProfileBtn.style.display = "inline-flex";
}


editProfileBtn.addEventListener("click", enableProfileEdit);

cancelProfileBtn.addEventListener("click", cancelProfileEdit);