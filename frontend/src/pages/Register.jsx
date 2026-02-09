import { useState } from "react";
import { registerUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ NEW: error state
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setErrorMessage(""); // clear old error when typing
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErrorMessage("");

    if (!avatar) {
      setErrorMessage("Avatar is required");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("username", form.username);
    formData.append("password", form.password);
    formData.append("avatar", avatar);

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      setLoading(true);
      await registerUser(formData);
      navigate("/login");
    } catch (error) {
      // ✅ BACKEND ERROR SHOWN IN UI
      setErrorMessage(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={submit}
        className="bg-black text-white p-6 rounded w-96 space-y-3"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <input
          name="fullName"
          placeholder="Full Name"
          className="w-full p-2 text-black"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 text-black"
          onChange={handleChange}
          required
        />

        <input
          name="username"
          placeholder="Username"
          className="w-full p-2 text-black"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 text-black"
          onChange={handleChange}
          required
        />

        <div>
          <label className="text-sm text-gray-300">Avatar (required)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">
            Cover Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-red-600 py-2 rounded hover:bg-red-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* ✅ ERROR SHOWN BELOW BUTTON */}
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mt-2">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}