from django.urls import path
from .views import register_view, login_view,profile_view, users_list_view 
from Users.views import (
    join_club_request,
    approve_request,
    reject_request,
    pending_requests,
    get_club_members,assign_role,
    remove_member,
    user_clubs,
    
)


urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('profile/', profile_view, name='profile'),
    path("join-club/<int:club_id>/", join_club_request, name="join-club"),
    path("requests/", pending_requests, name="pending-requests"),
    path("requests/approve/<int:request_id>/", approve_request, name="approve-request"),
    path("reject/<int:request_id>/", reject_request, name="reject-request"),
    path("<int:club_id>/members/", get_club_members),
    path('assign-role/',assign_role),
    path('list/', users_list_view, name='users_list'),
  
    path('clubs/', user_clubs, name='user_clubs'),
    path('<int:user_id>/remove/', remove_member, name='remove-member')


]
