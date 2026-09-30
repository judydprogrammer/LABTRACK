/* =========================================================
   LABSTRACK - GLOBAL SEARCH
   Works on all Admin pages
   ========================================================= */

let globalSearchTimer = null;
let globalSearchRequest = null;


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeSearchHTML(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


/* =========================================================
   RENDER SEARCH RESULTS
   ========================================================= */

function renderGlobalSearchResults(results) {

    const container =
        document.getElementById("globalSearchResults");

    if (!container) {
        return;
    }


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


    container.innerHTML =
        results.map(function (result) {

            return `
                <div
                    class="global-search-result"
                    data-url="${escapeSearchHTML(result.url)}"
                >

                    <div
                        class="global-search-icon ${escapeSearchHTML(result.type)}"
                    >

                        <i
                            class="fa-solid ${escapeSearchHTML(result.icon)}"
                        ></i>

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

        })
        .join("");


    /*
     * Add click events
     */

    container
        .querySelectorAll(".global-search-result")
        .forEach(function (item) {

            item.addEventListener(
                "click",
                function () {

                    const url =
                        this.getAttribute("data-url");

                    openGlobalSearchResult(url);

                }
            );

        });


    container.classList.add("show");
}


/* =========================================================
   SEARCH DATABASE
   ========================================================= */

async function performGlobalSearch(query) {

    const container =
        document.getElementById("globalSearchResults");


    if (!container) {
        return;
    }


    if (!query.trim()) {

        container.innerHTML = "";

        container.classList.remove("show");

        return;
    }


    /*
     * Loading
     */

    container.innerHTML = `
        <div class="global-search-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>
                Searching...
            </span>

        </div>
    `;

    container.classList.add("show");


    try {

        /*
         * Cancel previous request
         */

        if (globalSearchRequest) {
            globalSearchRequest.abort();
        }


        globalSearchRequest =
            new AbortController();


        /*
         * Call Laravel
         */

        const response =
            await fetch(
                `/admin/global-search?q=${encodeURIComponent(query)}`,
                {
                    method: "GET",

                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    },

                    credentials: "same-origin",

                    signal:
                        globalSearchRequest.signal,

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


        console.log(
            "GLOBAL SEARCH:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Search failed."
            );

        }


        renderGlobalSearchResults(
            data.results || []
        );


    }
    catch (error) {

        /*
         * Ignore cancelled requests
         */

        if (
            error.name === "AbortError"
        ) {
            return;
        }


        console.error(
            "Global search error:",
            error
        );


        container.innerHTML = `
            <div class="global-search-empty error">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <span>
                    Unable to search right now.
                </span>

            </div>
        `;

        container.classList.add("show");

    }

}


/* =========================================================
   OPEN RESULT
   ========================================================= */

function openGlobalSearchResult(url) {

    const input =
        document.getElementById(
            "globalSearchInput"
        );


    const results =
        document.getElementById(
            "globalSearchResults"
        );


    if (input) {
        input.value = "";
    }


    if (results) {

        results.innerHTML = "";

        results.classList.remove("show");

    }


    if (url) {
        window.location.href = url;
    }

}


/* =========================================================
   INITIALIZE SEARCH
   ========================================================= */

function initGlobalSearch() {

    const input =
        document.getElementById(
            "globalSearchInput"
        );


    const searchBox =
        document.getElementById(
            "globalSearchBox"
        );


    const results =
        document.getElementById(
            "globalSearchResults"
        );


    /*
     * Search bar doesn't exist on this page
     */

    if (
        !input ||
        !searchBox ||
        !results
    ) {

        console.warn(
            "Global search elements not found."
        );

        return;
    }


    console.log(
        "GLOBAL SEARCH INITIALIZED"
    );


    /* =====================================================
       INPUT
       ===================================================== */

    input.addEventListener(
        "input",
        function () {

            const query =
                this.value.trim();


            clearTimeout(
                globalSearchTimer
            );


            /*
             * Empty search
             */

            if (!query) {

                results.innerHTML = "";

                results.classList.remove(
                    "show"
                );

                return;
            }


            /*
             * Delay request
             */

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


    /* =====================================================
       ENTER + ESC
       ===================================================== */

    input.addEventListener(
        "keydown",
        function (event) {

            /*
             * ESC
             */

            if (
                event.key === "Escape"
            ) {

                this.value = "";

                results.innerHTML = "";

                results.classList.remove(
                    "show"
                );

                return;
            }


            /*
             * ENTER
             */

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


    /* =====================================================
       CLICK OUTSIDE
       ===================================================== */

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
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initGlobalSearch();

    }
);

console.log("🔥 GLOBAL SEARCH JS LOADED 🔥");

document.addEventListener("DOMContentLoaded", function () {
    console.log("🔥 GLOBAL SEARCH DOM READY 🔥");

    const input = document.getElementById("globalSearchInput");

    console.log("SEARCH INPUT:", input);

    if (input) {
        input.addEventListener("input", function () {
            console.log("🔥 SEARCH TYPED:", this.value);
        });
    }
});