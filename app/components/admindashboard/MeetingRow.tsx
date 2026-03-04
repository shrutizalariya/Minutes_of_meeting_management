interface MeetingRowProps {
  title: string;
  date: string;
  type: string;
  location: string;
  status: string;
}

export default function MeetingRow({ title, date, type, location, status }: MeetingRowProps) {
  return (
    <tr>
      <td className="px-8 py-4">{title} <br /><span className="text-xs text-slate-400">{date}</span></td>
      <td className="px-6 py-4">{type}</td>
      <td className="px-6 py-4">{location}</td>
      <td className="px-8 py-4 text-right">
      <span className={`px-2 py-1 rounded-full text-white text-xs ${
          status === "Completed" ? "bg-emerald-500" :
          status === "Scheduled" ? "bg-blue-500" :
          "bg-amber-500"
        }`}>{status}</span>
      </td>
    </tr>
  );
}