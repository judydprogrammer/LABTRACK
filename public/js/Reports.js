/* =========================================================
   LABTRACK - REPORTS.JS
   ========================================================= */

let currentReportData = null;
let currentReportType = "";
let currentReportFormat = "pdf";

let reportHistory = [];
let selectedReportId = null;

function selectReportItem(reportId) {

    selectedReportId = Number(reportId);

    document
        .querySelectorAll(".report-item")
        .forEach(item => {
            item.classList.remove("selected");
        });

    const selected =
        document.querySelector(
            `.report-item[data-report-id="${selectedReportId}"]`
        );

    if (selected) {
        selected.classList.add("selected");
    }
}


/* ---------------- PROFILE DROPDOWN ---------------- */
  function toggleProfile(e){
    e.stopPropagation();
    closeNotif();
    document.getElementById('profileMenu').classList.toggle('open');
  }
  function closeProfile(){ document.getElementById('profileMenu').classList.remove('open'); }


 

/* =========================================================
   ADMIN ROUTES
   ========================================================= */

function getAdminRoutes() {

    if (!window.adminRoutes) {
        console.error("window.adminRoutes is not configured.");
        return null;
    }

    return window.adminRoutes;
}


/* =========================================================
   CSRF
   ========================================================= */

function getCsrfToken() {

    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

    return token || "";
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message, type = "success") {

    const existing =
        document.getElementById("reportsToast");

    if (existing) {
        existing.remove();
    }

    const toast =
        document.createElement("div");

    toast.id = "reportsToast";

    toast.className =
        `reports-toast ${type}`;

    toast.innerHTML = `
        <i class="fa-solid ${
            type === "error"
                ? "fa-circle-exclamation"
                : "fa-circle-check"
        }"></i>

        <span>
            ${escapeHtml(message)}
        </span>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 250);

    }, 3000);
}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function goTo(page) {

    const routes =
        getAdminRoutes();

    if (!routes) {
        return;
    }

   const routeMap = {

    dashboard:
        routes.dashboard,

    subjects:
        routes.subjects,

    schedules:
        routes.schedules,

    schedule:
        routes.schedules,

    computers:
        routes.computers,

    attendance:
        routes.attendance,

    violations:
        routes.violations,

    reports:
        routes.reports,

    settings:
        routes.settings

};

    if (routeMap[page]) {

        window.location.href =
            routeMap[page];
    }
}


/* =========================================================
   GENERATE REPORT
   ========================================================= */
async function generateReport(event) {

    if (event) {
        event.preventDefault();
    }

    const typeSelect = document.getElementById("reportType");
    const formatSelect = document.getElementById("reportFormat");
    const fromInput = document.getElementById("reportFrom");
    const toInput = document.getElementById("reportTo");

    if (!typeSelect || !formatSelect) {
        console.error("Report form elements not found.");
        return;
    }

    const type = typeSelect.value;
    const format = formatSelect.value;

    const from = fromInput ? fromInput.value : "";
    const to = toInput ? toInput.value : "";

    if (
        !window.adminRoutes ||
        !window.adminRoutes.reportsData
    ) {
        showToast("Laravel report route not found.");
        return;
    }

    const button = document.querySelector(
        'button[onclick="generateReport()"]'
    );

    const originalText = button
        ? button.innerHTML
        : "";

    try {

        if (button) {
            button.disabled = true;

            button.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Generating...
            `;
        }


        /* =========================================
           BUILD PARAMETERS
        ========================================= */

        const params = new URLSearchParams();

        params.append("type", type);

        if (from) {
            params.append("from", from);
        }

        if (to) {
            params.append("to", to);
        }


        /* =========================================
           FETCH DATA
           
           IMPORTANT:
           DO NOT use window.location.href here.
        ========================================= */

        const url =
            window.adminRoutes.reportsData +
            "?" +
            params.toString();

        console.log("Fetching report:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        });


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data = await response.json();

        console.log(
            "Laravel Report Data:",
            data
        );


        /* =========================================
           CHECK RESPONSE
        ========================================= */

        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to generate report."
            );

        }


 /* =========================================
   SAVE GENERATED REPORT FOR DOWNLOAD
========================================= */

currentReportData = data;

currentReportType = type;

currentReportFormat = format;

window.currentGeneratedReport = {
    type: type,
    format: format,
    from: from,
    to: to,
    data: data
};


        /* =========================================
           SHOW PREVIEW MODAL
        ========================================= */

        showReportPreview(data);


        /* =========================================
           SAVE TO REPORT HISTORY
        ========================================= */

        try {

            await fetch(
                window.adminRoutes.reportsStore,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json",

                        "X-CSRF-TOKEN":
                            document
                                .querySelector(
                                    'meta[name="csrf-token"]'
                                )
                                ?.getAttribute("content")
                    },

                    body: JSON.stringify({

                        type: type,

                        format: format,

                        from: from || null,

                        to: to || null

                    })
                }
            );

        } catch (historyError) {

            console.error(
                "Unable to save report history:",
                historyError
            );

        }


        /* =========================================
           REFRESH RECENT REPORTS
        ========================================= */

        if (
            typeof loadReportHistory ===
            "function"
        ) {
            await loadReportHistory();
        }


        showToast(
            "Report generated successfully."
        );


    } catch (error) {

        console.error(
            "Generate Report Error:",
            error
        );

        showToast(
            "Unable to generate report. Please try again."
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.innerHTML =
                originalText;

        }

    }
}




/* =========================================================
   SHOW REPORT PREVIEW
   ========================================================= */

