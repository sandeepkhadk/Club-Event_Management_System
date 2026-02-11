# from django.shortcuts import render
# """
# Views for Club management API.
# Uses raw SQL through ClubService.
# """
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from clubs.services import ClubService
# from clubs.serializers import ClubSerializer, ClubUpdateSerializer
# import logging

# logger = logging.getLogger(__name__)


# class ClubListView(APIView):
#     """
#     API view for listing all clubs and creating new clubs.
    
#     GET /api/clubs/ - List all clubs
#     POST /api/clubs/ - Create a new club
#     """
    
#     def get(self, request):
#         """
#         Retrieve all clubs with optional pagination and search.
#         """
#         try:
#             # Get query parameters
#             skip = int(request.query_params.get('skip', 0))
#             limit = int(request.query_params.get('limit', 100))
#             search = request.query_params.get('search', None)
            
#             # Validate pagination parameters
#             if skip < 0:
#                 skip = 0
#             if limit <= 0 or limit > 100:
#                 limit = 100
            
#             # Get clubs
#             if search:
#                 clubs = ClubService.search_clubs(search)
#             else:
#                 clubs = ClubService.get_all_clubs(skip=skip, limit=limit)
            
#             # Get total count
#             total_count = ClubService.get_clubs_count()
            
#             # Serialize data
#             serializer = ClubSerializer([club.to_dict() for club in clubs], many=True)
            
#             return Response({
#                 'success': True,
#                 'count': len(clubs),
#                 'total': total_count,
#                 'data': serializer.data
#             }, status=status.HTTP_200_OK)
            
#         except Exception as e:
#             logger.error(f"Error retrieving clubs: {str(e)}")
#             return Response({
#                 'success': False,
#                 'error': str(e)
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#     def post(self, request):
#         """
#         Create a new club.
#         """
#         try:
#             # Validate input data
#             serializer = ClubSerializer(data=request.data)
#             if not serializer.is_valid():
#                 return Response({
#                     'success': False,
#                     'errors': serializer.errors
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Create club
#             club = ClubService.create_club(serializer.validated_data)
            
#             # Serialize response
#             response_serializer = ClubSerializer(club.to_dict())
            
#             return Response({
#                 'success': True,
#                 'message': 'Club created successfully',
#                 'data': response_serializer.data
#             }, status=status.HTTP_201_CREATED)
            
#         except ValueError as e:
#             return Response({
#                 'success': False,
#                 'error': str(e)
#             }, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             logger.error(f"Error creating club: {str(e)}")
#             return Response({
#                 'success': False,
#                 'error': 'An error occurred while creating the club'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class ClubDetailView(APIView):
#     """
#     API view for retrieving, updating, and deleting a specific club.
#     """
    
#     def get(self, request, club_id):
#         """Retrieve a single club by ID."""
#         try:
#             club = ClubService.get_club_by_id(club_id)
            
#             if not club:
#                 return Response({
#                     'success': False,
#                     'error': f'Club with ID {club_id} not found'
#                 }, status=status.HTTP_404_NOT_FOUND)
            
#             serializer = ClubSerializer(club.to_dict())
            
#             return Response({
#                 'success': True,
#                 'data': serializer.data
#             }, status=status.HTTP_200_OK)
            
#         except Exception as e:
#             logger.error(f"Error retrieving club {club_id}: {str(e)}")
#             return Response({
#                 'success': False,
#                 'error': 'An error occurred while retrieving the club'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#     def put(self, request, club_id):
#         """Fully update a club."""
#         return self._update_club(request, club_id, partial=False)
    
#     def patch(self, request, club_id):
#         """Partially update a club."""
#         return self._update_club(request, club_id, partial=True)
    
#     def _update_club(self, request, club_id, partial=False):
#         """Internal method to handle club updates."""
#         try:
#             # Check if club exists
#             existing_club = ClubService.get_club_by_id(club_id)
#             if not existing_club:
#                 return Response({
#                     'success': False,
#                     'error': f'Club with ID {club_id} not found'
#                 }, status=status.HTTP_404_NOT_FOUND)
            
#             # Validate input data
#             if partial:
#                 serializer = ClubUpdateSerializer(data=request.data)
#             else:
#                 serializer = ClubSerializer(data=request.data)
            
#             if not serializer.is_valid():
#                 return Response({
#                     'success': False,
#                     'errors': serializer.errors
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Update club
#             updated_club = ClubService.update_club(club_id, serializer.validated_data)
            
#             if not updated_club:
#                 return Response({
#                     'success': False,
#                     'error': f'Club with ID {club_id} not found'
#                 }, status=status.HTTP_404_NOT_FOUND)
            
