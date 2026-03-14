"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Command, FileText, Calendar, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SearchForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        setIsOpen(true);
        try {
          const res = await fetch(`/api/staff/search?q=${encodeURIComponent(query.trim())}`);
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Search failed:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/dashboard/staff/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative w-96 group" ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
              isOpen ? "text-emerald-600" : "text-slate-400 group-focus-within:text-emerald-600"
            }`}
            size={16}
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
            className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
            placeholder="Search meetings or tasks..."
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading ? (
              <Loader2 size={14} className="animate-spin text-emerald-500" />
            ) : (
              <div className="flex gap-1 items-center bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400">
                <Command size={10} /> K
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Results Dropdown */}
      {isOpen && (results.length > 0 || query.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="px-4 py-2 border-b border-slate-50 bg-slate-50/50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Quick Results
            </span>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {results.length > 0 ? (
              <div className="p-2 space-y-1">
                {results.map((res) => (
                  <Link
                    key={`${res.category}-${res.id}`}
                    href="/dashboard/staff/meetings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors no-underline group"
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      res.category === 'Meeting' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {res.category === 'Meeting' ? <FileText size={16} /> : <Calendar size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700">
                        {res.title}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {res.category} • {res.type}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : !isLoading && (
              <div className="p-8 text-center">
                <p className="text-xs text-slate-400 font-medium italic">
                  No direct matches found. Press Enter for full search.
                </p>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <button
              onClick={handleSubmit}
              className="w-full p-3 bg-slate-50 border-t border-slate-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
            >
              See all results
            </button>
          )}
        </div>
      )}
    </div>
  );
}
