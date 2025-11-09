import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "User" });
  const [localError, setLocalError] = useState(null);
  const { register, loading, error, clearError, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === "Admin" ? "/admin" : "/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError(null);
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      const newUser = await register(form);
      navigate(newUser.role === "Admin" ? "/admin" : "/");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Unable to register";
      setLocalError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-cyan-100 to-blue-100 p-6 relative">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 bg-white/70 backdrop-blur-md text-cyan-600 font-semibold px-4 py-2 rounded-full shadow hover:bg-cyan-50 transition flex items-center gap-1"
      >
        <span className="text-lg">←</span> Back to Home
      </Link>

      <div className="glass-effect w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden animate-fadeIn">
        {/* Left Section */}
        <div className="hidden lg:flex flex-col justify-center w-1/2 bg-gradient-to-br from-green-400 via-cyan-500 to-blue-500 text-white p-12 relative">
          <h2 className="text-4xl font-extrabold mb-4">Join the Community 💫</h2>
          <p className="text-lg text-white/90 leading-relaxed">
            Create your account and start exploring amazing products today with{" "}
            <span className="font-semibold">Together by Shaw.</span>
          </p>
          <div className="absolute bottom-6 right-6 text-sm text-white/70">🌿 Start Your Journey 🌿</div>
        </div>

        {/* Right Section */}
        <div className="flex-1 bg-white/60 backdrop-blur-lg p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-center gradient-text-2 mb-6">
            Create Your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {(localError || error) && (
              <p className="text-center text-sm text-red-500">{localError || error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 text-white font-semibold rounded-full hover-scale hover-glow transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="my-6 border-t border-gray-200" />

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
