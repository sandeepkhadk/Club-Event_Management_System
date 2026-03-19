import React from "react";
import useStudentDashboard from "./hooks/useStudentDashboard";
import LoadingScreen from "./components/LoadingScreen";
import DashboardHeader from "./components/DashboardHeader";
import ApplicationTracker from "./components/ApplicationTracker";
import EventTracker from "./components/EventTracker";
import MyClubs from "./components/MyClubs";
import LiveEvents from "./components/LiveEvents";
import ExploreClubs from "./components/ExploreClubs";

const StudentDashboard = () => {
  const {
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
    getClubStatus,
    handleLogout,
    handleClubJoin,
    handleJoinEvent,
    handleLeaveEvent,
    handleJoinClubEvent,
  } = useStudentDashboard();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900 antialiased">
      <DashboardHeader myProfile={myProfile} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 space-y-20">
        <ApplicationTracker myApplications={myApplications} />

        {joinedEvents.length > 0 && (
          <EventTracker
            events={events}
            joinedEvents={joinedEvents}
            user_id={user_id}
            onLeave={handleLeaveEvent}
          />
        )}

        {myClubs.length > 0 && (
          <MyClubs
            myClubs={myClubs}
            clubEvents={clubEvents}
            user_id={user_id}
            onJoinClubEvent={handleJoinClubEvent}
            onLeave={handleLeaveEvent}
          />
        )}

        <LiveEvents
          events={events}
          user_id={user_id}
          onJoin={handleJoinEvent}
          onLeave={handleLeaveEvent}
        />

        <ExploreClubs
          clubs={clubs}
          myApplications={myApplications}
          submitting={submitting}
          getClubStatus={getClubStatus}
          onJoin={handleClubJoin}
        />
      </main>
    </div>
  );
};

export default StudentDashboard;
