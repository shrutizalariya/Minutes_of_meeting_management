import Link from "next/link";
import { Eye, MapPin, Edit } from "lucide-react";
import DeleteButtonForMeetings from "@/app/ui/DeleteButtonForMeetings";

interface MeetingRowProps {
  id: number;
  title: string;
  date: string;
  type: string;
  location: string;
  status: string | null;
  showActions?: boolean;
}

export default function MeetingRow({ id, title, date, type, location, status, showActions = true }: MeetingRowProps) {
  return (
    <tr className="group hover:bg-slate-50/70 transition-all duration-300">
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <div className="font-black text-slate-800 text-sm tracking-tight group-hover:text-blue-600 transition-colors">{title}</div>
          <div className="flex items-center gap-2 mt-1.5">
             <div className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">{date}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${type === 'General' ? 'bg-slate-300' : 'bg-blue-400'}`} />
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            {type}
          </span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
           <MapPin size={12} className="text-blue-500" />
           <span className="text-slate-600 font-black text-[10px] uppercase tracking-widest">{location || "Internal"}</span>
        </div>
      </td>
      <td className="px-6 py-5 text-right">
        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm inline-block ${
              status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
              status === "Scheduled" ? "bg-blue-50 text-blue-600 border-blue-100" :
              "bg-amber-50 text-amber-600 border-amber-100"
            }`}>
          {status || "N/A"}
        </span>
      </td>
      {showActions && (
        <td className="px-8 py-5 text-right">
            <div className="flex items-center justify-end gap-2 pr-4">
              <Link
                href={`/dashboard/admin/meetings/${id}`}
                className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                title="View Details"
              >
                <Eye size={16} strokeWidth={2.5} />
              </Link>
              <Link
                href={`/dashboard/admin/meetings/edit/${id}`}
                className="p-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                title="Edit Meeting"
              >
                <Edit size={16} strokeWidth={2.5} />
              </Link>
              <DeleteButtonForMeetings
                id={id}
                iconClassName="w-4 h-4 text-red-600 hover:text-red-700"
              />
            </div>
        </td>
      )}
    </tr>
  );
}