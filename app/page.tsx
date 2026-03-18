"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {

  const router = useRouter();

  const [showPassword,setShowPassword] = useState(false);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);


  const handleLogin = async (e:any)=>{
    e.preventDefault();

    setError("");

    if(!email || !password || !role){
      setError("All fields are required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password,
        role
      }),
      credentials:"include"
    });

    const data = await res.json();

    setLoading(false);

    if(!res.ok){
      setError(data.error);
      return;
    }

    // Role Redirect
    if(data.user.role === "admin"){
      router.push("/dashboard/admin");
    }
    else if(data.user.role === "staff"){
      router.push("/dashboard/staff");
    }
    else{
      router.push("/dashboard/convener");
    }
  };


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 w-full max-w-md">


        {/* Logo */}

        <div className="flex justify-center mb-6">

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 rounded-xl">

            <FileText className="w-8 h-8 text-white"/>

          </div>

        </div>



        {/* Title */}

        <h2 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Sign in to continue
        </p>



       {/* Error */}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>

            {error}

          </div>
        )}

        <form onSubmit={handleLogin}>


          {/* Email */}

          <div className="mb-4">

            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>

            <div className="relative">

              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>

              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none"
              />

            </div>

          </div>



          {/* Password */}

          <div className="mb-4">

            <label className="block text-sm font-semibold mb-2">
              Password
            </label>

            <div className="relative">

              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none"
              />

              <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ?
                  <EyeOff className="w-5 h-5 text-gray-400"/>
                  :
                  <Eye className="w-5 h-5 text-gray-400"/>
                }
              </button>

            </div>

          </div>



          {/* Role */}

          <div className="mb-5">

            <label className="block text-sm font-semibold mb-2">
              Role
            </label>

            <select
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              className="w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none"
            >
              <option value="">Select Role</option>

              <option value="Admin">
                Admin
              </option>

              <option value="Staff">
                Staff
              </option>

              <option value="MeetingConvener">
                Meeting Convener
              </option>

            </select>

          </div>



          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:from-blue-700 hover:to-blue-900 transition"
          >

            {loading ?
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              :
              <>
                Sign In
                <ArrowRight className="w-5 h-5"/>
              </>
            }

          </button>


        </form>



        {/* Divider */}

        <div className="relative my-6">

          <div className="absolute inset-0 flex items-center">

            <div className="w-full border-t border-gray-300"></div>

          </div>

          <div className="relative flex justify-center text-sm">

            <span className="px-4 bg-white text-gray-500">
              Or continue with
            </span>

          </div>

        </div>



        {/* Google Login */}

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex justify-center items-center gap-3 border  border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
        >

          <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">

            <path fill="#4285f4" d="M533.5 278.4c0-17.6-1.6-34.5-4.6-51H272v96.6h146.9c-6.4 33-25.5 60.9-54.4 79.6v65h87.9c51.6-47.5 81.1-117.6 81.1-190.2z"/>

            <path fill="#34a853" d="M272 544.3c73.8 0 135.7-24.5 180.9-66.6l-87.9-65c-24.4 16.4-55.5 26-93 26-71.4 0-131.9-48.1-153.5-112.6H30.1v70.9C75.6 492.3 167 544.3 272 544.3z"/>

            <path fill="#fbbc05" d="M118.5 328.6c-9-26.5-9-55.1 0-81.6V176H30.1c-39.8 77.8-39.8 170.6 0 248.4l88.4-70.8z"/>

            <path fill="#ea4335" d="M272 107.3c39.8-.6 77.2 14 105.9 40.7l79.2-79.2C407.4 26.2 342.6-1.8 272 0 167 0 75.6 52 30.1 144.7l88.4 70.9c21.6-64.5 82.1-112.3 153.5-112.3z"/>

          </svg>

          Sign in with Google

        </button>



        {/* Signup */}

        <p className="text-center mt-6 text-gray-600">

          Don't have an account?

          <a
            href="/Register"
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            Sign Up
          </a>

        </p>


      </div>


      {/* Footer */}

      <p className="mt-6 text-gray-500 text-sm">

        Meeting Management System © 2026

      </p>


    </div>
  );
}