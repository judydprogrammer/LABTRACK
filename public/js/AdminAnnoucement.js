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

    if (pageRoutes[pageId]) {
        window.location.href = pageRoutes[pageId];
        return;
    }
}

/* =========================================================
   PROFILE DROPDOWN
========================================================= */

function toggleProfile(e) {

    e.stopPropagation();

    closeNotif();

    const menu =
        document.getElementById("profileMenu");

    if (menu) {
        menu.classList.toggle("open");
    }
}


function closeProfile() {

    const menu =
        document.getElementById("profileMenu");

    if (menu) {
        menu.classList.remove("open");
    }
}


/* =========================================================
   PROFILE DROPDOWN ACTIONS
========================================================= */

function openAdminProfile() {

    closeProfile();

    if (
        window.adminRoutes &&
        window.adminRoutes.settings
    ) {
        window.location.href =
            window.adminRoutes.settings;
        return;
    }

    console.error("Admin settings route not found.");
}


function openAdminSettings() {

    closeProfile();

    if (
        window.adminRoutes &&
        window.adminRoutes.settings
    ) {
        window.location.href =
            window.adminRoutes.settings;
        return;
    }

    console.error("Admin settings route not found.");
}


function openAdminNotifications() {

    closeProfile();

    if (
        window.adminRoutes &&
        window.adminRoutes.violations
    ) {
        window.location.href =
            window.adminRoutes.violations;
        return;
    }

    console.error("Admin violations route not found.");
}

/* =========================================================
   NOTIFICATIONS DROPDOWN
========================================================= */

function toggleNotif(e) {

    e.stopPropagation();

    closeProfile();

    const wrap =
        document.getElementById("notifWrap");

    if (wrap) {
        wrap.classList.toggle("open");
    }
}


function closeNotif() {

    const wrap =
        document.getElementById("notifWrap");

    if (wrap) {
        wrap.classList.remove("open");
    }
}


/* =========================================================
   GLOBAL CLICK
========================================================= */

document.addEventListener("click", function (e) {

    const pMenu =
        document.getElementById("profileMenu");

    const nMenu =
        document.getElementById("notifWrap");


    if (
        pMenu &&
        !pMenu.contains(e.target)
    ) {
        closeProfile();
    }


    if (
        nMenu &&
        !nMenu.contains(e.target)
    ) {
        closeNotif();
    }

});


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        closeProfile();
        closeNotif();

        if (typeof closeLogout === "function") {
            closeLogout();
        }

        if (typeof closeSubjectModal === "function") {
            closeSubjectModal();
        }

        if (typeof closeBlockAppModal === "function") {
            closeBlockAppModal();
        }

        closeAnnouncementMenus();
        closeDeleteModal();
    }

});


/* =========================================================
   ANNOUNCEMENTS
========================================================= */

let announcements = [];

let editingAnnouncementId = null;

let announcementToDelete = null;


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
   TOAST
========================================================= */

function showToast(message, type = "success") {

    const oldToast =
        document.getElementById("announcementToast");

    if (oldToast) {
        oldToast.remove();
    }


    const toast =
        document.createElement("div");

    toast.id = "announcementToast";

    toast.className =
        "announcement-toast " + type;

    toast.textContent = message;

    document.body.appendChild(toast);


    requestAnimationFrame(() => {
        toast.classList.add("show");
    });


    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 200);

    }, 2500);
}


/* =========================================================
   LOAD ANNOUNCEMENTS FROM LARAVEL
========================================================= */
async function loadAnnouncements() {

    const list = document.getElementById("announcementList");

    if (!list) {
        console.error("announcementList not found.");
        return;
    }

    try {

        list.innerHTML = `
            <div class="announcement-empty">
                <div class="announcement-empty-icon">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </div>
                <h4>Loading announcements...</h4>
                <p>Please wait.</p>
            </div>
        `;

        const response = await fetch(
            window.adminRoutes.announcementsData,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                }
            }
        );

        console.log("Announcement API status:", response.status);

        const data = await response.json();

        console.log("Announcement API response:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load announcements."
            );
        }

        if (!data.success) {
            throw new Error(
                data.message || "Unable to load announcements."
            );
        }

        announcements = Array.isArray(data.announcements)
            ? data.announcements
            : [];

        console.log(
            "Announcements loaded:",
            announcements
        );

        renderAnnouncements();

    } catch (error) {

        console.error(
            "Load Announcements Error:",
            error
        );

        list.innerHTML = `
            <div class="announcement-empty">

                <div class="announcement-empty-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>

                <h4>Unable to load announcements</h4>

                <p>${escapeHTML(error.message)}</p>

            </div>
        `;

        showToast(
            "Failed to load announcements.",
            "error"
        );
    }
}

