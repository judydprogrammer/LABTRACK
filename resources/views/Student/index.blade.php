<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Student Management</title>

    <script src="https://kit.fontawesome.com/96bdbf5a1c.js" crossorigin="anonymous"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background: #f5f7fb;
            padding: 30px;
        }

        .container {
            max-width: 1400px;
            margin: auto;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .page-header h1 {
            font-size: 28px;
            color: #222;
        }

        .page-header p {
            color: #777;
            font-size: 14px;
            margin-top: 5px;
        }

        .add-btn {
            background: #ff652f;
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            border: none;
            cursor: pointer;
        }

        .add-btn i {
            margin-right: 7px;
        }

        .card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
        }

        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            gap: 15px;
        }

        .search-box {
            position: relative;
            width: 350px;
        }

        .search-box i {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
        }

        .search-box input {
            width: 100%;
            padding: 11px 15px 11px 40px;
            border: 1px solid #ddd;
            border-radius: 8px;
            outline: none;
            font-size: 14px;
        }

        .search-box input:focus {
            border-color: #7cc8ff;
        }

        .table-container {
            width: 100%;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 1000px;
        }

        thead {
            background: #f8f9fb;
        }

        th {
            text-align: left;
            padding: 14px;
            font-size: 13px;
            color: #555;
            font-weight: 600;
        }

        td {
            padding: 14px;
            border-top: 1px solid #eee;
            font-size: 13px;
            color: #444;
        }

        .student-id {
            font-weight: 600;
            color: #333;
        }

        .action-buttons {
            display: flex;
            gap: 7px;
        }

        .action-btn {
            width: 34px;
            height: 34px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
        }

        .view-btn {
            background: #e8f5ff;
            color: #1685c7;
        }

        .edit-btn {
            background: #fff4df;
            color: #d98b00;
        }

        .delete-btn {
            background: #ffe8e8;
            color: #d93025;
        }

        .delete-form {
            display: inline;
        }

        .success-message {
            background: #e7f7ed;
            color: #18794e;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .empty-message {
            text-align: center;
            padding: 40px;
            color: #999;
        }
    </style>
</head>

<body>

<div class="container">

    <!-- HEADER -->
    <div class="page-header">

        <div>
            <h1>Student Management</h1>
            <p>Manage registered students and their information.</p>
        </div>

        <a href="{{ route('students.create') }}" class="add-btn">
            <i class="fa-solid fa-plus"></i>
            Add Student
        </a>

    </div>


    <!-- SUCCESS MESSAGE -->
    @if(session('success'))
        <div class="success-message">
            {{ session('success') }}
        </div>
    @endif


    <!-- STUDENT CARD -->
    <div class="card">

        <!-- TOOLBAR -->
        <div class="toolbar">

            <div class="search-box">
                <i class="fa-solid fa-magnifying-glass"></i>

                <input
                    type="text"
                    id="searchInput"
                    placeholder="Search student..."
                >
            </div>

        </div>


        <!-- TABLE -->
        <div class="table-container">

            <table id="studentTable">

                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Year Level</th>
                        <th>Section</th>
                        <th>Contact</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    @forelse($students as $student)

                    <tr>

                        <td class="student-id">
                            {{ $student->student_id }}
                        </td>

                        <td>
                            {{ $student->fullname }}
                        </td>

                        <td>
                            {{ $student->email }}
                        </td>

                        <td>
                            {{ $student->course ?? '-' }}
                        </td>

                        <td>
                            {{ $student->year_level ?? '-' }}
                        </td>

                        <td>
                            {{ $student->section ?? '-' }}
                        </td>

                        <td>
                            {{ $student->contact ?? '-' }}
                        </td>

                        <td>

                            <div class="action-buttons">

                                <!-- VIEW -->
                                <a
                                    href="{{ route('students.show', $student->id) }}"
                                    class="action-btn view-btn"
                                    title="View">
                                    <i class="fa-solid fa-eye"></i>
                                </a>


                                <!-- EDIT -->
                                <a
                                    href="{{ route('students.edit', $student->id) }}"
                                    class="action-btn edit-btn"
                                    title="Edit">
                                    <i class="fa-solid fa-pen"></i>
                                </a>


                                <!-- DELETE -->
                                        <button
                                            type="button"
                                            class="delete-btn"
                                            onclick="openDeleteModal(
                                                '{{ $student->id }}',
                                                '{{ $student->fullname }}'
                                            )">

                                            <i class="fa-solid fa-trash"></i>

                                        </button>

                                </form>

                            </div>

                        </td>

                    </tr>

                    <tbody id="studentTableBody">

                </tbody>

            </table>

        </div>

    </div>

</div>



