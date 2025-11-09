import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState(null);
  const { login, loading, error, clearError, isAuthenticated, user } = useAuth();
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
      const authenticatedUser = await login(form);
      navigate(authenticatedUser.role === "Admin" ? "/admin" : "/");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Unable to login";
      setLocalError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="glass-effect w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden animate-fadeIn">
        {/* Left Section */}
        <div className="hidden lg:flex flex-col justify-center w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-12 relative">
          <h2 className="text-4xl font-extrabold mb-4">Welcome Back 👋</h2>
          <p className="text-lg text-white/90 leading-relaxed">
            Discover new products, enjoy seamless shopping, and stay connected with{" "}
            <span className="font-semibold">Together by Shaw.</span>
          </p>
          <div className="absolute bottom-6 right-6 text-sm text-white/70">✨ Premium Experience ✨</div>
        </div>

        {/* Right Section */}
        <div className="flex-1 bg-white/60 backdrop-blur-lg p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-center gradient-text-1 mb-6">
            Login to Your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
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
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            {(localError || error) && (
              <p className="text-center text-sm text-red-500">{localError || error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-full hover-scale hover-glow transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="my-6 border-t border-gray-200" />

          <p className="text-center text-gray-600 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
