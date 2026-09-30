<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Edit Admin</title>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            min-height: 100vh;
            background: #f5f7fb;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 30px;
        }

        .card {
            width: 100%;
            max-width: 550px;
            background: white;
            padding: 35px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, .08);
        }

        h1 {
            color: #1f2937;
            margin-bottom: 8px;
        }

        .subtitle {
            color: #6b7280;
            margin-bottom: 25px;
        }

        .form-group {
            margin-bottom: 18px;
        }

        label {
            display: block;
            margin-bottom: 7px;
            font-weight: 600;
            color: #374151;
        }

        input {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 15px;
            outline: none;
        }

        input:focus {
            border-color: #0058d9;
        }

        .error {
            color: #dc2626;
            font-size: 13px;
            margin-top: 5px;
        }

        .buttons {
            display: flex;
            gap: 10px;
            margin-top: 25px;
        }

        .btn {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            font-weight: 600;
            font-size: 15px;
        }

        .btn-primary {
            background: #0058d9;
            color: white;
        }

        .btn-primary:hover {
            background: #0045aa;
        }

        .btn-secondary {
            background: #e5e7eb;
            color: #374151;
        }

        .btn-secondary:hover {
            background: #d1d5db;
        }
    </style>
</head>

<body>

<div class="card">

    <h1>Edit Admin</h1>

    <p class="subtitle">
        Update administrator account information.
    </p>

    <form action="{{ route('admins.update', $admin) }}" method="POST">

        @csrf
        @method('PUT')

        <!-- Admin ID -->
        <div class="form-group">
            <label for="admin_id">Admin ID</label>

            <input
                type="text"
                id="admin_id"
                name="admin_id"
                value="{{ old('admin_id', $admin->admin_id) }}"
                autocomplete="off"
                required>

            @error('admin_id')
                <div class="error">{{ $message }}</div>
            @enderror
        </div>

        <!-- Name -->
        <div class="form-group">
            <label for="name">Name</label>

            <input
                type="text"
                id="name"
                name="name"
                value="{{ old('name', $admin->name) }}"
                autocomplete="off"
                required>

            @error('name')
                <div class="error">{{ $message }}</div>
            @enderror
        </div>

        <!-- Email -->
        <div class="form-group">
            <label for="email">Email</label>

            <input
                type="email"
                id="email"
                name="email"
                value="{{ old('email', $admin->email) }}"
                autocomplete="off"
                required>

            @error('email')
                <div class="error">{{ $message }}</div>
            @enderror
        </div>

        <!-- New Password -->
        <div class="form-group">
            <label for="password">
                New Password
            </label>

            <input
                type="password"
                id="password"
                name="password"
                placeholder="Leave blank to keep current password"
                autocomplete="new-password">

            @error('password')
                <div class="error">{{ $message }}</div>
            @enderror
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
            <label for="password_confirmation">
                Confirm New Password
            </label>

            <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                placeholder="Confirm new password"
                autocomplete="new-password">
        </div>

        <div class="buttons">

            <a
                href="{{ route('admins.index') }}"
                class="btn btn-secondary">
                Cancel
            </a>

            <button
                type="submit"
                class="btn btn-primary">
                Save Changes
            </button>

        </div>

    </form>

</div>

</body>
</html>