/* =========================================================
   RENDER ANNOUNCEMENTS
========================================================= */
function renderAnnouncements() {

    const announcementList =
        document.getElementById("announcementList");

    if (!announcementList) {
        console.error("announcementList not found.");
        return;
    }

    console.log(
        "Rendering announcements:",
        announcements
    );

    if (
        !Array.isArray(announcements) ||
        announcements.length === 0
    ) {

        announcementList.innerHTML = `
            <div class="announcement-empty">

                <div class="announcement-empty-icon">
                    <i class="fa-regular fa-bell"></i>
                </div>

                <h4>No announcements made yet</h4>

                <p>
                    Published announcements will appear here.
                </p>

            </div>
        `;

        return;
    }


    announcementList.innerHTML =
        announcements.map(function (a) {

            return `
                <div class="announcement-item">

                    <div class="announcement-icon">
                        <i class="fa-solid fa-bullhorn"></i>
                    </div>


                    <div class="announcement-content">

                        <h4>
                            ${escapeHTML(a.title || "")}
                        </h4>


                        <div class="announcement-meta">

                            ${escapeHTML(a.date || "")}

                            ${
                                a.audience
                                    ? " · " +
                                      escapeHTML(a.audience)
                                    : ""
                            }

                        </div>


                        <div class="announcement-message">
                            ${sanitizeAnnouncementHTML(
                                a.body || ""
                            )}
                        </div>

                    </div>


                    <div class="announcement-actions-menu">

                        <button
                            type="button"
                            class="announcement-more"
                            onclick="toggleAnnouncementMenu(event, ${Number(a.id)})"
                            title="More options"
                        >
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>


                        <div
                            class="announcement-dropdown"
                            id="announcement-menu-${Number(a.id)}"
                        >

                            <button
                                type="button"
                                onclick="editAnnouncement(${Number(a.id)})"
                            >
                                <i class="fa-solid fa-pen"></i>
                                Edit
                            </button>


                            <button
                                type="button"
                                class="delete-action"
                                onclick="deleteAnnouncement(${Number(a.id)})"
                            >
                                <i class="fa-solid fa-trash"></i>
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            `;

        }).join("");
}

/* =========================================================
   POST / UPDATE ANNOUNCEMENT
========================================================= */
/* =========================================================
   POST / UPDATE ANNOUNCEMENT
========================================================= */

async function postAnnouncement() {

    const titleInput =
        document.getElementById("annTitle");

    const audienceInput =
        document.getElementById("annAudience");

    const messageInput =
        document.getElementById("annBody");


    if (
        !titleInput ||
        !audienceInput ||
        !messageInput
    ) {
        console.error(
            "Announcement form elements not found."
        );
        return;
    }


    const title =
        titleInput.value.trim();

    const audience =
        audienceInput.value;

    const body =
        messageInput.innerHTML.trim();

    const plainBody =
        messageInput.innerText.trim();


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!title) {

        showToast(
            "Please enter an announcement title.",
            "error"
        );

        titleInput.focus();

        return;
    }


    if (!audience) {

        showToast(
            "Please select an audience.",
            "error"
        );

        audienceInput.focus();

        return;
    }


    if (!plainBody) {

        showToast(
            "Please enter an announcement message.",
            "error"
        );

        messageInput.focus();

        return;
    }


    if (plainBody.length > 1000) {

        showToast(
            "Message cannot exceed 1000 characters.",
            "error"
        );

        return;
    }


    /* =====================================================
       CHECK EDITING
    ===================================================== */

    const wasEditing =
        editingAnnouncementId !== null;


    let url;
    let method;


    if (wasEditing) {

        url =
            `${window.adminRoutes.announcementsUpdate}/${editingAnnouncementId}`;

        method = "PUT";

    } else {

        url =
            window.adminRoutes.announcementsStore;

        method = "POST";
    }


    try {

        /* =================================================
           SEND REQUEST
        ================================================= */

        const response =
            await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json",

                        "X-CSRF-TOKEN":
                            getCsrfToken(),

                        "X-Requested-With":
                            "XMLHttpRequest"
                    },

                    body: JSON.stringify({
                        title: title,
                        audience: audience,
                        body: body
                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Announcement API Response:",
            data
        );


        /* =================================================
           ERROR
        ================================================= */

        if (!response.ok) {

            if (data.errors) {

                const firstError =
                    Object.values(data.errors)
                        .flat()[0];

                throw new Error(
                    firstError ||
                    "Validation failed."
                );
            }


            throw new Error(
                data.message ||
                "Failed to save announcement."
            );
        }


        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to save announcement."
            );
        }


        /* =================================================
           SUCCESS
        ================================================= */

        console.log(
            "ANNOUNCEMENT SAVED SUCCESSFULLY"
        );


        /* =================================================
           RESET FORM
        ================================================= */

        resetAnnouncementForm();


        /* =================================================
           RELOAD PUBLISHED ANNOUNCEMENTS
        ================================================= */

        await loadAnnouncements();


        /* =================================================
           SUCCESS POPUP
        ================================================= */

        if (wasEditing) {

            showAnnouncementNotification(
                "Announcement Updated Successfully!",
                "Your announcement has been successfully updated.",
                "success"
            );

        } else {

            showAnnouncementNotification(
                "Announcement Posted Successfully!",
                "Your announcement has been successfully published.",
                "success"
            );
        }


    } catch (error) {

        console.error(
            "Announcement Save Error:",
            error
        );


        showToast(
            error.message ||
            "Failed to save announcement.",
            "error"
        );
    }
}

