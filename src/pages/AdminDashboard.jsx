import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
export default function AdminDashboard() {
  const { user, accessToken } = useAuthStore();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
    else if (user.role !== "ADMIN") navigate("/dashboard");
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/api/users", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(
        `/api/users/${id}`,
        { role },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white p-8">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#1a254d] rounded-2xl shadow-lg">
          <thead>
            <tr className="text-left border-b border-gray-600">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const first = u.profile?.firstName || "";
              const last = u.profile?.lastName || "";
              const displayName =
                first || last ? `${first} ${last}`.trim() : "—";

              return (
                <tr
                  key={u.id}
                  className="border-b border-gray-700 hover:bg-[#243164]"
                >
                  <td className="p-3">{displayName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-[#101830] border border-gray-500 rounded p-1"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No users found.</p>
        )}
      </div>
    </div>
  );
}
