import React from 'react';
import { Link } from 'react-router-dom';

const DailyPoll = () => {
  return (
    <main className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-6 py-12 sm:py-16">
      <div className="max-w-lg w-full rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_rgba(0,0,0,0.35)]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_16px_40px_rgba(57,255,20,0.18)]">
            <span className="text-2xl font-black">⚡</span>
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">Daily Poll</h1>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            This feature is coming soon. Stay tuned for daily match polls and fan-powered picks.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-center">
          <p className="text-slate-300 text-base font-medium">We’re setting up a fresh daily poll experience just for you.</p>
          <p className="mt-4 text-sm text-slate-500">Check back soon for daily fixtures, player pick battles, and quick vote rounds.</p>
          <Link
            to="/"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-950 transition duration-300 hover:brightness-110"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default DailyPoll;
