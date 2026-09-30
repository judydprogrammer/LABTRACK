console.log("LABTRACK ATTENDANCE JS LOADED");


/* =========================================================
   LABTRACK - ATTENDANCE MANAGEMENT
========================================================= */

let attendanceRecords = [];

let globalAttendanceRecords = [];

let globalSearchTimer = null;

let globalSearchRequest = 0;

let currentAttendance = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const dateInput =
    document.getElementById("attendanceDate");

const subjectFilter =
    document.getElementById("subjectFilter");

const blockFilter =
    document.getElementById("blockFilter");

const statusFilter =
    document.getElementById("statusFilter");

const searchInput =
    document.getElementById("attendanceSearch")?.value

const attendanceDateTitle =
    document.getElementById("attendanceDateTitle");

const attendanceTableBody =
    document.getElementById("attendanceTableBody");

const attendanceEmpty =
    document.getElementById("attendanceEmpty");

const totalCount =
    document.getElementById("totalCount");

const presentCount =
    document.getElementById("presentCount");

const lateCount =
    document.getElementById("lateCount");

const absentCount =
    document.getElementById("absentCount");

const recordCount =
    document.getElementById("recordCount");

const footerRecordCount =
    document.getElementById("footerRecordCount");

const attendanceRate =
    document.getElementById("attendanceRate");

const attendanceRateFill =
    document.getElementById("attendanceRateFill");

const exportMenu =
    document.getElementById("exportMenu");

const profileMenu =
    document.getElementById("profileMenu");

const notifWrap =
    document.getElementById("notifWrap");

/* =========================================================
   INITIALIZE
========================================================= */

loadAttendance();


/* =========================================================
   DATE CHANGE
========================================================= */

if (dateInput) {
    dateInput.addEventListener("change", function () {

        updateDateTitle(dateInput.value);

        loadAttendance();

    });
}


/* =========================================================
   SUBJECT FILTER
========================================================= */

if (subjectFilter) {
    subjectFilter.addEventListener("change", function () {

        loadAttendance();

    });
}


/* =========================================================
   BLOCK FILTER
========================================================= */

if (blockFilter) {
    blockFilter.addEventListener("change", function () {

        renderAttendance();

    });
}


/* =========================================================
   STATUS FILTER
========================================================= */

if (statusFilter) {
    statusFilter.addEventListener("change", function () {

        renderAttendance();

    });
}


/* =========================================================
   SEARCH
========================================================= */




/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeProfile();
        closeNotif();
        closeExport();
        closeAttendanceDetails();
        closeAttendanceEdit();
        closeLogout();

    }

});


/* =========================================================
   CSRF
========================================================= */

function getCsrfToken() {

    const token =
        document.querySelector(
            'meta[name="csrf-token"]'
        )?.content;

    if (
        !token ||
        token.includes("{{")
    ) {

        console.error(
            "Laravel CSRF token was not found."
        );

        return null;

    }

    return token;
}


/* =========================================================
   LOAD ATTENDANCE FROM DATABASE
   ========================================================= */