/* =========================================================
   RESET FORM
========================================================= */

function resetAnnouncementForm() {

    const titleInput =
        document.getElementById("annTitle");

    const audienceInput =
        document.getElementById("annAudience");

    const messageInput =
        document.getElementById("annBody");


    if (titleInput) {
        titleInput.value = "";
    }


    if (audienceInput) {
        audienceInput.selectedIndex = 0;
    }


    if (messageInput) {
        messageInput.innerHTML = "";
    }


    editingAnnouncementId = null;


    /* Reset button */

    const postButton =
        document.querySelector(
            ".announcement-actions .btn-primary"
        );


    if (postButton) {

        postButton.innerHTML = `
            <i class="fa-solid fa-paper-plane"></i>
            <span>Post Announcement</span>
        `;
    }


    /* Remove cancel button */

    const cancelButton =
        document.getElementById(
            "cancelEditAnnouncement"
        );


    if (cancelButton) {
        cancelButton.remove();
    }


    updateMessageCounter();
}


/* =========================================================
   EDIT ANNOUNCEMENT
========================================================= */
function editAnnouncement(id) {

    const announcement = announcements.find(
        ann => ann.id == id
    );

    if (!announcement) {
        console.error("Announcement not found:", id);
        return;
    }

    editingAnnouncementId = id;

    document.getElementById("annTitle").value =
        announcement.title || "";

    document.getElementById("annAudience").value =
        announcement.audience || "";

    document.getElementById("annBody").innerHTML =
        announcement.body || "";

    // CHANGE BUTTON TEXT
    const button = document.querySelector(
        ".announcement-actions .btn-primary"
    );

    if (button) {
        button.querySelector("span").textContent =
            "Update Announcement";
    }

    console.log("EDITING ANNOUNCEMENT:", id);
}

/* =========================================================
   DELETE ANNOUNCEMENT
========================================================= */

function deleteAnnouncement(id) {

    const announcement =
        announcements.find(
            a => Number(a.id) === Number(id)
        );


    if (!announcement) {
        return;
    }


    announcementToDelete =
        Number(id);


    const modal =
        document.getElementById(
            "deleteAnnouncementModal"
        );


    if (modal) {
        modal.classList.add("show");
    }


    closeAnnouncementMenus();
}


/* =========================================================
   CONFIRM DELETE
========================================================= */

async function confirmDeleteAnnouncement() {

    if (announcementToDelete === null) {
        return;
    }


    const id =
        announcementToDelete;


    try {

        const url =
            `${window.adminRoutes.announcementsDelete}/${id}`;


        const response =
            await fetch(
                url,
                {
                    method: "DELETE",

                    headers: {
                        "Accept":
                            "application/json",

                        "X-CSRF-TOKEN":
                            getCsrfToken()
                    }
                }
            );


        const data =
            await response.json();


        /* =================================================
           ERROR
        ================================================= */

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete announcement."
            );
        }


        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to delete announcement."
            );
        }


        /* =================================================
           SUCCESS
        ================================================= */

        closeDeleteModal();


        announcementToDelete = null;


        /* Reload Published Announcements */
            await loadAnnouncements();

            /* Show Delete Success Popup */

            showAnnouncementNotification(
                "Announcement Deleted!",
                "The announcement has been successfully deleted.",
                "delete"
            );



        /* Show Delete Success Popup */

        showAnnouncementNotification(
            "Announcement Deleted!",
            "The announcement has been successfully deleted.",
            "delete"
        );


    } catch (error) {

        console.error(
            "Delete Announcement Error:",
            error
        );


        showToast(
            error.message ||
            "Failed to delete announcement.",
            "error"
        );
    }
}


/* =========================================================
   CLOSE DELETE MODAL
========================================================= */

function closeDeleteModal() {

    const modal =
        document.getElementById(
            "deleteAnnouncementModal"
        );


    if (modal) {
        modal.classList.remove("show");
    }


    announcementToDelete = null;
}


/* =========================================================
   THREE DOT MENU
========================================================= */

function toggleAnnouncementMenu(event, id) {

    event.stopPropagation();


    const currentMenu =
        document.getElementById(
            `announcement-menu-${id}`
        );


    if (!currentMenu) {
        return;
    }


    document
        .querySelectorAll(
            ".announcement-dropdown"
        )
        .forEach(menu => {

            if (menu !== currentMenu) {

                menu.classList.remove(
                    "show"
                );
            }

        });


    currentMenu.classList.toggle(
        "show"
    );
}


/* =========================================================
   CLOSE ANNOUNCEMENT MENUS
========================================================= */

