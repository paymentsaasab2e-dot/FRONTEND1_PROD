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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {lmsCoursesWithAI.map((course) => {
          const Icon = ICON_MAP[course.iconKey];
          return (
            <div key={course.id} className={LMS_CARD_INTERACTIVE}>
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#28A8E1] border border-blue-100">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-snug">{course.title}</h2>
                    <p className="mt-1.5 text-sm text-gray-500 font-normal leading-relaxed">{course.description}</p>
                  </div>

                  <div className="flex items-start gap-2 rounded-lg border border-violet-100 bg-violet-50/50 px-3 py-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-violet-600 mt-0.5" strokeWidth={2} />
                    <p className="text-xs font-medium text-violet-900 leading-relaxed">{course.aiContext}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {levelBadge(course.level)}
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                      <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                      {course.duration}
                    </span>
                  </div>

                  {course.progress != null && course.progress > 0 && course.progress < 100 ? (
                    <LmsProgressBar value={course.progress} />
                  ) : null}
                  {course.progress === 100 ? (
                    <p className="text-xs font-semibold text-emerald-700">Completed — revisit anytime</p>
                  ) : null}

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      className="flex-1 min-w-[6rem] rounded-xl bg-[#28A8E1] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98] cursor-pointer"
                    >
                      {courseCtaLabel(course.progress)}
                    </button>
                    <button
                      type="button"
                      className="flex-1 min-w-[6rem] rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] cursor-pointer"
                    >
                      Save
                    </button>
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
