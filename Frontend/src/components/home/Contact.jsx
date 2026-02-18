import React from "react";
import Navbar from "./navbar";
import { useLocation } from "react-router-dom";
import { 
  Mail, 
  Facebook, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Clock 
} from "lucide-react";


const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "contact@university.edu",
      link: "mailto:contact@university.edu"
    },
    {
      icon: Phone,
      title: "WhatsApp",
      value: "+977 98xxxxxxxx",
      link: "https://wa.me/97798xxxxxxxx"
    },
    {
      icon: Facebook,
      title: "Facebook",
      value: "University Clubs NP",
      link: "https://facebook.com/"
    },
    {
      icon: MapPin,
      title: "Address", 
      value: "Thapathali Campus, Nepal",
      link: "#"
    }
  ];
  
  const location = useLocation();
  const showNavbar = location.pathname === '/contact' || location.pathname.startsWith('/contact/');
  
  return (
    <>
    {showNavbar && <Navbar />}
        
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-4 flex flex-col">
    
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center py-12 mb-12 flex-grow">
         
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl px-5 py-2 rounded-2xl border border-slate-200/60 shadow-xl mb-6">
            <MessageCircle className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
              Get In Touch
            </h1>
          </div>
          <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Connect with us for club memberships, events, and campus opportunities
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {contactInfo.map((contact, index) => (
            <a
              key={index}
              href={contact.link}
              className="group relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/70 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 hover:border-indigo-300/80 transition-all duration-500 overflow-hidden h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/3 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700" />
              
              <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-indigo-300/50 group-hover:scale-105 transition-all duration-400 border-2 border-white/50 mb-4">
                <contact.icon className="w-8 h-8 text-indigo-600 group-hover:text-indigo-700 group-hover:scale-105 transition-all duration-300" />
              </div>
              
              <div className="relative z-10 space-y-2">
                <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{contact.title}</h3>
                <p className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-all duration-400">
                  {contact.value}
                </p>
                <div className="h-px w-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full group-hover:w-full transition-all duration-500" />
              </div>
            </a>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="max-w-lg mx-auto mb-16">
          <div className="bg-white/95 backdrop-blur-3xl rounded-2xl p-8 border border-slate-200/60 shadow-3xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-black text-base mb-3 shadow-xl">
                <Clock className="w-5 h-5" />
                We're Here 24/7
              </div>
              <h2 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                Send us a Message
              </h2>
              <p className="text-sm text-slate-600">
                Have questions about clubs? Drop us a quick message!
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200/60 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 bg-white/70 backdrop-blur-xl transition-all duration-300 text-sm placeholder-slate-500 shadow-lg font-medium"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200/60 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 bg-white/70 backdrop-blur-xl transition-all duration-300 text-sm placeholder-slate-500 shadow-lg font-medium"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200/60 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 bg-white/70 backdrop-blur-xl resize-vertical transition-all duration-300 text-sm placeholder-slate-500 shadow-lg font-medium"
                  placeholder="Tell us about your inquiry..."
                />
              </div>
              
              <button className="group relative w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white rounded-xl font-black text-base uppercase tracking-wide shadow-xl hover:shadow-indigo-500/40 hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-60 transition-all duration-400 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent rounded-xl blur -skew-x-12 -translate-x-4 group-hover:translate-x-0 transition-transform duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Send Message
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-3">
              📍 Serving Campus Students • 
              <span className="font-black text-indigo-600 ml-1">Est. 2026</span>
            </p>
            <div className="flex justify-center items-center gap-4 text-lg">
              <a href="mailto:contact@university.edu" title="Email" className="group p-2.5 bg-indigo-100/80 hover:bg-indigo-200 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md">
                <Mail className="w-5 h-5 text-indigo-700 group-hover:text-indigo-800" />
              </a>
              <a href="https://wa.me/97798xxxxxxxx" title="WhatsApp" className="group p-2.5 bg-green-100/80 hover:bg-green-200 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md">
                <Phone className="w-5 h-5 text-green-600 group-hover:text-green-700" />
              </a>
              <a href="https://facebook.com/universityclubsnp" title="Facebook" className="group p-2.5 bg-blue-100/80 hover:bg-blue-200 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md">
                <Facebook className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section - Full Width Dark Blue Footer */}
      <footer className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-slate-200 text-center py-6 border-t-4 border-indigo-500/30 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-medium tracking-wide">
            © {new Date().getFullYear()} Event & Club Management System. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Serving Campus Students
          </p>
        </div>
      </footer>
    </>
  );
};

export default Contact;
