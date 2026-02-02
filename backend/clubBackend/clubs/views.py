from django.shortcuts import render
"""
Views for Club management API.
Uses SQLAlchemy instead of Django ORM.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
# from clubs.database import get_db
# from clubs.services import ClubService
# from clubs.serializers import ClubSerializer, ClubUpdateSerializer
print("Import 1: database")
from clubs.database import get_db
print("Import 2: services")
from clubs.services import ClubService
print("Import 3: serializers")
from clubs.serializers import ClubSerializer, ClubUpdateSerializer
print("All imports successful!")
import logging

logger = logging.getLogger(__name__)

# Create your views here.
class ClubListView(APIView):
    """
    API view for listing all clubs and creating new clubs.
    
    GET /api/clubs/ - List all clubs
    POST /api/clubs/ - Create a new club
    """
    
    def get(self, request):
        """
        Retrieve all clubs with optional pagination and search.
        
        Query Parameters:
            - skip: Number of records to skip (default: 0)
            - limit: Maximum records to return (default: 100)
            - search: Search term for filtering clubs
        """
        db = get_db()
        try:
            # Get query parameters
            skip = int(request.query_params.get('skip', 0))
            limit = int(request.query_params.get('limit', 100))
            search = request.query_params.get('search', None)
            
            # Validate pagination parameters
            if skip < 0:
                skip = 0
            if limit <= 0 or limit > 100:
                limit = 100
            
            # Get clubs
            if search:
                clubs = ClubService.search_clubs(db, search)
            else:
                clubs = ClubService.get_all_clubs(db, skip=skip, limit=limit)
            
            # Get total count
            total_count = ClubService.get_clubs_count(db)
            
            # Serialize data
            serializer = ClubSerializer([club.to_dict() for club in clubs], many=True)
            
            return Response({
                'success': True,
                'count': len(clubs),
                'total': total_count,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error retrieving clubs: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            db.close()
    
    def post(self, request):
        """
        Create a new club.
        
        Request Body:
            - club_name (required): Name of the club
            - description (required): Description of the club
            - founded_date (optional): Founded date
            - created_by (required): User ID of creator
        """
        db = get_db()
        try:
            # Validate input data
            serializer = ClubSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create club
            club = ClubService.create_club(db, serializer.validated_data)
            
            # Serialize response
            response_serializer = ClubSerializer(club.to_dict())
            
            return Response({
                'success': True,
                'message': 'Club created successfully',
                'data': response_serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except ValueError as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating club: {str(e)}")
            return Response({
                'success': False,
                'error': 'An error occurred while creating the club'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            db.close()


class ClubDetailView(APIView):
    """
    API view for retrieving, updating, and deleting a specific club.
    
    GET /api/clubs/{id}/ - Retrieve a club
    PUT /api/clubs/{id}/ - Update a club
    PATCH /api/clubs/{id}/ - Partially update a club
    DELETE /api/clubs/{id}/ - Delete a club
    """
    
    def get(self, request, club_id):
        """
        Retrieve a single club by ID.
        """
        db = get_db()
        try:
            club = ClubService.get_club_by_id(db, club_id)
            
            if not club:
                return Response({
                    'success': False,
                    'error': f'Club with ID {club_id} not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ClubSerializer(club.to_dict())
            
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error retrieving club {club_id}: {str(e)}")
            return Response({
                'success': False,
                'error': 'An error occurred while retrieving the club'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            db.close()
    
    def put(self, request, club_id):
        """
        Fully update a club (all fields required).
        """
        return self._update_club(request, club_id, partial=False)
    
    def patch(self, request, club_id):
        """
        Partially update a club (only provided fields updated).
        """
        return self._update_club(request, club_id, partial=True)
    
    def _update_club(self, request, club_id, partial=False):
        """
        Internal method to handle club updates.
        """
        db = get_db()
        try:
            # Check if club exists
            existing_club = ClubService.get_club_by_id(db, club_id)
            if not existing_club:
                return Response({
                    'success': False,
                    'error': f'Club with ID {club_id} not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Validate input data
            if partial:
                serializer = ClubUpdateSerializer(data=request.data)
            else:
                serializer = ClubSerializer(data=request.data)
            
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Update club
            updated_club = ClubService.update_club(db, club_id, serializer.validated_data)
            
            if not updated_club:
                return Response({
                    'success': False,
                    'error': f'Club with ID {club_id} not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Serialize response
            response_serializer = ClubSerializer(updated_club.to_dict())
            
            return Response({
                'success': True,
                'message': 'Club updated successfully',
                'data': response_serializer.data
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error updating club {club_id}: {str(e)}")
            return Response({
                'success': False,
                'error': 'An error occurred while updating the club'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            db.close()
    
    def delete(self, request, club_id):
        """
        Delete a club by ID.
        """
        db = get_db()
        try:
            deleted = ClubService.delete_club(db, club_id)
            
            if not deleted:
                return Response({
                    'success': False,
                    'error': f'Club with ID {club_id} not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            return Response({
                'success': True,
                'message': f'Club with ID {club_id} deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error deleting club {club_id}: {str(e)}")
            return Response({
                'success': False,
                'error': 'An error occurred while deleting the club'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            db.close()


class ClubsByCreatorView(APIView):
    """
    API view for retrieving all clubs created by a specific user.
    
    GET /api/clubs/creator/{user_id}/ - Get clubs by creator
    """
    
    def get(self, request, user_id):
        """
        Retrieve all clubs created by a specific user.
        """
        db = get_db()
        try:
            clubs = ClubService.get_clubs_by_creator(db, user_id)
            
            serializer = ClubSerializer([club.to_dict() for club in clubs], many=True)
            
            return Response({
                'success': True,
                'count': len(clubs),
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error retrieving clubs for user {user_id}: {str(e)}")
            return Response({
                'success': False,
                'error': 'An error occurred while retrieving clubs'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            db.close()