```html
<!-- =========================
     DELETE CONFIRMATION MODAL
========================= -->

<div id="deleteModal" class="delete-modal">

    <div class="delete-modal-content">

        <!-- ICON -->

        <div class="delete-icon">

            <i class="fa-solid fa-trash"></i>

        </div>


        <!-- TITLE -->

        <h2>Delete Student?</h2>


        <!-- MESSAGE -->

        <p>
            Are you sure you want to delete
            <strong id="studentName"></strong>?
        </p>

        <span class="delete-warning">
            This action cannot be undone.
        </span>


        <!-- BUTTONS -->

        <div class="delete-actions">

            <button
                type="button"
                class="cancel-delete"
                onclick="closeDeleteModal()">

                Cancel

            </button>


            <form
                id="deleteForm"
                method="POST">

                @csrf

                @method('DELETE')

                <button
                    type="submit"
                    class="confirm-delete">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </form>

        </div>

    </div>

</div>


<style>

/* =========================
   DELETE MODAL
========================= */

.delete-modal {

    display: none;

    position: fixed;

    inset: 0;

    background: rgba(0, 0, 0, 0.45);

    align-items: center;

    justify-content: center;

    z-index: 9999;

}


/* =========================
   MODAL BOX
========================= */

.delete-modal-content {

    width: 420px;

    max-width: 90%;

    background: white;

    border-radius: 16px;

    padding: 30px;

    text-align: center;

    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);

    animation: deletePopup 0.2s ease;

}


/* =========================
   DELETE ICON
========================= */

.delete-icon {

    width: 65px;

    height: 65px;

    margin: 0 auto 18px;

    border-radius: 50%;

    background: #ffe8e5;

    color: #e74c3c;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 25px;

}


.delete-modal-content h2 {

    font-size: 21px;

    color: #222;

    margin-bottom: 10px;

}


.delete-modal-content p {

    color: #555;

    font-size: 14px;

    line-height: 1.6;

}


.delete-modal-content p strong {

    color: #222;

}


.delete-warning {

    display: block;

    margin-top: 5px;

    color: #999;

    font-size: 12px;

}


/* =========================
   BUTTONS
========================= */

.delete-actions {

    display: flex;

    justify-content: center;

    gap: 10px;

    margin-top: 25px;

}


.delete-actions button {

    border: none;

    padding: 10px 20px;

    border-radius: 8px;

    font-family: 'Poppins', sans-serif;

    font-size: 13px;

    font-weight: 500;

    cursor: pointer;

}


.cancel-delete {

    background: #eeeeee;

    color: #555;

}


.cancel-delete:hover {

    background: #e2e2e2;

}


.confirm-delete {

    background: #e74c3c;

    color: white;

}


.confirm-delete:hover {

    background: #d63c2f;

}


/* =========================
   ANIMATION
========================= */

@keyframes deletePopup {

    from {

        opacity: 0;

        transform: scale(0.9);

    }

    to {

        opacity: 1;

        transform: scale(1);

    }

}

</style>


<script>

/* =========================
   OPEN DELETE MODAL
========================= */

function openDeleteModal(studentId, studentName) {

    const modal = document.getElementById('deleteModal');

    const name = document.getElementById('studentName');

    const form = document.getElementById('deleteForm');


    name.textContent = studentName;


    form.action = `/students/${studentId}`;


    modal.style.display = 'flex';

}


/* =========================
   CLOSE DELETE MODAL
========================= */

function closeDeleteModal() {

    const modal = document.getElementById('deleteModal');

    modal.style.display = 'none';

}


/* =========================
   CLOSE WHEN CLICKING
   OUTSIDE THE MODAL
========================= */

window.addEventListener('click', function(event) {

    const modal = document.getElementById('deleteModal');

    if (event.target === modal) {

        closeDeleteModal();

    }

});


/* =========================
   ESC KEY
========================= */

document.addEventListener('keydown', function(event) {

    if (event.key === 'Escape') {

        closeDeleteModal();

    }

});

</script>


<!-- SEARCH SCRIPT -->
<script>

    const searchInput = document.getElementById('searchInput');
    const tableRows = document.querySelectorAll('#studentTable tbody tr');

    searchInput.addEventListener('keyup', function () {

        const searchValue = this.value.toLowerCase();

        tableRows.forEach(row => {

            const rowText = row.textContent.toLowerCase();

            if (rowText.includes(searchValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }

        });

    });

</script>

<script>

async function loadStudents() {

    try {

        const response = await fetch("{{ route('students.data') }}");

        if (!response.ok) {
            throw new Error('Failed to load students.');
        }

        const data = await response.json();

        const tbody = document.getElementById('studentTableBody');

        tbody.innerHTML = '';

        if (!data.students || data.students.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-message">
                        No students found.
                    </td>
                </tr>
            `;

            return;
        }

        data.students.forEach(student => {

            const row = document.createElement('tr');

            row.innerHTML = `

                <td class="student-id">
                    ${escapeHtml(student.student_id)}
                </td>

                <td>
                    ${escapeHtml(student.fullname)}
                </td>

                <td>
                    ${escapeHtml(student.email ?? '-')}
                </td>

                <td>
                    ${escapeHtml(student.course ?? '-')}
                </td>

                <td>
                    ${escapeHtml(student.year_level ?? '-')}
                </td>

                <td>
                    ${escapeHtml(student.section ?? '-')}
                </td>

                <td>
                    ${escapeHtml(student.contact ?? '-')}
                </td>

                <td>

                    <div class="action-buttons">

                        <a
                            href="/students/${student.id}"
                            class="action-btn view-btn"
                            title="View"
                        >
                            <i class="fa-solid fa-eye"></i>
                        </a>

                        <a
                            href="/students/${student.id}/edit"
                            class="action-btn edit-btn"
                            title="Edit"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </a>

                        <button
                            type="button"
                            class="action-btn delete-btn"
                            title="Delete"
                            onclick="openDeleteModal(
                                '${student.id}',
                                '${escapeHtml(student.fullname)}'
                            )"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>
            `;

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error('Student realtime error:', error);

    }
}


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


// INITIAL LOAD
loadStudents();


// REALTIME REFRESH
setInterval(loadStudents, 3000);



document.getElementById('searchInput').addEventListener('input', function () {

    const searchValue = this.value.toLowerCase();

    const rows = document.querySelectorAll('#studentTableBody tr');

    rows.forEach(row => {

        const rowText = row.textContent.toLowerCase();

        row.style.display =
            rowText.includes(searchValue)
                ? ''
                : 'none';

    });

});

</script>

</body>
</html>

