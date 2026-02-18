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
from Users.tables import member_requests, members,users_table
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select, insert,join,text
from django.views.decorators.csrf import csrf_exempt

import json
@csrf_exempt
@jwt_required
def create_club(request):
    if request.user_payload.get("global_role") != "superadmin":
        return JsonResponse({"error": "Super Admin only"}, status=403)

    try:
        data = json.loads(request.body)
        club_name = data.get("club_name")
        admin_email = data.get("admin_email")
        description = data.get("description") or None
        founded_date = data.get("founded_date") or None
        created_by = request.user_payload.get("user_id")

        if not club_name or not admin_email:
            return JsonResponse({"error": "Club name and admin email required"}, status=400)

        session = SessionLocal()
        try:
            # 1. Check user exists first
            user_check = session.execute(
                text("SELECT user_id FROM users WHERE email = :email"),
                {"email": admin_email}
            ).first()
            
            if not user_check:
                return JsonResponse({"error": f"User '{admin_email}' not found"}, status=404)
            
            admin_user_id = user_check[0]
            print(f"Found admin user_id: {admin_user_id}")  # DEBUG

            # 2. Insert club
            session.execute(
                text("""
                    INSERT INTO clubs (club_name, description, founded_date, created_by) 
                    VALUES (:club_name, :desc, :founded_date, :created_by)
                """),
                {
                    "club_name": club_name,
                    "desc": description,
                    "founded_date": founded_date,
                    "created_by": created_by
                }
            )

            # 3. Get new club_id (DATABASE AGONOSTIC)
            new_club_id_result = session.execute(
                text("""
                    SELECT club_id FROM clubs 
                    WHERE club_name = :club_name AND created_by = :created_by 
                    ORDER BY club_id DESC LIMIT 1
                """),
                {"club_name": club_name, "created_by": created_by}
            ).first()
            
            if not new_club_id_result:
                return JsonResponse({"error": "Failed to create club"}, status=500)
            
            new_club_id = new_club_id_result[0]
            print(f"New club_id: {new_club_id}")  # DEBUG

            # 4. Assign admin
            session.execute(
                text("""
                    INSERT INTO members (club_id, user_id, role) 
                    VALUES (:club_id, :user_id, 'admin')
                """),
                {"club_id": new_club_id, "user_id": admin_user_id}
            )

            session.commit()
            print(f"✅ Club {new_club_id} created with admin {admin_user_id}")
            
            return JsonResponse({
                "success": True, 
                "message": f"Club '{club_name}' created with admin assigned!"
            }, status=201)
        
        finally:
            session.close()

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        print(f"CREATE ERROR: {str(e)}")
        print(f"Data: {data}")
        return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)

@csrf_exempt
def get_clubs(request):
    session = SessionLocal()
    try:
        # 1️⃣ Fetch all clubs
        clubs = session.execute(
            select(clubs_table).order_by(clubs_table.c.created_at.desc())
        ).mappings().all()

        # 2️⃣ Fetch all users to map IDs → names
        users = session.execute(
            select(users_table.c.user_id, users_table.c.name)
        ).mappings().all()
        user_map = {u['user_id']: u['name'] for u in users}

        # 3️⃣ Fetch all members
        club_members = session.execute(
            select(members.c.club_id, members.c.user_id)
        ).mappings().all()

        # Map club_id → list of member names
        members_map = {}
        for m in club_members:
            club_id = m['club_id']
            user_id = m['user_id']
            members_map.setdefault(club_id, []).append(user_map.get(user_id, "Unknown"))

        # 4️⃣ Convert clubs → list of dict and attach created_by_name + members list
        clubs_list = []
        for club in clubs:
            club_dict = dict(club)
            created_by_id = club_dict.get("created_by")
            club_dict["created_by_name"] = user_map.get(created_by_id, "Unknown")
            club_dict["members_names"] = members_map.get(club_dict["club_id"], [])
            clubs_list.append(club_dict)

        return JsonResponse({"clubs": clubs_list}, status=200)

    finally:
        session.close()

# @jwt_required
# def get_club(request, club_id):
#     # if request.user_payload.get("role") != "admin":
#     #     return JsonResponse({"error": "Admin only"}, status=403)

#     session = SessionLocal()
#     try:
#         club = session.execute(
#             select(clubs_table).where(clubs_table.c.club_id == club_id)
#         ).mappings().first()


#         if not club:
#             return JsonResponse({"error": "Club not found"}, status=404)

#         return JsonResponse(club, status=200)
#     finally:
#         session.close()
        
