import Link from "next/link";
import { Subject } from "@/types";
import { getSubjectColorConfig } from "@/lib/utils";

interface SubjectCardProps {
  subject: Subject;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const color = getSubjectColorConfig(subject.color);
  const readyCount = subject.assignments.filter((a) => a.status === "tayyor").length;
  const inProgressCount = subject.assignments.filter((a) => a.status === "jarayonda").length;
  const total = subject.assignments.length;

  return (
    <Link href={`/subjects/${subject.slug}`} className="block group">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm
        hover:shadow-md hover:border-slate-200 transition-all duration-200 p-6 h-full">

        {/* Top row: icon + assignment count */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-12 h-12 ${color.bg} ${color.border} border rounded-xl
            flex items-center justify-center`}>
            <span className={`text-xl font-bold ${color.text}`}>
              {subject.name.charAt(0)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-slate-900">{total}</p>
            <p className="text-xs text-slate-400">topshiriq</p>
          </div>
        </div>

        {/* Subject name & description */}
        <h3 className="font-semibold text-slate-900 text-lg leading-snug mb-1
          group-hover:text-indigo-600 transition-colors">
          {subject.name}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">
          {subject.description}
        </p>

        {/* Footer: status dots + arrow */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              {readyCount} tayyor
            </span>
            {inProgressCount > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                {inProgressCount} jarayonda
              </span>
            )}
          </div>
          <svg
            className="w-4 h-4 text-slate-300 group-hover:text-indigo-500
              group-hover:translate-x-0.5 transition-all"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
