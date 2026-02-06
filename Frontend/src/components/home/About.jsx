import React from 'react';
import { ShieldCheck, ClipboardCheck, Users, Activity, Landmark, Search } from 'lucide-react';
import Navbar from './navbar';

const About = () => {
  return (
    <>
    <Navbar />
    <section className="py-20 bg-white">
     
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        
        <div className="text-center mb-16">
          <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">System Overview</h2>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Club and Event <span className="text-indigo-600">Management System.</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            The official college platform for regulating, monitoring, and participating in authorized 
            campus organizations and events.
          </p>
        </div>

        {/* Grid Layout: Preview & Aim */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* System Preview - Focused on Regulation */}
          <div className="space-y-6">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <Landmark className="mr-3 text-indigo-600" size={24} /> General Preview
              </h3>
              <p className="text-slate-600 leading-relaxed">
                This system acts as the digital record for all <b>verified college clubs</b>. It provides students 
                with a transparent directory of official organizations and a centralized calendar of 
                administration-approved events. Every activity logged here is vetted to ensure it aligns 
                with institutional standards.
              </p>
            </div>

            <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-sm">
              <h3 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center">
                <ClipboardCheck className="mr-3 text-indigo-600" size={24} /> Main Aim
              </h3>
              <p className="text-indigo-700 leading-relaxed">
                Our primary aim is to ensure <b>accountability and structured engagement</b>. By centralizing 
                club management, we help the administration verify that every event is safe, organized, 
                and productive. We aim to provide students with a secure environment to develop leadership 
                skills through recognized extracurricular activities.
              </p>
            </div>
          </div>

          {/* Pillars of the System */}
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start p-4">
              <div className="bg-blue-100 p-3 rounded-2xl mr-4 shadow-sm">
                <ShieldCheck className="text-blue-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Verified Organizations</h4>
                <p className="text-gray-500 text-sm">Only clubs officially recognized by the college board are listed and managed within the system.</p>
              </div>
            </div>

            <div className="flex items-start p-4">
              <div className="bg-purple-100 p-3 rounded-2xl mr-4 shadow-sm">
                <Activity className="text-purple-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Participation Tracking</h4>
                <p className="text-gray-500 text-sm">Maintains a digital footprint of student involvement and attendance for official recognition.</p>
              </div>
            </div>

            <div className="flex items-start p-4">
              <div className="bg-emerald-100 p-3 rounded-2xl mr-4 shadow-sm">
                <Search className="text-emerald-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Centralized Discovery</h4>
                <p className="text-gray-500 text-sm">A single source of truth for students to find upcoming workshops, seminars, and club meetings.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Workflow */}
        
        <div className="mt-16 py-12 px-8 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <h3 className="text-center text-xl font-bold text-gray-800 mb-8 uppercase tracking-widest">Administrative Flow</h3>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-indigo-600">1</div>
              <p className="text-sm font-semibold text-gray-700">Existing Club<br/>Sync</p>
            </div>
            <div className="hidden md:block h-px bg-gray-300 flex-1"></div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-indigo-600">2</div>
              <p className="text-sm font-semibold text-gray-700">Event<br/>Submission</p>
            </div>
            <div className="hidden md:block h-px bg-gray-300 flex-1"></div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 shadow-md rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-white">3</div>
              <p className="text-sm font-semibold text-gray-700">Admin<br/>Verification</p>
            </div>
            <div className="hidden md:block h-px bg-gray-300 flex-1"></div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-indigo-600">4</div>
              <p className="text-sm font-semibold text-gray-700">Public<br/>Listing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
 
};

export default About;