function closeAnnouncementMenus() {

    document
        .querySelectorAll(
            ".announcement-dropdown"
        )
        .forEach(menu => {

            menu.classList.remove(
                "show"
            );

        });
}


document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                ".announcement-actions-menu"
            )
        ) {

            closeAnnouncementMenus();

        }

    }
);


/* =========================================================
   MESSAGE EDITOR
========================================================= */

const messageEditor =
    document.getElementById("annBody");

const messageCounter =
    document.getElementById("messageCounter");


function formatMessage(command) {

    if (!messageEditor) return;


    messageEditor.focus();


    document.execCommand(
        command,
        false,
        null
    );


    updateMessageCounter();
}


function insertAnnouncementLink() {

    if (!messageEditor) return;

    messageEditor.focus();

    const modal =
        document.getElementById("linkModal");

    const input =
        document.getElementById("announcementLink");

    if (!modal || !input) return;

    input.value = "";

    modal.classList.add("show");

    setTimeout(() => {
        input.focus();
    }, 100);
}



function confirmAnnouncementLink() {

    const input =
        document.getElementById(
            "announcementLink"
        );

    if (!input) return;

    let url =
        input.value.trim();


    if (!url) {

        showToast(
            "Please enter a URL.",
            "error"
        );

        input.focus();

        return;
    }


    /* Add https automatically */

    if (
        !/^https?:\/\//i.test(url)
    ) {

        url =
            "https://" + url;

    }


    /* Validate URL */

    try {

        new URL(url);

    } catch {

        showToast(
            "Please enter a valid URL.",
            "error"
        );

        input.focus();

        return;
    }


    messageEditor.focus();


    document.execCommand(
        "createLink",
        false,
        url
    );


    updateMessageCounter();

    closeLinkModal();


    showToast(
        "Link inserted successfully."
    );
}

function closeLinkModal() {

    const modal =
        document.getElementById(
            "linkModal"
        );

    if (modal) {
        modal.classList.remove("show");
    }
}



/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text ?? "";

    return div.innerHTML;
}


/* =========================================================
   SANITIZE ANNOUNCEMENT HTML
========================================================= */

function sanitizeAnnouncementHTML(html) {

    if (!html) {
        return "";
    }


    const temp =
        document.createElement("div");

    temp.innerHTML = html;


    const allowedTags = [
        "B",
        "STRONG",
        "I",
        "EM",
        "U",
        "UL",
        "OL",
        "LI",
        "A",
        "BR",
        "P"
    ];


    temp.querySelectorAll("*")
        .forEach(element => {

            if (
                !allowedTags.includes(
                    element.tagName
                )
            ) {

                element.replaceWith(
                    ...element.childNodes
                );

                return;
            }


            /* Remove unwanted attributes */

            [...element.attributes]
                .forEach(attribute => {

                    if (
                        element.tagName !== "A" ||
                        attribute.name !== "href"
                    ) {

                        element.removeAttribute(
                            attribute.name
                        );
                    }

                });


            /* Validate links */

            if (
                element.tagName === "A"
            ) {

                const href =
                    element.getAttribute(
                        "href"
                    ) || "";


                if (
                    !/^https?:\/\//i.test(
                        href
                    )
                ) {

                    element.removeAttribute(
                        "href"
                    );

                } else {

                    element.setAttribute(
                        "target",
                        "_blank"
                    );

                    element.setAttribute(
                        "rel",
                        "noopener noreferrer"
                    );
                }
            }

        });


    return temp.innerHTML;
}

/* =========================================================
   REAL UNICODE EMOJI PICKER
========================================================= */

