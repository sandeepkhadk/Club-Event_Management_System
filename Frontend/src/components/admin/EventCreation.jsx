import React, { useState } from "react";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useUserRole } from "../../context/hooks/useUserRole";
import { Calendar, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import apiUrl from "../../api";

const EventCreationForm = ({ onEventCreated, approvedHandlers = [] }) => {
  const { token } = useAuthContext();
  const decoded = useUserRole();
  
  //  ADMIN ONLY - Check decoded.clubrole === 'admin'
  const isAdmin = decoded?.club_role === 'admin';
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_datetime: "",
    end_datetime: "",
    handler_id: "",
    status: "Planned",
    visibility: "clubonly",
    max_capacity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //  HIDE FORM COMPLETELY FOR NON-ADMINS
  if (!isAdmin) {
    return null; // Completely invisible for non-admins
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    //  FINAL ADMIN CHECK
    if (!isAdmin) {
      setError("Admin access required");
      return;
    }

    if (
      !formData.title ||
      !formData.description ||
      !formData.start_datetime ||
      !formData.end_datetime ||
      !formData.handler_id
    ) {
      setError("All required fields must be filled");
      return;
    }

    if (formData.max_capacity && formData.max_capacity <= 0) {
      setError("Max capacity must be greater than 0");
      return;
    }

    if (new Date(formData.start_datetime) >= new Date(formData.end_datetime)) {
      setError("Start time must be before end time");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}events/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          ...formData,
          max_capacity: formData.max_capacity ? Number(formData.max_capacity) : null,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        setError(data.error || data.message || "Failed to create event");
      } else {
        onEventCreated(data);
        // Reset form
        setFormData({
          title: "",
          description: "",
          start_datetime: "",
          end_datetime: "",
          handler_id: "",
          status: "Planned",
          visibility: "clubonly",
          max_capacity: "",
        });
        setError("");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-6 lg:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200">
      {/* 🔥 ADMIN HEADER */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
        <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Create New Event
          </h2>
          <div className="flex items-center gap-2 mt-2 text-sm font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-xl">
            <CheckCircle className="w-4 h-4" />
            Admin Access Granted
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span className="text-rose-800 font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Event Title *
          </label>
          <input
            name="title"
            type="text"
            placeholder="e.g., Annual Chess Tournament"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50 backdrop-blur-sm text-lg font-semibold placeholder-slate-400 transition-all shadow-sm hover:shadow-md"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Description *
          </label>
          <textarea
            name="description"
            placeholder="Describe the event details, location, requirements..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50 backdrop-blur-sm resize-vertical placeholder-slate-400 transition-all shadow-sm hover:shadow-md"
            required
          />
        </div>

        {/* Event Handler */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Event Handler *
          </label>
          <select
            name="handler_id"
            value={formData.handler_id}
            onChange={handleChange}
            className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm hover:shadow-md appearance-none cursor-pointer"
            required
          >
            <option value="">Select Event Handler</option>
            {approvedHandlers.length === 0 ? (
              <option disabled>No approved handlers available</option>
            ) : (
              approvedHandlers.map((handler) => (
                <option key={handler.user_id || handler.id} value={handler.user_id || handler.id}>
                  {handler.name} ({handler.email || handler.role})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
              Start Date & Time *
            </label>
            <input
              name="start_datetime"
              type="datetime-local"
              value={formData.start_datetime}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50 backdrop-blur-sm text-lg placeholder-slate-400 transition-all shadow-sm hover:shadow-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
              End Date & Time *
            </label>
            <input
              name="end_datetime"
              type="datetime-local"
              value={formData.end_datetime}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50 backdrop-blur-sm text-lg placeholder-slate-400 transition-all shadow-sm hover:shadow-md"
              required
            />
          </div>
        </div>

        {/* Advanced Options */}
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Advanced Settings
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visibility */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                Visibility
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm hover:shadow-md"
              >
                <option value="clubonly">Club Members Only</option>
                <option value="global">Open to Everyone</option>
        
              </select>
            </div>

            {/* Max Capacity */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                Max Capacity (Optional)
              </label>
              <input
                name="max_capacity"
                type="number"
                placeholder="e.g., 100"
                value={formData.max_capacity}
                onChange={handleChange}
                min="1"
                className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
              Initial Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm hover:shadow-md"
            >
              <option value="Planned">Planned</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xl uppercase tracking-wider rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-7 h-7 animate-spin" />
              Creating Event...
            </>
          ) : (
            <>
              <Calendar className="w-7 h-7" />
              Create Event
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default EventCreationForm;
