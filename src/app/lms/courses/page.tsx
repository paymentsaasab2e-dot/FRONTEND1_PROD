import { Clock, BookOpen, Code2, Palette, LineChart, Sparkles } from 'lucide-react';
import { LMS_CARD_INTERACTIVE, LMS_PAGE_SUBTITLE } from '../constants';
import { LmsProgressBar } from '../components/LmsProgressBar';
import { AISectionHeading } from '../components/ai';
import { lmsCoursesWithAI, type CourseIconKey } from '../data/ai-mock';

const ICON_MAP: Record<CourseIconKey, typeof Code2> = {
  code2: Code2,
  palette: Palette,
  lineChart: LineChart,
  bookOpen: BookOpen,
};

function courseCtaLabel(progress: number | null) {
  if (progress === 100) return 'Review';
  if (progress != null && progress > 0) return 'Continue';
  return 'Start';
}

function levelBadge(level: 'Beginner' | 'Intermediate') {
  if (level === 'Beginner') {
    return (
      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
        Beginner
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
      Intermediate
    </span>
  );
}

export default function LmsCoursesPage() {
  return (
    <div className="space-y-8">
      <div className="min-w-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">Courses</h1>
        <p className={LMS_PAGE_SUBTITLE}>Structured learning paths to support your job search and interviews.</p>
      </div>

      <div className="space-y-3">
        <AISectionHeading title="AI course picks" />
        <p className="text-sm font-normal text-gray-500">
          Context lines are mock recommendations — ready to bind to your ranking service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lmsCoursesWithAI.map((course) => {
          const Icon = ICON_MAP[course.iconKey];
          return (
            <div key={course.id} className={LMS_CARD_INTERACTIVE}>
              <div className="flex flex-col h-full gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#28A8E1] border border-blue-100 shadow-sm">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {levelBadge(course.level)}
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
                        <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                        {course.duration}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">{course.title}</h2>
                  </div>
                </div>

                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 font-normal leading-relaxed">{course.description}</p>
                    
                    <div className="flex items-start gap-2.5 rounded-xl border border-violet-100 bg-violet-50/50 p-3.5 transition-colors hover:bg-violet-50">
                      <Sparkles className="h-4 w-4 shrink-0 text-violet-600 mt-0.5" strokeWidth={2.5} />
                      <p className="text-xs font-semibold text-violet-900 leading-relaxed uppercase tracking-wide opacity-80">
                        Recommendation: <span className="lowercase font-medium normal-case block mt-0.5 opacity-100 text-[13px]">{course.aiContext}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {course.progress != null && course.progress > 0 && course.progress < 100 ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <LmsProgressBar value={course.progress} />
                      </div>
                    ) : null}
                    
                    {course.progress === 100 ? (
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-100/50">
                         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Course Completed</p>
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        className="flex-[2] rounded-xl bg-[#28A8E1] px-5 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-95 hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                      >
                        {courseCtaLabel(course.progress)}
                      </button>
                      <button
                        type="button"
                        className="flex-1 rounded-xl border-2 border-slate-100 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98] cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
