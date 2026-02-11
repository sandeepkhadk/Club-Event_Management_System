from django.urls import path
from .views import register_view, login_view,profile_view
from Users.views import (
    join_club_request,
    approve_request,
    reject_request,
    pending_requests,
)


urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('profile/', profile_view, name='profile'),
      path("join-club/", join_club_request, name="join-club"),
    path("requests/", pending_requests, name="pending-requests"),
    path("requests/approve/", approve_request, name="approve-request"),
    path("requests/reject/", reject_request, name="reject-request"),
]