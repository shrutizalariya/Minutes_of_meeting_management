"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, FileText, User, Phone } from "lucide-react";
import { RegisterUserAction } from "@/app/actions/RegisterUserAction";

export default function RegisterPage() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [role,setRole] = useState("user");

  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  async function handleRegister(e:any){
    e.preventDefault();

    setError("");

    if(password !== confirmPassword){
        setError("Passwords do not match");
        return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("name",name);
    formData.append("email",email);
    formData.append("phone",phone);
    formData.append("password",password);
    formData.append("role",role);

    try{

      await RegisterUserAction(formData);

      window.location.href="/Login";

    }catch(err){

      setError("Registration Failed");

    }finally{
      setLoading(false);
    }
  }


  return (

<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">

{/* Card */}

<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 w-full max-w-md">

{/* Logo */}

<div className="flex items-center justify-center mb-6">

<div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">

<FileText className="w-8 h-8 text-white"/>

</div>

</div>


{/* Title */}

<h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">

Create Account

</h2>

<p className="text-gray-600 text-center mb-6">

Register to continue

</p>



{/* Error */}

{error && (

<p className="text-red-600 mb-4 text-center">

{error}

</p>

)}



<form onSubmit={handleRegister} className="space-y-4">

{/* Name */}

<div>

<label className="block text-sm font-semibold text-gray-700 mb-2">

Name

</label>

<div className="relative">

<div className="absolute inset-y-0 left-0 pl-4 flex items-center">

<User className="w-5 h-5 text-gray-400"/>

</div>

<input
type="text"
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
placeholder="Your Name"
/>

</div>

</div>



{/* Email */}

<div>

<label className="block text-sm font-semibold text-gray-700 mb-2">

Email

</label>

<div className="relative">

<div className="absolute inset-y-0 left-0 pl-4 flex items-center">

<Mail className="w-5 h-5 text-gray-400"/>

</div>

<input
type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
placeholder="you@example.com"
/>

</div>

</div>




{/* Role */}

<div>

<label className="block text-sm font-semibold text-gray-700 mb-2">

Role

</label>

<select
value={role}
onChange={(e)=>setRole(e.target.value)}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
>

<option value="user">User</option>
<option value="staff">Staff</option>
<option value="admin">Admin</option>

</select>

</div>



{/* Password */}

<div>

<label className="block text-sm font-semibold text-gray-700 mb-2">

Password

</label>

<div className="relative">

<div className="absolute inset-y-0 left-0 pl-4 flex items-center">

<Lock className="w-5 h-5 text-gray-400"/>

</div>

<input
type={showPassword ? "text":"password"}
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
placeholder="Enter password"
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute inset-y-0 right-0 pr-4 flex items-center"
>

{showPassword ? <EyeOff className="w-5 h-5 text-gray-400"/> : <Eye className="w-5 h-5 text-gray-400"/>}

</button>

</div>

</div>



{/* Confirm Password */}

<div>

<label className="block text-sm font-semibold text-gray-700 mb-2">

Confirm Password

</label>

<div className="relative">

<div className="absolute inset-y-0 left-0 pl-4 flex items-center">

<Lock className="w-5 h-5 text-gray-400"/>

</div>

<input
type={showConfirmPassword ? "text":"password"}
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
placeholder="Confirm password"
/>

<button
type="button"
onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
className="absolute inset-y-0 right-0 pr-4 flex items-center"
>

{showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400"/> : <Eye className="w-5 h-5 text-gray-400"/>}

</button>

</div>

</div>



{/* Submit */}

<button
type="submit"
disabled={loading}
className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2"
>

{loading ? (
<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
) : (
<>
Register
<ArrowRight className="w-5 h-5"/>
</>
)}

</button>

</form>



{/* Login Link */}

<p className="mt-6 text-center text-gray-600">

Already have an account?{" "}

<a href="/" className="font-semibold text-blue-600">

Sign in

</a>

</p>

</div>

</div>

  );
}