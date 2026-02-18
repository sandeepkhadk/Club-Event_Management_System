import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Info, 
  CheckCircle2, 
  ClipboardList, 
  Globe, 
  ArrowRightCircle,
  Sparkles
} from 'lucide-react';
import Navbar from './navbar';
import { useLocation } from "react-router-dom"; 

const About = () => {
  const location = useLocation();
  const showNavbar = location.pathname === '/about' || location.pathname.startsWith('/about/');

  return (
    
     
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900 antialiased">
        {showNavbar && <Navbar />}
        {/* 🔥 HERO HEADER - Glassmorphism */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-r from-slate-100 via-white to-indigo-50/50">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-indigo-500/5" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 backdrop-blur-sm border border-sky-200/50 rounded-2xl text-sm font-bold text-sky-700 mb-8 animate-fade-in-up">
              <Info className="w-4 h-4" />
              Official Campus Platform
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 bg-clip-text text-transparent leading-tight">
                  Club & Event <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text">Portal</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-lg bg-white/60 backdrop-blur-sm px-8 py-6 rounded-3xl border border-slate-200/50 shadow-xl">
                  The official system for organizing campus life. Verified clubs. Approved events. 
                  <span className="font-bold text-sky-600"> Student-first.</span>
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500/10 backdrop-blur-sm border-2 border-sky-500/20 rounded-2xl text-sky-700 font-bold text-sm hover:bg-sky-500/20 transition-all group">
                    <ShieldCheck className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    100% Official
                  </div>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 backdrop-blur-sm border-2 border-emerald-500/20 rounded-2xl text-emerald-700 font-bold text-sm hover:bg-emerald-500/20 transition-all">
                    <CheckCircle2 className="w-4 h-4" />
                    College Approved
                  </div>
                </div>
              </div>
              <div className="relative md:col-span-1">
                <div className="relative w-full h-80 md:h-96 bg-gradient-to-br from-sky-400/20 to-indigo-400/20 rounded-4xl border border-sky-200/30 backdrop-blur-xl shadow-2xl overflow-hidden animate-float">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(125,211,252,0.3),_transparent)]" />
                  <div className="absolute top-12 left-12 w-24 h-24 bg-sky-500/20 rounded-3xl blur-xl" />
                  <div className="absolute bottom-16 right-16 w-32 h-32 bg-indigo-500/20 rounded-3xl blur-xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="w-32 h-32 text-white/20 drop-shadow-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 lg:py-32 space-y-24 lg:space-y-32">
          
          {/* 🔥 PRINCIPLES CARDS */}
          <section className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-sky-500/10 backdrop-blur-sm border border-sky-200/30 rounded-3xl w-fit">
                <ClipboardList className="w-5 h-5 text-sky-600" />
                <span className="font-bold text-sm text-sky-700 uppercase tracking-wider">Our Foundation</span>
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  Built on <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">Trust</span> 
                  <span className="block text-2xl lg:text-3xl text-slate-600 font-normal mt-4">and Official Standards</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                  Every club and event is officially recognized by college administration. 
                  We maintain the highest standards so students participate in safe, 
                  organized, and meaningful activities.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 order-1 lg:order-2">
              <div className="group p-8 bg-white/60 backdrop-blur-xl border border-slate-200/40 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-sky-300/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-indigo-500/5 -translate-x-4 -skew-x-12 group-hover:translate-x-0 group-hover:skew-x-0 transition-all duration-700 opacity-0 group-hover:opacity-100" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-500 text-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 group-hover:scale-110 transition-all duration-300">
                    <Globe className="w-7 h-7 drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-sky-600 transition-colors">Official Platform</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Centralized directory of all college-recognized student organizations
                  </p>
                </div>
              </div>
              
              <div className="group p-8 bg-white/60 backdrop-blur-xl border border-slate-200/40 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-300/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 -translate-x-4 -skew-x-12 group-hover:translate-x-0 group-hover:skew-x-0 transition-all duration-700 opacity-0 group-hover:opacity-100" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 group-hover:scale-110 transition-all duration-300">
                    <ShieldCheck className="w-7 h-7 drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">College Approved</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    All activities meet official college safety and organization standards
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 🔥 STUDENT FEATURES - 2 ITEMS ONLY */}
          <section>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-4xl shadow-2xl mb-8 backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
                <span className="text-xl font-black uppercase tracking-widest">Student First</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                Simple. Fast. <span className="text-transparent bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text">Reliable.</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {[
                { icon: Users, title: "Browse Clubs", desc: "Discover all college-recognized organizations in one place", color: "sky" },
                { icon: CheckCircle2, title: "Instant Registration", desc: "One-click signup for workshops, seminars, and campus events", color: "emerald" }
              ].map(({ icon: Icon, title, desc, color }, i) => (
                <div key={i} className="group p-12 lg:p-16 text-center transition-all duration-500 hover:-translate-y-6 lg:hover:-translate-y-8">
                  <div className={`w-28 h-28 lg:w-32 lg:h-32 mx-auto mb-10 bg-gradient-to-r from-${color}-400 to-${color}-500 text-white rounded-4xl shadow-2xl lg:shadow-3xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_35px_60px_-15px_rgba(59,130,246,0.5)] transition-all duration-700 mx-auto`}>
                    <Icon className="w-12 lg:w-14 h-12 lg:h-14 drop-shadow-2xl" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors leading-tight">{title}</h3>
                  <p className="text-slate-600 text-xl lg:text-2xl leading-relaxed px-4">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 🔥 APPROVAL PROCESS - SIMPLIFIED */}
          <section className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 rounded-4xl p-16 lg:p-24 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(125,211,252,0.1),transparent)]" />
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-sky-500/20 backdrop-blur-sm border-2 border-sky-500/30 rounded-3xl text-sky-300 font-bold text-lg mb-8">
                  <ClipboardList className="w-5 h-5" />
                  How We Work
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
                  Official <span className="text-transparent bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text drop-shadow-2xl">Process</span>
                </h2>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  From club registration to event launch, everything follows college protocol
                </p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
                {[
                  { n: "01", t: "Club Sync", d: "Official clubs registered in central system", icon: Users },
                  { n: "02", t: "Event Plan", d: "Club leaders submit proposals", icon: ClipboardList },
                  { n: "03", t: "Admin Review", d: "College administration approves", icon: ShieldCheck },
                  { n: "04", t: "Live Launch", d: "Events published to student calendar", icon: CheckCircle2 }
                ].map((step, i) => (
                  <div key={i} className="group relative text-center transition-all duration-700 hover:scale-105">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 backdrop-blur-sm border-2 border-sky-400/30 rounded-3xl flex items-center justify-center group-hover:bg-sky-500/40 group-hover:border-sky-400 group-hover:shadow-2xl transition-all duration-500">
                      <step.icon className="w-8 h-8 text-sky-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-black text-sky-400 mb-4 group-hover:text-sky-300 transition-colors">{step.n}</div>
                    <h4 className="text-xl font-black text-white mb-3 group-hover:text-sky-300 transition-colors">{step.t}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.d}</p>
                    {i < 3 && (
                      <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block">
                        <div className="w-20 h-1 bg-gradient-to-r from-sky-400/50 to-indigo-400/50 rounded-full group-hover:w-24 transition-all duration-500" />
                        <ArrowRightCircle className="w-8 h-8 text-sky-500/50 group-hover:text-sky-400 group-hover:scale-110 transition-all" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 🔥 CTA FOOTER */}
          <section className="text-center py-24">
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
                Ready to <span className="text-transparent bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text">Connect</span>?
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-10">
                Join verified clubs and stay connected to campus opportunities.
              </p>
              <div className="inline-flex items-center gap-4 p-1 bg-gradient-to-r from-slate-100 to-slate-200 rounded-3xl backdrop-blur-sm shadow-xl">
                <a href="/clubs" className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-black text-lg uppercase tracking-widest rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-sky-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                  <span className="relative flex items-center gap-3">
                    <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Explore Clubs
                  </span>
                </a>
              </div>
            </div>
          </section>
        </div>

      </div>
   
  );
};

export default About;