@jwt_required
def get_club(request, club_id):
    session = SessionLocal()
    try:
        # 1️⃣ Get club info
        club_sql = """
            SELECT c.*, u.name as created_by_name 
            FROM clubs c 
            LEFT JOIN users u ON c.created_by = u.user_id 
            WHERE c.club_id = :club_id
        """
        club = session.execute(text(club_sql), {"club_id": club_id}).mappings().first()
        
        if not club:
            return JsonResponse({"error": "Club not found"}, status=404)

        return JsonResponse(dict(club), status=200)

    except Exception as e:
        print(f"🚨 CLUB RAW SQL ERROR: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
    finally:
        session.close()

        
@csrf_exempt 
@jwt_required
def delete_club(request, club_id):
    # Only SUPERADMIN can delete clubs
    print("🔍 USER PAYLOAD:", request.user_payload)  # ADD THIS LINE
    print("🔍 GLOBAL ROLE:", request.user_payload.get("global_role"))  # ADD THIS
    
    if request.user_payload.get("global_role") != "superadmin":
        print("⛔ Access denied: User is not superadmin")  # ADD THIS   
        return JsonResponse({"error": "Super Admin only"}, status=403)

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


def create_join_request(user_id, club_id):
    session = SessionLocal()
    try:
        exists_request = session.execute(
            select(member_requests).where(
                member_requests.c.user_id == user_id,
                member_requests.c.club_id == club_id,
                member_requests.c.status == "pending"
            )
        ).first()

        is_member = session.execute(
            select(members).where(
                members.c.user_id == user_id,
                members.c.club_id == club_id
            )
        ).first()

        if exists_request or is_member:
            return False, "Already requested or member"

        session.execute(
            insert(member_requests).values(
                user_id=user_id,
                club_id=club_id,
                role="member",
                status="pending"
            )
        )
        session.commit()
        return True, "Request submitted"
    finally:
        session.close()
# @jwt_required
# def get_club_members(request, club_id):
#     """
#     Get all members and pending requests of a specific club in a single array
#     """
#     session = SessionLocal()
#     try:
#         # -------- Approved Members --------
#         member_stmt = (
#             select(
#                 members.c.user_id,
#                 users_table.c.name,
#                 members.c.role,
#                 members.c.club_id
#             )
#             .join(users_table, users_table.c.user_id == members.c.user_id)
#             .where(members.c.club_id == club_id)
#         )
#         member_results = session.execute(member_stmt).mappings().all()
#         # Add status manually
#         members_list = [{**dict(row), "status": "Approved"} for row in member_results]

#         # -------- Pending Requests --------
#         request_stmt = (
#             select(
#                 member_requests.c.user_id,
#                 users_table.c.name,
#                 member_requests.c.club_id,
#                 member_requests.c.status  # e.g., 'Pending'
#             )
#             .join(users_table, users_table.c.user_id == member_requests.c.user_id)
#             .where(member_requests.c.club_id == club_id)
#         )
#         request_results = session.execute(request_stmt).mappings().all()
#         requests_list = [dict(row) for row in request_results]

#         # -------- Combine both lists --------
#         combined_list = members_list + requests_list

#         return JsonResponse({
#             "members": combined_list
#         }, status=200)

#     except SQLAlchemyError as e:
#         return JsonResponse(
#             {"success": False, "error": str(e)},
#             status=500
#         )

#     finally:
#         session.close()
@csrf_exempt
@jwt_required
def get_club_members(request, club_id):
    session = SessionLocal()
    try:
        # 1️⃣ APPROVED MEMBERS - RAW SQL
        members_sql = """
            SELECT DISTINCT m.user_id, u.name, m.role, m.club_id, 'Approved' as status
            FROM members m
            LEFT JOIN users u ON m.user_id = u.user_id 
            WHERE m.club_id = :club_id
        """
        member_results = session.execute(text(members_sql), {"club_id": club_id}).mappings().all()

        # 2️⃣ PENDING REQUESTS - RAW SQL  
        requests_sql = """
            SELECT DISTINCT r.user_id, u.name, r.club_id, r.status, 'Pending' as status
            FROM member_requests r
            LEFT JOIN users u ON r.user_id = u.user_id 
            WHERE r.club_id = :club_id AND r.status = 'pending'
        """
        request_results = session.execute(text(requests_sql), {"club_id": club_id}).mappings().all()

        # 3️⃣ COMBINE RESULTS
        all_members = []
        for row in member_results + request_results:
            all_members.append(dict(row))

        return JsonResponse({"members": all_members}, status=200)

    except Exception as e:
        print(f"🚨 MEMBERS RAW SQL ERROR: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
    finally:
        session.close()

@csrf_exempt
@jwt_required
def update_club(request, club_id):
    # Only SUPERADMIN can update
    if request.user_payload.get("global_role") != "superadmin":
        return JsonResponse({"error": "Super Admin only"}, status=403)

    try:
        data = json.loads(request.body)
        club_name = data.get("club_name")
        description = data.get("description") 
        founded_date = data.get("founded_date")
        admin_email = data.get("admin_email")

        if not club_name:
            return JsonResponse({"error": "Club name required"}, status=400)

        session = SessionLocal()
        try:
            # 1. Check club exists (RAW SQL)
            club_result = session.execute(
                text("SELECT club_id FROM clubs WHERE club_id = :club_id"),
                {"club_id": club_id}
            ).first()

            if not club_result:
                return JsonResponse({"error": "Club not found"}, status=404)

            # 2. Update club basic info (RAW SQL)
            session.execute(
                text("""
                    UPDATE clubs 
                    SET club_name = :club_name, 
                        description = :description, 
                        founded_date = :founded_date
                    WHERE club_id = :club_id
                """),
                {
                    "club_name": club_name,
                    "description": description,
                    "founded_date": founded_date,
                    "club_id": club_id
                }
            )

            # 3. Update admin (members table) - RAW SQL
            if admin_email:
                # Get user_id from email
                user_result = session.execute(
                    text("SELECT user_id FROM users WHERE email = :email LIMIT 1"),
                    {"email": admin_email}
                ).first()
                
                if user_result:
                    user_id = user_result[0]
                    
                    # Remove old admin
                    session.execute(
                        text("""
                            DELETE FROM members 
                            WHERE club_id = :club_id AND role = 'admin'
                        """),
                        {"club_id": club_id}
                    )
                    
                    # Add new admin
                    session.execute(
                        text("""
                            INSERT INTO members (club_id, user_id, role) 
                            VALUES (:club_id, :user_id, 'admin')
                        """),
                        {
                            "club_id": club_id,
                            "user_id": user_id
                        }
                    )
                else:
                    return JsonResponse({"error": "User not found"}, status=404)

            session.commit()
            return JsonResponse({
                "success": True, 
                "message": "Club updated successfully including admin!"
            })

        finally:
            session.close()

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        print(f"UPDATE ERROR: {str(e)}")
        return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)
