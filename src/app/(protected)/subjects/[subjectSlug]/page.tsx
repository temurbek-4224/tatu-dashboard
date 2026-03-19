import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubjectBySlug } from "@/data/subjects";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AssignmentCard from "@/components/subjects/AssignmentCard";
import { getSubjectColorConfig } from "@/lib/utils";

interface Props {
  params: Promise<{ subjectSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectSlug } = await params;
  const subject = getSubjectBySlug(subjectSlug);
  return { title: subject?.name ?? "Fan topilmadi" };
}

export default async function SubjectPage({ params }: Props) {
  const { subjectSlug } = await params;
  const subject = getSubjectBySlug(subjectSlug);
  if (!subject) notFound();

  const color = getSubjectColorConfig(subject.color);
  const total = subject.assignments.length;
  const readyCount = subject.assignments.filter((a) => a.status === "tayyor").length;
  const progressPercent = total > 0 ? Math.round((readyCount / total) * 100) : 0;

  return (
    <div className="animate-slide-up max-w-3xl">
      <Breadcrumb
        items={[
          { label: "Bosh sahifa", href: "/dashboard" },
          { label: subject.name },
        ]}
      />

      {/* Subject hero card */}
      <div className={`${color.bg} ${color.border} border rounded-2xl p-6 mb-8`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className={`text-xs font-semibold uppercase tracking-widest ${color.text} mb-1 block`}>
              Fan
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{subject.name}</h1>
            <p className="text-slate-600 text-sm mt-1">{subject.description}</p>
          </div>
          <div className={`w-12 h-12 ${color.accent} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-lg">
              {subject.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>{readyCount} ta bajarilgan</span>
            <span>{total} ta jami</span>
          </div>
          <div className={`w-full ${color.progressBg} rounded-full h-2 overflow-hidden`}>
            <div
              className={`h-full ${color.accent} rounded-full transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Assignments list */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Topshiriqlar
        </h2>

        {subject.assignments.length > 0 ? (
          <div className="space-y-3">
            {subject.assignments.map((assignment, index) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                subjectSlug={subject.slug}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p>Bu fan uchun hali topshiriqlar qo&apos;shilmagan</p>
          </div>
        )}
      </section>
    </div>
  );
}
