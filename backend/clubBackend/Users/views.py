# Users/views.py
from unittest import result
from django.http import JsonResponse
from datetime import datetime
from sqlalchemy import insert
from .db import engine, users
from django.views.decorators.csrf import csrf_exempt
from .utils import hash_password
from .jwt import generate_jwt
from sqlalchemy import select
from .utils import verify_password
import json
from .utils import jwt_required


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

    # Validate input
    if not name or not email or not password:
        return JsonResponse(
            {"success": False, "error": "All fields are required"},
            status=400
        )

    try:
        with engine.connect() as conn:

            # Check if email already exists
            existing_user = conn.execute(
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
                created_at=datetime.now()
            )

            conn.execute(stmt)
            conn.commit()

        return JsonResponse(
            {"success": True, "message": "User registered successfully"},
            status=201
        )

    except Exception as e:
        return JsonResponse(
            {"success": False, "error": str(e)},
            status=500
        )
@csrf_exempt
def login_view(request):

    if request.method == "POST":
        import json
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")
        role=data.get("userType")
        if not email or not password:
            return JsonResponse(
                {"success": False, "error": "Email and password required"},
                status=400
            )

        try:
            with engine.connect() as conn:
                stmt = select(users).where(users.c.email == email)
                result = conn.execute(stmt).fetchone()

                if not result:
                    return JsonResponse(
                        {"success": False, "error": "Invalid email or password"},
                        status=401
                    )

                # result.password → hashed password from DB
                if not verify_password(password, result.password):
                    return JsonResponse(
                        {"success": False, "error": "Invalid email or password"},
                        status=401
                    )

                # generate jwt with email + role
                token = generate_jwt(result.email, role)

        except Exception as e:
            return JsonResponse(
                {"success": False, "error": str(e)},
                status=500
            )

        return JsonResponse({
            "success": True,
            "message": "Login successful",
            "token": token,
            "role": role,
            "name": result.name
        })

    return JsonResponse(
        {"success": False, "error": "Invalid request method"},
        status=400
    )
@jwt_required
def profile_view(request):
    user_payload = request.user_payload
    email = user_payload.get("email")

    with engine.connect() as conn:
        stmt = select(users).where(users.c.email == email)
        result = conn.execute(stmt).mappings().fetchone()  # ✅ mappings() returns dict-like row

    if result is None:
        return JsonResponse({"error": "User not found"}, status=404)

    return JsonResponse({
        "name": result["name"],
        "email": result["email"],
        "role": user_payload.get("role")
    })
