"""
URL patterns for clubs app.
"""
from django.urls import path
# from clubs.views import ClubListView, ClubDetailView, ClubsByCreatorView

# app_name = 'clubs'

# urlpatterns = [
#     # List and create clubs
#     path('', ClubListView.as_view(), name='club-list'),
    
#     # Retrieve, update, delete specific club
#     path('<int:club_id>/', ClubDetailView.as_view(), name='club-detail'),
    
#     # Get clubs by creator
#     path('creator/<int:user_id>/', ClubsByCreatorView.as_view(), name='clubs-by-creator'),
    
# ]
from django.urls import path, include
from Users.views import (
    join_club_request,
    # ADD THESE 4 IMPORTS  
    approve_member_request, 
    reject_member_request
 
)

from clubs.views import (
    create_club, get_clubs, get_club, delete_club,
    get_club_members, update_club
)

urlpatterns = [
    path("create/", create_club, name="create-club"),
    path("", get_clubs, name="get-clubs"),
    path("<int:club_id>/", get_club, name="get-club"),
    path("<int:club_id>/delete/", delete_club, name="delete-club"),
    path("<int:club_id>/join/", join_club_request, name="join-club"),  
    path("<int:club_id>/members/", get_club_members),  # Updated for AdminDashboard
    # path("<int:club_id>/events/", include("Events.urls")),
    path('<int:club_id>/update/', update_club, name='update_club'),
    
    # ADD THESE NEW URLS ↓
    path("<int:club_id>/approve-member/<int:member_id>/", approve_member_request, name="approve-member"),
    path("<int:club_id>/reject-member/<int:member_id>/", reject_member_request, name="reject-member"),
   
]