const emojiCategories = {

    recent: [
        "😀","😂","😍","🥰","😊","😎","😭","😢","😡","🤔",
        "😮","😱","🥳","🤩","👍","👎","❤️","💙","💚","💛",
        "💜","🧡","🖤","🤍","🔥","✨","⭐","💯","🎉","👏",
        "🙏","✅","❌","⚠️","📢","📅","🎓","💻","📚","✏️",
        "🏆","🎁","🌟","🚀","💡","📌","🔔","📣","❤️‍🔥"
    ],

    smileys: [
        "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇",
        "🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚",
        "😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸",
        "🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️",
        "😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡"
    ],

    people: [
        "👋","🤚","🖐️","✋","🖖","👌","🤏","✌️","🤞","🤟",
        "🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊",
        "👊","🤝","👏","🙌","👐","🤲","🙏","✍️","💪","🧠",
        "👀","👁️","👄","👂","👃","🧑","👨","👩","🧒","👦",
        "👧","🎓","🧑‍🏫","🧑‍🎓","👨‍💻","👩‍💻","🧑‍💻","👨‍🎓",
        "👩‍🎓","🙋"
    ],

    animals: [
        "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
        "🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐒","🐔",
        "🐧","🐦","🐤","🦆","🦅","🦉","🐺","🐗","🐴","🦄",
        "🐝","🪲","🦋","🐌","🐞","🐢","🐍","🦎","🐙","🦑",
        "🦀","🐠","🐟","🐬","🐳","🦈","🐊","🐘","🦒","🦓"
    ],

    food: [
        "🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍒",
        "🍑","🥭","🍍","🥥","🥝","🍅","🥑","🍆","🥕","🌽",
        "🌶️","🥒","🥬","🥦","🧄","🧅","🍞","🥐","🥖","🧀",
        "🍔","🍟","🍕","🌭","🌮","🍿","🍩","🍪","🎂","🍰",
        "🧁","🍫","🍭","☕","🍵","🥤","🧋","🍽️","🍜","🍚"
    ],

    travel: [
        "🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐",
        "🛻","🚚","🚛","🚜","🛵","🏍️","🚲","✈️","🛫","🛬",
        "🚀","🛸","🚁","⛵","🚢","🚤","🚂","🚆","🚇","🚉",
        "🏠","🏡","🏢","🏫","🏥","🏦","🏨","🏪","🏬","🏭",
        "🗼","🗽","🏰","🏝️","🏖️","🏕️","🌋","⛺","🗺️","🌍"
    ],

    activities: [
        "⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱",
        "🏓","🏸","🥅","⛳","🏹","🎣","🥊","🥋","⛸️","🎿",
        "🏆","🥇","🥈","🥉","🏅","🎖️","🎮","🕹️","🎯","🎲",
        "🎨","🎭","🎬","🎤","🎧","🎼","🎹","🥁","🎸","🎺",
        "🎻","🎷","🎪","🎟️","🎫","🎉","🎊","🎁","🎈","🎂"
    ],

    objects: [
        "⌚","📱","💻","🖥️","🖨️","⌨️","🖱️","💾","💿","📷",
        "📸","📹","📺","📻","☎️","📞","📟","🔋","🔌","💡",
        "🔦","🕯️","📖","📚","📓","📒","📕","📗","📘","📙",
        "📔","✏️","🖊️","🖋️","📝","📌","📍","📎","🔗","🔒",
        "🔑","🔔","📢","📣","📬","📦","🎒","🧳","💼","🛒"
    ],

    symbols: [
        "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔",
        "❤️‍🔥","💕","💞","💓","💗","💖","💘","💝","💟","❣️",
        "💯","💢","💥","💫","✨","⭐","🌟","⚡","🔥","☀️",
        "❄️","☁️","☔","🌈","✅","☑️","✔️","❌","❗","❓",
        "‼️","⁉️","⚠️","🚫","🔴","🟠","🟡","🟢","🔵","🟣"
    ]

};


const emojiNames = {

    "😀": "grinning happy smile",
    "😂": "laugh funny tears",
    "😍": "love heart eyes",
    "🥰": "love cute",
    "😊": "smile happy",
    "😎": "cool sunglasses",
    "😭": "cry sad tears",
    "😢": "sad cry",
    "😡": "angry mad",
    "🤔": "thinking",
    "😮": "surprised wow",
    "😱": "scared scream",
    "🥳": "party celebration",
    "🤩": "excited star",
    "👍": "like good approve",
    "👎": "dislike",
    "❤️": "heart love",
    "🔥": "fire hot",
    "✨": "sparkles",
    "⭐": "star",
    "💯": "perfect hundred",
    "🎉": "party celebration",
    "👏": "clap applause",
    "🙏": "pray thanks",
    "✅": "check correct done",
    "❌": "wrong cancel",
    "⚠️": "warning caution",
    "📢": "announcement",
    "📅": "calendar date",
    "🎓": "school graduation",
    "💻": "computer laptop",
    "📚": "books study",
    "🏆": "trophy winner",
    "🎁": "gift",
    "💡": "idea",
    "📌": "pin important",
    "🔔": "notification",
    "📣": "megaphone"
};


let currentEmojiCategory = "recent";


/* =========================================================
   OPEN EMOJI PICKER
========================================================= */

function openEmojiPicker() {

    const modal =
        document.getElementById("emojiModal");

    if (!modal) {
        console.error("emojiModal not found.");
        return;
    }


    const search =
        document.getElementById("emojiSearch");

    if (search) {
        search.value = "";
    }


    currentEmojiCategory = "recent";


    document
        .querySelectorAll(".emoji-category")
        .forEach(button => {
            button.classList.remove("active");
        });


    const recentButton =
        document.querySelector(
            '.emoji-category[onclick*="recent"]'
        );

    if (recentButton) {
        recentButton.classList.add("active");
    }


    renderEmojiPicker();


    modal.classList.add("show");


    setTimeout(() => {

        if (search) {
            search.focus();
        }

    }, 100);
}


/* =========================================================
   RENDER EMOJI GRID
========================================================= */

