import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  MoveRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  connectedBusinessFlow,
  employerAiFeatures,
  employerDeepDiveModules,
  employerIntegrationGroups,
  employerMobileHighlights,
  employerModules,
  employerPlatformSignals,
  employerProblems,
  employerRoles,
  employerSolutions,
  employerTrustBand,
  type DeepDiveModule,
  type ModuleCard,
} from "./data";

const containerClass = "mx-auto max-w-[1240px] px-6";
const primaryCtaClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#28A8DF] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(40,168,223,0.22)] transition-all hover:-translate-y-0.5 hover:bg-sky-500";
const secondaryCtaClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50";
const demoHref =
  "mailto:support@saasab2e.com?subject=Book%20a%20SAASA%20B2E%20Employer%20Demo";
const talkHref =
  "mailto:support@saasab2e.com?subject=Talk%20to%20the%20SAASA%20B2E%20team";

const employerNav = [
  { href: "#ecosystem", label: "Ecosystem" },
  { href: "#modules", label: "Modules" },
  { href: "#connected-flow", label: "Business Flow" },
  { href: "#roles", label: "Roles" },
  { href: "#integrations", label: "Readiness" },
] as const;

const heroHighlights = [
  "Recruitment, people ops, payroll, CRM, analytics, and mobile in one employer system",
  "Leadership visibility without juggling separate tools",
  "Training continuity from skill-gap signals to learning recommendations",
] as const;

