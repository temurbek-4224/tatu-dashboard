import type { Metadata } from "next";
import { subjects } from "@/data/subjects";
import SubjectCard from "@/components/dashboard/SubjectCard";
import WelcomeSection from "@/components/dashboard/WelcomeSection";

export const metadata: Metadata = { title: "Bosh sahifa" };

export default function DashboardPage() {
  const totalAssignments = subjects.reduce((sum, s) => sum + s.assignments.length, 0);

  return (
    <div className="animate-slide-up">
      {/* Personalised welcome banner — reads user from localStorage via useAuth */}
      <WelcomeSection
        totalSubjects={subjects.length}
        totalAssignments={totalAssignments}
      />

      {/* Subjects section */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Fanlar ro&apos;yxati
        </h2>

        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        ) : (
          // Empty state — shown when data is empty
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">Hozircha fanlar mavjud emas</p>
            <p className="text-slate-400 text-sm mt-1">Fanlar qo&apos;shilgandan so&apos;ng bu yerda ko&apos;rinadi</p>
          </div>
        )}
      </section>
    </div>
  );
}
