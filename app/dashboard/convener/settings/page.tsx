import React from "react";
import { getUserSettings } from "@/app/actions/user/UpdateProfile";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import ConvenerSettingsForm from "./ConvenerSettingsForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) redirect("/");

  let userId = 0;
  try {
    const payload = await verifyToken(token) as { id: number; email: string; role: string };
    if (payload && payload.id) {
      userId = payload.id;
    } else {
      redirect("/");
    }
  } catch (error) {
    console.error("Token verification failed in settings:", error);
    redirect("/");
  }

  const user = await getUserSettings(userId);

  if (!user) {
    return (
      <div className="p-20 text-center" style={{ fontFamily: "'Sora', sans-serif" }}>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Configuration Error</h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">We could not retrieve your facilitator profile. Please try re-authenticating.</p>
          <div className="mt-8">
              <a href="/dashboard/convener" className="text-indigo-600 font-bold text-sm uppercase tracking-widest hover:underline">Return to Console</a>
          </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      `}</style>
      <ConvenerSettingsForm user={user} />
    </div>
  );
}