function showReportPreview(
    data,
    reportType,
    reportFrom,
    reportTo
) {

    const modal =
        document.getElementById(
            "reportPreviewModal"
        );

    if (!modal) {
        console.error("reportPreviewModal not found.");
        return;
    }

    const title =
        document.getElementById(
            "previewReportTitle"
        );


    const subtitle =
        document.getElementById(
            "previewReportSubtitle"
        );


    const summaryGrid =
        document.getElementById(
            "reportSummaryGrid"
        );


    const tableHead =
        document.getElementById(
            "reportPreviewHead"
        );


    const tableBody =
        document.getElementById(
            "reportPreviewBody"
        );


    if (!modal) {

        console.error(
            "reportPreviewModal not found."
        );

        return;
    }


    /* -----------------------------------------------------
       TITLE
       ----------------------------------------------------- */

    if (title) {

        title.textContent =
            reportType;
    }


    /* -----------------------------------------------------
       SUBTITLE
       ----------------------------------------------------- */

    if (subtitle) {

        let dateText = "";


        if (
            reportFrom &&
            reportTo
        ) {

            dateText =
                `Date: ${formatDate(reportFrom)} - ${formatDate(reportTo)}`;

        } else if (reportFrom) {

            dateText =
                `From ${formatDate(reportFrom)}`;

        } else if (reportTo) {

            dateText =
                `Until ${formatDate(reportTo)}`;

        } else {

            dateText =
                "Generated from Laravel database";
        }


        subtitle.textContent =
            dateText;
    }


    /* -----------------------------------------------------
       SUMMARY
       ----------------------------------------------------- */

    if (summaryGrid) {

        summaryGrid.innerHTML = "";


        const summary =
            data.summary || {};


        Object.entries(
            summary
        ).forEach(
            ([key, value]) => {

                const box =
                    document.createElement(
                        "div"
                    );


                box.className =
                    "report-summary-box";


                box.innerHTML = `
                    <span>
                        ${escapeHtml(
                            formatLabel(key)
                        )}
                    </span>

                    <strong>
                        ${escapeHtml(value)}
                    </strong>
                `;


                summaryGrid.appendChild(
                    box
                );
            }
        );
    }


    /* -----------------------------------------------------
       RECORDS
       ----------------------------------------------------- */

    if (tableHead) {

        tableHead.innerHTML = "";
    }


    if (tableBody) {

        tableBody.innerHTML = "";
    }


    const records =
        Array.isArray(data.records)
            ? data.records
            : [];


    if (
        records.length === 0
    ) {

        if (tableHead) {

            tableHead.innerHTML = `
                <tr>
                    <th>No Records</th>
                </tr>
            `;
        }


        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td class="empty-report-cell">
                        No records found for the selected period.
                    </td>
                </tr>
            `;
        }

    } else {

        const columns =
            Object.keys(
                records[0]
            );


        /* ---------------------------------------------
           TABLE HEADER
           --------------------------------------------- */

        if (tableHead) {

            const headerRow =
                document.createElement(
                    "tr"
                );


            columns.forEach(
                column => {

                    const th =
                        document.createElement(
                            "th"
                        );


                    th.textContent =
                        formatLabel(
                            column
                        );


                    headerRow.appendChild(
                        th
                    );
                }
            );


            tableHead.appendChild(
                headerRow
            );
        }


        /* ---------------------------------------------
           TABLE BODY
           --------------------------------------------- */

        if (tableBody) {

            records.forEach(
                record => {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    columns.forEach(
                        column => {

                            const td =
                                document.createElement(
                                    "td"
                                );


                            let value =
                                record[column];


                            if (
                                value === null ||
                                value === undefined ||
                                value === ""
                            ) {

                                value = "—";
                            }


                            td.textContent =
                                value;


                            row.appendChild(
                                td
                            );
                        }
                    );


                    tableBody.appendChild(
                        row
                    );
                }
            );
        }
    }


    /* -----------------------------------------------------
       OPEN MODAL
       ----------------------------------------------------- */

    modal.classList.add(
        "show"
    );
}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;
    }


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


/* =========================================================
   FORMAT LABEL
   ========================================================= */

function formatLabel(value) {

    return String(value || "")
        .replace(
            /([A-Z])/g,
            " $1"
        )
        .replace(
            /[_-]/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim()
        .replace(
            /\b\w/g,
            char =>
                char.toUpperCase()
        );
}


/* =========================================================
   CLOSE PREVIEW
   ========================================================= */

function closeReportPreview() {

    const modal =
        document.getElementById(
            "reportPreviewModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );
    }
}


/* =========================================================
   DOWNLOAD GENERATED REPORT
   ========================================================= */

function downloadGeneratedReport() {

    if (!currentReportData) {

        showToast(
            "Please generate a report first.",
            "error"
        );

        return;
    }


    console.log(
        "Downloading report:",
        currentReportFormat
    );


    switch (
        currentReportFormat
    ) {

        case "csv":

            downloadCSV(
                currentReportData
            );

            break;


        case "excel":

            downloadExcel(
                currentReportData
            );

            break;


        case "pdf":

        default:

            downloadPDF();

            break;
    }
}


/* =========================================================
   PDF / PRINT
   ========================================================= */

function downloadPDF() {

    if (!currentReportData) {

        showToast(
            "No report data available.",
            "error"
        );

        return;
    }


    const report =
        currentReportData;


    const title =
        currentReportType ||
        report.type ||
        "LABTRACK Report";


    const from =
        document.getElementById(
            "reportFrom"
        )?.value || "";


    const to =
        document.getElementById(
            "reportTo"
        )?.value || "";


    const records =
        Array.isArray(report.records)
            ? report.records
            : [];


    const summary =
        report.summary || {};


    let summaryHTML = "";


    Object.entries(
        summary
    ).forEach(
        ([key, value]) => {

            summaryHTML += `
                <div class="summary-box">

                    <span>
                        ${escapeHtml(
                            formatLabel(key)
                        )}
                    </span>

                    <strong>
                        ${escapeHtml(value)}
                    </strong>

                </div>
            `;
        }
    );


    let tableHTML = "";


    if (
        records.length > 0
    ) {

        const columns =
            Object.keys(
                records[0]
            );


        tableHTML = `
            <table>

                <thead>

                    <tr>

                        ${columns.map(
                            column => `
                                <th>
                                    ${escapeHtml(
                                        formatLabel(column)
                                    )}
                                </th>
                            `
                        ).join("")}

                    </tr>

                </thead>

                <tbody>

                    ${records.map(
                        record => `
                            <tr>

                                ${columns.map(
                                    column => `
                                        <td>
                                            ${escapeHtml(
                                                record[column] ?? "—"
                                            )}
                                        </td>
                                    `
                                ).join("")}

                            </tr>
                        `
                    ).join("")}

                </tbody>

            </table>
        `;

    } else {

        tableHTML = `
            <div class="no-records">
                No records found for the selected period.
            </div>
        `;
    }


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        showToast(
            "Please allow pop-ups to download the PDF.",
            "error"
        );

        return;
    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${escapeHtml(title)}
            </title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 40px;
                    color: #111827;
                    background: white;
                }

                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 800;
                }

                .header h2 {
                    margin: 8px 0;
                    font-size: 20px;
                }

                .header p {
                    margin: 0;
                    color: #64748b;
                    font-size: 13px;
                }

                .summary {
                    display: grid;
                    grid-template-columns:
                        repeat(4, 1fr);
                    gap: 12px;
                    margin-bottom: 25px;
                }

                .summary-box {
                    border: 1px solid #dbe1ea;
                    border-radius: 8px;
                    padding: 15px;
                    text-align: center;
                }

                .summary-box span {
                    display: block;
                    font-size: 12px;
                    color: #64748b;
                    margin-bottom: 6px;
                }

                .summary-box strong {
                    font-size: 22px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }

                th,
                td {
                    border: 1px solid #d1d5db;
                    padding: 9px;
                    font-size: 12px;
                    text-align: left;
                }

                th {
                    font-weight: 700;
                    background: #f3f4f6;
                }

                .no-records {
                    padding: 30px;
                    text-align: center;
                    border: 1px solid #d1d5db;
                }

                .footer {
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #d1d5db;
                    color: #64748b;
                    font-size: 11px;
                }

                @media print {

                    body {
                        padding: 20px;
                    }

                }

            </style>

        </head>


        <body>

            <div class="header">

                <h1>
                    LABTRACK
                </h1>

                <h2>
                    ${escapeHtml(title)}
                </h2>

                <p>
                    ${
                        from && to
                            ? `Date: ${escapeHtml(
                                formatDate(from)
                            )} - ${escapeHtml(
                                formatDate(to)
                            )}`
                            : "Generated Report"
                    }
                </p>

            </div>


            <div class="summary">

                ${summaryHTML}

            </div>


            ${tableHTML}


            <div class="footer">

                Generated by LABTRACK

                <br>

                ${escapeHtml(
                    new Date().toLocaleString()
                )}

            </div>

        </body>

        </html>
    `);


    printWindow.document.close();


    printWindow.focus();


    setTimeout(() => {

        printWindow.print();

    }, 500);


    showToast(
        "PDF print window opened.",
        "success"
    );
}


