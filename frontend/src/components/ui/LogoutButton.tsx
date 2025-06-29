import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

// Define the expected shape of the auth store
interface AuthStore {
  logout: () => void;
}

const LogoutButton: React.FC = () => {
  const logout = useAuthStore((state: AuthStore) => state.logout);
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      aria-label="Logout"
      title="Logout"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
