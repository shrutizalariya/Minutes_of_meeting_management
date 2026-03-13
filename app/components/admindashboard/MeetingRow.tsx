import Link from "next/link";
import { Eye } from "lucide-react";

interface MeetingRowProps {
  id: number;
  title: string;
  date: string;
  type: string;
  location: string;
  status: string | null;
}

export default function MeetingRow({ id, title, date, type, location, status }: MeetingRowProps) {
  return (
    <tr className="group hover:bg-slate-50/50 transition-all duration-200">
      <td className="px-6 py-4">
        <div className="font-bold text-slate-700 text-sm tracking-tight">{title}</div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{date}</div>
      </td>
      <td className="px-6 py-4">
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-tight">
          {type}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-500 text-xs font-semibold">{location}</td>
      <td className="px-6 py-4">
        <div className="flex justify-end">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status === "Completed" ? "bg-emerald-100 text-emerald-600" :
              status === "Scheduled" ? "bg-blue-100 text-blue-600" :
                "bg-amber-100 text-amber-600"
            }`}>
            {status || "N/A"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <Link
          href={`/dashboard/admin/meetings/${id}`}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          title="View Details"
        >
          <Eye size={16} />
        </Link>
      </td>
    </tr>
  );
}