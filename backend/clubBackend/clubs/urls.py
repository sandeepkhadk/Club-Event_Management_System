"""
URL patterns for clubs app.
"""
from django.urls import path
from clubs.views import ClubListView, ClubDetailView, ClubsByCreatorView

app_name = 'clubs'

urlpatterns = [
    # List and create clubs
    path('', ClubListView.as_view(), name='club-list'),
    
    # Retrieve, update, delete specific club
    path('<int:club_id>/', ClubDetailView.as_view(), name='club-detail'),
    
    # Get clubs by creator
    path('creator/<int:user_id>/', ClubsByCreatorView.as_view(), name='clubs-by-creator'),
    
]