function renderEmojiPicker() {

    const grid =
        document.getElementById("emojiIconGrid");

    const noResults =
        document.getElementById("emojiNoResults");

    const count =
        document.getElementById("emojiCount");

    const title =
        document.getElementById("emojiSectionTitle");

    const searchInput =
        document.getElementById("emojiSearch");


    if (!grid) {
        console.error("emojiIconGrid not found.");
        return;
    }


    const searchText =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    let emojis = [];


    /* SEARCH */

    if (searchText) {

        Object.values(emojiCategories)
            .flat()
            .forEach(emoji => {

                const name =
                    emojiNames[emoji] || "";

                if (
                    emoji.includes(searchText) ||
                    name.toLowerCase().includes(searchText)
                ) {

                    if (!emojis.includes(emoji)) {
                        emojis.push(emoji);
                    }

                }

            });

    }

    /* CATEGORY */

    else {

        emojis =
            emojiCategories[currentEmojiCategory] || [];

    }


    grid.innerHTML = "";


    const titles = {
        recent: "Recent",
        smileys: "Smileys",
        people: "People",
        animals: "Animals",
        food: "Food",
        travel: "Travel & Places",
        activities: "Activities",
        objects: "Objects",
        symbols: "Symbols"
    };


    if (title) {

        title.textContent =
            searchText
                ? "Search Results"
                : titles[currentEmojiCategory];

    }


    if (count) {

        count.textContent =
            `${emojis.length} emojis`;

    }


    if (emojis.length === 0) {

        if (noResults) {
            noResults.style.display = "flex";
        }

        return;
    }


    if (noResults) {
        noResults.style.display = "none";
    }


    emojis.forEach(emoji => {

        const button =
            document.createElement("button");


        button.type = "button";

        button.className =
            "emoji-icon-button";


        button.textContent =
            emoji;


        button.title =
            emojiNames[emoji] || "Insert emoji";


        button.addEventListener(
            "click",
            function () {
                selectUnicodeEmoji(emoji);
            }
        );


        grid.appendChild(button);

    });

}


/* =========================================================
   CATEGORY
========================================================= */

function filterEmojiCategory(category, button) {

    currentEmojiCategory =
        category;


    document
        .querySelectorAll(".emoji-category")
        .forEach(item => {
            item.classList.remove("active");
        });


    if (button) {
        button.classList.add("active");
    }


    const search =
        document.getElementById("emojiSearch");

    if (search) {
        search.value = "";
    }


    renderEmojiPicker();
}


/* =========================================================
   SEARCH
========================================================= */

function searchEmojiIcons() {

    renderEmojiPicker();

}


/* =========================================================
   SELECT REAL UNICODE EMOJI
========================================================= */

function selectUnicodeEmoji(emoji) {

    if (!messageEditor) {
        return;
    }


    messageEditor.focus();


    document.execCommand(
        "insertText",
        false,
        emoji
    );


    updateMessageCounter();


    /* Add to recent */

    emojiCategories.recent =
        emojiCategories.recent.filter(
            item => item !== emoji
        );


    emojiCategories.recent.unshift(
        emoji
    );


    emojiCategories.recent =
        emojiCategories.recent.slice(
            0,
            50
        );


    closeEmojiPicker();

}


/* =========================================================
   CLOSE EMOJI PICKER
========================================================= */

function closeEmojiPicker() {

    const modal =
        document.getElementById("emojiModal");

    if (modal) {
        modal.classList.remove("show");
    }

}


/* =========================================================
   EMOJI SEARCH EVENT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const search =
            document.getElementById("emojiSearch");

        if (search) {

            search.addEventListener(
                "input",
                searchEmojiIcons
            );

        }

    }
);

/* =========================================================
   MESSAGE CHARACTER COUNTER
========================================================= */

function updateMessageCounter() {

    const messageEditor =
        document.getElementById("annBody");

    const messageCounter =
        document.getElementById("messageCounter");

    if (!messageEditor || !messageCounter) {
        return;
    }

    const text =
        messageEditor.innerText.trim();

    messageCounter.textContent =
        `${text.length} / 1000 characters`;

    if (text.length > 1000) {

        messageCounter.style.color =
            "#ef4444";

    } else {

        messageCounter.style.color =
            "#64748b";

    }
}


/* =========================================================
   INITIALIZE ANNOUNCEMENT PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAnnouncements();
      

        updateMessageCounter();

    }
);

/* =========================================
   ANNOUNCEMENT NOTIFICATION POPUP
========================================= */

