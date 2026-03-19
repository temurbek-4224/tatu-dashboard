import Link from "next/link";
import { Assignment } from "@/types";
import Badge from "@/components/ui/Badge";

interface AssignmentCardProps {
  assignment: Assignment;
  subjectSlug: string;
  index: number;
}

export default function AssignmentCard({ assignment, subjectSlug, index }: AssignmentCardProps) {
  return (
    <Link
      href={`/subjects/${subjectSlug}/${assignment.slug}`}
      className="block group"
    >
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm
        hover:shadow-md hover:border-slate-200 transition-all duration-200
        p-4 flex items-center gap-4">

        {/* Index badge */}
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg
          flex items-center justify-center font-bold text-sm flex-shrink-0
          group-hover:bg-indigo-100 transition-colors">
          {index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-0.5">
            <h3 className="font-medium text-slate-900 capitalize text-sm
              group-hover:text-indigo-600 transition-colors truncate">
              {assignment.title}
            </h3>
            <Badge status={assignment.status} />
          </div>
          <p className="text-xs text-slate-500 truncate">{assignment.description}</p>
        </div>

        {/* Chevron */}
        <svg
          className="w-4 h-4 text-slate-300 group-hover:text-indigo-500
            group-hover:translate-x-0.5 transition-all flex-shrink-0"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
