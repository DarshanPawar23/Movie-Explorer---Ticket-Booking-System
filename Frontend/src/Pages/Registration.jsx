import { useState } from "react";
import API from "../Api_Services/Axios.jsx";
import { useNavigate,Link } from "react-router-dom";

function Registration() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        }
        );
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await API.post("/api/register", form);
            alert(response.data.message);
            navigate("/login");
        }
        catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );
        }
        finally {
            setLoading(false);
        }
    }
   return (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
    
    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">
      
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">
          🎬 Movie Explorer
        </h1>

        <p className="text-gray-300 mt-2">
          Create your account and start booking tickets
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-gray-200 mb-2">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-200 mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-300 text-white font-semibold shadow-lg"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-300">
          Already have an account?{" "}
        <Link
  to="/login"
  className="text-red-500 hover:text-red-400 font-semibold"
>
  Login
</Link>
        </p>
      </div>
    </div>
  </div>
);
}
export default Registration;