function showAnnouncementNotification(
    title,
    message,
    type = "success"
) {

    /* Remove existing popup if there is one */
    const existingPopup =
        document.getElementById("announcementNotificationPopup");

    if (existingPopup) {
        existingPopup.remove();
    }


    /* =========================================
       CREATE OVERLAY
    ========================================= */

    const overlay =
        document.createElement("div");

    overlay.id =
        "announcementNotificationPopup";


    /* =========================================
       OVERLAY STYLE
    ========================================= */

    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(15, 23, 42, 0.45)";
    overlay.style.backdropFilter = "blur(3px)";
    overlay.style.webkitBackdropFilter = "blur(3px)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "999999";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.2s ease";


    /* =========================================
       CREATE POPUP
    ========================================= */

    const popup =
        document.createElement("div");


    popup.style.width = "min(420px, 90%)";
    popup.style.background = "#ffffff";
    popup.style.borderRadius = "18px";
    popup.style.padding = "32px";
    popup.style.textAlign = "center";
    popup.style.boxShadow =
        "0 25px 60px rgba(0,0,0,0.20)";
    popup.style.transform = "scale(0.9)";
    popup.style.transition =
        "transform 0.2s ease";


    /* =========================================
       ICON
    ========================================= */

    const iconCircle =
        document.createElement("div");

    iconCircle.style.width = "68px";
    iconCircle.style.height = "68px";
    iconCircle.style.borderRadius = "50%";
    iconCircle.style.margin = "0 auto 18px";
    iconCircle.style.display = "flex";
    iconCircle.style.alignItems = "center";
    iconCircle.style.justifyContent = "center";
    iconCircle.style.fontSize = "28px";


    if (type === "delete") {

        iconCircle.style.background =
            "#fee2e2";

        iconCircle.style.color =
            "#ef4444";

        iconCircle.innerHTML =
            '<i class="fa-solid fa-trash"></i>';

    }

    else if (type === "error") {

        iconCircle.style.background =
            "#fef3c7";

        iconCircle.style.color =
            "#f59e0b";

        iconCircle.innerHTML =
            '<i class="fa-solid fa-triangle-exclamation"></i>';

    }

    else {

        iconCircle.style.background =
            "#dcfce7";

        iconCircle.style.color =
            "#22c55e";

        iconCircle.innerHTML =
            '<i class="fa-solid fa-check"></i>';

    }


    /* =========================================
       TITLE
    ========================================= */

    const titleElement =
        document.createElement("h3");

    titleElement.textContent =
        title;

    titleElement.style.margin =
        "0 0 10px";

    titleElement.style.fontSize =
        "21px";

    titleElement.style.fontWeight =
        "700";

    titleElement.style.color =
        "#111827";


    /* =========================================
       MESSAGE
    ========================================= */

    const messageElement =
        document.createElement("p");

    messageElement.textContent =
        message;

    messageElement.style.margin =
        "0 0 24px";

    messageElement.style.fontSize =
        "14px";

    messageElement.style.lineHeight =
        "1.6";

    messageElement.style.color =
        "#6b7280";


    /* =========================================
       OK BUTTON
    ========================================= */

    const okButton =
        document.createElement("button");

    okButton.type =
        "button";

    okButton.textContent =
        "OK";

    okButton.style.border =
        "none";

    okButton.style.background =
        "#2563eb";

    okButton.style.color =
        "#ffffff";

    okButton.style.padding =
        "11px 30px";

    okButton.style.borderRadius =
        "9px";

    okButton.style.fontSize =
        "14px";

    okButton.style.fontWeight =
        "600";

    okButton.style.cursor =
        "pointer";

    okButton.style.minWidth =
        "100px";


    okButton.addEventListener(
    "click",
    async function () {

        closeAnnouncementNotification();

        await loadAnnouncements();

    }
);


    /* =========================================
       HOVER
    ========================================= */

    okButton.addEventListener(
        "mouseenter",
        function () {

            okButton.style.background =
                "#1d4ed8";

        }
    );


    okButton.addEventListener(
        "mouseleave",
        function () {

            okButton.style.background =
                "#2563eb";

        }
    );


    /* =========================================
       BUILD POPUP
    ========================================= */

    popup.appendChild(iconCircle);
    popup.appendChild(titleElement);
    popup.appendChild(messageElement);
    popup.appendChild(okButton);

    overlay.appendChild(popup);

    document.body.appendChild(overlay);


    /* =========================================
       SHOW ANIMATION
    ========================================= */

    requestAnimationFrame(function () {

        overlay.style.opacity =
            "1";

        popup.style.transform =
            "scale(1)";

    });


    /* =========================================
       CLICK OUTSIDE
    ========================================= */

    overlay.addEventListener(
        "click",
        function (event) {

            if (event.target === overlay) {

                closeAnnouncementNotification();

            }

        }
    );

}


/* =========================================
   CLOSE ANNOUNCEMENT NOTIFICATION
========================================= */

function closeAnnouncementNotification() {

    const popup =
        document.getElementById(
            "announcementNotificationPopup"
        );

    if (!popup) {
        return;
    }


    popup.style.opacity =
        "0";


    const popupContent =
        popup.firstElementChild;

    if (popupContent) {

        popupContent.style.transform =
            "scale(0.9)";

    }


    setTimeout(function () {

        popup.remove();

    }, 200);

}

