import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";

export default function Index({ users }) {
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, put, reset, errors } = useForm({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: () => {
                    setEditingUser(null);
                    reset();
                },
            });
        } else {
            post("/users", {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setData({ name: user.name, email: user.email, password: "" });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure?")) {
            router.delete(`/users/${id}`);
        }
    };

    const cancelEdit = () => {
        setEditingUser(null);
        reset();
    };

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "40px auto",
                fontFamily: "sans-serif",
            }}
        >
            <h1>User Management (Laravel + React + Inertia)</h1>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                style={{
                    marginBottom: "30px",
                    padding: "20px",
                    border: "1px solid #ccc",
                }}
            >
                <h3>{editingUser ? "Edit User" : "Create User"}</h3>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                    {errors.name && (
                        <span style={{ color: "red" }}>{errors.name}</span>
                    )}
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                    {errors.email && (
                        <span style={{ color: "red" }}>{errors.email}</span>
                    )}
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="password"
                        placeholder={
                            editingUser
                                ? "Password (leave blank to keep)"
                                : "Password"
                        }
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                    {errors.password && (
                        <span style={{ color: "red" }}>{errors.password}</span>
                    )}
                </div>

                <button
                    type="submit"
                    style={{ padding: "8px 16px", marginRight: "10px" }}
                >
                    {editingUser ? "Update" : "Save"}
                </button>
                {editingUser && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        style={{ padding: "8px 16px" }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            {/* Users Table */}
            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button
                                    onClick={() => handleEdit(user)}
                                    style={{ marginRight: "5px" }}
                                >
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(user.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
