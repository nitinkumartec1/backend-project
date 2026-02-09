import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/auth.api";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log(err);
    }
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-black text-white">
      <Link to="/" className="text-xl font-bold text-red-500">
        VideoTube
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-300">
              Hi, {user.username}
            </span>

            <Link to="/upload" className="hover:text-red-400">
              Upload
            </Link>

            <Link to="/dashboard" className="hover:text-red-400">
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-red-400">
              Login
            </Link>
            <Link to="/register" className="hover:text-red-400">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}