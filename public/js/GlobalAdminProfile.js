/* =========================================================
   LABSTRACK
   GLOBAL ADMIN PROFILE REALTIME SYNC
   ========================================================= */


let adminProfileRequest = null;


/* =========================================================
   GET ADMIN INITIALS
   ========================================================= */

function getAdminInitials(name) {

    if (!name) {
        return "AD";
    }

    const words =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();

}


/* =========================================================
   UPDATE ADMIN PROFILE UI
   ========================================================= */

function updateAdminProfileUI(admin) {

    if (!admin) {
        return;
    }


    const name =
        admin.name || "Administrator";


    const adminId =
        admin.admin_id || "N/A";


    const initials =
        getAdminInitials(name);


    /* =====================================================
       TOP PROFILE NAME
       ===================================================== */

    document
        .querySelectorAll(".profile-name .name")
        .forEach(function (element) {

            element.textContent = name;

        });


    /* =====================================================
       DROPDOWN PROFILE NAME
       ===================================================== */

    document
        .querySelectorAll(".profile-menu-header .name")
        .forEach(function (element) {

            element.textContent = name;

        });


    /* =====================================================
       ADMIN ID
       ===================================================== */

    document
        .querySelectorAll(".profile-menu-header .sub")
        .forEach(function (element) {

            element.textContent =
                "ID: " + adminId;

        });


    /* =====================================================
       AVATAR
       ===================================================== */

    document
        .querySelectorAll(".profile .avatar")
        .forEach(function (element) {

            element.textContent = initials;

        });


    /* =====================================================
       OPTIONAL ADMIN NAME ELEMENTS
       ===================================================== */

    document
        .querySelectorAll("[data-admin-name]")
        .forEach(function (element) {

            element.textContent = name;

        });

}


/* =========================================================
   LOAD ADMIN PROFILE
   ========================================================= */

async function loadAdminProfile() {

    try {

        if (adminProfileRequest) {

            adminProfileRequest.abort();

        }


        adminProfileRequest =
            new AbortController();


        const response =
            await fetch(
                "/admin/profile/data",
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
                        "no-store",

                    signal:
                        adminProfileRequest.signal

                }
            );


        if (response.status === 401) {

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Profile request failed: " +
                response.status
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !data.admin
        ) {

            return;

        }


        updateAdminProfileUI(
            data.admin
        );

    }

    catch (error) {

        if (
            error.name === "AbortError"
        ) {

            return;

        }


        console.error(
            "Admin profile sync error:",
            error
        );

    }

}


/* =========================================================
   START REALTIME PROFILE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Load immediately
         */

        loadAdminProfile();


        /*
         * Refresh every 5 seconds
         */

        setInterval(
            loadAdminProfile,
            5000
        );

    }
);