import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Users, 
  Info, 
  CheckCircle2, 
  ClipboardList, 
  Globe, 
  ArrowRightCircle 
} from 'lucide-react';
import Navbar from './navbar';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-slate-800 font-sans">
        
        {/* --- Header Section (Trustworthy & Official) --- */}
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-2 text-sky-600 font-bold text-sm uppercase tracking-widest mb-4">
              <Info size={18} />
              <span>General Information</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Club & Event <span className="text-sky-600">Portal</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              The official system for organizing campus life. We help students find official 
              groups and ensure all events follow college safety standards.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-16">
          
          {/* --- Information Cards --- */}
          <div className="grid md:grid-cols-2 gap-10 mb-20">
            <div className="p-8 border border-slate-100 rounded-2xl bg-white shadow-sm hover:border-sky-200 transition-colors">
              <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 mb-6">
                <Globe size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Our Platform</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                This system acts as a digital directory. You can find a list of all <b>verified clubs</b> and 
                a calendar of approved events. It is the easiest way to stay updated with campus activities.
              </p>
            </div>

            <div className="p-8 border border-slate-100 rounded-2xl bg-white shadow-sm hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Our Standards</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                We ensure that campus activities are <b>well-organized and official</b>. 
                Every event is reviewed by the college to make sure it follows rules and provides value to students.
              </p>
            </div>
          </div>

          {/* --- Features Grid --- */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <ClipboardList className="text-sky-600" /> Student Capabilities
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-sky-600 bg-sky-50 p-2 rounded-lg"><Users size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">Browse Clubs</h4>
                  <p className="text-xs text-slate-500 mt-1">View all official organizations recognized by the college board.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-sky-600 bg-sky-50 p-2 rounded-lg"><CheckCircle2 size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">Register Fast</h4>
                  <p className="text-xs text-slate-500 mt-1">Sign up for workshops and seminars with a single click.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-sky-600 bg-sky-50 p-2 rounded-lg"><Search size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">Easy Search</h4>
                  <p className="text-xs text-slate-500 mt-1">Find events by date, category, or organizing club.</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Step-by-Step Flow --- */}
          <div className="bg-slate-900 rounded-3xl p-10 text-white">
            <h3 className="text-xl font-bold mb-10 text-center uppercase tracking-widest text-slate-400">
              The Approval Process
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { n: "01", t: "Sync", d: "Clubs are registered in the system." },
                { n: "02", t: "Plan", d: "Leads submit event details." },
                { n: "03", t: "Verify", d: "Admin checks safety and rules." },
                { n: "04", t: "Launch", d: "Event goes live on the calendar." }
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="text-sky-400 font-black text-2xl mb-2">{step.n}</div>
                  <h4 className="font-bold text-white mb-1">{step.t}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{step.d}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-4 -right-4 text-slate-700">
                      <ArrowRightCircle size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Footer --- */}
        <footer className="py-12 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-medium italic">
            &copy; {new Date().getFullYear()} Official Club Management Framework
          </p>
        </footer>
      </div>
    </>
  );
};

export default About;