/* =========================================================
   ANNOUNCEMENT BUTTON HANDLER
========================================================= */
document.addEventListener("DOMContentLoaded", function () {

    const announcementButton =
        document.querySelector(
            ".announcement-actions .btn-primary"
        );

    if (!announcementButton) {
        console.error(
            "❌ POST ANNOUNCEMENT BUTTON NOT FOUND"
        );
        return;
    }

    console.log(
        "✅ POST ANNOUNCEMENT BUTTON FOUND"
    );

    announcementButton.onclick = function (event) {

        event.preventDefault();
        event.stopPropagation();

        console.log(
            "🔥 ANNOUNCEMENT BUTTON CLICKED"
        );

        postAnnouncement();

    };

});
/* =====================================================
   LOGOUT MODAL
===================================================== */

function openLogout() {

    const modal = document.getElementById("logoutModal");

    if (!modal) {
        console.error("logoutModal not found.");
        return;
    }

    const profile = document.querySelector(".profile");

    if (profile) {
        profile.classList.remove("open");
    }

    modal.classList.add("show");
}


function closeLogout() {

    const modal = document.getElementById("logoutModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


function confirmLogout() {

    const form = document.getElementById("logoutForm");

    if (!form) {
        console.error("logoutForm not found.");
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

/* =========================================================
   REALTIME ADMIN PROFILE
========================================================= */

async function loadRealtimeAdminProfile() {

    try {

        const response = await fetch(
            "/admin/profile/data?_=" + Date.now(),
            {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                "Profile request failed: " +
                response.status
            );
        }

        const data = await response.json();

        if (!data.success || !data.admin) {
            return;
        }

        const admin = data.admin;

        const name =
            admin.name || "Administrator";

        const adminId =
            admin.admin_id || "N/A";

        const role =
            admin.role || "Laboratory Administrator";


        /* =================================================
           GET INITIALS
        ================================================= */

        const initials =
            name
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map(word =>
                    word.charAt(0).toUpperCase()
                )
                .join("") || "AD";


        /* =================================================
           TOPBAR
        ================================================= */

        const topName =
            document.getElementById("topAdminName");

        const topRole =
            document.getElementById("topAdminRole");

        const topAvatar =
            document.getElementById("topAdminAvatar");


        if (topName) {
            topName.textContent = name;
        }

        if (topRole) {
            topRole.textContent = role;
        }

        if (topAvatar) {
            topAvatar.textContent = initials;
        }


        /* =================================================
           DROPDOWN
        ================================================= */

        const dropdownName =
            document.getElementById(
                "dropdownAdminName"
            );

        const dropdownId =
            document.getElementById(
                "dropdownAdminId"
            );

        const dropdownAvatar =
            document.getElementById(
                "dropdownAdminAvatar"
            );


        if (dropdownName) {
            dropdownName.textContent = name;
        }

        if (dropdownId) {
            dropdownId.textContent =
                "ID: " + adminId;
        }

        if (dropdownAvatar) {
            dropdownAvatar.textContent =
                initials;
        }

    } catch (error) {

        console.error(
            "Realtime admin profile error:",
            error
        );

    }
}

/* =========================================================
   REALTIME ADMIN PROFILE REFRESH
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadRealtimeAdminProfile();

        setInterval(
            loadRealtimeAdminProfile,
            5000
        );

    }
);

/* =========================================================
   ANNOUNCEMENT SEARCH
========================================================= */

document.addEventListener("input", function (event) {

    if (event.target.id !== "globalSearchInput") {
        return;
    }

    const searchValue =
        event.target.value
            .trim()
            .toLowerCase();

    const announcements =
        document.querySelectorAll(
            "#announcementList .announcement-item"
        );

    console.log(
        "Announcement Search:",
        searchValue
    );

    console.log(
        "Announcements Found:",
        announcements.length
    );

    announcements.forEach(function (announcement) {

        const title =
            announcement.querySelector(
                ".announcement-content h4"
            )?.textContent
            .toLowerCase() || "";

        const meta =
            announcement.querySelector(
                ".announcement-meta"
            )?.textContent
            .toLowerCase() || "";

        const message =
            announcement.querySelector(
                ".announcement-message"
            )?.textContent
            .toLowerCase() || "";

        const searchableText =
            `${title} ${meta} ${message}`;

        if (
            searchValue === "" ||
            searchableText.includes(searchValue)
        ) {

            announcement.style.display = "";

        } else {

            announcement.style.display = "none";

        }

    });

});




/* =========================================================
   LOGOUT MODAL
========================================================= */

function openLogout() {

    closeProfile();

    const logoutModal =
        document.getElementById("logoutModal");

    if (!logoutModal) {
        console.error("Logout modal not found.");
        return;
    }

    logoutModal.classList.add("show");
}


function closeLogout() {

    const logoutModal =
        document.getElementById("logoutModal");

    if (logoutModal) {
        logoutModal.classList.remove("show");
    }
}


function confirmLogout() {

    const logoutForm =
        document.getElementById("logoutForm");

    if (!logoutForm) {
        console.error("Logout form not found.");
        return;
    }

    logoutForm.submit();
}




// =====================================================
// ESCAPE HTML
// =====================================================

function escapeAnnouncementHTML(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}
