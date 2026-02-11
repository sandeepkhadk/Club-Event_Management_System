from django.http import JsonResponse
from datetime import datetime
from sqlalchemy import insert, select
from sqlalchemy.exc import SQLAlchemyError
from core.db.base import SessionLocal
from .tables import users_table as users
from .tables import member_requests
from .tables import members
from django.views.decorators.csrf import csrf_exempt
from .utils import hash_password, verify_password, jwt_required
from .jwt import generate_jwt
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
        # Check if email already exists
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
        return JsonResponse(
            {"success": False, "error": "Invalid request method"},
            status=400
        )

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"success": False, "error": "Invalid JSON format"},
            status=400
        )

    email = data.get("email")
    password = data.get("password")
    role = data.get("userType")

    if not email or not password:
        return JsonResponse(
            {"success": False, "error": "Email and password required"},
            status=400
        )

    session = SessionLocal()
    try:
        stmt = select(users).where(users.c.email == email)
        result = session.execute(stmt).fetchone()

        if not result or not verify_password(password, result.password):
            return JsonResponse(
                {"success": False, "error": "Invalid email or password"},
                status=401
            )

        # generate JWT with email + role
        token = generate_jwt(result.email, role)

    except Exception as e:
        print("LOGIN ERROR:", e)
        return JsonResponse(
            {"success": False, "error": "Internal server error"},
            status=500
        )

    return JsonResponse({
        "success": True,
        "message": "Login successful",
        "token": token,
        "role": role,
        "name": result["name"]
    })

    except SQLAlchemyError as e:
        return JsonResponse(
            {"success": False, "error": str(e)},
            status=500
        )

    finally:
        session.close()


@jwt_required
def profile_view(request):
    user_payload = request.user_payload
    email = user_payload.get("email")

    session = SessionLocal()
    try:
        stmt = select(users).where(users.c.email == email)
        result = session.execute(stmt).mappings().fetchone() 

        if result is None:
            return JsonResponse({"error": "User not found"}, status=404)

        return JsonResponse({
            "name": result["name"],
            "email": result["email"],
            "role": user_payload.get("role")
        })

    except SQLAlchemyError as e:
        return JsonResponse(
            {"success": False, "error": str(e)},
            status=500
        )

    finally:
        session.close()

# @jwt_required
@csrf_exempt
def join_club_request(request):
    """
    Any logged-in user can request to join a club.
    Does NOT insert into members yet.
    """
    data = json.loads(request.body)
    club_id = data.get("club_id")
    user_id=data.get("user_id")
    if not club_id:
        return JsonResponse({"error": "club_id required"}, status=400)

    session = SessionLocal()
    try:
        # Check if user already requested or is a member
        # user_id = request.user_payload["user_id"]

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
            return JsonResponse({"error": "Already requested or member"}, status=400)

        # Insert request
        stmt = insert(member_requests).values(
            user_id=user_id,
            club_id=club_id,
            role="member",
            status="pending"
        )
        session.execute(stmt)
        session.commit()

        return JsonResponse({"success": True, "message": "Request submitted"}, status=201)
    finally:
        session.close()
@jwt_required
def pending_requests(request):
    """
    Admin can view pending join requests
    """
    if request.user_payload.get("role") != "admin":
        return JsonResponse({"error": "Admin only"}, status=403)

    session = SessionLocal()
    try:
        stmt = select(member_requests).where(member_requests.c.status == "pending")
        results = session.execute(stmt).mappings().all()
        return JsonResponse({"requests": list(results)}, status=200)
    finally:
        session.close()
# @jwt_required
@csrf_exempt
def approve_request(request):
    """
    Admin approves a user's join request.
    Moves from requests table to members table
    """
    # if request.user_payload.get("role") != "admin":
    #     return JsonResponse({"error": "Admin only"}, status=403)

    data = json.loads(request.body)
    request_id = data.get("request_id")
    if not request_id:
        return JsonResponse({"error": "request_id required"}, status=400)

    session = SessionLocal()
    try:
        req = session.execute(
            select(member_requests).where(member_requests.c.id == request_id)
        ).fetchone()

        if not req or req.status != "pending":
            return JsonResponse({"error": "Invalid request"}, status=400)

        # Add to members table
        session.execute(
            insert(members).values(
                user_id=req.user_id,
                club_id=req.club_id,
                role=req.role
            )
        )

        # Update request status
        session.execute(
            member_requests.update()
            .where(member_requests.c.id == request_id)
            .values(status="approved")
        )

        session.commit()
        return JsonResponse({"success": True, "message": "Request approved"}, status=200)
    finally:
        session.close()
@jwt_required
def reject_request(request):
    """
    Admin rejects a join request.
    Only updates status to 'rejected'
    """
    # admin check
    if request.user_payload.get("role") != "admin":
        return JsonResponse({"error": "Admin only"}, status=403)

    data = json.loads(request.body)
    request_id = data.get("request_id")

    if not request_id:
        return JsonResponse({"error": "request_id required"}, status=400)

    session = SessionLocal()
    try:
        # check request exists and is pending
        req = session.execute(
            select(member_requests).where(
                member_requests.c.id == request_id,
                member_requests.c.status == "pending"
            )
        ).first()

        if not req:
            return JsonResponse({"error": "Invalid or already handled request"}, status=400)

        # update status to rejected
        session.execute(
            member_requests.update()
            .where(member_requests.c.id == request_id)
            .values(status="rejected")
        )

        session.commit()
        return JsonResponse(
            {"success": True, "message": "Request rejected"},
            status=200
        )
    finally:
        session.close()
