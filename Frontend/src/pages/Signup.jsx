import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import logo from "../assets/Elevaltelogo.png"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../authSlice";
import { useEffect, useState } from "react";

// Schema validation for the signup page
const signupSchema = z.object({
  firstName: z.string().min(3, "Name Should Contain At least 3 Character"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password should be 8 characters"),
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const nevigate = useNavigate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const submitData = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form
        onSubmit={handleSubmit(submitData)}
        className="w-full max-w-md mx-auto bg-black border border-orange-500/30 rounded-3xl p-8 shadow-[0_10px_40px_rgba(249,115,22,0.1)]"
      >
        <div className="space-y-6">
          {/* Heading */}
          <div className="text-center">
            <div className="flex justify-center align-middle">
              <img
                src={logo}
                alt="Elevate Logo"
                className="w-24 h-24 mb-4"
              />

              <div className="flex items-center justify-center">
                <h2 className="text-3xl font-bold text-orange-500">
                  Elevate
                </h2>
              </div>
            </div>

            <p className="text-orange-400/80 mt-2">
              Start your coding journey today
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Full Name
            </label>

            <input
              {...register("firstName")}
              type="text"
              placeholder="Enter your full name"
              className={`w-full bg-black text-gray-300 placeholder:text-gray-600 border rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/20 ${errors.firstName
                ? "border-red-500 focus:border-red-500"
                : "border-orange-500/30 focus:border-orange-500"
                }`}
            />

            {errors.firstName && (
              <p className="text-red-500 text-sm mt-2">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email Address
            </label>
            <input
              {...register("emailId")}
              type="email"
              placeholder="Enter your email"
              className={`w-full bg-black text-gray-300 placeholder:text-gray-600 border rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/20 ${errors.emailId
                ? "border-red-500 focus:border-red-500"
                : "border-orange-500/30 focus:border-orange-500"
                }`}
            />

            {errors.emailId && (
              <p className="text-red-500 text-sm mt-2">
                {errors.emailId.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className={`w-full bg-black text-gray-300 placeholder:text-gray-600 border rounded-xl px-4 py-3 pr-12 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/20 ${errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-orange-500/30 focus:border-orange-500"
                  }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-xl shadow-sm hover:shadow-orange-500/20 hover:shadow-md transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?
            <span onClick={() => navigate("/login")} className="ml-1 text-orange-500 font-semibold cursor-pointer hover:text-orange-400 hover:underline transition-colors">
              Sign In
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;