#             # Serialize response
#             response_serializer = ClubSerializer(updated_club.to_dict())
            
#             return Response({
#                 'success': True,
#                 'message': 'Club updated successfully',
#                 'data': response_serializer.data
#             }, status=status.HTTP_200_OK)
            
#         except ValueError as e:
#             return Response({
#                 'success': False,
#                 'error': str(e)
#             }, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             logger.error(f"Error updating club {club_id}: {str(e)}")
#             return Response({
#                 'success': False,
#                 'error': 'An error occurred while updating the club'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#     def delete(self, request, club_id):
#         """Delete a club by ID."""
#         try:
#             deleted = ClubService.delete_club(club_id)
            
#             if not deleted:
#                 return Response({
#                     'success': False,
#                     'error': f'Club with ID {club_id} not found'
#                 }, status=status.HTTP_404_NOT_FOUND)
            
#             return Response({
#                 'success': True,
#                 'message': f'Club with ID {club_id} deleted successfully'
#             }, status=status.HTTP_200_OK)
            
#         except Exception as e:
#             logger.error(f"Error deleting club {club_id}: {str(e)}")
#             return Response({
#                 'success': False,
#                 'error': 'An error occurred while deleting the club'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class ClubsByCreatorView(APIView):
#     """
#     API view for retrieving all clubs created by a specific user.
#     """
    
#     def get(self, request, user_id):
#         """Retrieve all clubs created by a specific user."""
#         try:
#             clubs = ClubService.get_clubs_by_creator(user_id)
            
#             serializer = ClubSerializer([club.to_dict() for club in clubs], many=True)
            
#             return Response({
#                 'success': True,
#                 'count': len(clubs),
#                 'data': serializer.data
#             }, status=status.HTTP_200_OK)
            
#         except Exception as e:
#             logger.error(f"Error retrieving clubs for user {user_id}: {str(e)}")
#             return Response({
#                 'success': False,
#                 'error': 'An error occurred while retrieving clubs'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from Users.utils import jwt_required
from Users.tables import members

from django.http import JsonResponse
from core.db.base import SessionLocal
from .tables import clubs_table
from sqlalchemy import select, insert
from django.views.decorators.csrf import csrf_exempt
import json

# @jwt_required
@csrf_exempt
def create_club(request):
    # if request.user_payload.get("role") == "admin":
    #     return JsonResponse({"error": "Admin only"}, status=403)

    data = json.loads(request.body)

    club_name = data.get("club_name")
    description = data.get("description")
    founded_date = data.get("founded_date")
    created_by=data.get("created_by")

    if not club_name or not description:
        return JsonResponse({"error": "Missing fields"}, status=400)

    session = SessionLocal()
    try:
        session.execute(
            insert(clubs_table).values(
                club_name=club_name,
                description=description,
                founded_date=founded_date,
                # created_by=request.user_payload["user_id"]
                created_by=created_by
            )
        )
        session.commit()

        return JsonResponse(
            {"success": True, "message": "Club created successfully"},
            status=201
        )
    finally:
        session.close()

@jwt_required
def get_clubs(request):
    if request.user_payload.get("role") != "admin":
        return JsonResponse({"error": "Admin only"}, status=403)

    session = SessionLocal()
    try:
        clubs = session.execute(
            select(clubs_table).order_by(clubs_table.c.created_at.desc())
        ).mappings().all()

        return JsonResponse({"clubs": list(clubs)}, status=200)
    finally:
        session.close()

@jwt_required
def get_club(request, club_id):
    if request.user_payload.get("role") != "admin":
        return JsonResponse({"error": "Admin only"}, status=403)

    session = SessionLocal()
    try:
        club = session.execute(
            select(clubs_table).where(clubs_table.c.club_id == club_id)
        ).mappings().first()

        if not club:
            return JsonResponse({"error": "Club not found"}, status=404)

        return JsonResponse(club, status=200)
    finally:
        session.close()

@jwt_required
def delete_club(request, club_id):
    if request.user_payload.get("role") != "admin":
        return JsonResponse({"error": "Admin only"}, status=403)

    session = SessionLocal()
    try:
        exists = session.execute(
            select(clubs_table).where(clubs_table.c.club_id == club_id)
        ).first()

        if not exists:
            return JsonResponse({"error": "Club not found"}, status=404)

        session.execute(
            clubs_table.delete().where(clubs_table.c.club_id == club_id)
        )
        session.commit()

        return JsonResponse(
            {"success": True, "message": "Club deleted successfully"},
            status=200
        )
    finally:
        session.close()