/* =========================================================
   CSV
   ========================================================= */

function downloadCSV(data) {

    const records =
        Array.isArray(data.records)
            ? data.records
            : [];


    let rows = [];


    if (
        records.length > 0
    ) {

        const columns =
            Object.keys(
                records[0]
            );


        rows.push(
            columns
        );


        records.forEach(
            record => {

                rows.push(
                    columns.map(
                        column =>
                            record[column] ?? ""
                    )
                );
            }
        );

    } else {

        const summary =
            data.summary || {};


        rows.push([
            "Summary",
            "Value"
        ]);


        Object.entries(
            summary
        ).forEach(
            ([key, value]) => {

                rows.push([
                    formatLabel(key),
                    value
                ]);
            }
        );
    }


    const csv =
        rows
            .map(
                row =>
                    row
                        .map(
                            value =>
                                `"${String(
                                    value ?? ""
                                ).replace(
                                    /"/g,
                                    '""'
                                )}"`
                        )
                        .join(",")
            )
            .join("\r\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    const fileName =
        `${currentReportType
            .replace(
                /[^a-z0-9]+/gi,
                "_"
            )
            .replace(
                /^_+|_+$/g,
                ""
            ) || "LABTRACK_Report"}.csv`;


    link.href =
        url;

    link.download =
        fileName;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "CSV report downloaded.",
        "success"
    );
}


/* =========================================================
   EXCEL
   ========================================================= */

function downloadExcel(data) {

    /*
     * This creates an Excel-compatible
     * .xls file using HTML table data.
     */

    const records =
        Array.isArray(data.records)
            ? data.records
            : [];


    let table = "";


    if (
        records.length > 0
    ) {

        const columns =
            Object.keys(
                records[0]
            );


        table += `
            <table border="1">

                <tr>

                    ${columns.map(
                        column => `
                            <th>
                                ${escapeHtml(
                                    formatLabel(column)
                                )}
                            </th>
                        `
                    ).join("")}

                </tr>
        `;


        records.forEach(
            record => {

                table += `
                    <tr>

                        ${columns.map(
                            column => `
                                <td>
                                    ${escapeHtml(
                                        record[column] ?? ""
                                    )}
                                </td>
                            `
                        ).join("")}

                    </tr>
                `;
            }
        );


        table += `
            </table>
        `;

    } else {

        table = `
            <table border="1">

                <tr>
                    <th>Summary</th>
                    <th>Value</th>
                </tr>

                ${
                    Object.entries(
                        data.summary || {}
                    ).map(
                        ([key, value]) => `
                            <tr>

                                <td>
                                    ${escapeHtml(
                                        formatLabel(key)
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        value
                                    )}
                                </td>

                            </tr>
                        `
                    ).join("")
                }

            </table>
        `;
    }


    const excelHTML = `

        <html>

        <head>

            <meta charset="UTF-8">

        </head>

        <body>

            <h2>
                LABTRACK - ${escapeHtml(
                    currentReportType
                )}
            </h2>

            ${table}

        </body>

        </html>
    `;


    const blob =
        new Blob(
            [excelHTML],
            {
                type:
                    "application/vnd.ms-excel"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `${currentReportType
            .replace(
                /[^a-z0-9]+/gi,
                "_"
            )
            .replace(
                /^_+|_+$/g,
                ""
            ) || "LABTRACK_Report"}.xls`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Excel report downloaded.",
        "success"
    );
}


/* =========================================================
   LOAD REPORT HISTORY
   ========================================================= */

async function loadReportHistory() {

    const routes =
        getAdminRoutes();


    if (
        !routes ||
        !routes.reportsHistory
    ) {

        console.error(
            "reportsHistory route is missing."
        );

        return;
    }


    try {

        const response =
            await fetch(
                routes.reportsHistory,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json",

                        "X-Requested-With":
                            "XMLHttpRequest"
                    }
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            data.success === false
        ) {

            throw new Error(
                data.message ||
                "Unable to load report history."
            );
        }


        reportHistory =
            Array.isArray(
                data.reports
            )
                ? data.reports
                : [];


        renderReports();


    } catch (error) {

        console.error(
            "Load Report History Error:",
            error
        );


        reportHistory = [];

        renderReports();
    }
}


/* =========================================================
   RENDER REPORT HISTORY
   ========================================================= */

