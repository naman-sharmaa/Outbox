import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        <div className="prose prose-invert prose-neutral max-w-none">
          <p className="text-neutral-400 text-lg leading-relaxed mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-6">
            We collect information you provide directly to us, such as when you
            create or modify your account, request on-demand services, contact
            customer support, or otherwise communicate with us.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-6">
            We may use the information we collect about you to provide,
            maintain, and improve our services, including to facilitate
            payments, send receipts, provide products and services you request,
            develop new features, provide customer support, and send updates.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
            3. Data Security
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-6">
            We take reasonable measures to help protect information about you
            from loss, theft, misuse and unauthorized access, disclosure,
            alteration and destruction.
          </p>
        </div>
      </section>
    </main>
  );
}
