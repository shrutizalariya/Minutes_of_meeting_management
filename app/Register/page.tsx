"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, FileText, User, Phone } from "lucide-react";
import { RegisterUserAction } from "@/app/actions/RegisterUserAction";

export default function RegisterPage() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: any) {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!role) {
      setError("Please select a role");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", role);

    try {
      await RegisterUserAction(formData);
      window.location.href = "/Login";
    } catch (err: any) {
      setError(err.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 rounded-xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
        </div>


        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Register to continue
        </p>



        {/* Error Alert Style from Login */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}



        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>
          </div>


          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>


          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Role
            </label>
            <select
              value={role}
              required
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition-all cursor-pointer"
            >
              <option value="">Select Role</option>
              <option value="staff">Staff</option>
              <option value="meetingconvener">Meeting Convener</option>
            </select>
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition-all"
                placeholder="Create password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>


          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition-all"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:from-blue-700 hover:to-blue-900 transition shadow-md active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Continue Registration
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>




        {/* Login Link */}
        <p className="mt-8 text-center text-gray-600 text-sm font-medium">
          Already have an account?{" "}
          <a href="/" className="font-bold text-blue-600 hover:underline transition-colors">
            Sign in
          </a>
        </p>

      </div>


      {/* Footer */}
      <p className="mt-8 text-gray-500 text-[11px] font-bold uppercase tracking-[0.1em]">
        Meeting Management System &copy; 2026
      </p>

    </div>
  );
}