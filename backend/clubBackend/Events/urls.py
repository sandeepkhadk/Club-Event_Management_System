from django.urls import path



from django.urls import path
from Events.views import (
    create_event,
    get_all_events,
    get_club_events,
    # get_event,
    delete_event,
    join_event,
    leave_event,
    get_global_events,
    get_feed_events
)

urlpatterns = [
    path("create/", create_event, name="create-event"),
    path("", get_club_events, name="club-events"),
    # path("<int:event_id>/", get_event, name="get-event"),
    path("<int:event_id>/delete/", delete_event, name="delete-event"),
    path("join/", join_event, name="join-event"),
    path("leave/", leave_event, name="leave-event"),
    path("all/", get_all_events, name="all-events"), 
    path("global/",get_global_events,name="global event"),
    path("visibility",get_feed_events,name="visible")
]