function renderReports() {

    const container =
        document.getElementById(
            "reportHistoryList"
        );


    if (!container) {

        return;
    }


    if (
        reportHistory.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-report-history">

                <i class="fa-solid fa-file-circle-xmark"></i>

                <h4>No reports yet</h4>

                <p>
                    Generated reports will appear here.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        reportHistory
            .map(
                report => {

                    const id =
                        Number(
                            report.id
                        );


                    const format =
                        String(
                            report.format ||
                            "pdf"
                        ).toLowerCase();


                    const icon =
                        getFormatIcon(
                            format
                        );


                    const iconClass =
                        getFormatClass(
                            format
                        );


                    const selected =
                        Number(
                            selectedReportId
                        ) === id
                            ? "selected"
                            : "";


                    return `
                        <div
                            class="report-item ${selected}"
                            data-report-id="${id}"
                            onclick="selectReportItem(${id})"
                        >

                            <div
                                class="report-icon ${iconClass}"
                            >
                                <i class="${icon}"></i>
                            </div>


                            <div class="report-details">

                                <h4>
                                    ${escapeHtml(
                                        report.name ||
                                        report.type ||
                                        "Report"
                                    )}
                                </h4>

                                <p>
                                    ${escapeHtml(
                                        report.date ||
                                        "Generated report"
                                    )}
                                </p>

                            </div>


                            <button
                                type="button"
                                class="btn-icon"
                                onclick="
                                    event.stopPropagation();
                                    downloadHistoryReport(${id});
                                "
                                title="Download Report"
                            >

                                <i class="fa-solid fa-download"></i>

                            </button>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   SELECT REPORT
   ========================================================= */

function selectReportItem(
    reportId
) {

    selectedReportId =
        Number(reportId);


    document
        .querySelectorAll(
            ".report-item"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "selected"
                );
            }
        );


    const selected =
        document.querySelector(
            `.report-item[data-report-id="${selectedReportId}"]`
        );


    if (selected) {

        selected.classList.add(
            "selected"
        );
    }
}

/* =========================================================
   DOWNLOAD HISTORY REPORT
   ========================================================= */

async function downloadHistoryReport(reportId) {

    const report =
        reportHistory.find(
            item =>
                Number(item.id) ===
                Number(reportId)
        );

    if (!report) {

        showToast(
            "Report not found.",
            "error"
        );

        return;
    }


    const routes =
        getAdminRoutes();

    if (
        !routes ||
        !routes.reportsData
    ) {

        showToast(
            "Report data route is missing.",
            "error"
        );

        return;
    }


    try {

        showToast(
            "Preparing report...",
            "success"
        );


        /* =========================================
           GET THE ORIGINAL REPORT DATA
        ========================================= */

        const params =
            new URLSearchParams();


        params.append(
            "type",
            report.type ||
            report.name ||
            "Attendance Summary"
        );


        if (report.from) {

            params.append(
                "from",
                report.from
            );

        }


        if (report.to) {

            params.append(
                "to",
                report.to
            );

        }


        const response =
            await fetch(
                `${routes.reportsData}?${params.toString()}`,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json",

                        "X-Requested-With":
                            "XMLHttpRequest"
                    },

                    credentials:
                        "same-origin"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !data ||
            data.success === false
        ) {

            throw new Error(
                data?.message ||
                "Unable to load report data."
            );

        }


        /* =========================================
           RESTORE THE REAL REPORT DATA
        ========================================= */

        currentReportType =
            report.type ||
            report.name ||
            data.type ||
            "Report";


        currentReportFormat =
            String(
                report.format ||
                "pdf"
            ).toLowerCase();


        currentReportData = {

            ...data,

            type:
                currentReportType,

            from:
                report.from ||
                data.from ||
                "",

            to:
                report.to ||
                data.to ||
                "",

            summary:
                data.summary || {},

            records:
                Array.isArray(data.records)
                    ? data.records
                    : []

        };


        selectedReportId =
            Number(reportId);


        console.log(
            "History report restored:",
            currentReportData
        );


        /* =========================================
           DOWNLOAD USING ORIGINAL FORMAT
        ========================================= */

        if (
            currentReportFormat ===
            "csv"
        ) {

            downloadCSV(
                currentReportData
            );

        }

        else if (
            currentReportFormat ===
            "excel" ||
            currentReportFormat ===
            "xlsx"
        ) {

            downloadExcel(
                currentReportData
            );

        }

        else {

            downloadPDF();

        }


    } catch (error) {

        console.error(
            "Download History Report Error:",
            error
        );


        showToast(
            "Unable to download the report.",
            "error"
        );

    }


    /* =========================================
       FETCH THE ACTUAL REPORT DATA
       FROM LARAVEL
    ========================================= */

    if (
        !window.adminRoutes ||
        !window.adminRoutes.reportsData
    ) {

        showToast(
            "Report data route not found.",
            "error"
        );

        return;
    }


    try {

        showToast(
            "Preparing report...",
            "success"
        );


        const params =
            new URLSearchParams();

        params.append(
            "type",
            currentReportType
        );


        if (report.from) {

            params.append(
                "from",
                report.from
            );
        }


        if (report.to) {

            params.append(
                "to",
                report.to
            );
        }


        const response =
            await fetch(
                window.adminRoutes.reportsData +
                "?" +
                params.toString(),
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json",

                        "X-Requested-With":
                            "XMLHttpRequest"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load report data."
            );
        }


        /* =========================================
           SAVE ACTUAL DATA
        ========================================= */

        currentReportData =
            data;


        /* =========================================
           DOWNLOAD USING THE ORIGINAL FORMAT
        ========================================= */

        switch (
            currentReportFormat
        ) {

            case "csv":

                downloadCSV(
                    currentReportData
                );

                break;


            case "excel":

            case "xlsx":

                downloadExcel(
                    currentReportData
                );

                break;


            case "pdf":

            default:

                downloadPDF();

                break;
        }


    } catch (error) {

        console.error(
            "Download History Report Error:",
            error
        );

        showToast(
            "Unable to download the report. Please try again.",
            "error"
        );
    }
}


/* =========================================================
   FORMAT ICON
   ========================================================= */

function getFormatIcon(
    format
) {

    switch (
        String(format).toLowerCase()
    ) {

        case "pdf":

            return "fa-solid fa-file-pdf";


        case "csv":

            return "fa-solid fa-file-csv";


        case "excel":

        case "xlsx":

            return "fa-solid fa-file-excel";


        default:

            return "fa-solid fa-file";
    }
}


/* =========================================================
   FORMAT CLASS
   ========================================================= */

function getFormatClass(
    format
) {

    switch (
        String(format).toLowerCase()
    ) {

        case "pdf":

            return "pdf-icon";


        case "csv":

            return "csv-icon";


        case "excel":

        case "xlsx":

            return "excel-icon";


        default:

            return "";
    }
}


/* =========================================================
   DELETE SELECTED REPORT
   ========================================================= */

function deleteSelectedReport() {
    

    if (!selectedReportId) {

        showToast(
            "Please select a report first.",
            "error"
        );

        return;
    }


    const report =
        reportHistory.find(
            item =>
                Number(item.id) ===
                Number(selectedReportId)
        );


    if (!report) {

        showToast(
            "Selected report was not found.",
            "error"
        );

        return;
    }


    const message =
        document.getElementById(
            "deleteReportMessage"
        );


    if (message) {

        message.textContent =
            `Are you sure you want to delete "${report.name || report.type}"?`;
    }


    const modal =
        document.getElementById(
            "deleteReportModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    } else {

        if (
            confirm(
                `Are you sure you want to delete "${report.name || report.type}"?`
            )
        ) {

            confirmDeleteReport();
        }
    }
}


/* =========================================================
   CLOSE DELETE MODAL
   ========================================================= */

function closeDeleteReportModal() {

    const modal =
        document.getElementById(
            "deleteReportModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );
    }
}


/* =========================================================
   CONFIRM DELETE
   ========================================================= */

async function confirmDeleteReport() {

    if (!selectedReportId) {

        closeDeleteReportModal();

        return;
    }


    const routes =
        getAdminRoutes();


    if (
        !routes ||
        !routes.reportsDelete
    ) {

        showToast(
            "Delete report route is missing.",
            "error"
        );

        return;
    }


    const csrfToken =
        getCsrfToken();


    if (!csrfToken) {

        showToast(
            "CSRF token not found.",
            "error"
        );

        return;
    }


    try {

        const deleteUrl =
            routes.reportsDelete.replace(
                "__ID__",
                selectedReportId
            );


        const response =
            await fetch(
                deleteUrl,
                {
                    method: "DELETE",

                    headers: {

                        "Accept":
                            "application/json",

                        "X-CSRF-TOKEN":
                            csrfToken,

                        "X-Requested-With":
                            "XMLHttpRequest"
                    }
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            data.success === false
        ) {

            throw new Error(
                data.message ||
                "Unable to delete report."
            );
        }


        closeDeleteReportModal();


        selectedReportId =
            null;


        await loadReportHistory();


        showToast(
            "Report deleted successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Delete Report Error:",
            error
        );


        showToast(
            error.message ||
            "Unable to delete report.",
            "error"
        );
    }
}


/* =========================================================
   REFRESH REPORT HISTORY
   ========================================================= */

async function refreshReportHistory() {

    await loadReportHistory();


    showToast(
        "Reports refreshed successfully.",
        "success"
    );
}

/* =========================================================
   MOVE LOGOUT MODAL TO BODY
   This makes the overlay cover the ENTIRE LABTRACK page.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const logoutModal =
        document.getElementById("logoutModal");

    if (
        logoutModal &&
        logoutModal.parentElement !== document.body
    ) {
        document.body.appendChild(logoutModal);
    }

});

/* =========================================================
   LOGOUT
   ========================================================= */

function openLogout() {

    const modal =
        document.getElementById("logoutModal");

    if (!modal) {
        console.error("logoutModal not found!");
        return;
    }

    /* Make absolutely sure it is on BODY */
    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    modal.style.display = "flex";

    requestAnimationFrame(() => {
        modal.classList.add("show");
    });

    document.body.style.overflow = "hidden";
}


function closeLogout() {

    const modal =
        document.getElementById("logoutModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

    modal.style.display = "none";

    document.body.style.overflow = "";
}


function confirmLogout() {
    const form = document.getElementById("logoutForm");

    if (!form) {
        console.error("logoutForm not found!");
        return;
    }

    form.submit();
}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const previewModal =
            document.getElementById(
                "reportPreviewModal"
            );


        if (
            previewModal &&
            event.target === previewModal
        ) {

            closeReportPreview();
        }


        const deleteModal =
            document.getElementById(
                "deleteReportModal"
            );


        if (
            deleteModal &&
            event.target === deleteModal
        ) {

            closeDeleteReportModal();
        }


        const logoutModal =
            document.getElementById(
                "logoutModal"
            );


        if (
            logoutModal &&
            event.target === logoutModal
        ) {

            closeLogout();
        }

    }
);


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeReportPreview();

            closeDeleteReportModal();

            closeLogout();
        }

    }
);

// ==========================================
// SIDEBAR TOGGLE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const notificationBtn =
        document.getElementById("notificationBtn");

    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            toggleNotif
        );

    }

});


/* =========================================================
   TOPBAR GLOBAL SEARCH
========================================================= */

let globalSearchTimer = null;
let globalSearchRequest = 0;


function closeGlobalSearch() {

    const results =
        document.getElementById("globalSearchResults");

    if (results) {
        results.innerHTML = "";
        results.classList.remove("show");
    }

}


/* =========================================================
   RENDER GLOBAL SEARCH RESULTS
========================================================= */

function renderGlobalSearchResults(data, keyword) {

    const container =
        document.getElementById("globalSearchResults");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const results = [];


    /* STUDENTS */

    if (Array.isArray(data.students)) {

        data.students.forEach(student => {

            results.push({
                type: "Student",
                icon: "fa-user-graduate",
                title:
                    student.name ||
                    student.fullname ||
                    student.student_name ||
                    "Student",
                subtitle:
                    student.student_id ||
                    student.id ||
                    "",
                route: "attendance"
            });

        });

    }


    /* COMPUTERS */

    if (Array.isArray(data.computers)) {

        data.computers.forEach(computer => {

            results.push({
                type: "Computer",
                icon: "fa-computer",
                title:
                    computer.computer_name ||
                    computer.name ||
                    "Computer",
                subtitle:
                    computer.lab ||
                    computer.ip_address ||
                    "",
                route: "computers"
            });

        });

    }


    /* VIOLATIONS */

    if (Array.isArray(data.violations)) {

        data.violations.forEach(violation => {

            results.push({
                type: "Violation",
                icon: "fa-triangle-exclamation",
                title:
                    violation.violation ||
                    violation.description ||
                    violation.student_name ||
                    "Violation",
                subtitle:
                    violation.student_name ||
                    violation.pc_name ||
                    "",
                route: "violations"
            });

        });

    }


    /* ATTENDANCE */

    if (Array.isArray(data.attendance)) {

        data.attendance.forEach(record => {

            results.push({
                type: "Attendance",
                icon: "fa-clipboard-check",
                title:
                    record.student_name ||
                    record.name ||
                    "Attendance Record",
                subtitle:
                    record.student_id ||
                    record.subject ||
                    "",
                route: "attendance"
            });

        });

    }


    /* REPORTS */

if (Array.isArray(data.reports)) {

    data.reports.forEach(report => {

        results.push({

            type: "Report",

            icon: getFormatIcon(
                report.format || "pdf"
            ),

            title:
                report.name ||
                report.type ||
                "Report",

            subtitle:
                report.date ||
                "Generated report",

            route: "reports",

            reportId:
                Number(report.id)

        });

    });

}


    /* REPORTS */

if (Array.isArray(reportHistory)) {

    const reportSearch = searchText(keyword);

    reportHistory
        .filter(report => {

            const reportName =
                String(
                    report.name ||
                    report.type ||
                    ""
                ).toLowerCase();

            const reportDate =
                String(
                    report.date ||
                    ""
                ).toLowerCase();

            const reportFormat =
                String(
                    report.format ||
                    ""
                ).toLowerCase();

            return (
                reportName.includes(reportSearch) ||
                reportDate.includes(reportSearch) ||
                reportFormat.includes(reportSearch)
            );

        })
        .forEach(report => {

            results.push({

                type: "Report",

                icon: getFormatIcon(
                    report.format || "pdf"
                ),

                title:
                    report.name ||
                    report.type ||
                    "Report",

                subtitle:
                    report.date ||
                    "Generated report",

                route: "reports"

            });

        });

}


    /* NO RESULTS */

    if (results.length === 0) {

        container.innerHTML = `
            <div class="global-search-empty">
                <i class="fa-solid fa-magnifying-glass"></i>

                <span>
                    No results found for
                    "<strong>${escapeHtml(keyword)}</strong>"
                </span>
            </div>
        `;

        container.classList.add("show");

        return;
    }


    /* LIMIT RESULTS */

    results
        .slice(0, 8)
        .forEach(result => {

            const item =
                document.createElement("button");

            item.type = "button";

            item.className =
                "global-search-result-item";


            item.innerHTML = `
                <div class="global-search-result-icon">
                    <i class="fa-solid ${result.icon}"></i>
                </div>

                <div class="global-search-result-content">

                    <strong>
                        ${escapeHtml(result.title)}
                    </strong>

                    <span>
                        ${escapeHtml(result.subtitle)}
                    </span>

                </div>

                <small>
                    ${escapeHtml(result.type)}
                </small>
            `;

item.addEventListener(
    "click",
    async function () {

        closeGlobalSearch();

        if (result.type === "Report") {

            await downloadHistoryReport(
                result.reportId
            );

            return;
        }

        goTo(result.route);

    }
);
            container.appendChild(item);

        });


    container.classList.add("show");

}


/* =========================================================
   DOWNLOAD CONFIRMATION
   ========================================================= */

let pendingDownloadReportId = null;


function openDownloadConfirm(reportId) {

    const report =
        reportHistory.find(
            item =>
                Number(item.id) ===
                Number(reportId)
        );

    if (!report) {

        showToast(
            "Report not found.",
            "error"
        );

        return;
    }


    pendingDownloadReportId =
        Number(reportId);


    const modal =
        document.getElementById(
            "downloadConfirmModal"
        );

    const name =
        document.getElementById(
            "downloadConfirmName"
        );

    const date =
        document.getElementById(
            "downloadConfirmDate"
        );


    if (!modal) {
        return;
    }


    if (name) {

        name.textContent =
            report.name ||
            report.type ||
            "Report";
    }


    if (date) {

        date.textContent =
            report.date ||
            "Generated report";
    }


    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";
}


function closeDownloadConfirm() {

    const modal =
        document.getElementById(
            "downloadConfirmModal"
        );

    if (modal) {

        modal.classList.remove(
            "show"
        );
    }


    document.body.style.overflow =
        "";

    pendingDownloadReportId =
        null;
}


/* CONFIRM DOWNLOAD */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const button =
            document.getElementById(
                "confirmDownloadBtn"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            async function () {

                if (
                    !pendingDownloadReportId
                ) {
                    return;
                }


                const reportId =
                    pendingDownloadReportId;


                /*
                 * Close modal first
                 */
                closeDownloadConfirm();


                /*
                 * Download selected report
                 */
                await downloadHistoryReport(
                    reportId
                );

            }
        );

    }
);

/* =========================================================
   REPORTS TOP SEARCH
   Searches only Recent Reports
   Clicking a result automatically downloads the report
========================================================= */

async function performGlobalSearch(keyword) {

    const search = String(keyword || "")
        .trim()
        .toLowerCase();

    const container =
        document.getElementById("globalSearchResults");

    const reportList =
        document.getElementById("reportHistoryList");

    if (!container || !reportList) {
        return;
    }


    /* EMPTY SEARCH */
    if (!search) {

        container.innerHTML = "";

        container.classList.remove("show");

        return;
    }


    /* GET EXISTING REPORT ITEMS */
    const reports =
        Array.from(
            reportList.querySelectorAll(".report-item")
        );


    /* SEARCH EXISTING REPORTS */
    const matches =
        reports.filter(report => {

            const text =
                report.textContent
                    .toLowerCase()
                    .trim();

            return text.includes(search);

        });


    /* NO RESULTS */
    if (matches.length === 0) {

        container.innerHTML = `

            <div class="global-search-empty">

                <i class="fa-solid fa-magnifying-glass"></i>

                <span>
                    No results found for
                    "<strong>${escapeHtml(keyword)}</strong>"
                </span>

            </div>

        `;

        container.classList.add("show");

        return;
    }


    /* SHOW SEARCH RESULTS */
    container.innerHTML =

        matches
            .slice(0, 8)
            .map(report => {

                /* -----------------------------------------
                   GET REPORT ID
                ----------------------------------------- */

                const reportId =
                    Number(
                        report.getAttribute(
                            "data-report-id"
                        )
                    );


                /* -----------------------------------------
                   GET REPORT TITLE
                ----------------------------------------- */

                const title =
                    report.querySelector(
                        ".report-details h4"
                    )
                    ?.textContent
                    ?.trim() ||

                    "Report";


                /* -----------------------------------------
                   GET REPORT DATE
                ----------------------------------------- */

                const date =
                    report.querySelector(
                        ".report-details p"
                    )
                    ?.textContent
                    ?.trim() ||

                    "";


                return `

                    <div
                        class="global-search-result-item"
                        style="
                            cursor:pointer;
                        "
                        onclick="
                            event.stopPropagation();
                            closeGlobalSearch();
                            openDownloadConfirm(${reportId});
                        "
                    >

                        <div
                            class="global-search-result-icon"
                        >

                            <i
                                class="fa-solid fa-file-lines"
                            ></i>

                        </div>


                        <div
                            class="global-search-result-content"
                        >

                            <strong>
                                ${escapeHtml(title)}
                            </strong>

                            <span>
                                ${escapeHtml(date)}
                            </span>

                        </div>


                        <small>
                            Report
                        </small>

                    </div>

                `;

            })
            .join("");


    container.classList.add("show");
}

/* =========================================================
   INITIALIZE TOP SEARCH
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchInput =
            document.getElementById(
                "globalSearchInput"
            );


        if (!searchInput) {

            console.error(
                "globalSearchInput not found."
            );

            return;

        }


        searchInput.addEventListener(
            "input",
            function () {

                const value =
                    this.value;


                clearTimeout(
                    globalSearchTimer
                );


                globalSearchTimer =
                    setTimeout(
                        function () {

                            performGlobalSearch(
                                value
                            );

                        },
                        250
                    );

            }
        );


        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeGlobalSearch();

                    this.blur();

                }

            }
        );

    }
);


/* =========================================================
   CLOSE SEARCH WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const searchBox =
            document.getElementById(
                "globalSearchBox"
            );


        if (
            searchBox &&
            !searchBox.contains(
                event.target
            )
        ) {

            closeGlobalSearch();

        }

    }
);



/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        startReportsNotificationRealtime();

    }
);

/* =========================================================
   REALTIME NOTIFICATIONS
   LABTRACK REPORTS
========================================================= */

let adminNotifications = [];
let notificationPolling = null;


/* =========================================================
   TOGGLE NOTIFICATION DROPDOWN
========================================================= */

function toggleNotif(event) {

    if (event) {
        event.stopPropagation();
    }

    closeProfile();

    const notifWrap =
        document.getElementById("notifWrap");

    if (!notifWrap) {
        return;
    }

    notifWrap.classList.toggle("open");
}


/* =========================================================
   CLOSE NOTIFICATION DROPDOWN
========================================================= */

function closeNotif() {

    const notifWrap =
        document.getElementById("notifWrap");

    if (!notifWrap) {
        return;
    }

    notifWrap.classList.remove("open");
}


/* =========================================================
   LOAD NOTIFICATIONS
========================================================= */

async function loadAdminNotifications() {

    try {

        const response = await fetch(
            "/admin/settings/notifications",
            {
                method: "GET",

                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },

                cache: "no-store"
            }
        );


        if (!response.ok) {

            console.error(
                "Notification request failed:",
                response.status
            );

            return;
        }


        const data =
            await response.json();


        if (!data.success && !data.notifications && !data.data) {

            console.warn(
                "Notification API returned no notification data."
            );

            return;
        }


        /*
         * Accept either:
         *
         * data.notifications
         * or
         * data.data
         */

        adminNotifications =
            Array.isArray(data.notifications)
                ? data.notifications
                : Array.isArray(data.data)
                    ? data.data
                    : [];


        renderAdminNotifications();

    }
    catch (error) {

        console.error(
            "Failed to load notifications:",
            error
        );

    }

}


/* =========================================================
   RENDER NOTIFICATIONS
========================================================= */

function renderAdminNotifications() {

    const notificationList =
        document.getElementById(
            "notificationList"
        );


    const bellDot =
        document.getElementById(
            "bellDot"
        );


    if (!notificationList) {
        return;
    }


    /*
     * SHOW ONLY LATEST 3
     */

    const notifications =
        adminNotifications.slice(0, 3);


    /*
     * UNREAD COUNT
     */

    const unreadCount =
        adminNotifications.filter(
            notification => {

                return (
                    notification.read === false ||
                    notification.is_read === false ||
                    notification.unread === true
                );

            }
        ).length;


    /*
     * UPDATE BELL BADGE
     */

    if (bellDot) {

        if (unreadCount > 0) {

            bellDot.textContent =
                unreadCount > 99
                    ? "99+"
                    : unreadCount;

            bellDot.style.display =
                "flex";

        }
        else {

            bellDot.style.display =
                "none";

        }

    }


    /*
     * EMPTY
     */

    if (!notifications.length) {

        notificationList.innerHTML = `
            <div
                class="notification-empty"
                style="
                    padding:20px;
                    text-align:center;
                    color:var(--ink-soft);
                    font-size:12px;
                "
            >
                No new notifications
            </div>
        `;

        return;
    }


    /*
     * RENDER
     */

    notificationList.innerHTML =
        notifications.map(
            notification => {

                const type =
                    String(
                        notification.type ||
                        notification.category ||
                        "general"
                    ).toLowerCase();


                let icon =
                    "fa-circle-check";

                let iconColor =
                    "var(--blue)";

                let iconBackground =
                    "var(--blue-soft)";


                /*
                 * VIOLATION
                 */

                if (
                    type.includes("violation") ||
                    type.includes("unauthorized") ||
                    type.includes("blocked")
                ) {

                    icon =
                        "fa-ban";

                    iconColor =
                        "var(--red)";

                    iconBackground =
                        "var(--red-soft)";
                }


                /*
                 * PC OFFLINE
                 */

                else if (
                    type.includes("offline") ||
                    type.includes("computer") ||
                    type.includes("warning")
                ) {

                    icon =
                        "fa-triangle-exclamation";

                    iconColor =
                        "var(--orange)";

                    iconBackground =
                        "var(--orange-soft)";
                }


                /*
                 * ATTENDANCE
                 */

                else if (
                    type.includes("attendance")
                ) {

                    icon =
                        "fa-circle-check";

                    iconColor =
                        "var(--blue)";

                    iconBackground =
                        "var(--blue-soft)";
                }


                /*
                 * ANNOUNCEMENT
                 */

                else if (
                    type.includes("announcement")
                ) {

                    icon =
                        "fa-bullhorn";

                    iconColor =
                        "var(--orange)";

                    iconBackground =
                        "var(--orange-soft)";
                }


                /*
                 * REPORT
                 */

                else if (
                    type.includes("report")
                ) {

                    icon =
                        "fa-file-lines";

                    iconColor =
                        "var(--blue)";

                    iconBackground =
                        "var(--blue-soft)";
                }


                const title =
                    notification.title ||
                    notification.message ||
                    notification.text ||
                    "New notification";


                const message =
                    notification.message ||
                    notification.description ||
                    "";


                const createdAt =
                    notification.created_at ||
                    notification.time ||
                    notification.date ||
                    "";


                const unread =
                    notification.read === false ||
                    notification.is_read === false ||
                    notification.unread === true;


                return `

                    <div
                        class="notif-row ${unread ? "unread" : ""}"
                        data-notification-id="${escapeNotificationValue(notification.id)}"
                        onclick="openAdminNotification(
                            '${escapeNotificationValue(notification.id)}',
                            '${escapeNotificationValue(type)}',
                            event
                        )"
                    >

                        <div
                            class="dot-icon"
                            style="
                                background:${iconBackground};
                                color:${iconColor};
                            "
                        >

                            <i
                                class="fa-solid ${icon}"
                            ></i>

                        </div>


                        <div class="notif-content">

                            <div class="r-title">
                                ${escapeNotificationValue(title)}
                            </div>


                            ${
                                message &&
                                message !== title
                                    ? `
                                        <div
                                            class="r-time"
                                            style="
                                                margin-top:2px;
                                            "
                                        >
                                            ${escapeNotificationValue(message)}
                                        </div>
                                      `
                                    : ""
                            }


                            <small
                                style="
                                    display:block;
                                    margin-top:2px;
                                    color:var(--ink-soft);
                                "
                            >
                                ${formatNotificationTime(createdAt)}
                            </small>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   ESCAPE NOTIFICATION TEXT
========================================================= */

function escapeNotificationValue(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatNotificationTime(value) {

    if (!value) {
        return "Just now";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;
    }


    const seconds =
        Math.floor(
            (
                Date.now() -
                date.getTime()
            ) / 1000
        );


    if (seconds < 60) {
        return "Just now";
    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (minutes < 60) {

        return `${minutes} minute${
            minutes === 1 ? "" : "s"
        } ago`;

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return `${hours} hour${
            hours === 1 ? "" : "s"
        } ago`;

    }


    const days =
        Math.floor(
            hours / 24
        );


    return `${days} day${
        days === 1 ? "" : "s"
    } ago`;

}


/* =========================================================
   OPEN NOTIFICATION
========================================================= */

async function openAdminNotification(
    notificationId,
    type,
    event
) {

    if (event) {
        event.stopPropagation();
    }


    /*
     * Mark locally as read
     */

    const notification =
        adminNotifications.find(
            item =>
                String(item.id) ===
                String(notificationId)
        );


    if (notification) {

        notification.read = true;
        notification.is_read = true;
        notification.unread = false;

    }


    renderAdminNotifications();

    closeNotif();


    /*
     * Navigate according to notification type
     */

    const notificationType =
        String(type || "")
            .toLowerCase();


    if (
        notificationType.includes("violation") ||
        notificationType.includes("unauthorized") ||
        notificationType.includes("blocked")
    ) {

        goTo("violations");

        return;
    }


    if (
        notificationType.includes("offline") ||
        notificationType.includes("computer")
    ) {

        goTo("computers");

        return;
    }


    if (
        notificationType.includes("attendance")
    ) {

        goTo("attendance");

        return;
    }


    if (
        notificationType.includes("announcement")
    ) {

        goTo("announcements");

        return;
    }


    if (
        notificationType.includes("report")
    ) {

        goTo("reports");

        return;
    }

}


/* =========================================================
   MARK ALL AS READ
========================================================= */

async function markAllNotificationsRead(event) {

    if (event) {
        event.stopPropagation();
    }


    try {

        const csrf =
            document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;


        const response =
            await fetch(
                "/admin/settings/notifications/read",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json",

                        "X-CSRF-TOKEN":
                            csrf,

                        "X-Requested-With":
                            "XMLHttpRequest"
                    },

                    body:
                        JSON.stringify({})
                }
            );


        if (!response.ok) {

            throw new Error(
                `Request failed: ${response.status}`
            );

        }


        /*
         * Update immediately
         */

        adminNotifications =
            adminNotifications.map(
                notification => ({
                    ...notification,
                    read: true,
                    is_read: true,
                    unread: false
                })
            );


        renderAdminNotifications();

    }
    catch (error) {

        console.error(
            "Mark all notifications as read failed:",
            error
        );

    }

}


/* =========================================================
   VIEW ALL
========================================================= */

function viewAllNotifications(event) {

    if (event) {
        event.stopPropagation();
    }

    closeNotif();

    goTo("violations");
}


/* =========================================================
   START REALTIME POLLING
========================================================= */

function startNotificationPolling() {

    /*
     * Load immediately
     */

    loadAdminNotifications();


    /*
     * Prevent duplicate intervals
     */

    if (notificationPolling) {

        clearInterval(
            notificationPolling
        );

    }


    /*
     * Check every 3 seconds
     *
     * This gives the realtime-like behavior
     * shown in your screenshot.
     */

    notificationPolling =
        setInterval(
            loadAdminNotifications,
            3000
        );

}


/* =========================================================
   INITIALIZE NOTIFICATIONS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const notificationBtn =
            document.getElementById(
                "notificationBtn"
            );


        const markReadBtn =
            document.getElementById(
                "markNotificationsRead"
            );


        if (notificationBtn) {

            notificationBtn.addEventListener(
                "click",
                toggleNotif
            );

        }


        if (markReadBtn) {

            markReadBtn.addEventListener(
                "click",
                markAllNotificationsRead
            );

        }


        startNotificationPolling();

    }
);


/* =========================================================
   CLOSE NOTIFICATION WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const notifWrap =
            document.getElementById(
                "notifWrap"
            );


        if (
            notifWrap &&
            !notifWrap.contains(
                event.target
            )
        ) {

            closeNotif();

        }

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "LABTRACK Reports.js loaded."
        );


        /* Load reports from database */
        loadReportHistory();


        /* Activate reports page */
        const reportsPage =
            document.getElementById(
                "page-reports"
            );


        if (reportsPage) {

            reportsPage.classList.add(
                "active"
            );
        }

    }
);