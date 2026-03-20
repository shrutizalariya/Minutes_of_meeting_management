"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DynamicGlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ meetings: any[]; staff: any[] }>({ meetings: [], staff: [] });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        try {
          // Note: We need a search API route or we can use a server action. 
          // For now, I'll assume we'll create a lightweight API route for this.
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data);
            setOpen(true);
          }
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults({ meetings: [], staff: [] });
        setOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div className="relative w-72 lg:w-96 group" ref={dropdownRef}>
      <div className="relative">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            open ? "text-blue-500" : "text-slate-400 group-focus-within:text-blue-500"
          }`}
          size={16}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setOpen(true)}
          className="w-full bg-slate-100/50 border-none rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          placeholder="Search meetings or staff..."
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={16} />
        )}
      </div>

      {open && (results.meetings.length > 0 || results.staff.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-50 overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-1">
            
            {results.meetings.length > 0 && (
              <div>
                <header className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Meetings</header>
                {results.meetings.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelect(`/dashboard/convener/meetings/${m.id}`)}
                    className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center gap-3 group transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Calendar size={14} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-slate-700 truncate">{m.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{m.date} • {m.location}</p>
                    </div>
                    <ArrowRight size={12} className="text-slate-200 group-hover:text-blue-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            )}

            {results.staff.length > 0 && (
              <div className={results.meetings.length > 0 ? "mt-2 pt-2 border-t border-slate-50" : ""}>
                <header className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff</header>
                {results.staff.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(`/dashboard/convener/staff?q=${encodeURIComponent(s.name)}`)}
                    className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center gap-3 group transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <div className="h-8 w-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <User size={14} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-slate-700 truncate">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{s.role} • {s.email}</p>
                    </div>
                    <ArrowRight size={12} className="text-slate-200 group-hover:text-blue-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
