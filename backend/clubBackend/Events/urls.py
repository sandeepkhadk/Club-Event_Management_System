from django.urls import path




from Events.views import (
    create_event,
    get_all_events,
    get_club_events,
    # get_event,
    delete_event,
    join_event,
    leave_event,
    get_feed_events,
    get_global_events,
    update_event
 
)

urlpatterns = [
    path("create/", create_event, name="create-event"),
    path("<int:event_id>/delete/", delete_event, name="delete-event"),  # move above <int:club_id> if needed
    path("<int:club_id>/", get_club_events, name="club-event"),
    path("join/", join_event, name="join-event"),
    path("leave/", leave_event, name="leave-event"),
    path("all/", get_all_events, name="all-events"), 
    path("global/", get_global_events, name="global event"),
    path("visibility/", get_feed_events, name="visible"),
    path("<int:event_id>/update/", update_event, name="update-event"),
]
