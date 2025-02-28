import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/aman-logo-dark.png"; // Ensure correct path
import BackgroundImage from "../assets/fish-farm.jpg"; // Ensure correct path

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(credentials);
      if (userData.role === "admin") {
        navigate("/admin/manage-users");
      } else if (userData.role === "user") {
        navigate("/user/device-overview");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Panel - Login Form */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-center p-6 lg:p-10 bg-white">
        <img src={Logo} alt="AMAN Logo" className="h-16 mb-6" />
        <h2 className="text-3xl !font-bold !text-blue-700">Login</h2>
        <p className="text-gray-600 text-center mt-2 px-4">
          Log in to your account and stay updated and take action effortlessly.
        </p>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full max-w-md mt-6 space-y-4 px-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email*</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password*</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 !rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Login
          </button>
        </form>
      </div>

      {/* Right Panel - Background Image (Hidden on Small Screens) */}
      <div className="lg:w-1/2 w-full hidden lg:flex items-center justify-center bg-cover bg-center" 
           style={{ backgroundImage: `url(${BackgroundImage})` }}>
      </div>
    </div>
  );
};

export default LoginPage;
