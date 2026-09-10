import React from "react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col font-body selection:bg-white/20 text-white relative">
      <nav className="w-full z-50 pt-8 pb-4">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#FF6347] flex items-center justify-center text-white font-bold text-xs">
              R
            </div>
            <span className="font-display font-semibold text-xl tracking-tight text-white">
              ReachInbox
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <section className="max-w-[800px] mx-auto px-4 py-24 w-full relative z-10">
        <h1 className="text-5xl font-display text-white mb-8 tracking-tight">
          Terms of Service
        </h1>
        <div className="prose prose-invert prose-neutral max-w-none">
          <p className="text-neutral-400 text-lg leading-relaxed mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-6">
            By accessing or using ReachInbox's services, you agree to be bound
            by these Terms. If you disagree with any part of the terms, then you
            may not access the service.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
            2. Use License
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-6">
            Permission is granted to temporarily download one copy of the
            materials (information or software) on ReachInbox's website for
            personal, non-commercial transitory viewing only.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
            3. Fair Use & Anti-Spam Policy
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-6">
            You agree to use ReachInbox strictly for legitimate outreach
            purposes and comply with all anti-spam laws, including CAN-SPAM and
            GDPR. Abuse of our infrastructure will result in immediate account
            termination.
          </p>
        </div>
      </section>
    </main>
  );
}
