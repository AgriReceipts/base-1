import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import { Eye, EyeOff, Trash2 } from "lucide-react";

import api from "@/lib/axiosInstance";

// --- Type Definition ---
interface User {
  id: string;
  username: string;
  committeeName: string | null;
  password?: string;
  role: string;
  name: string;
  designation: string;
}

// --- Main Component ---
const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set(),
  );
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("auth/users");
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // This is correct, runs only once on mount.

  // --- CHANGE 1: Wrapped function in useCallback ---
  // This prevents the function from being recreated on every render,
  // optimizing performance and preventing unnecessary re-renders of child components.
  const togglePasswordVisibility = useCallback((username: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  }, []); // Empty dependency array means the function is created only once.

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`auth/delete/${id}`);
    } catch (error) {
      console.error("Error trying to delete user", error);
    } finally {
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  // --- CHANGE 2: Removed all "dark:" prefixed Tailwind CSS classes ---
  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg w-full max-w-8xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          User Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          A list of all users in the system.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Committee
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3 rounded-r-lg">
                Password
              </th>
              <th scope="col" className="px-6 py-3 rounded-r-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.username}
                className="bg-white border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">
                    {user.designation}
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-gray-700">
                  {user.username}
                </td>
                <td className="px-6 py-4">
                  {user.committeeName || (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono flex-grow">
                      {visiblePasswords.has(user.username)
                        ? user.password
                        : "••••••••••••"}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(user.username)}
                      className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
                      aria-label={
                        visiblePasswords.has(user.username)
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {visiblePasswords.has(user.username) ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-9">
                  <div
                    className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full cursor-pointer transition-colors duration-200"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">No users found.</p>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
