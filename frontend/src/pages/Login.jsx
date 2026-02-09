import { useState } from "react";
import { loginUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMessage("");

    if (!identifier || !password) {
      setErrorMessage("Email/Username and password are required");
      return;
    }

    try {
      setLoading(true);

      // Decide whether it's email or username
      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await loginUser(payload);

      // Backend returns user + tokens
      const { user, accessToken } = res.data.data;

      // Optional: store accessToken if you need it for headers
      localStorage.setItem("token", accessToken);

      // Update auth context
      setUser(user);

      navigate("/");
    } catch (error) {
      setErrorMessage(
        "Error: " +
          (error.response?.data?.message || "Login failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={submit}
        className="bg-black text-white p-6 rounded w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          type="text"
          placeholder="Email or Username"
          className="w-full p-2 text-black"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-red-600 py-2 rounded hover:bg-red-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔴 BACKEND ERROR MESSAGE */}
        {errorMessage && (
          <p className="text-red-500 text-sm text-center">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}