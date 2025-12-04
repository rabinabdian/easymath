// src/components/YearPlanView.tsx
import { useNavigate } from 'react-router-dom';
import type { YearPlan } from '../types/yearPlan';
import { VersionDisplay } from './VersionDisplay';

interface YearPlanViewProps {
  plan: YearPlan;
}

const ACTIVITY_LABELS: Record<string, string> = {
  lesson: 'שיעור',
  practice: 'תרגול',
  quiz: 'בוחן',
  exam: 'מבחן',
  game: 'משחק',
};

const TOPIC_LABELS: Record<string, string> = {
  numbers: 'מספרים',
  addition: 'חיבור',
  subtraction: 'חיסור',
  multiplication: 'כפל',
  evenOdd: 'זוגי/אי-זוגי',
  geometry: 'גיאומטריה',
};

export default function YearPlanView({ plan }: YearPlanViewProps) {
  const navigate = useNavigate();

  // קבוצת שבועות לפי חודשים
  const monthsMap = new Map<string, typeof plan.weeks>();

  plan.weeks.forEach((week) => {
    if (!monthsMap.has(week.month)) {
      monthsMap.set(week.month, []);
    }
    monthsMap.get(week.month)!.push(week);
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 relative">
      <VersionDisplay className="absolute top-2 left-2 z-10" />
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                תכנית שנתית – כיתה {plan.grade}
              </h1>
              <p className="text-sm text-slate-600">שנת לימודים: {plan.yearLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/teacher')}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              חזרה למורה
            </button>
          </div>
        </header>

        <div className="space-y-6">
          {Array.from(monthsMap.entries()).map(([month, weeks]) => (
            <section
              key={month}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                {month}
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {weeks.map((week, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        שבוע {week.weekOfMonth}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        {TOPIC_LABELS[week.topic] || week.topic}
                      </span>
                    </div>

                    {week.subtopic && (
                      <p className="mb-2 text-xs text-slate-600">
                        {week.subtopic}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {week.focus.map((activity, actIdx) => (
                        <span
                          key={actIdx}
                          className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
                        >
                          {ACTIVITY_LABELS[activity] || activity}
                        </span>
                      ))}
                    </div>

                    {week.notes && (
                      <p className="mt-2 text-xs italic text-slate-500">
                        {week.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
