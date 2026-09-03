"use client";
import React from 'react';
import { Mail, Zap, Shield, BarChart, ArrowRight } from 'lucide-react';

export default function Home() {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/google`;

  return (
    <main className="min-h-screen bg-brand-base flex flex-col font-body selection:bg-accent-primary/20">
      
      {/* Navigation */}
      <nav className="w-full border-b border-brand-border bg-brand-surface sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-accent-primary flex items-center justify-center text-white font-bold">
              R
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ReachInbox</span>
          </div>
          <div className="flex gap-4">
            <a href="#features" className="hidden md:flex items-center text-sm font-medium text-text-muted hover:text-text-base transition-colors">Features</a>
            <a href="#how-it-works" className="hidden md:flex items-center text-sm font-medium text-text-muted hover:text-text-base transition-colors">How it works</a>
            <a 
              href={loginUrl}
              className="px-4 py-2 bg-accent-primary text-white text-sm font-medium rounded-md hover:bg-accent-primary/90 transition-colors shadow-sm"
            >
              Sign In
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 pt-24 pb-32 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-accent-primary/5 to-transparent pointer-events-none -z-10 rounded-full blur-3xl"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-xs font-semibold text-accent-primary mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
          The New Standard for Cold Email
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold text-text-base leading-[1.1] tracking-tight mb-6 max-w-4xl">
          Turn cold leads into <br />
          <span className="text-accent-primary">warm revenue.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl leading-relaxed">
          ReachInbox is the most reliable cold email infrastructure. Connect unlimited accounts, scale your outreach effortlessly, and stay out of the spam folder with intelligent routing and delays.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a 
            href={loginUrl}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white text-lg font-medium rounded-lg hover:bg-accent-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Sending for Free <ArrowRight size={20} />
          </a>
        </div>
        
        <div className="mt-10 flex items-center gap-4 text-sm text-text-muted">
          <div className="flex -space-x-2">
            {[1,2,3,4].map((i) => (
              <img key={i} className="w-8 h-8 rounded-full border-2 border-brand-surface" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
            ))}
          </div>
          <p>Join 5,000+ sales teams growing with ReachInbox</p>
        </div>
      </section>

      {/* App Interface Mockup */}
      <section className="max-w-5xl mx-auto px-4 w-full -mt-12 relative z-10 mb-32">
        <div className="bg-brand-surface rounded-xl border border-brand-border shadow-2xl p-2 md:p-4 ring-1 ring-black/5">
          <div className="bg-brand-base rounded-lg border border-brand-border h-[400px] md:h-[600px] w-full overflow-hidden flex flex-col">
            <div className="h-12 border-b border-brand-border flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center text-center opacity-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
               <h3 className="text-2xl font-display font-semibold mb-2">Beautiful, clutter-free dashboard</h3>
               <p className="text-text-muted max-w-md">Manage thousands of scheduled emails without breaking a sweat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Everything you need to scale</h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">We've built the exact tools you need to maximize deliverability and streamline your sales motion.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Mail className="text-accent-primary" size={24} />, title: 'Unlimited Sender Accounts', desc: 'Connect as many domains and mailboxes as you want. We rotate them automatically to keep you under the radar.' },
              { icon: <Shield className="text-accent-primary" size={24} />, title: 'Deliverability Protection', desc: 'Built-in pacing, hourly limits, and bounce handling protect your domain reputation permanently.' },
              { icon: <Zap className="text-accent-primary" size={24} />, title: 'Instant Slack Alerts', desc: 'Get notified in your Slack workspace the moment a sender account hits a rate limit or encounters an issue.' }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-xl bg-brand-base border border-brand-border transition-all hover:shadow-md">
                <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-base py-12 border-t border-brand-border text-center">
        <p className="text-text-muted text-sm">© {new Date().getFullYear()} ReachInbox.ai - All rights reserved.</p>
      </footer>
      
    </main>
  );
}
