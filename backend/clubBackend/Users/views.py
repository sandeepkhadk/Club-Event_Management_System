from django.http import JsonResponse
from datetime import datetime
from sqlalchemy import insert, select, text,update,delete
from sqlalchemy.exc import SQLAlchemyError
from core.db.base import SessionLocal
from .tables import users_table as users
from .tables import member_requests
from .tables import members
from django.views.decorators.csrf import csrf_exempt
from .utils import hash_password, verify_password, jwt_required
from .jwt import generate_jwt
from clubs.views import create_join_request
import json



@csrf_exempt
 
def register_view(request):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "error": "Invalid request method"},
            status=405
        )

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"success": False, "error": "Invalid JSON format"},
            status=400
        )

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return JsonResponse(
            {"success": False, "error": "All fields are required"},
            status=400
        )

    session = SessionLocal()
    try:
      
        existing_user = session.execute(
            select(users).where(users.c.email == email)
        ).fetchone()

        if existing_user:
            return JsonResponse(
                {"success": False, "error": "Email already registered"},
                status=409
            )

        hashed_password = hash_password(password)

        stmt = insert(users).values(
            name=name,
            email=email,
            password=hashed_password,
            created_at=datetime.utcnow()
        )

        session.execute(stmt)
        session.commit()

        return JsonResponse(
            {"success": True, "message": "User registered successfully"},
            status=201
        )

    except SQLAlchemyError as e:
        session.rollback()
        return JsonResponse(
            {"success": False, "error": str(e)},
            status=500
        )

    finally:
        session.close()

@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "POST request required"}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return JsonResponse({"success": False, "error": "Email and password required"}, status=400)

    session = SessionLocal()
    try:
        # Fetch user
        stmt = select(users).where(users.c.email == email)
        result = session.execute(stmt).mappings().fetchone()
        if not result:
            return JsonResponse({"success": False, "error": "User not found"}, status=401)

        # Verify password
        if not verify_password(password, result["password"]):
            return JsonResponse({"success": False, "error": "Invalid password"}, status=401)

        user_id = result["user_id"]

        # Default global role
        if result["email"] == "superadmin@gmail.com":
            global_role = "superadmin"
        else:
            global_role = "member"  # will adjust if no club role

        # Fetch the single club role for this user
        club_stmt = select(members.c.club_id, members.c.role).where(members.c.user_id == user_id)
        club_row = session.execute(club_stmt).mappings().first()

        if club_row:
            club_id = club_row["club_id"]
            club_role = club_row["role"]
        else:
            club_id = None
            club_role = None
            if result["email"] != "superadmin@gmail.com":
             global_role = "unmember"  

       
        token = generate_jwt(
            email=result["email"],
            user_id=user_id,
            club_id=club_id,
            global_role=global_role,
            club_role=club_role
        )

        return JsonResponse({
            "success": True,
            "message": "Login successful",
            "token": token,
            "global_role": global_role,
            "club_id": club_id,
            "club_role": club_role,
            "name": result["name"],
            "user_id": user_id
        })

    except SQLAlchemyError as e:
        session.rollback()
        return JsonResponse({"success": False, "error": str(e)}, status=500)
    finally:
        session.close()


@csrf_exempt
@jwt_required
def join_club_request(request, club_id):
   
    if request.method == "POST":
        user_id = request.user_payload.get("user_id")
        success, message = create_join_request(user_id, club_id)
        status_code = 201 if success else 400
        return JsonResponse({"success": success, "message": message}, status=status_code)
    return JsonResponse(
        {"success": False, "message": "Only POST requests allowed."},
        status=405
    )
@csrf_exempt
@jwt_required


