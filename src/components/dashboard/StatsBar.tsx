import { subjects } from "@/data/subjects";

export default function StatsBar() {
  const totalSubjects = subjects.length;
  const totalAssignments = subjects.reduce((sum, s) => sum + s.assignments.length, 0);
  const completedAssignments = subjects.reduce(
    (sum, s) => sum + s.assignments.filter((a) => a.status === "tayyor").length,
    0
  );

  const stats = [
    {
      label: "Jami fanlar",
      value: totalSubjects,
      icon: (
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bg: "bg-indigo-50",
    },
    {
      label: "Jami topshiriqlar",
      value: totalAssignments,
      icon: (
        <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      bg: "bg-violet-50",
    },
    {
      label: "Bajarilganlar",
      value: completedAssignments,
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4 flex items-center gap-4"
        >
          <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
