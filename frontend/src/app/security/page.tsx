import React from "react";
import Link from "next/link";

export default function Security() {
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
          Security
        </h1>
        <div className="prose prose-invert prose-neutral max-w-none">
          <p className="text-neutral-400 text-lg leading-relaxed mb-6">
            At ReachInbox, we take the security of your data and email
            infrastructure very seriously.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
            Infrastructure Security
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-6">
            Our platform is hosted on secure, compliant cloud infrastructure. We
            utilize isolated Redis queues and robust worker systems to ensure
            that job scheduling is isolated and crash-proof.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
            Data Encryption
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-6">
            All data in transit is encrypted using TLS 1.2 or higher. Sensitive
            information at rest, including email credentials and OAuth tokens,
            are symmetrically encrypted using industry-standard AES-256
            algorithms.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-4">
            Compliance
          </h2>
          <p className="text-neutral-400 leading-relaxed mb-6">
            We adhere to strict data processing standards to ensure your
            outreach remains compliant with global security requirements.
            Regular audits are conducted on our codebase to prevent
            vulnerabilities.
          </p>
        </div>
      </section>
    </main>
  );
}