def approve_request(request, request_id):
    """
    Admin approves a join request by user_id and adds the user to members table.
    request_id is the user's ID who made the request.
    """

    if request.user_payload.get("club_role") != "admin":
        return JsonResponse({"error": "Admin only"}, status=403)

    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    try:
        data = json.loads(request.body or "{}")
        role = data.get("role", "member")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    session = SessionLocal()
    try:
        club_id = request.user_payload.get("club_id")

        # Check pending request
        stmt = select(member_requests).where(
            member_requests.c.user_id == request_id,
            member_requests.c.club_id == club_id,
            member_requests.c.status == "pending"
        )
        req = session.execute(stmt).mappings().first()

        if not req:
            return JsonResponse({"error": "Pending request not found"}, status=404)

        # Add user to members if not already
        existing_member = session.execute(
            select(members).where(
                members.c.user_id == request_id,
                members.c.club_id == club_id
            )
        ).first()

        if not existing_member:
            session.execute(
                insert(members).values(
                    user_id=request_id,
                    club_id=club_id,
                    role=role
                )
            )

        # ✅ Delete request after approval
        session.execute(
            delete(member_requests).where(
                member_requests.c.user_id == request_id,
                member_requests.c.club_id == club_id
            )
        )

        session.commit()

        return JsonResponse({
            "success": True,
            "message": f"User {request_id} approved and request removed"
        }, status=200)

    finally:
        session.close()

@csrf_exempt
@jwt_required
def reject_request(request, request_id):

    if request.user_payload.get("club_role") != "admin":
        return JsonResponse({"error": "Admin only"}, status=403)

    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    session = SessionLocal()
    try:
        # Check if request exists
        stmt = select(member_requests).where(
            member_requests.c.user_id == request_id
        )
        req = session.execute(stmt).mappings().first()

        if not req:
            return JsonResponse({"error": "Request not found"}, status=404)

        # Delete request
        delete_stmt = delete(member_requests).where(
            member_requests.c.user_id == request_id
        )

        session.execute(delete_stmt)
        session.commit()

        return JsonResponse(
            {"success": True, "message": f"Request {request_id} rejected"},
            status=200
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    finally:
        session.close()

        return JsonResponse(
            {"success": True, "message": f"Request {request_id} removed"},
            status=200
        )
        
@csrf_exempt
@jwt_required
def get_club_members(request, club_id):
    """
    Fetch all members of a specific club
    """
    session = SessionLocal()
    try:
        # Join members table with users table, no status check
        stmt = (
            select(
                members.c.user_id,
                users.c.name,
                members.c.role,
                members.c.club_id
            )
            .join(users, users.c.user_id == members.c.user_id)
            .where(members.c.club_id == club_id)
        )

        results = session.execute(stmt).mappings().all()  # list of RowMapping

        # Convert to plain dicts
        members_list = [dict(row) for row in results]

        return JsonResponse({"members": members_list}, status=200)

    except SQLAlchemyError as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)

    finally:
        session.close()
@jwt_required
@csrf_exempt
def pending_requests(request):
    """
    Admin can view pending join requests for their club.
    Superadmin can see all pending requests.
    """
    user_payload = request.user_payload
    global_role = user_payload.get("global_role")
    club_id = user_payload.get("club_id")
    club_role = user_payload.get("club_role")

    if global_role != "superadmin" and club_role != "admin":
        return JsonResponse({"error": "Admin only"}, status=403)

    session = SessionLocal()
    try:
        stmt = select(member_requests).where(member_requests.c.status == "pending")
        
        
        if global_role != "superadmin":
            stmt = stmt.where(member_requests.c.club_id == club_id)

        results = session.execute(stmt).mappings().all()
        return JsonResponse({"requests": list(results)}, status=200)
    finally:
        session.close()
