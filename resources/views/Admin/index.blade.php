<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://kit.fontawesome.com/96bdbf5a1c.js" crossorigin="anonymous"></script>

    <title>Admin Accounts</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 40px;
            background: #f5f7fb;
        }

        

        .container {
            max-width: 1000px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
        }

        h1 {
            margin-bottom: 20px;
        }

        .success {
            padding: 12px;
            background: #d1fae5;
            color: #065f46;
            margin-bottom: 20px;
            border-radius: 8px;
        }

        .add-btn {
            display: inline-block;
            padding: 10px 16px;
            background: #0058d9;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        th,
        td {
            padding: 12px 14px;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }

        /* Column widths */
        th:nth-child(1),
        td:nth-child(1) {
            width: 8%;
        }

        th:nth-child(2),
        td:nth-child(2) {
            width: 20%;
        }

        th:nth-child(3),
        td:nth-child(3) {
            width: 20%;
        }

        th:nth-child(4),
        td:nth-child(4) {
            width: 32%;
        }

        th:nth-child(5),
        td:nth-child(5) {
            width: 20%;
        }

        /* ACTIONS */
        th:nth-child(5),
        td.actions {
            text-align: center;
        }

        .actions {
            vertical-align: middle;
            white-space: nowrap;
        }

        .action-btn {
            width: 34px;
            height: 34px;

            display: inline-flex;
            align-items: center;
            justify-content: center;

            border: none;
            border-radius: 8px;

            cursor: pointer;
            text-decoration: none;

            font-size: 14px;
            margin: 0 2px;
        }

        .delete-form {
            display: inline-block;
            margin: 0;
            padding: 0;
        }

        .action {
            text-decoration: none;
            margin-right: 8px;
        }

        .delete-btn {
            border: none;
            background: none;
            color: red;
            cursor: pointer;
            font-size: 14px;
        }

        .actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.action-btn {
    width: 34px;
    height: 34px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 8px;

    cursor: pointer;
    text-decoration: none;

    font-size: 14px;

    transition: 0.2s ease;
}

.actions {
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: center;
}

.action-btn {
    width: 34px;
    height: 34px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 8px;

    cursor: pointer;
    text-decoration: none;

    font-size: 14px;

    transition: 0.2s ease;
}

    .view-btn {
        background: #e8f1ff;
        color: #2563eb;
    }

    .view-btn:hover {
        background: #2563eb;
        color: white;
    }

    .edit-btn {
        background: #fff4d6;
        color: #d97706;
    }

    .edit-btn:hover {
        background: #d97706;
        color: white;
    }

    .delete-btn {
        background: #ffe4e4;
        color: #dc2626;
    }

    .delete-btn:hover {
        background: #dc2626;
        color: white;
    }

    .delete-form {
        display: inline;
        margin: 0;
    }



    </style>
</head>

<body>

<div class="container">

    <h1>Admin Accounts</h1>

    @if(session('success'))
        <div class="success">
            {{ session('success') }}
        </div>
    @endif

    <a href="{{ route('admins.create') }}" class="add-btn">
        + Add Admin
    </a>

            <table>

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Admin ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>

                @forelse($admins as $admin)

                    <tr>

                        <td>{{ $admin->id }}</td>

                        <td>{{ $admin->admin_id }}</td>

                        <td>{{ $admin->name }}</td>

                        <td>{{ $admin->email }}</td>

                        <td class="actions">

                            <a
                                href="{{ route('admins.show', $admin) }}"
                                class="action-btn view-btn"
                                title="View Admin">
                                <i class="fa-solid fa-eye"></i>
                            </a>

                            <a
                                href="{{ route('admins.edit', $admin) }}"
                                class="action-btn edit-btn"
                                title="Edit Admin">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </a>

                            <form
                                action="{{ route('admins.destroy', $admin) }}"
                                method="POST"
                                class="delete-form">

                                @csrf
                                @method('DELETE')

                                <button
                                    type="submit"
                                    class="action-btn delete-btn"
                                    title="Delete Admin"
                                    onclick="return confirm('Are you sure you want to delete this admin account?')">

                                    <i class="fa-solid fa-trash"></i>

                                </button>

                            </form>

                        </td>

                    </tr>

                @empty

                    <tr>
                        <td colspan="5">
                            No admin accounts found.
                        </td>
                    </tr>

                @endforelse

            </tbody>

        </table>

</div>

</body>
</html>