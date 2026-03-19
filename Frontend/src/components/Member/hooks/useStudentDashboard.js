import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/provider/AuthContext";
import { useUserRole } from "../../../context/hooks/useUserRole";
import apiUrl from "../../../api";

const useStudentDashboard = () => {
  const navigate = useNavigate();
  const decoded = useUserRole();
  const user_id = decoded?.user_id;
  const { token, logout } = useAuthContext();

  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [myClubs, setMyClubs] = useState([]);
  const [clubEvents, setClubEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const getClubStatus = (clubId) => {
    const application = myApplications.find(
      (app) => Number(app.club_id) === Number(clubId)
    );
    if (!application) return "available";
    const status = application.status?.toLowerCase();
    if (status === "approved") return "approved";
    if (status === "rejected") return "rejected";
    if (status === "pending") return "pending";
    return "available";
  };

  const fetchDashboardData = useCallback(async () => {
    if (!token || !user_id) return;
    setLoading(true);

    try {
      const [clubRes, eventRes, profileRes] = await Promise.all([
        fetch(`${apiUrl}clubs/`),
        fetch(`${apiUrl}events/global/`),
        fetch(`${apiUrl}users/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const clubData = await clubRes.json();
      const eventData = await eventRes.json();
      const profileData = await profileRes.json();

      setClubs(clubData.clubs || []);
      setMyProfile(profileData);

      const clubMap = {};
      (clubData.clubs || []).forEach((club) => {
        clubMap[Number(club.club_id)] = club.club_name;
      });

      const clubRequests = (profileData.applications || []).map((app) => ({
        ...app,
        club_name:
          app.club_name || clubMap[Number(app.club_id)] || "Unknown Club",
        status: app.status
          ? app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()
          : "Pending",
      }));

      setMyApplications(clubRequests);
      setMyClubs(profileData.approved_clubs || []);

      const mappedEvents = (eventData.events || []).map((e) => ({
        ...e,
        joined: e.joined_users?.includes(user_id) || false,
      }));

      setEvents(mappedEvents);

      const clubEventsMap = {};
      (profileData.approved_clubs || []).forEach((club) => {
        clubEventsMap[club.club_id] = mappedEvents.filter(
          (e) => e.club_id === club.club_id
        );
      });

      setClubEvents(clubEventsMap);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token, user_id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleClubJoin = async (club_id) => {
    const status = getClubStatus(club_id);

    if (status === "pending") return alert("Request already pending!");
    if (status === "approved") return alert("You're already a member!");
    if (!token) return alert("Not authenticated");

    setSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}users/join-club/${club_id}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send request");

      const club = clubs.find((c) => c.club_id === club_id);
      if (!club) return console.error("Club not found in state");

      const newApplication = {
        club_id: club.club_id,
        club_name: club.club_name,
        status: "Pending",
        created_at: new Date().toISOString(),
      };

      setMyApplications((prev) => [...prev, newApplication]);
      alert("✅ Request sent! Status is Pending.");
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinEvent = async (event) => {
    try {
      if (!token) throw new Error("You must be logged in.");
      const eventId = event.id || event.event_id;

      const res = await fetch(`${apiUrl}events/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to join event");
      }

      setEvents((prevEvents) =>
        prevEvents.map((e) => {
          if (e.id !== eventId && e.event_id !== eventId) return e;
          if (e.joined_users?.includes(user_id)) return e;
          return {
            ...e,
            joined_users: [...(e.joined_users || []), user_id],
            joined: true,
          };
        })
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeaveEvent = async (event) => {
    try {
      if (!token) throw new Error("You must be logged in.");
      const eventId = event.id || event.event_id;

      const res = await fetch(`${apiUrl}events/leave/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to leave event");
      }

      setEvents((prevEvents) =>
        prevEvents.map((e) => {
          if (e.id !== eventId && e.event_id !== eventId) return e;
          return {
            ...e,
            joined_users: (e.joined_users || []).filter((uid) => uid !== user_id),
            joined: false,
          };
        })
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleJoinClubEvent = async (event, clubId) => {
    try {
      if (!token) throw new Error("You must be logged in.");
      const eventId = event.id || event.event_id;

      const res = await fetch(`${apiUrl}events/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (!res.ok) throw new Error("Failed to join event");

      setClubEvents((prev) => ({
        ...prev,
        [clubId]: prev[clubId]?.map((e) =>
          e.id === eventId || e.event_id === eventId
            ? { ...e, joined: true, joined_users: [...(e.joined_users || []), user_id] }
            : e
        ),
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const joinedEvents = events.filter((e) => e.joined_users?.includes(user_id));

  return {
    // state
    clubs,
    events,
    myApplications,
    myProfile,
    myClubs,
    clubEvents,
    loading,
    submitting,
    joinedEvents,
    user_id,
    // helpers
    getClubStatus,
    // handlers
    handleLogout,
    handleClubJoin,
    handleJoinEvent,
    handleLeaveEvent,
    handleJoinClubEvent,
  };
};

export default useStudentDashboard;