const modulePersonality = {
  recruitos: {
    eyebrow: "Pipeline velocity",
    summary:
      "Approvals, AI JDs, publishing, shortlisting, interviews, invoicing, and onboarding handoff.",
    chips: ["Manager approvals", "AI shortlisting", "Interview ops"],
  },
  peoplecore: {
    eyebrow: "Workforce structure",
    summary:
      "Records, attendance, assets, leave, performance, and training continuity in one employee core.",
    chips: ["Employee 360", "Biometric + GPS", "Training records"],
  },
  payflow: {
    eyebrow: "Finance confidence",
    summary:
      "Attendance-linked payroll, reminders, compliance exports, and payslip transparency.",
    chips: ["Late mark logic", "Bonus inputs", "Tally / SAP ready"],
  },
  flowcrm: {
    eyebrow: "Conversion momentum",
    summary:
      "Lead capture, assignment, follow-up discipline, quotations, and conversion reporting.",
    chips: ["Meta + Google", "WhatsApp capture", "Quote workflows"],
  },
  commandiq: {
    eyebrow: "Executive clarity",
    summary:
      "Cross-module dashboards, attrition watch, budget alerts, skill gaps, and training ROI.",
    chips: ["Founder view", "Skill-gap signals", "Exportable reports"],
  },
} as const;

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="mb-3 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
        {eyebrow}
      </div>
      <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base font-medium leading-7 text-slate-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function EmployerHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className={`${containerClass} flex items-center justify-between py-3.5`}>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/SAASA%20Logo.png"
              alt="SAASA B2E"
              width={122}
              height={34}
              className="h-8 w-auto"
            />
            <span className="hidden rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700 sm:inline-flex">
              Employer Ecosystem
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {employerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 sm:inline-flex"
          >
            Back to Job Portal
          </Link>
          <a href={demoHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#28A8DF] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(40,168,223,0.22)] transition-all hover:-translate-y-0.5 hover:bg-sky-500">
            Book Demo
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function HeroControlCenter() {
  const RecruitIcon = employerModules[0].icon;
  const PeopleIcon = employerModules[1].icon;
  const PayrollIcon = employerModules[2].icon;
  const CrmIcon = employerModules[3].icon;
  const InsightsIcon = employerModules[4].icon;

  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <div className="absolute -left-8 top-8 h-36 w-36 rounded-full bg-sky-300/18 blur-3xl" />
      <div className="absolute -right-8 bottom-8 h-40 w-40 rounded-full bg-orange-200/24 blur-3xl" />

      <div className="relative rounded-[34px] border border-slate-200 bg-white/95 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.11)]">
        <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
              SAASA Employer OS
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Hiring, people ops, payroll, CRM, analytics, and training continuity in one command view.
            </p>
          </div>
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Live control
          </span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[30px] bg-slate-950 p-5 text-white shadow-[0_20px_40px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-200">
                  RecruitOS Pipeline
                </p>
                <p className="mt-1 text-lg font-bold">
                  18 open roles, 46 shortlisted, 14 interviews booked
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-sky-200">
                <RecruitIcon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  label: "Line manager approvals",
                  value: "6 pending",
                  tone: "bg-amber-400",
                },
                {
                  label: "Candidate matching",
                  value: "AI assisted",
                  tone: "bg-sky-400",
                },
                {
                  label: "Offer to onboarding handoff",
                  value: "4 this week",
                  tone: "bg-emerald-400",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.tone}`} />
                    <span className="text-sm font-medium text-slate-200">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      PayFlow
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-950">
                      98%
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      payroll run ready
                    </p>
                  </div>
                  <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                    <PayrollIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      FlowCRM
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-950">
                      +146
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      captured leads this week
                    </p>
                  </div>
                  <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
                    <CrmIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    CommandIQ
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-950">
                    Leadership view
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-3 text-white">
                  <InsightsIcon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    label: "Attrition risk alerts",
                    value: "2 flagged",
                    icon: PeopleIcon,
                  },
                  {
                    label: "Skill-gap watch",
                    value: "LMS ready",
                    icon: PeopleIcon,
                  },
                  {
                    label: "CRM conversion velocity",
                    value: "18% higher",
                    icon: CrmIcon,
                  },
                  {
                    label: "Budget watchlist",
                    value: "1 payroll center",
                    icon: InsightsIcon,
                  },
                ].map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-3"
                    >
                      <div className="flex items-center gap-2 text-slate-500">
                        <ItemIcon className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          {item.label}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] border border-sky-100 bg-sky-50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white p-3 text-sky-600 shadow-sm">
                <PeopleIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">
                  PeopleCore
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Records, attendance, tasks, and employee actions stay synced.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white p-3 text-emerald-600 shadow-sm">
                <InsightsIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Training continuity
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Skill gaps, training records, and learning prompts feed performance and analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top_left,rgba(40,168,223,0.15),transparent_40%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_34%)]" />
      <div className={`${containerClass} relative`}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-[#28A8DF]" />
              SAASA B2E for employers
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-[4.15rem] lg:leading-[1.02]">
              Run hiring, people ops, payroll, CRM, and growth from one employer system.
            </h1>

            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-[19px]">
              SAASA B2E gives employers one connected operating layer across recruitment,
              onboarding, workforce operations, payroll, CRM, analytics, learning continuity,
              and mobile workflows.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href={demoHref} className={primaryCtaClass}>
                Book Demo
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="#ecosystem" className={secondaryCtaClass}>
                Explore Ecosystem
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-slate-200/80 bg-white/90 px-4 py-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#28A8DF]" />
                    <p className="text-sm font-semibold leading-7 text-slate-800">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <HeroControlCenter />
        </div>
      </div>
    </section>
  );
}

function TrustBandSection() {
  return (
    <section className="pb-4">
      <div className={containerClass}>
        <div className="rounded-[32px] border border-slate-200 bg-white/88 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {employerTrustBand.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#28A8DF] shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] font-medium leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function EcosystemCard({ module }: { module: ModuleCard }) {
  const Icon = module.icon;

  return (
    <Link
      href={`#${module.id}`}
      className="group relative block overflow-hidden rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(15,23,42,0.09)]"
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${module.accent}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {module.label}
          </p>
          <h3 className="mt-2 text-[1.6rem] font-black tracking-tight text-slate-950">
            {module.name}
          </h3>
        </div>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br ${module.accent} text-white shadow-lg ${module.glow}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
        {module.description}
      </p>

      <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Business outcome
        </p>
        <p className="mt-2 text-sm font-semibold leading-7 text-slate-900">
          {module.outcome}
        </p>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
        Explore module
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function EcosystemOverviewSection() {
  return (
    <section id="ecosystem" className="scroll-mt-28 py-20">
      <div className={containerClass}>
        <SectionHeading
          eyebrow="Ecosystem Overview"
          title="Five connected products. One employer operating layer."
          description="SAASA B2E combines hiring, workforce operations, payroll, CRM, and executive reporting so teams can move faster without stitching together separate tools."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2 xl:grid-cols-5">
          {employerModules.map((module) => (
            <EcosystemCard key={module.id} module={module} />
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Training continuity
            </p>
            <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950">
              LMS signals stay connected to performance and workforce planning.
            </h3>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              Skill gaps can trigger learning recommendations, training records stay visible, and
              CommandIQ can read that growth data alongside hiring, payroll, and people operations.
            </p>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-slate-950 px-6 py-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300">
              Why it matters
            </p>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-200">
              Hiring, onboarding, development, payroll closure, CRM follow-through, and leadership reporting
              all stay inside the same operating story.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyCompaniesNeedThisSection() {
  return (
    <section className="py-20">
      <div className={containerClass}>
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[36px] border border-rose-100 bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-rose-500">
              Why companies need this
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Disconnected tools create invisible operating drag.
            </h2>
            <div className="mt-7 space-y-3">
              {employerProblems.slice(0, 5).map((problem) => (
                <div
                  key={problem}
                  className="flex gap-3 rounded-[22px] border border-slate-200 bg-slate-50/90 px-4 py-3.5"
                >
                  <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <p className="text-sm font-medium leading-7 text-slate-700">
                    {problem}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] bg-slate-950 p-8 text-white shadow-[0_22px_60px_rgba(15,23,42,0.16)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300">
              The SAASA B2E answer
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight">
              From manpower request to payroll closure, with CRM and decision visibility built in.
            </h2>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-300">
              SAASA B2E replaces fragmented workflows with one company-facing system built for
              modern employers, HR teams, recruiters, operations leaders, payroll teams, and founders.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {employerSolutions.map((solution) => (
                <div
                  key={solution}
                  className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-sky-300" />
                    <p className="text-sm font-medium leading-7 text-slate-200">
                      {solution}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {employerPlatformSignals.slice(0, 5).map((signal) => {
                const Icon = signal.icon;

                return (
                  <div
                    key={signal.label}
                    className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <div className="flex items-center gap-2 text-slate-400">
                      <Icon className="h-4 w-4 text-sky-300" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                        {signal.label}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-bold text-white">
                      {signal.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeepDiveShowcase({ module }: { module: DeepDiveModule }) {
  const Icon = module.icon;
  const personality = modulePersonality[module.id as keyof typeof modulePersonality];

  return (
    <div
      className={`rounded-[34px] border border-slate-200 bg-gradient-to-br ${module.surface} p-5 shadow-[0_22px_60px_rgba(15,23,42,0.08)] sm:p-6`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br ${module.accent} text-white shadow-lg`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {module.name}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Connected workflow design
            </p>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
          {module.label}
        </span>
      </div>

      <div className="mt-5 rounded-[26px] border border-slate-200 bg-white/90 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {personality.eyebrow}
            </p>
            <p className="mt-2 text-sm font-semibold leading-7 text-slate-900">
              {personality.summary}
            </p>
          </div>
          <div
            className={`hidden rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white sm:inline-flex ${module.accent}`}
          >
            {module.label}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {personality.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {module.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[22px] border border-slate-200 bg-white/90 px-4 py-4 shadow-sm"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {metric.label}
            </p>
            <p className="mt-3 text-xl font-black text-slate-950">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[26px] border border-slate-200 bg-white/90 p-5 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Workflow
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {module.workflow.map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
                {step}
              </span>
              {index !== module.workflow.length - 1 ? (
                <MoveRight className="h-4 w-4 text-slate-400" />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[26px] border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Operational coverage
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {module.capabilities.slice(3).map((capability) => (
              <span
                key={capability}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold tracking-[0.05em] text-slate-700"
              >
                {capability}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300">
            AI + control note
          </p>
          <p className="mt-4 text-base font-semibold leading-8 text-white">
            {module.insight}
          </p>
          <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Business outcome
            </p>
            <p className="mt-2 text-sm font-medium leading-7 text-slate-200">
              {module.outcome}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDeepDiveSection() {
  return (
    <section id="modules" className="scroll-mt-28 py-20">
      <div className={containerClass}>
        <SectionHeading
          eyebrow="Product Deep Dive"
          title="Designed as one business system, not five isolated software tabs."
          description="Each module solves a clear business function, but the real value shows up in the handoffs: hiring into onboarding, attendance into payroll, CRM into reporting, and skill gaps into learning action."
        />

        <div className="mt-14 space-y-12">
          {employerDeepDiveModules.map((module, index) => (
            <div
              key={module.id}
              id={module.id}
              className="scroll-mt-28 grid items-center gap-8 lg:grid-cols-2"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm">
                  {module.kicker}
                </div>
                <h3 className="mt-6 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  {module.headline}
                </h3>
                <p className="mt-4 text-base font-medium leading-8 text-slate-600">
                  {module.description}
                </p>

                <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Business outcome
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-7 text-slate-900">
                    {module.outcome}
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {module.capabilities.slice(0, 3).map((capability) => (
                    <div
                      key={capability}
                      className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#28A8DF]" />
                        <p className="text-sm font-medium leading-7 text-slate-700">
                          {capability}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <DeepDiveShowcase module={module} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConnectedBusinessFlowSection() {
  return (
    <section id="connected-flow" className="scroll-mt-28 py-20">
      <div className={containerClass}>
        <SectionHeading
          eyebrow="Connected Business Flow"
          title="Lead to analyze. One operational chain."
          description="The ecosystem works because every module hands context forward. Demand enters, hiring closes, employees move into operations, payroll runs with live inputs, and leadership sees the whole picture in one command layer."
        />

        <div className="mt-12 rounded-[36px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="grid gap-3 xl:grid-cols-7">
            {connectedBusinessFlow.map((step, index) => (
              <div key={step.title} className="flex items-stretch gap-4 xl:block">
                <div className="flex min-w-[56px] flex-col items-center xl:mb-4 xl:flex-row xl:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white shadow-lg">
                    {index + 1}
                  </div>
                  {index !== connectedBusinessFlow.length - 1 ? (
                    <div className="ml-0 mt-3 h-full w-px bg-gradient-to-b from-[#28A8DF] to-slate-200 xl:ml-4 xl:mt-0 xl:h-px xl:flex-1 xl:w-auto" />
                  ) : null}
                </div>
                <div className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-4 xl:h-full">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Stage {index + 1}
                  </p>
                  <h3 className="mt-3 text-xl font-black text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-950 px-5 py-4 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300">
              Workforce improvement loop
            </p>
            <p className="mt-2 text-sm font-medium leading-7 text-slate-200">
              Skill-gap signals and training records can feed learning recommendations, improve employee growth visibility,
              and flow back into CommandIQ for stronger hiring and workforce decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleBasedControlSection() {
  return (
    <section id="roles" className="scroll-mt-28 py-20">
      <div className={containerClass}>
        <div className="grid gap-8 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[34px] bg-slate-950 p-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300">
              Role-based control
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight">
              Visibility for every role. Exposure only where it belongs.
            </h2>
            <p className="mt-4 text-base font-medium leading-8 text-slate-300">
              Give owners, HR, recruiters, managers, finance, and employees the exact control they need
              without losing auditability or company data isolation.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Role-based access and functional control",
                "Founder visibility across hiring, people ops, payroll, CRM, and training signals",
                "Audit trails with company data isolation built in",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-sky-300" />
                  <p className="text-sm font-medium leading-7 text-slate-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {employerRoles.map((role) => {
              const Icon = role.icon;

              return (
                <article
                  key={role.title}
                  className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-sky-50 text-[#28A8DF] shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">
                    {role.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                    {role.summary}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function AiLayerSection() {
  return (
    <section className="py-20">
      <div className={containerClass}>
        <div className="overflow-hidden rounded-[38px] border border-slate-200 bg-slate-950 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="border-b border-white/10 p-7 lg:border-b-0 lg:border-r">
              <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                AI layer
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
                Useful AI, not ornamental AI.
              </h2>
              <p className="mt-4 text-base font-medium leading-8 text-slate-300">
                SAASA B2E applies AI where it reduces repetitive work or improves decision quality:
                sharper JDs, faster shortlists, payroll checks, practical workforce signals, and
                learning recommendations tied to skill gaps.
              </p>

              <div className="mt-6 rounded-[26px] border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Why this feels credible
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "AI where it reduces repetitive operational work",
                    "Human approval where governance still matters",
                    "Signals tied to real workflows, records, and business outcomes",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-sky-300" />
                      <p className="text-sm font-medium leading-7 text-slate-200">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-7 sm:grid-cols-2 xl:grid-cols-3">
              {employerAiFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white/10 text-sky-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm font-medium leading-7 text-slate-300">
                      {feature.copy}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntegrationsSection() {
  return (
    <section id="integrations" className="scroll-mt-28 py-20">
      <div className={containerClass}>
        <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr]">
          <SectionHeading
            eyebrow="Integrations and Readiness"
            title="Built for operations, not just demos."
            description="SAASA B2E is designed to sit inside real company workflows with communication channels, finance systems, biometric devices, mobile usage, APIs, and export-ready reporting."
          />

          <div className="rounded-[34px] border border-slate-200 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Operational trust layer
            </p>
            <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
              Readiness across communication, finance, devices, and exports.
            </h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {employerIntegrationGroups.map((group) => {
                const Icon = group.icon;

                return (
                  <article
                    key={group.title}
                    className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white text-[#28A8DF] shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="mt-4 text-lg font-black text-slate-950">
                      {group.title}
                    </h4>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold tracking-[0.05em] text-slate-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 rounded-[26px] border border-slate-200 bg-slate-950 px-5 py-5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300">
                Enterprise confidence
              </p>
              <p className="mt-3 text-sm font-medium leading-7 text-slate-200">
                Role-based access, audit trails, company data isolation, exportable reports,
                payroll visibility, and connected mobile usage help the platform stay operationally
                credible beyond the sales narrative.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileCompanionSection() {
  return (
    <section className="py-20">
      <div className={containerClass}>
        <div className="grid items-center gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-[36px] border border-slate-200 bg-white p-5 shadow-[0_22px_55px_rgba(15,23,42,0.1)]">
              <div className="mx-auto w-full max-w-[17rem] rounded-[34px] border border-slate-200 bg-slate-950 p-3 shadow-2xl">
                <div className="rounded-[28px] bg-white p-4">
                  <div className="mx-auto h-1.5 w-16 rounded-full bg-slate-200" />
                  <div className="mt-4 rounded-[24px] bg-sky-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">
                      Mobile companion
                    </p>
                    <p className="mt-2 text-base font-black text-slate-950">
                      Approvals, attendance, tasks, and payroll visibility anywhere.
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {[
                      "Recruiter: interview slots synced",
                      "Manager: 4 leave approvals",
                      "Finance: payroll run reminder",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Mobile Companion"
              title="One connected experience across desktop and mobile."
              description="Approvals, attendance, records, payroll visibility, alerts, and self-service actions do not have to wait for someone to return to a laptop."
            />

            <div className="mt-7 grid gap-3">
              {employerMobileHighlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm"
                >
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#28A8DF]" />
                    <p className="text-sm font-medium leading-7 text-slate-700">
                      {highlight}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section id="final-cta" className="scroll-mt-28 py-20">
      <div className={containerClass}>
        <div className="overflow-hidden rounded-[42px] border border-slate-200 bg-[linear-gradient(135deg,#eff8ff_0%,#ffffff_52%,#fff8ef_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="grid gap-8 p-8 lg:grid-cols-[0.96fr_1.04fr] lg:p-10">
            <div className="max-w-xl">
              <div className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm">
                Final CTA
              </div>
              <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Give employers one connected system for hiring, operations, payroll, CRM, analytics, and learning continuity.
              </h2>
              <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-slate-600">
                SAASA B2E is built for HR heads, recruiters, operations teams, payroll leaders,
                managers, and founders who want sharper control without juggling disconnected tools.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  "Recruit to payroll continuity",
                  "Role-based control",
                  "Training intelligence",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300">
                Ready for a live walkthrough
              </p>
              <h3 className="mt-3 text-3xl font-black tracking-tight">
                Book a demo around your employer workflow.
              </h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "See RecruitOS, PeopleCore, PayFlow, FlowCRM, and CommandIQ in one flow",
                  "Review founder, HR, recruiter, finance, and manager visibility",
                  "Understand LMS continuity from skill gaps to learning action",
                  "Discuss integrations, mobile usage, and operational rollout",
                ].map((item) => (
                  <div key={item} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-sky-300" />
                      <p className="text-sm font-medium leading-7 text-slate-200">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <a href={demoHref} className={primaryCtaClass}>
                  Book Demo
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href={talkHref} className={secondaryCtaClass}>
                  Talk to Our Team
                </a>
                <Link href="#ecosystem" className={secondaryCtaClass}>
                  Explore the SAASA Ecosystem
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmployerFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className={`${containerClass} py-14`}>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/SAASA%20Logo.png"
                alt="SAASA B2E"
                width={132}
                height={36}
                className="h-8 w-auto"
              />
              <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                For Employers
              </span>
            </Link>
            <p className="mt-5 text-sm font-medium leading-7 text-slate-600">
              SAASA B2E is the employer-facing AI-powered HRMS ecosystem for recruitment,
              people operations, payroll, CRM, and executive decision intelligence.
            </p>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
              Ecosystem
            </p>
            <div className="mt-4 space-y-3">
              {employerModules.map((module) => (
                <Link
                  key={module.id}
                  href={`#${module.id}`}
                  className="block text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
                >
                  {module.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
              Explore
            </p>
            <div className="mt-4 space-y-3">
              <Link href="#connected-flow" className="block text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950">
                Connected flow
              </Link>
              <Link href="#roles" className="block text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950">
                Role-based access
              </Link>
              <Link href="#integrations" className="block text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950">
                Integrations and readiness
              </Link>
              <Link href="/" className="block text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950">
                Back to Job Portal
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
              Contact
            </p>
            <div className="mt-4 space-y-3">
              <a href={demoHref} className="block text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950">
                Book a demo
              </a>
              <a href={talkHref} className="block text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950">
                Talk to our team
              </a>
              <a href="mailto:support@saasab2e.com" className="block text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950">
                support@saasab2e.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>SAASA B2E for Employers. Built for modern companies running people operations with clarity.</p>
          <p>{new Date().getFullYear()} SAASA B2E. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function EmployerLandingPage() {
  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-950">
      <EmployerHeader />
      <main>
        <HeroSection />
        <TrustBandSection />
        <EcosystemOverviewSection />
        <WhyCompaniesNeedThisSection />
        <ProductDeepDiveSection />
        <ConnectedBusinessFlowSection />
        <RoleBasedControlSection />
        <AiLayerSection />
        <IntegrationsSection />
        <MobileCompanionSection />
        <FinalCtaSection />
      </main>
      <EmployerFooter />
    </div>
  );
}