async function loadAttendance() {

    const dateInput = document.getElementById("attendanceDate");
    const subjectFilter = document.getElementById("subjectFilter");

    const selectedDate = dateInput
        ? dateInput.value
        : "";

    const selectedSubject = subjectFilter
        ? subjectFilter.value
        : "all";

    const params = new URLSearchParams();

    if (selectedDate) {
        params.append("date", selectedDate);
    }

    if (
        selectedSubject &&
        selectedSubject !== "all"
    ) {
        params.append("subject", selectedSubject);
    }

    try {

        const response = await fetch(
            `${adminRoutes.attendanceData}?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load attendance records."
            );
        }

        const data = await response.json();

        console.log("Attendance database response:", data);

        if (!data.success) {
            throw new Error(
                data.message ||
                "Unable to load attendance."
            );
        }

        attendanceRecords =
            data.records || [];

        attendanceSubjects =
            data.subjects || [];

        initializeSubjects();
        initializeBlocks();

        renderAttendance();

    } catch (error) {

        console.error(
            "Attendance loading error:",
            error
        );

        attendanceRecords = [];

        renderAttendance();

        alert(
            "Unable to load attendance records from the database."
        );
    }
}


/* =========================================================
   GLOBAL ATTENDANCE SEARCH
   Searches ALL attendance records
   regardless of selected date.
========================================================= */

async function searchAllAttendance(searchValue) {

    const search =
        searchValue
            .toLowerCase()
            .trim();


    /* -----------------------------------------
       If empty, return to normal date search
    ----------------------------------------- */

    if (!search) {

        globalAttendanceRecords = [];

        loadAttendance();

        return;
    }


    const requestId =
        ++globalSearchRequest;


    try {

        const params =
            new URLSearchParams();

        params.append(
            "search",
            search
        );


        const response =
            await fetch(
                `${adminRoutes.attendanceData}?${params.toString()}`,
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
                "Failed to search attendance records."
            );

        }


        const data =
            await response.json();


        /*
         * Ignore old requests.
         */
        if (
            requestId !==
            globalSearchRequest
        ) {
            return;
        }


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to search attendance."
            );

        }


        globalAttendanceRecords =
            data.records || [];


        /*
         * Temporarily use global results
         * for the attendance table.
         */
        attendanceRecords =
            globalAttendanceRecords;


        initializeBlocks();

        renderAttendance();


        console.log(
            "GLOBAL ATTENDANCE SEARCH:",
            search,
            globalAttendanceRecords
        );


    } catch (error) {

        console.error(
            "Global attendance search error:",
            error
        );

    }

}
/* =========================================================
   REFRESH
========================================================= */

/* =========================================================
   FILTER ATTENDANCE
========================================================= */
function getFilteredAttendance() {

    const search =
        document.getElementById(
            "attendanceSearch"
        )?.value
        .toLowerCase()
        .trim() || "";


    const selectedBlock =
        document.getElementById(
            "blockFilter"
        )?.value || "all";


    const selectedStatus =
        document.getElementById(
            "statusFilter"
        )?.value || "all";


    return attendanceRecords.filter(
        record => {

            const searchable = `
                ${record.studentId || ""}
                ${record.name || ""}
                ${record.block || ""}
                ${record.subject || ""}
                ${record.computerUsed || ""}
                ${record.timeIn || ""}
                ${record.timeOut || ""}
                ${record.status || ""}
            `.toLowerCase();

            const matchesSearch =
                !search ||
                record.name?.toLowerCase().trim() === search ||
                String(record.studentId || "").toLowerCase().includes(search) ||
                String(record.block || "").toLowerCase().includes(search) ||
                String(record.subject || "").toLowerCase().includes(search) ||
                String(record.computerUsed || "").toLowerCase().includes(search) ||
                String(record.timeIn || "").toLowerCase().includes(search) ||
                String(record.timeOut || "").toLowerCase().includes(search) ||
                String(record.status || "").toLowerCase().includes(search);


            const matchesBlock =
                selectedBlock === "all" ||
                record.block === selectedBlock;


            const matchesStatus =
                selectedStatus === "all" ||
                record.status === selectedStatus;


            return (
                matchesSearch &&
                matchesBlock &&
                matchesStatus
            );

        }
    );

}

/* =========================================================
   INITIALIZE FILTERS
========================================================= */

function initializeFilters() {

    initializeSubjects();

    initializeBlocks();

}


/* =========================================================
   SUBJECT OPTIONS
========================================================= */

function initializeSubjects() {

    if (!subjectFilter) {
        return;
    }


    const currentValue =
        subjectFilter.value || "all";


    subjectFilter.innerHTML = `
        <option value="all">
            All Subjects
        </option>
    `;


    attendanceSubjects.forEach(subject => {

        const option =
            document.createElement("option");


        option.value =
            subject.label;


        option.textContent =
            subject.label;


        subjectFilter.appendChild(option);

    });


    const exists =
        [...subjectFilter.options]
            .some(
                option =>
                    option.value === currentValue
            );


    if (exists) {
        subjectFilter.value =
            currentValue;
    }
}

/* =========================================================
   BLOCK OPTIONS
========================================================= */
function initializeBlocks() {

    if (!blockFilter) {
        return;
    }

    const currentValue =
        blockFilter.value || "all";

    const blocks =
        [
            ...new Set(
                attendanceRecords
                    .map(record => record.block)
                    .filter(Boolean)
            )
        ];

    blockFilter.innerHTML = `
        <option value="all">
            All Blocks
        </option>
    `;

    blocks
        .sort()
        .forEach(block => {

            const option =
                document.createElement("option");

            option.value = block;

            option.textContent = block;

            blockFilter.appendChild(option);

        });

    if (blocks.includes(currentValue)) {

        blockFilter.value =
            currentValue;

    } else {

        blockFilter.value =
            "all";

    }

}

/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================================
   UPDATE DATE TITLE
========================================================= */

function updateDateTitle(selectedDate) {

    if (!attendanceDateTitle) {
        return;
    }


    if (!selectedDate) {

        attendanceDateTitle.textContent =
            "Attendance Overview";

        return;

    }


    const today =
        new Date();


    const todayString =
        today.toLocaleDateString(
            "en-CA"
        );


    if (
        selectedDate === todayString
    ) {

        attendanceDateTitle.textContent =
            `Today · ${formatDate(selectedDate)}`;

    } else {

        attendanceDateTitle.textContent =
            formatDate(selectedDate);

    }

}


/* =========================================================
   UPDATE SUMMARY
========================================================= */

function updateSummary(records) {

    const total =
        records.length;


    const present =
        records.filter(
            record =>
                record.status === "Present"
        ).length;


    const late =
        records.filter(
            record =>
                record.status === "Late"
        ).length;


    const absent =
        records.filter(
            record =>
                record.status === "Absent"
        ).length;


    if (totalCount) {
        totalCount.textContent = total;
    }


    if (presentCount) {
        presentCount.textContent = present;
    }


    if (lateCount) {
        lateCount.textContent = late;
    }


    if (absentCount) {
        absentCount.textContent = absent;
    }


    /*
     * Attendance rate.
     *
     * Present + Late are counted as attended.
     */

    const attended =
        present + late;


    const rate =
        total > 0
            ? ((attended / total) * 100)
                .toFixed(1)
            : "0.0";


    if (attendanceRate) {

        attendanceRate.textContent =
            `${rate}%`;

    }


    if (attendanceRateFill) {

        attendanceRateFill.style.width =
            `${rate}%`;

    }

}


/* =========================================================
   UPDATE RECORD COUNT
========================================================= */

function updateRecordCounts(count) {

    if (recordCount) {

        recordCount.textContent =
            count;

    }


    if (footerRecordCount) {

        footerRecordCount.textContent =
            count;

    }

}


/* =========================================================
   STATUS BADGE
========================================================= */

function createStatusBadge(status) {

    const badge =
        document.createElement("span");


    const normalized =
        String(status || "")
            .toLowerCase();


    badge.className =
        `status-badge ${normalized}`;


    let icon =
        "fa-circle";


    if (status === "Present") {

        icon =
            "fa-check";

    } else if (status === "Late") {

        icon =
            "fa-clock";

    } else if (status === "Absent") {

        icon =
            "fa-xmark";

    }


    badge.innerHTML =
        `
        <i class="fa-solid ${icon}"></i>
        ${escapeHtml(status || "Unknown")}
        `;


    return badge;

}


/* =========================================================
   RENDER ATTENDANCE
========================================================= */

function renderAttendance() {

    if (!attendanceTableBody) {
        return;
    }


    const selectedDate =
        dateInput
            ? dateInput.value
            : "";


    const records =
        getFilteredAttendance();


    updateDateTitle(
        selectedDate
    );


    updateSummary(
        records
    );


    updateRecordCounts(
        records.length
    );


    attendanceTableBody.innerHTML =
        "";


    /*
     * Empty
     */

    if (records.length === 0) {

        if (attendanceEmpty) {

            attendanceEmpty.style.display =
                "flex";

        }

        return;

    }


    if (attendanceEmpty) {

        attendanceEmpty.style.display =
            "none";

    }


    /*
     * Group by block
     */

    const grouped = {};


    records.forEach(record => {

        const block =
            record.block ||
            "Unassigned";


        if (!grouped[block]) {

            grouped[block] = [];

        }


        grouped[block].push(
            record
        );

    });


    Object.keys(grouped)
        .sort()
        .forEach(block => {

            /*
             * Block row
             */

            const blockRow =
                document.createElement("tr");


            blockRow.className =
                "block-row";


            const blockCell =
                document.createElement("td");


            blockCell.colSpan = 7;


            blockCell.innerHTML =
                `
                <div class="block-title">
                    <i class="fa-solid fa-users"></i>
                    <span>
                        ${escapeHtml(block)}
                    </span>
                </div>
                `;


            blockRow.appendChild(
                blockCell
            );


            attendanceTableBody.appendChild(
                blockRow
            );


            /*
             * Student rows
             */

            grouped[block].forEach(
                record => {

                    const row =
                        document.createElement("tr");


                    row.className =
                        "attendance-data-row";


                    row.title =
                        "Click to view attendance details";


                    /*
                     * Student ID
                     */

                    const studentId =
                        document.createElement("td");


                    studentId.className =
                        "student-id";


                    studentId.textContent =
                        record.studentId || "—";


                    /*
                     * Name
                     */

                    const name =
                        document.createElement("td");


                    name.className =
                        "student-name";


                    name.textContent =
                        record.name || "—";


                    /*
                     * Block
                     */

                    const blockCell =
                        document.createElement("td");


                    blockCell.className =
                        "block-cell";


                    blockCell.textContent =
                        record.block || "—";


                    /*
                     * Subject
                     */

                    const subject =
                        document.createElement("td");


                    subject.className =
                        "subject-cell";


                    subject.textContent =
                        record.subject || "—";


                    /*
                     * Time In
                     */

                    const timeIn =
                        document.createElement("td");


                    timeIn.className =
                        "time-cell";


                    timeIn.textContent =
                        formatTime(
                            record.timeIn
                        );


                    /*
                     * Time Out
                     */

                    const timeOut =
                        document.createElement("td");


                    timeOut.className =
                        "time-cell";


                    timeOut.textContent =
                        formatTime(
                            record.timeOut
                        );


                    /*
                     * Status
                     */

                    const status =
                        document.createElement("td");


                    status.appendChild(
                        createStatusBadge(
                            record.status
                        )
                    );


                    /*
                     * Append
                     */

                    row.appendChild(
                        studentId
                    );

                    row.appendChild(
                        name
                    );

                    row.appendChild(
                        blockCell
                    );

                    row.appendChild(
                        subject
                    );

                    row.appendChild(
                        timeIn
                    );

                    row.appendChild(
                        timeOut
                    );

                    row.appendChild(
                        status
                    );


                    /*
                     * View details
                     */

                    row.addEventListener(
                        "click",
                        function () {

                            openAttendanceDetails(
                                record
                            );

                        }
                    );


                    attendanceTableBody.appendChild(
                        row
                    );

                }
            );

        });

}


/* =========================================================
   FORMAT TIME
========================================================= */
function formatTime(time) {

    if (!time) {
        return "—";
    }

    const value = String(time).trim();

    // Already formatted as 12-hour time
    if (value.includes("AM") || value.includes("PM")) {
        return value;
    }

    // Laravel/database format: HH:MM:SS
    const parts = value.split(":");

    if (parts.length < 2) {
        return value;
    }

    let hour = parseInt(parts[0], 10);
    const minute = parts[1];

    const period = hour >= 12
        ? "PM"
        : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${period}`;
}


/* =========================================================
   VIEW DETAILS
========================================================= */

function openAttendanceDetails(record) {

    currentAttendance = record;

    const modal =
        document.getElementById(
            "attendanceDetailsModal"
        );

    if (!modal) {
        return;
    }

    setText(
        "detailStudentId",
        record.studentId || "—"
    );

    setText(
        "detailStudentName",
        record.name || "—"
    );

    setText(
        "detailBlock",
        record.block || "—"
    );

    setText(
        "detailSubject",
        record.subject || "—"
    );

    setText(
        "detailComputer",
        record.computerUsed || "Not assigned"
    );

    setText(
        "detailDate",
        formatDate(record.date)
    );

    setText(
        "detailTimeIn",
        formatTime(record.timeIn)
    );

    setText(
        "detailTimeOut",
        formatTime(record.timeOut)
    );

    setText(
        "detailStatus",
        record.status || "—"
    );

    modal.classList.add("show");
}


/* =========================================================
   CLOSE DETAILS
========================================================= */

function closeAttendanceDetails() {

    const modal =
        document.getElementById(
            "attendanceDetailsModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   EDIT CURRENT
========================================================= */

function editCurrentAttendance() {

    if (!currentAttendance) {
        return;
    }


    closeAttendanceDetails();


    const record =
        currentAttendance;


    setValue(
        "editStudentId",
        record.studentId
    );


    setValue(
        "editStudentName",
        record.name
    );


    setValue(
        "editBlock",
        record.block
    );


    setValue(
        "editSubject",
        record.subject
    );


    setValue(
        "editComputer",
        record.computerUsed || ""
    );


    setValue(
        "editDate",
        record.date
    );


    setValue(
        "editTimeIn",
        normalizeTime(
            record.timeIn
        )
    );


    setValue(
        "editTimeOut",
        normalizeTime(
            record.timeOut
        )
    );


    setValue(
        "editStatus",
        record.status
    );


    const modal =
        document.getElementById(
            "attendanceEditModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


/* =========================================================
   CLOSE EDIT
========================================================= */

function closeAttendanceEdit() {

    const modal =
        document.getElementById(
            "attendanceEditModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   SAVE EDIT
========================================================= */

async function saveAttendanceEdit(event) {

    event.preventDefault();


    if (!currentAttendance) {
        return;
    }


    const csrf =
        getCsrfToken();


    if (!csrf) {

        alert(
            "CSRF token not found. Please refresh the page."
        );

        return;

    }


    const payload = {

        student_id:
            getValue("editStudentId"),

        student_name:
            getValue("editStudentName"),

        block:
            getValue("editBlock"),

        subject:
            getValue("editSubject"),

        computer_used:
            getValue("editComputer"),

        attendance_date:
            getValue("editDate"),

        time_in:
            getValue("editTimeIn") || null,

        time_out:
            getValue("editTimeOut") || null,

        status:
            getValue("editStatus")

    };


    try {

        const response =
            await fetch(
                `/admin/attendance/${currentAttendance.id}`,
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
                        JSON.stringify(payload)

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update attendance."
            );

        }


        closeAttendanceEdit();


        await loadAttendance();


        showSaveSuccess(
            data.message ||
            "Attendance record has been updated successfully."
        );


    } catch (error) {

        console.error(
            "Update attendance error:",
            error
        );


        alert(
            error.message ||
            "Unable to update attendance."
        );

    }

}


/* =========================================================
   DELETE CURRENT
========================================================= */

async function deleteCurrentAttendance() {

    if (!currentAttendance) {
        return;
    }


    const confirmed =
        confirm(
            `Delete the attendance record of ${currentAttendance.name}?`
        );


    if (!confirmed) {
        return;
    }


    const csrf =
        getCsrfToken();


    if (!csrf) {

        alert(
            "CSRF token not found. Please refresh the page."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `/admin/attendance/${currentAttendance.id}`,
                {
                    method: "DELETE",

                    headers: {

                        "Accept":
                            "application/json",

                        "X-CSRF-TOKEN":
                            csrf,

                        "X-Requested-With":
                            "XMLHttpRequest"

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete attendance."
            );

        }


        closeAttendanceDetails();


        await loadAttendance();


        alert(
            data.message ||
            "Attendance record deleted successfully."
        );


    } catch (error) {

        console.error(
            "Delete attendance error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete attendance."
        );

    }

}


/* =========================================================
   EXPORT
========================================================= */

function toggleExport(event) {

    if (event) {
        event.stopPropagation();
    }


    if (!exportMenu) {
        return;
    }


    exportMenu.classList.toggle(
        "show"
    );

}


/* =========================================================
   CLOSE EXPORT
========================================================= */

function closeExport() {

    if (exportMenu) {

        exportMenu.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   EXPORT ATTENDANCE
========================================================= */

function exportAttendance(type) {

    const records =
        getFilteredAttendance();


    if (records.length === 0) {

        alert(
            "There are no attendance records to export."
        );

        closeExport();

        return;

    }


    if (type === "csv") {

        exportCSV(
            records
        );

    }


    if (type === "print") {

        printAttendance(
            records
        );

    }


    closeExport();

}




/* =========================================================
   CSV EXPORT
========================================================= */

function exportCSV(records) {

    const headers = [

        "Student ID",
        "Name",
        "Block",
        "Subject",
        "Computer Used",
        "Date",
        "Time In",
        "Time Out",
        "Status"

    ];


    const rows =
    records.map(record => [

        record.studentId,

        record.name,

        record.block,

        record.subject,

        record.computerUsed || "",

        record.date,

        formatTime(
            record.timeIn
        ),

        formatTime(
            record.timeOut
        ),

        record.status

    ]);


    const csv =
        [
            headers,
            ...rows
        ]
            .map(row =>
                row.map(value =>
                    `"${String(value ?? "")
                        .replace(/"/g, '""')}"`
                ).join(",")
            )
            .join("\n");


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
        document.createElement("a");


    link.href =
        url;


    link.download =
        `LABTRACK-Attendance-${dateInput.value}.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   PRINT / PDF
========================================================= */

function printAttendance(records) {

    const date =
        dateInput
            ? dateInput.value
            : "";


    const rows =
        records.map(record => {

            return `
                <tr>

                    <td>
                        ${escapeHtml(record.studentId)}
                    </td>

                    <td>
                        ${escapeHtml(record.name)}
                    </td>

                    <td>
                        ${escapeHtml(record.block)}
                    </td>

                    <td>
                        ${escapeHtml(record.subject)}
                    </td>

                    <td>
                        ${escapeHtml(formatTime(record.timeIn))}
                    </td>

                    <td>
                        ${escapeHtml(formatTime(record.timeOut))}
                    </td>

                    <td>
                        ${escapeHtml(record.status)}
                    </td>

                </tr>
            `;

        }).join("");


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the report."
        );

        return;

    }


    printWindow.document.write(
        `
        <!DOCTYPE html>

        <html>

        <head>

            <title>
                LABTRACK Attendance Report
            </title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 30px;
                    color: #111827;
                }

                h1 {
                    margin-bottom: 5px;
                }

                p {
                    color: #64748b;
                    margin-top: 0;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 25px;
                }

                th,
                td {
                    border: 1px solid #dbe2ea;
                    padding: 9px;
                    text-align: left;
                    font-size: 12px;
                }

                th {
                    background: #f8fafc;
                }

                @media print {

                    button {
                        display: none;
                    }

                }

            </style>

        </head>

        <body>

            <h1>
                LABTRACK
            </h1>

            <p>
                Attendance Report —
                ${escapeHtml(formatDate(date))}
            </p>

            <table>

                <thead>

                    <tr>

                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Block</th>
                        <th>Subject</th>
                        <th>Time In</th>
                        <th>Time Out</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    ${rows}

                </tbody>

            </table>

        </body>

        </html>
        `
    );


    printWindow.document.close();


    printWindow.focus();


    setTimeout(
        function () {

            printWindow.print();

        },
        300
    );

}


/* =========================================================
   PROFILE
========================================================= */

function toggleProfile(event) {

    if (event) {
        event.stopPropagation();
    }


    closeNotif();


    if (!profileMenu) {
        return;
    }


    profileMenu.classList.toggle(
        "open"
    );

}


function closeProfile() {

    if (profileMenu) {

        profileMenu.classList.remove(
            "open"
        );

    }

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function toggleNotif(event) {

    if (event) {
        event.stopPropagation();
    }


    closeProfile();


    if (!notifWrap) {
        return;
    }


    notifWrap.classList.toggle(
        "open"
    );

}


function closeNotif() {

    if (notifWrap) {

        notifWrap.classList.remove(
            "open"
        );

    }

}


/* =========================================================
   DOCUMENT CLICK
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            profileMenu &&
            !profileMenu.contains(
                event.target
            )
        ) {

            closeProfile();

        }


        if (
            notifWrap &&
            !notifWrap.contains(
                event.target
            )
        ) {

            closeNotif();

        }


        const exportWrapper =
            document.querySelector(
                ".export-wrapper"
            );


        if (
            exportWrapper &&
            !exportWrapper.contains(
                event.target
            )
        ) {

            closeExport();

        }

    }
);


/* =========================================================
   HELPERS
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value || "—";

    }

}


function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value || "";

    }

}


function getValue(id) {

    const element =
        document.getElementById(id);


    return element
        ? element.value
        : "";

}


function normalizeTime(time) {

    if (!time) {
        return "";
    }


    return String(time)
        .substring(0, 5);

}


function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function showToast(message, type = "success") {

    const existing = document.getElementById("attendanceToast");

    if (existing) {
        existing.remove();
    }

    const toast = document.createElement("div");

    toast.id = "attendanceToast";

    toast.innerHTML = `
        <div class="attendance-toast-icon">
            <i class="fa-solid ${
                type === "error"
                    ? "fa-circle-exclamation"
                    : "fa-check"
            }"></i>
        </div>

        <div class="attendance-toast-message">
            ${escapeHtml(message)}
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2500);
}

/* =========================================================
   NAVIGATION
========================================================= */

function goTo(pageId) {

    const routes =
        window.adminRoutes || {};


    const route =
        routes[pageId];


    if (route) {

        window.location.href =
            route;

        return;

    }


    console.warn(
        `No Laravel route configured for "${pageId}".`
    );

}


/* =========================================================
   SAVE SUCCESS POPUP
========================================================= */

function showSaveSuccess(message) {

    // Remove existing popup if there is one
    const existing =
        document.getElementById("saveSuccessPopup");

    if (existing) {
        existing.remove();
    }

    // Create popup
    const popup =
        document.createElement("div");

    popup.id =
        "saveSuccessPopup";

    popup.innerHTML = `
        <div class="save-success-popup-card">

            <div class="save-success-popup-icon">
                <i class="fa-solid fa-check"></i>
            </div>

            <h2>Changes Saved!</h2>

            <p>
                ${escapeHtml(
                    message ||
                    "Attendance record has been updated successfully."
                )}
            </p>

            <button
                type="button"
                class="save-success-popup-btn"
                onclick="closeSaveSuccess()"
            >
                OK
            </button>

        </div>
    `;

    document.body.appendChild(popup);

    // Show popup
    requestAnimationFrame(() => {
        popup.classList.add("show");
    });
}


function closeSaveSuccess() {

    const popup =
        document.getElementById(
            "saveSuccessPopup"
        );

    if (!popup) {
        return;
    }

    popup.classList.remove("show");

    setTimeout(() => {

        popup.remove();

    }, 200);
}


/* =========================================================
   SEARCH
========================================================= */

function handleAttendanceSearch(value) {

    console.log("SEARCH WORKING:", value);

    renderAttendance();

}


/* =========================================================
   TOPBAR ATTENDANCE SEARCH
   Global search ONLY.
   Does NOT affect the attendance table.
========================================================= */

document.addEventListener("input", function (event) {

    if (
        event.target &&
        event.target.id === "globalAttendanceSearch"
    ) {

        console.log(
            "Global search:",
            event.target.value
        );

        /*
         * IMPORTANT:
         * Do NOT copy the value to
         * #attendanceSearch.
         *
         * Do NOT call renderAttendance().
         */

        return;
    }

});

/* =========================================================
   GLOBAL ADMIN SEARCH
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const globalSearch =
        document.getElementById("globalAttendanceSearch");

    if (!globalSearch) {
        return;
    }

    let searchTimer = null;

    globalSearch.addEventListener("input", function () {

        const query = this.value.trim();

        clearTimeout(searchTimer);

        if (!query) {
            closeGlobalSearchResults();
            return;
        }

        searchTimer = setTimeout(() => {
            performGlobalSearch(query);
        }, 250);

    });

});


async function performGlobalSearch(query) {

    try {

        const response = await fetch(
            `/admin/global-search?q=${encodeURIComponent(query)}`,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Global search failed: ${response.status}`
            );
        }

        const data = await response.json();

        console.log("GLOBAL SEARCH:", data);

        showGlobalSearchResults(data, query);

    } catch (error) {

        console.error("Global search error:", error);

    }

}

/* =========================================================
   GLOBAL SEARCH RESULTS
========================================================= */

function showGlobalSearchResults(data, query) {

    let resultsBox =
        document.getElementById("globalSearchResults");

    if (!resultsBox) {

        resultsBox = document.createElement("div");

        resultsBox.id = "globalSearchResults";

        resultsBox.className = "global-search-results";

        const searchBox =
            document.querySelector(".search-box");

        if (searchBox) {
            searchBox.appendChild(resultsBox);
        }
    }

    resultsBox.innerHTML = "";

    let results = [];

    /*
     * Supports common response formats.
     */
    if (Array.isArray(data)) {
        results = data;
    }

    else if (Array.isArray(data.results)) {
        results = data.results;
    }

    else {

        Object.keys(data).forEach(key => {

            if (Array.isArray(data[key])) {

                data[key].forEach(item => {

                    results.push({
                        ...item,
                        category: key
                    });

                });

            }

        });

    }


    if (!results.length) {

        resultsBox.innerHTML = `
            <div class="global-search-empty">
                <i class="fa-solid fa-magnifying-glass"></i>

                <span>
                    No results found for
                    "<strong>${escapeSearchText(query)}</strong>"
                </span>
            </div>
        `;

        resultsBox.classList.add("show");

        return;
    }


    results.slice(0, 8).forEach(item => {

        const result =
            document.createElement("div");

        result.className =
            "global-search-result";


        const title =
            item.name ||
            item.fullname ||
            item.student_name ||
            item.subject_name ||
            item.subject_code ||
            item.computer_name ||
            item.title ||
            item.description ||
            "Search Result";


        const category =
            item.category ||
            item.type ||
            "Result";


        result.innerHTML = `
            <div class="global-search-result-icon">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>

            <div class="global-search-result-info">

                <strong>
                    ${escapeSearchText(title)}
                </strong>

                <small>
                    ${escapeSearchText(category)}
                </small>

            </div>
        `;


        result.addEventListener("click", () => {

            handleGlobalSearchResult(item);

        });


        resultsBox.appendChild(result);

    });


    resultsBox.classList.add("show");
}

function closeGlobalSearchResults() {

    const resultsBox =
        document.getElementById("globalSearchResults");

    if (resultsBox) {
        resultsBox.classList.remove("show");
    }

}

function escapeSearchText(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}





/* =========================================================
   ATTENDANCE SEARCH - EVENT DELEGATION
========================================================= */

document.addEventListener("input", function (event) {

    if (event.target && event.target.id === "attendanceSearch") {

        console.log("SEARCH WORKING:", event.target.value);

        renderAttendance();

    }

});


function toggleExportMenu() {
    const menu = document.getElementById("exportMenu");

    if (!menu) {
        console.error("exportMenu not found.");
        return;
    }

    menu.classList.toggle("show");
}


function closeExport() {

    const menu = document.getElementById("exportMenu");

    if (menu) {
        menu.classList.remove("show");
    }

}


function exportAttendance(type) {

    const records = getFilteredAttendance();

    if (records.length === 0) {

        alert("There are no attendance records to export.");

        closeExport();

        return;
    }

    if (type === "csv") {
        exportCSV(records);
    }

    if (type === "print") {
        printAttendance(records);
    }

    closeExport();

}


async function refreshAttendance() {

    const button = document.querySelector(
        ".attendance-action-btn:first-child"
    );

    if (button) {
        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Refreshing...
        `;
    }

    try {

        await loadAttendance();

    } catch (error) {

        console.error(
            "Refresh Attendance Error:",
            error
        );

        alert(
            "Unable to refresh attendance records."
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.innerHTML = `
                <i class="fa-solid fa-rotate"></i>
                Refresh
            `;

        }

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

    // Close profile dropdown first
    if (typeof closeProfile === "function") {
        closeProfile();
    }

    const logoutModal =
        document.getElementById("logoutModal");

    if (!logoutModal) {
        console.error("logoutModal not found.");
        return;
    }

    logoutModal.classList.add("show");
}


function closeLogout() {

    const logoutModal =
        document.getElementById("logoutModal");

    if (!logoutModal) {
        return;
    }

    logoutModal.classList.remove("show");
}


function confirmLogout() {

    const logoutForm =
        document.getElementById("logoutForm");

    if (!logoutForm) {
        console.error("logoutForm not found.");
        return;
    }

    /*
     * Use the real Laravel Blade form.
     * This includes @csrf automatically.
     */
    logoutForm.submit();
}