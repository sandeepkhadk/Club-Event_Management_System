import React, { useState } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import { Mail, Facebook, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import emailjs from "emailjs-com"; // ← import EmailJS

const Contact = () => {
  const contactInfo = [
    { icon: Mail, title: "Email Us", value: "contact@university.edu", link: "mailto:contact@university.edu" },
    { icon: Phone, title: "WhatsApp", value: "+977 98xxxxxxxx", link: "https://wa.me/97798xxxxxxxx" },
    { icon: Facebook, title: "Facebook", value: "University Clubs NP", link: "https://facebook.com/" },
    { icon: MapPin, title: "Address", value: "Thapathali Campus, Nepal", link: "#" }
  ];

  const location = useLocation();
  const showNavbar = location.pathname === '/contact' || location.pathname.startsWith('/contact/');

  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
        "service_spfzgtc",        // Replace with your EmailJS Service ID
      "template_z2ekl0k",       // Replace with your EmailJS Template ID
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message
      },
      "vo-NyGy73Vpoqe6L9"      // ← Your Public API Key
    )
    .then(
      (result) => {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // reset form
      },
      (error) => {
        alert("Failed to send message. Please try again.");
        console.error(error);
      }
    );
  };

  return (
    <>
      {showNavbar && <Navbar />}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-4 flex flex-col">

        {/* Hero Section & Contact Cards omitted for brevity */}

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
              <p className="text-sm text-slate-600">Have questions about clubs? Drop us a quick message!</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-slate-200/60 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 bg-white/70 backdrop-blur-xl transition-all duration-300"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-slate-200/60 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 bg-white/70 backdrop-blur-xl transition-all duration-300"
              />
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-4 py-3 border-2 border-slate-200/60 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 bg-white/70 backdrop-blur-xl resize-vertical transition-all duration-300"
              />
              <button type="submit" className="group relative w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white rounded-xl font-black text-base uppercase tracking-wide shadow-xl hover:shadow-indigo-500/40 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-400">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;