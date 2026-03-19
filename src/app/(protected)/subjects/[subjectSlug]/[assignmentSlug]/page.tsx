import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAssignmentBySlug } from "@/data/subjects";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Badge from "@/components/ui/Badge";
import InteractiveArea from "@/components/assignments/InteractiveArea";

interface Props {
  params: Promise<{ subjectSlug: string; assignmentSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectSlug, assignmentSlug } = await params;
  const result = getAssignmentBySlug(subjectSlug, assignmentSlug);
  return { title: result?.assignment.title ?? "Topshiriq topilmadi" };
}

export default async function AssignmentPage({ params }: Props) {
  const { subjectSlug, assignmentSlug } = await params;
  const result = getAssignmentBySlug(subjectSlug, assignmentSlug);
  if (!result) notFound();

  const { subject, assignment } = result;

  return (
    <div className="animate-slide-up max-w-3xl space-y-5">
      <Breadcrumb
        items={[
          { label: "Bosh sahifa", href: "/dashboard" },
          { label: subject.name, href: `/subjects/${subject.slug}` },
          { label: assignment.title },
        ]}
      />

      {/* Assignment header card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-xl font-bold text-slate-900 capitalize tracking-tight">
                {assignment.title}
              </h1>
              <Badge status={assignment.status} />
            </div>
            <p className="text-slate-500 text-sm">{assignment.description}</p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 font-mono whitespace-nowrap flex-shrink-0">
            {subject.name}
          </div>
        </div>
      </div>

      {/* Task description */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Topshiriq vazifasi
        </h2>
        <p className="text-slate-700 text-sm leading-relaxed">{assignment.taskDetails}</p>
      </div>

      {/* Interactive program area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Interaktiv dastur
        </h2>
        {/* InteractiveArea renders a "use client" component — client boundary is respected */}
        <InteractiveArea programType={assignment.programType} />
      </div>

      {/* Notes / Explanation */}
      {assignment.notes && (
        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
          <h2 className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Izohlar va tushuntirish
          </h2>
          <p className="text-amber-800 text-sm leading-relaxed">{assignment.notes}</p>
        </div>
      )}
    </div>
  );
}
