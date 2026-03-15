import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/provider/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Calendar, Pencil } from "lucide-react";
import apiUrl from "../../api";

const formatForInput = (dt) => {
  if (!dt) return "";
  return new Date(dt).toISOString().slice(0, 16);
};

const EventCreationForm = ({
  onEventCreated,
  onEventUpdated,
  approvedHandlers = [],
  editEvent = null,
  isEditable = false,
}) => {
  const { token } = useAuthContext();

  let club_role = "";
  try {
    if (token) {
      const decoded = jwtDecode(token);
      club_role = decoded?.club_role || "";
    }
  } catch {
    club_role = "";
  }

  const isAdmin = club_role === "admin";
  const isHandler = club_role === "handler";
  const isEditMode = !!editEvent;
  const canRender = isAdmin || isEditMode || isEditable;

  const emptyForm = {
    title: "",
    description: "",
    start_datetime: "",
    end_datetime: "",
    handler_id: "",
    status: "Planned",
    visibility: "clubonly",
    max_capacity: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (editEvent) {
      setFormData({
        title: editEvent.title || "",
        description: editEvent.description || "",
        start_datetime: formatForInput(editEvent.start_datetime),
        end_datetime: formatForInput(editEvent.end_datetime),
        handler_id: editEvent.handler_id || "",
        status: editEvent.status || "Planned",
        visibility: editEvent.visibility || "clubonly",
        max_capacity: editEvent.max_capacity || "",
      });
      setError("");
      setSuccess("");
    } else {
      setFormData(emptyForm);
    }
  }, [editEvent?.event_id]);

  if (!canRender) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.title || !formData.description || !formData.start_datetime || !formData.end_datetime) {
      setError("All required fields must be filled");
      return;
    }

    if (!isEditMode && !formData.handler_id) {
      setError("Please select an event handler");
      return;
    }

    if (formData.max_capacity && Number(formData.max_capacity) <= 0) {
      setError("Max capacity must be greater than 0");
      return;
    }

    if (new Date(formData.start_datetime) >= new Date(formData.end_datetime)) {
      setError("Start time must be before end time");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // ───── PAYLOAD ─────
        const payload = isAdmin
          ? {
              title: formData.title,
              description: formData.description,
              start_datetime: formData.start_datetime,
              end_datetime: formData.end_datetime,
              status: formData.status,
              visibility: formData.visibility,
              max_capacity: formData.max_capacity ? Number(formData.max_capacity) : null,
            }
          : {
              start_datetime: formData.start_datetime,
              end_datetime: formData.end_datetime,
              status: formData.status,
            };

        const response = await fetch(`${apiUrl}events/${editEvent.event_id}/update/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || data.message || "Failed to update event");
        } else {
          setSuccess("Event updated successfully!");
          onEventUpdated?.({ ...editEvent, ...payload, ...(data.event || {}) });
        }
      } else {
        // CREATE MODE
        const response = await fetch(`${apiUrl}events/create/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            max_capacity: formData.max_capacity ? Number(formData.max_capacity) : null,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || data.message || "Failed to create event");
        } else {
          setSuccess("Event created successfully!");
          onEventCreated?.(data);
          setFormData(emptyForm);
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const readOnlyForHandler = isEditMode && !isAdmin;

  return (
    <section className="max-w-2xl mx-auto p-6 lg:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200">

      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
        <div className={`p-4 rounded-2xl shadow-xl bg-gradient-to-r ${isEditMode ? "from-indigo-500 to-purple-600" : "from-emerald-500 to-teal-600"}`}>
          {isEditMode ? <Pencil className="w-8 h-8 text-white" /> : <Calendar className="w-8 h-8 text-white" />}
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {isEditMode ? "Edit Event" : "Create New Event"}
        </h2>
      </div>

      {error && <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800">{error}</div>}
      {success && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input name="title" value={formData.title} onChange={handleChange} readOnly={readOnlyForHandler} className="w-full p-4 border rounded-2xl" placeholder="Event Title" required />
        <textarea name="description" value={formData.description} onChange={handleChange} readOnly={readOnlyForHandler} className="w-full p-4 border rounded-2xl" placeholder="Event Description" required />

        {!isEditMode && isAdmin && (
          <select name="handler_id" value={formData.handler_id} onChange={handleChange} className="w-full p-4 border rounded-2xl" required>
            <option value="">Select Handler</option>
            {approvedHandlers.map((h) => (
              <option key={h.user_id || h.id} value={h.user_id || h.id}>{h.name}</option>
            ))}
          </select>
        )}

        <input type="datetime-local" name="start_datetime" value={formData.start_datetime} onChange={handleChange} className="w-full p-4 border rounded-2xl" required />
        <input type="datetime-local" name="end_datetime" value={formData.end_datetime} onChange={handleChange} className="w-full p-4 border rounded-2xl" required />

        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-4 border rounded-2xl">
          <option value="Planned">Planned</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl">
          {loading ? "Processing..." : isEditMode ? "Save Changes" : "Create Event"}
        </button>
      </form>
    </section>
  );
};

export default EventCreationForm;