@csrf_exempt
@jwt_required
def assign_role(request):
    """
    Superadmin assigns role to a member of a club
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    user_payload = request.user_payload
    global_role = user_payload.get("global_role")
    print(global_role)

    if global_role != "superadmin":
        return JsonResponse({"error": "Superadmin only"}, status=403)

    try:
        data = json.loads(request.body)
        print(data)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    user_id = data.get("user_id")
    club_id = data.get("club_id")
    new_role = data.get("role")

    if not user_id or not club_id or not new_role:
        return JsonResponse(
            {"error": "user_id, club_id and role required"},
            status=400
        )

    session = SessionLocal()
    try:
       
        stmt = select(members).where(
            members.c.user_id == user_id,
            members.c.club_id == club_id
        )
        member_row = session.execute(stmt).mappings().first()

        if not member_row:
            return JsonResponse({"error": "Member not found in club"}, status=404)

       
        upd = (
            update(members)
            .where(
                members.c.user_id == user_id,
                members.c.club_id == club_id
            )
            .values(role=new_role)
        )

        session.execute(upd)
        session.commit()

        return JsonResponse({
            "success": True,
            "message": f"Role updated to {new_role}"
        }, status=200)

    except SQLAlchemyError as e:
        session.rollback()
        return JsonResponse({"error": str(e)}, status=500)

    finally:
        session.close()
@csrf_exempt
@jwt_required
def remove_member(request, user_id):
    print(user_id)
    if request.method != "DELETE":
        return JsonResponse({"error": "POST request required"}, status=400)

    user_payload = request.user_payload
    global_role = user_payload.get("global_role")
    club_role = user_payload.get("club_role")
    club_id = user_payload.get("club_id")

    if global_role != "superadmin" and club_role != "admin":
        return JsonResponse({"error": "Admin only"}, status=403)

    session = SessionLocal()
    try:
        
        stmt = select(members).where(members.c.user_id == user_id)
        # if global_role != "superadmin":
        #     stmt = stmt.where(members.c.club_id == club_id)

        member_row = session.execute(stmt).mappings().first()
        print(member_row)
        if not member_row:
            print("jejfndjf")
            return JsonResponse({"error": "Member not found"}, status=404)

        # Delete the member
        delete_stmt = members.delete().where(members.c.user_id == user_id)
        if global_role != "superadmin":
            delete_stmt = delete_stmt.where(members.c.club_id == club_id)

        session.execute(delete_stmt)
        session.commit()

        return JsonResponse({
            "success": True,
            "message": f"Member {user_id} removed successfully"
        }, status=200)

    except SQLAlchemyError as e:
        session.rollback()
        return JsonResponse({"error": str(e)}, status=500)

    finally:
        session.close()
        
@jwt_required
@csrf_exempt
def users_list_view(request):
    """Superadmin: Get all users for admin dropdown"""
    if request.method != "GET":
        return JsonResponse({"success": False, "error": "GET only"}, status=405)
    
    try:
        user_payload = request.user_payload
        print(f"🔍 JWT Payload: {user_payload}")
        
        # ✅ FIX: Convert RowMapping to dicts properly
        session = SessionLocal()
        stmt = select(users.c.user_id, users.c.email, users.c.name)
        results = session.execute(stmt).mappings().all()
        
        # Convert each RowMapping to plain dict
        users_list = []
        for row in results:
            user_dict = dict(row)  # ✅ This fixes JSON serialization
            users_list.append({
                "user_id": user_dict.get("user_id"),
                "email": user_dict.get("email"),
                "name": user_dict.get("name", "No name")
            })
        
        print(f"✅ Returning {len(users_list)} users")
        
        return JsonResponse({
            "success": True,
            "users": users_list  # ✅ Plain dicts only
        }, status=200)
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({"success": False, "error": str(e)}, status=500)
    
    finally:
        if 'session' in locals():
            session.close()
@jwt_required
def profile_view(request):
    user_payload = request.user_payload
    
    email = user_payload.get("email")
    user_id = user_payload.get("user_id")
    club_id = user_payload.get("club_id")  # 🔥 From JWT
    role = user_payload.get("role")
    club_role = user_payload.get("club_role")

    if not email:
        return JsonResponse({"error": "Invalid token"}, status=401)

    session = SessionLocal()
    
    try:
        # 1. Get user basic info
        user_query = text("""
            SELECT name, email FROM users WHERE email = :email
        """)
        user_result = session.execute(user_query, {"email": email}).fetchone()
        
        if not user_result:
            return JsonResponse({"error": "User not found"}, status=404)

        # 2. 🔥 GET CLUB NAME FROM club_id
        club_name = None
        if club_id:
            club_query = text("""
                SELECT club_name FROM clubs WHERE club_id = :club_id
            """)
            club_result = session.execute(club_query, {"club_id": club_id}).fetchone()
            club_name = club_result[0] if club_result else None  # ✅ Now defined!

        # 3. Get applications
        applications_query = text("""
            SELECT mr.club_id, mr.status, c.club_name as club_name
            FROM member_requests mr
            LEFT JOIN clubs c ON mr.club_id = c.club_id
            WHERE mr.user_id = :user_id
        """)
        applications_result = session.execute(applications_query, {"user_id": user_id}).fetchall()

        applications = [
            {
                "club_id": row[0],
                "status": row[1],
                "club_name": row[2]  # ✅ Richer data
            }
            for row in applications_result
        ]

        return JsonResponse({
            "name": user_result[0],
            "email": user_result[1],
            "role": role,
            "club_id": club_id,
            "club_name": club_name,  # ✅ NOW WORKS!
            "club_role": club_role,
            "applications": applications
        })

    except Exception as e:
        print("PROFILE ERROR:", str(e))
        return JsonResponse({"error": str(e)}, status=500)
    finally:
        session.close()


@jwt_required
def approve_member_request(request, club_id, member_id):
    """Club admin approves member - AdminDashboard calls this"""
    session = SessionLocal()
    try:
        user_id = request.user_payload["user_id"]
        
        # 1. Check if user is club admin
        admin_check = session.execute(
            text("SELECT role FROM members WHERE club_id = :club_id AND user_id = :user_id"),
            {"club_id": club_id, "user_id": user_id}
        ).first()
        
        if not admin_check or admin_check[0] != 'admin':
            return JsonResponse({"error": "Club admin required"}, status=403)
        
        # 2. Check pending request exists
        pending_check = session.execute(
            text("""
                SELECT user_id FROM member_requests 
                WHERE club_id = :club_id AND user_id = :member_id AND status = 'pending'
            """), 
            {"club_id": club_id, "member_id": member_id}
        ).first()
        
        if not pending_check:
            return JsonResponse({"error": "No pending request found"}, status=404)
        
        # 3. Add to members table
        session.execute(
            text("""
                INSERT INTO members (club_id, user_id, role, joined_date) 
                VALUES (:club_id, :member_id, 'member', NOW())
            """),
            {"club_id": club_id, "member_id": member_id}
        )
        
        # 4. Delete pending request
        session.execute(
            text("""
                DELETE FROM member_requests 
                WHERE club_id = :club_id AND user_id = :member_id
            """),
            {"club_id": club_id, "member_id": member_id}
        )
        
        session.commit()
        return JsonResponse({"message": "Member approved successfully"})
        
    except Exception as e:
        print(f"APPROVE ERROR: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
    finally:
        session.close()

@jwt_required
def reject_member_request(request, club_id, member_id):
    """Club admin rejects member request"""
    session = SessionLocal()
    try:
        user_id = request.user_payload["user_id"]
        
        # 1. Check if user is club admin
        admin_check = session.execute(
            text("SELECT role FROM members WHERE club_id = :club_id AND user_id = :user_id"),
            {"club_id": club_id, "user_id": user_id}
        ).first()
        
        if not admin_check or admin_check[0] != 'admin':
            return JsonResponse({"error": "Club admin required"}, status=403)
        
        # 2. Delete pending request only
        result = session.execute(
            text("""
                DELETE FROM member_requests 
                WHERE club_id = :club_id AND user_id = :member_id AND status = 'pending'
            """),
            {"club_id": club_id, "member_id": member_id}
        )
        
        if result.rowcount == 0:
            return JsonResponse({"error": "No pending request found"}, status=404)
        
        session.commit()
        return JsonResponse({"message": "Request rejected"})
        
    except Exception as e:
        print(f"REJECT ERROR: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
    finally:
        session.close()

@jwt_required
def user_clubs(request):
    """Get user's clubs for RoleBasedRedirect"""
    session = SessionLocal()
    try:
        user_id = request.user_payload["user_id"]
        results = session.execute(
            text("""
                SELECT DISTINCT c.club_id, c.club_name as name 
                FROM clubs c
                JOIN members m ON c.club_id = m.club_id
                WHERE m.user_id = :user_id AND m.role IN ('admin', 'member')
                ORDER BY c.club_name
                LIMIT 1
            """),
            {"user_id": user_id}
        ).mappings().all()
        
        clubs = [dict(row) for row in results]
        return JsonResponse({"clubs": clubs})
    finally:
        session.close()
