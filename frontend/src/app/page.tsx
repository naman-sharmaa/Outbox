"use client";
import React, { useState } from "react";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Layers,
  Play,
  Mail,
  Linkedin,
  Plus,
  Minus,
} from "lucide-react";

const faqs = [
  {
    question: "What is ReachInbox?",
    answer:
      "ReachInbox is an AI-powered cold email scheduling platform designed to automate outreach, optimize deliverability, and maximize revenue. It runs in the background to send your emails perfectly paced.",
  },
  {
    question: "Can I connect multiple email accounts?",
    answer:
      "Yes, our platform supports unlimited sender accounts. Distributing your sending volume across multiple addresses is the best way to scale your campaigns while protecting your domain reputation.",
  },
  {
    question: "How does the smart follow-up sequence work?",
    answer:
      "You can chain up to 7 follow-up emails with custom time delays (e.g., wait 3 days). If a prospect replies to any of your emails, the sequence automatically halts for that specific lead to prevent awkward automated responses.",
  },
  {
    question: "Is it safe for my domain reputation?",
    answer:
      "Absolutely. Our intelligent rate limiting and distributed background workers ensure you never exceed safe hourly sending thresholds, preventing you from landing in the spam folder.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! You can start building and testing your campaigns completely for free. Once you're ready to scale your outreach, you can upgrade to a premium plan.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-neutral-800">
      <button
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="text-lg font-medium text-white group-hover:text-neutral-200 transition-colors">
          {question}
        </span>
        <span className="ml-6 flex-shrink-0 text-neutral-500 group-hover:text-white transition-colors">
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="text-neutral-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

function FAQAccordion({ faqsList }: { faqsList: typeof faqs }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col border-t border-neutral-800">
      {faqsList.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/google`;

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col font-body selection:bg-white/20 text-white relative overflow-clip">
      {/* Navigation */}
      <nav className="w-full z-50 pt-8 pb-4 absolute top-0 left-0">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#FF6347] flex items-center justify-center text-white font-bold text-xs">
              R
            </div>
            <span className="font-display font-semibold text-xl tracking-tight text-white">
              ReachInbox
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How it works
            </a>
            <a href="#faqs" className="hover:text-white transition-colors">
              FAQs
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={loginUrl}
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden md:block"
            >
              Login
            </a>
            <a
              href={loginUrl}
              className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 pt-40 pb-24 min-h-screen flex flex-col items-center justify-center text-center">
        {/* Glows behind hero text - Intense Orange and Cyan */}
        <div className="absolute top-[50%] left-[10%] w-[600px] h-[600px] bg-[#FF4500]/60 rounded-full blur-[160px] pointer-events-none z-0 animate-glow -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-[50%] right-[10%] w-[600px] h-[600px] bg-[#00E5FF]/60 rounded-full blur-[160px] pointer-events-none z-0 animate-glow-reverse -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#111111] border border-neutral-800 text-[11px] font-medium text-neutral-300 mb-10 tracking-wide">
            New Autonomous Email Scheduling Agent
          </div>

          <h1 className="text-6xl md:text-[5.5rem] font-display text-white leading-[1.0] tracking-tight mb-8">
            The AI sales platform for
            <br />
            smarter, faster revenue
            <br />
            growth
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 mb-12 max-w-2xl leading-relaxed font-light">
            Get yourself the engineer that architects, explains, tests, and
            optimizes
            <br className="hidden md:block" />— turning your ideas into
            production-ready outreach in seconds
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href={loginUrl}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Build today for free <ArrowRight size={16} />
            </a>
            <a
              href={loginUrl}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1C1C1C] text-white text-sm font-semibold rounded-xl hover:bg-[#2A2A2A] transition-all"
            >
              View Demo
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Scroll Features Container */}
      <div className="relative w-full" id="features">
        {/* Sticky Layer 1: Advanced AI Scheduling Mockup */}
        <section className="sticky top-0 h-screen w-full bg-[#09090b] flex flex-col items-center justify-center px-4 z-10 overflow-hidden">
          <div className="absolute top-[50%] left-[20%] w-[500px] h-[500px] bg-[#8B5CF6]/15 rounded-full blur-[140px] pointer-events-none z-0 -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-[50%] right-[20%] w-[500px] h-[500px] bg-[#3B82F6]/15 rounded-full blur-[140px] pointer-events-none z-0 -translate-y-1/2 translate-x-1/2" />

          <div className="max-w-[1100px] w-full bg-[#0D0D0D] rounded-xl border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-1.5 relative z-10 flex flex-col">
            <div className="bg-[#09090b] rounded-lg border border-neutral-800 h-[450px] md:h-[600px] w-full overflow-hidden flex flex-col relative">
              {/* macOS window dots */}
              <div className="h-10 border-b border-neutral-800/50 flex items-center px-4 gap-2 relative z-20 bg-[#09090b]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                <div className="ml-4 text-xs text-neutral-500 font-medium">
                  Advanced AI Scheduling Dashboard
                </div>
              </div>

              {/* Custom Video Mockup */}
              <div className="flex-1 w-full h-full relative bg-black">
                <video
                  src="/dashboard-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Layer 2: Automated Scheduling */}
        <section className="sticky top-0 h-screen w-full bg-[#0a0a0d] flex flex-col items-center justify-center px-4 z-20 border-t border-neutral-800/60 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="absolute top-[50%] right-[10%] w-[400px] h-[400px] bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none z-0 -translate-y-1/2 translate-x-1/2" />

          <div className="max-w-[1100px] mx-auto w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 shadow-lg">
                <Clock className="text-[#10B981]" size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-display text-white mb-6 leading-tight">
                Automated Scheduling Engine
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed font-light">
                Set precise delivery times across multiple accounts without
                manual intervention. Our distributed workers handle timezones
                and pacing perfectly.
              </p>
            </div>
            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-2 shadow-2xl relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                alt="Scheduling Analytics"
                className="rounded-lg w-full h-full object-cover aspect-[4/3] opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 border border-white/5 rounded-lg pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Sticky Layer 3: Follow-Up Sequences */}
        <section className="sticky top-0 h-screen w-full bg-[#0d0d11] flex flex-col items-center justify-center px-4 z-30 border-t border-neutral-800/60 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="absolute top-[50%] left-[10%] w-[400px] h-[400px] bg-[#F59E0B]/10 rounded-full blur-[120px] pointer-events-none z-0 -translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-[1100px] mx-auto w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div className="order-2 md:order-1 bg-[#111111] border border-neutral-800 rounded-xl p-2 shadow-2xl relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                alt="Sequence Workflows"
                className="rounded-lg w-full h-full object-cover aspect-[4/3] opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 shadow-lg">
                <Layers className="text-[#F59E0B]" size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-display text-white mb-6 leading-tight">
                Smart Follow-Up Sequences
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed font-light">
                Chain up to 7 follow-ups with customizable delays. Stop sending
                automatically if they reply, keeping you at the top of the inbox
                safely.
              </p>
            </div>
          </div>
        </section>

        {/* Sticky Layer 4: Infrastructure */}
        <section className="sticky top-0 h-screen w-full bg-[#0f0f13] flex flex-col items-center justify-center px-4 z-40 border-t border-neutral-800/60 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="absolute top-[50%] right-[10%] w-[400px] h-[400px] bg-[#EF4444]/10 rounded-full blur-[120px] pointer-events-none z-0 -translate-y-1/2 translate-x-1/2" />

          <div className="max-w-[1100px] mx-auto w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 shadow-lg">
                <ShieldCheck className="text-[#EF4444]" size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-display text-white mb-6 leading-tight">
                Crash-Proof Infrastructure
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed font-light">
                Powered by BullMQ and Redis idempotency, our systems ensure you
                never send a duplicate email or lose a job during a sudden
                server restart.
              </p>
            </div>
            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-2 shadow-2xl relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
                alt="Server Infrastructure"
                className="rounded-lg w-full h-full object-cover aspect-[4/3] opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter grayscale group-hover:grayscale-0"
              />
            </div>
          </div>
        </section>
      </div>

      {/* How It Works Section (Replacing the CTA Card) */}
      <section
        className="w-full relative z-50 bg-[#09090b] pt-32 pb-40 px-4 border-t border-neutral-900"
        id="how-it-works"
      >
        {/* Glows for How It Works */}
        <div className="absolute top-[50%] left-[50%] w-[800px] h-[800px] bg-[#2DD4BF]/10 rounded-full blur-[200px] pointer-events-none z-0 -translate-y-1/2 -translate-x-1/2 animate-glow" />

        <div className="max-w-[1200px] mx-auto flex flex-col items-center relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#111111] border border-neutral-800 text-[11px] font-medium text-[#2DD4BF] mb-6 tracking-wide">
            Simple 3-Step Process
          </div>
          <h2 className="text-4xl md:text-6xl font-display text-white mb-20 tracking-tight max-w-3xl leading-[1.1]">
            How ReachInbox fits into your workflow
          </h2>

          <div className="grid md:grid-cols-3 gap-8 w-full">
            {/* Step 1 */}
            <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:border-neutral-600 transition-colors">
              <div className="w-16 h-16 bg-neutral-900 rounded-full border border-neutral-700 flex items-center justify-center text-2xl font-display text-white mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Upload Audience
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Simply drag and drop your lead list. We automatically
                deduplicate, verify, and route your contacts for the safest
                delivery.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:border-neutral-600 transition-colors">
              <div className="w-16 h-16 bg-neutral-900 rounded-full border border-neutral-700 flex items-center justify-center text-2xl font-display text-white mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Craft Sequences
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Write your initial message and attach up to 7 follow-ups with
                intelligent time delays and conditional sending rules.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:border-neutral-600 transition-colors">
              <div className="w-16 h-16 bg-neutral-900 rounded-full border border-neutral-700 flex items-center justify-center text-2xl font-display text-white mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Watch it Grow
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Our infrastructure handles the rest. BullMQ dynamically queues
                jobs while protecting your hourly limits perfectly.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <a
              href={loginUrl}
              className="px-8 py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Start sending for free
            </a>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section
        className="w-full relative z-50 bg-[#09090b] py-32 px-4 border-t border-neutral-900"
        id="faqs"
      >
        <div className="max-w-[800px] mx-auto flex flex-col relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-white mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-400 text-lg">
              Everything you need to know about the product and billing.
            </p>
          </div>

          <FAQAccordion faqsList={faqs} />
        </div>
      </section>

      {/* Footer (Full featured) */}
      <footer className="w-full border-t border-neutral-900 bg-[#09090b] pt-16 pb-8 z-50 relative">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-12">
          {/* Top Footer Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {/* Column 1: Brand */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-[#FF6347] flex items-center justify-center text-white font-bold text-xs">
                  R
                </div>
                <span className="font-display font-semibold text-xl tracking-tight text-white">
                  ReachInbox
                </span>
              </div>
              <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
                The ultimate AI-powered cold email infrastructure. Built for
                reliable scale, designed for revenue.
              </p>
            </div>

            {/* Column 2: Product Links (Vertical) */}
            <div className="flex flex-col items-center md:items-start gap-4 text-sm font-medium text-neutral-400">
              <a
                href="#features"
                className="hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-white transition-colors"
              >
                How it works
              </a>
              <a href="#faqs" className="hover:text-white transition-colors">
                FAQs
              </a>
            </div>

            {/* Column 3: Legal Links (Vertical) replacing Login/SignUp */}
            <div className="flex flex-col items-center md:items-start gap-4 text-sm font-medium text-neutral-400">
              <a
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-of-service"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/security"
                className="hover:text-white transition-colors"
              >
                Security
              </a>
            </div>
          </div>

          <div className="w-full h-px bg-neutral-900"></div>

          {/* Bottom Footer Section */}
          <div className="relative flex flex-col md:flex-row items-center justify-center pt-4 mt-8">
            <p className="text-neutral-600 text-xs">
              © {new Date().getFullYear()} ReachInbox. All rights reserved.
            </p>
            <div className="flex items-center gap-5 mt-6 md:mt-0 md:absolute md:right-0">
              <a
                href="mailto:namansharma2109@gmail.com"
                className="text-neutral-500 hover:text-white transition-all hover:scale-110"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/namansharma18/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-[#0A66C2] transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
