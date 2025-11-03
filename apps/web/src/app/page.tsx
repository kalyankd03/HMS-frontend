'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FlaskConical, Pill, Sparkles } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { BookDemoDialog } from "@/components/book-demo-dialog";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-white via-sky-50/30 to-white text-slate-900 pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute right-0 top-12 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
        </div>
        <div className="container relative mx-auto max-w-5xl px-6 py-12 lg:py-16">
          <div className="space-y-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              AI-Powered Healthcare Platform
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl sm:leading-tight lg:text-6xl">
                Transform Hospital Operations with AI Intelligence
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-slate-600 leading-relaxed">
                Thravi HMS revolutionizes hospital operations by combining automation, AI analytics, and interoperability — enabling smarter workflows across registration, pharmacy, labs, and billing.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
              <BookDemoDialog />
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-sky-700">Coming Soon in 2026</span> — Be part of our early adopter hospitals and clinics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Modules */}
      <section className="container mx-auto max-w-6xl px-6 py-20">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Intelligent modules for every department
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Thravi HMS orchestrates clinical, operational, and financial excellence with integrated, AI-first workflows.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group relative overflow-hidden rounded-2xl border-sky-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-100/50">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/0 via-sky-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="relative flex flex-row items-center gap-3 p-0 pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-200">
                <FileText className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Smart EMR</CardTitle>
            </CardHeader>
            <CardContent className="relative p-0 text-slate-600 leading-relaxed">
              Unified digital patient records across departments with real-time updates.
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-2xl border-indigo-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-100/50">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-indigo-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="relative flex flex-row items-center gap-3 p-0 pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200">
                <FlaskConical className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900"> Lab Management &amp; Pharmacy</CardTitle>
            </CardHeader>
            <CardContent className="relative p-0 text-slate-600 leading-relaxed">
            Streamlines lab testing, report generation, and pharmacy operations with unified billing and inventory — enhanced by AI-driven accuracy and automation.
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-2xl border-cyan-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-100/50">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/0 via-cyan-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="relative flex flex-row items-center gap-3 p-0 pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-200">
                <Pill className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">AI Analytics</CardTitle>
            </CardHeader>
            <CardContent className="relative p-0 text-slate-600 leading-relaxed">
              Predictive dashboards and clinical intelligence that optimize operations, track performance, and enhance patient outcomes.
            </CardContent>
          </Card>
        </div>
        <p className="mt-10 text-center text-base text-slate-600 leading-relaxed">
          Plus advanced analytics, IoT integrations, and ABDM compliance — all in one AI-driven platform.
        </p>
      </section>

      {/* Vision */}
      <section className="bg-gradient-to-b from-white to-sky-50/30">
        <div className="container mx-auto max-w-5xl space-y-10 px-6 py-20">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Our Vision</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              To empower healthcare institutions through intelligent, interoperable, and adaptive technology that enhances patient outcomes, reduces manual effort, and enables data-driven decision-making.
            </p>
          </div>
          <Card className="rounded-3xl border-sky-200 bg-gradient-to-br from-white via-sky-50/50 to-indigo-50/30 p-10 shadow-xl">
            <CardContent className="space-y-6 p-0 text-lg text-slate-700 leading-relaxed">
              <p className="text-xl font-semibold text-slate-900">
                Thravi Healthtech Private Limited is building India's next-generation AI healthcare infrastructure.
              </p>
              <p>
                We bring automation, analytics, and interoperability together so hospitals can deliver compassionate, precise, and efficient care at scale.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Countdown */}
      <section className="container mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-white to-sky-50 p-12 text-center shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-sky-600">
            Launching Soon in 2026
          </p>
          <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Be part of our early adopter hospitals and clinics
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Schedule a personalized demo and see how Thravi HMS can transform your operations
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <BookDemoDialog />
          </div>
        </div>
      </section>

      {/* AI & Analytics */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.2),transparent_50%)]" />
        <div className="container relative mx-auto max-w-5xl px-6">
          <div className="space-y-6 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-sky-300">
              AI &amp; Analytics
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              From Data to Diagnosis — Powered by AI
            </h2>
            <p className="text-xl text-sky-100 leading-relaxed">
              Thravi's AI engine summarizes lab reports, predicts patient trends, and assists clinicians in real-time for faster, more reliable care.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-sky-400/20 bg-white/5 backdrop-blur-sm p-6 text-left transition-all hover:bg-white/10 hover:border-sky-400/40">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">
                Predictive Insights
              </p>
              <p className="mt-4 text-base text-white/90 leading-relaxed">
                Forecast patient loads, admission probability, and ICU demand with machine learning.
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-400/20 bg-white/5 backdrop-blur-sm p-6 text-left transition-all hover:bg-white/10 hover:border-indigo-400/40">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-300">
                Clinical Summaries
              </p>
              <p className="mt-4 text-base text-white/90 leading-relaxed">
                AI-generated briefs consolidate diagnostics, vitals, and medication plans instantly.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-white/5 backdrop-blur-sm p-6 text-left transition-all hover:bg-white/10 hover:border-cyan-400/40">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
                Intelligent Automation
              </p>
              <p className="mt-4 text-base text-white/90 leading-relaxed">
                Trigger workflows across labs, pharmacy, and billing with smart orchestration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="container mx-auto max-w-5xl space-y-6 px-6 text-center text-sm text-slate-600">
          <div className="space-y-3">
            <p className="text-2xl font-bold text-slate-900">Thravi HMS</p>
            <p className="text-base text-slate-700">An AI-powered Hospital Management &amp; Clinical Intelligence Platform</p>
            <p className="text-slate-600">Built by Thravi Healthtech Private Limited</p>
            <p className="text-slate-600">📍 Hyderabad, India</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600">
            <span>
              Contact:{" "}
              <a href="mailto:support@thravi.in" className="font-medium text-sky-600 hover:text-sky-700 hover:underline">
                support @thravi.in
              </a>
            </span>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com" className="font-medium text-sky-600 hover:text-sky-700 hover:underline" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href="https://x.com" className="font-medium text-sky-600 hover:text-sky-700 hover:underline" target="_blank" rel="noreferrer">
                X
              </a>
              <a href="https://www.instagram.com" className="font-medium text-sky-600 hover:text-sky-700 hover:underline" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>
          <p className="text-xs text-slate-500 pt-4">
            © 2025 Thravi Healthtech Private Limited. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
    </>
  );
}
