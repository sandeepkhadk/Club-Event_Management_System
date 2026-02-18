from django.urls import path
from .views import register_view, login_view,profile_view
from Users.views import (
    join_club_request,
    approve_request,
    reject_request,
    pending_requests,
    get_club_members,assign_role,
    remove_member,
    request_password_reset,reset_password

)


urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('profile/', profile_view, name='profile'),
    path("join-club/<int:club_id>/", join_club_request, name="join-club"),
    path("requests/", pending_requests, name="pending-requests"),
<<<<<<< Updated upstream
   path("requests/approve/<int:request_id>/", approve_request, name="approve-request"),
    path("requests/reject/<int:user_id>/", reject_request, name="reject-request"),
    path("clubs/<int:club_id>/members/", get_club_members),
=======
    path("requests/approve/<int:request_id>/", approve_request, name="approve-request"),
    path("reject/<int:request_id>/", reject_request, name="reject-request"),
    path("<int:club_id>/members/", get_club_members),
>>>>>>> Stashed changes
    path('assign-role/',assign_role),
    # urls.py
    path('<int:user_id>/remove/', remove_member, name='remove-member'),
        # Send reset email
    path("request-reset/", request_password_reset, name="request-reset"),

    # Reset password using token
    path("reset-password/", reset_password, name="reset-password"),



]