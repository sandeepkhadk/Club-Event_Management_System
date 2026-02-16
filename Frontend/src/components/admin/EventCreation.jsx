import React, { useState } from "react";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useUserRole } from "../../context/hooks/useUserRole";

const EventCreationForm = ({ onEventCreated, approvedHandlers = [] }) => {
  const { token } = useAuthContext();
  const decoded = useUserRole();
  const clubId = decoded.club_id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_datetime: "",
    end_datetime: "",
    handler_id: "",
    status: "Planned",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.start_datetime ||
      !formData.end_datetime ||
      !formData.handler_id
    ) {
      setError("All fields including handler are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/events/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create event");
      } else {
        onEventCreated(data);

        // reset form
        setFormData({
          title: "",
          description: "",
          start_datetime: "",
          end_datetime: "",
          handler_id: "",
          status: "Planned",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Create Event</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        {/* Title */}
        <input
          name="title"
          type="text"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* Start */}
        <input
          name="start_datetime"
          type="datetime-local"
          value={formData.start_datetime}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* End */}
        <input
          name="end_datetime"
          type="datetime-local"
          value={formData.end_datetime}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* Handler Dropdown */}
        <select
          name="handler_id"
          value={formData.handler_id}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="">Select Event Handler</option>

          {approvedHandlers.length === 0 && (
            <option disabled>No approved members</option>
          )}

          {approvedHandlers.map((m) => (
            <option key={m.user_id} value={m.user_id}>
              {m.name} ({m.role || "member"})
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="Planned">Planned</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </section>
  );
};

export default EventCreationForm;
