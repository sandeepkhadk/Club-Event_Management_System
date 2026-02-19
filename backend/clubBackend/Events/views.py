


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .tables import events_participants
from sqlalchemy import select, insert,join
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from Users.tables import members
from Users.tables import users_table as users
from Users.utils import jwt_required
from core.db.base import SessionLocal
from .tables import events_table
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# @csrf_exempt
# def get_club_events(request, club_id):
#     session = SessionLocal()
#     try:
#         # 1️⃣ Join events_table with users for handler name
#         stmt = (
#             select(
#                 events_table.c.event_id,
#                 events_table.c.title,
#                 events_table.c.description,
#                 events_table.c.start_datetime,
#                 events_table.c.end_datetime,
#                 events_table.c.status,
#                 events_table.c.handler_id,
#                 events_table.c.visibility,
#                 events_table.c.max_capacity,
#                 users.c.name.label("handler_name")
#             )
#             .join(users, users.c.user_id == events_table.c.handler_id)
#             .where(events_table.c.club_id == club_id)
#             .order_by(events_table.c.start_datetime)
#         )
#         events = session.execute(stmt).mappings().all()
#         events_list = [dict(e) for e in events]

#         # 2️⃣ Add joined users for each event
#         for e in events_list:
#             joins = session.execute(
#                 select(events_participants.c.user_id)
#                 .where(events_participants.c.event_id == e["event_id"])
#             ).fetchall()
#             e["joined_users"] = [u[0] for u in joins]  # list of user_ids

#         return JsonResponse({"events": events_list}, status=200)
#     finally:
#         session.close()
csrf_exempt
def get_club_events(request, club_id):
    session = SessionLocal()
    try:
        # 1️⃣ Join events_table with users for handler name
        stmt = (
            select(
                events_table.c.event_id,
                events_table.c.title,
                events_table.c.description,
                events_table.c.start_datetime,
                events_table.c.end_datetime,
                events_table.c.status,
                events_table.c.handler_id,
                events_table.c.visibility,
                events_table.c.max_capacity,
                users.c.name.label("handler_name")
            )
            .join(users, users.c.user_id == events_table.c.handler_id)
            .where(events_table.c.club_id == club_id)
            .order_by(events_table.c.start_datetime)
        )
        events = session.execute(stmt).mappings().all()
        events_list = [dict(e) for e in events]

        # 2️⃣ Add joined users for each event
        for e in events_list:
            joins = session.execute(
                select(events_participants.c.user_id)
                .where(events_participants.c.event_id == e["event_id"])
            ).fetchall()
            e["joined_users"] = [u[0] for u in joins]  # list of user_ids

        return JsonResponse({"events": events_list}, status=200)
    finally:
        session.close()

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@csrf_exempt
def get_all_events(request):
    """Return all events with handler name and joined users"""
    session = SessionLocal()
    try:
        # 1️⃣ Join events_table with users for handler name
        stmt = (
            select(
                events_table.c.event_id,
                events_table.c.title,
                events_table.c.description,
                events_table.c.start_datetime,
                events_table.c.end_datetime,
                events_table.c.status,
                events_table.c.handler_id,
                users.c.name.label("handler_name"),
                events_table.c.club_id
            )
            .join(users, users.c.user_id == events_table.c.handler_id)
            .order_by(events_table.c.start_datetime)
        )
        events = session.execute(stmt).mappings().all()
        events_list = [dict(e) for e in events]
        print(events_list)

        # 2️⃣ Add joined users for each event
        for e in events_list:
            joins = session.execute(
                select(events_participants.c.user_id)
                .where(events_participants.c.event_id == e["event_id"])
            ).fetchall()
            e["joined_users"] = [u[0] for u in joins]  # list of user_ids

        return JsonResponse({"events": events_list}, status=200)
    finally:
        session.close()
from datetime import datetime


@csrf_exempt
@jwt_required
def create_event(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    user_id = request.user_payload.get("user_id")
    club_id = request.user_payload.get("club_id")
    title = data.get("title")
    description = data.get("description")
    start_datetime = data.get("start_datetime")
    end_datetime = data.get("end_datetime")
    status = data.get("status", "Planned")
    visibility=data.get("visibility")
    max_capacity = data.get("max_capacity")

    if max_capacity in ("", None):
     max_capacity = None
    else:
     max_capacity = int(max_capacity)



    if not all([club_id, title, description, start_datetime, end_datetime]):
        return JsonResponse(
            {"error": "All fields (club_id, title, description, start_datetime, end_datetime) are required"},
            status=400
        )

    session = SessionLocal()
    try:
        # Check if user is a member
        is_member = session.execute(
            select(members).where(
                members.c.user_id == user_id,
                members.c.club_id == club_id
            )
        ).first()

        if not is_member:
            return JsonResponse({"error": "Only club members can create events"}, status=403)

        # Insert event
        result = session.execute(
            insert(events_table)
            .values(
                club_id=club_id,
                handler_id=user_id,
                title=title,
                description=description,
                start_datetime=start_datetime,
                end_datetime=end_datetime,
                status=status,
                visibility=visibility,
                max_capacity=max_capacity
            )
            .returning(
                events_table.c.event_id,
                events_table.c.title,
                events_table.c.description,
                events_table.c.start_datetime,
                events_table.c.end_datetime,
                events_table.c.status,
                events_table.c.handler_id
            )
        )
        new_event = result.first()
        session.commit()

        # Convert Row to dict and stringify datetime
        response = {
            "event_id": new_event.event_id,
            "title": new_event.title,
            "description": new_event.description,
            "start_datetime": new_event.start_datetime.isoformat() if isinstance(new_event.start_datetime, datetime) else new_event.start_datetime,
            "end_datetime": new_event.end_datetime.isoformat() if isinstance(new_event.end_datetime, datetime) else new_event.end_datetime,
            "status": new_event.status,
            "handler_id": new_event.handler_id,
            "handler_name": session.execute(
                select(users.c.name).where(users.c.user_id == new_event.handler_id)
            ).scalar()
           
        }
        return JsonResponse({"success": True, "event": response}, status=201)

    finally:
        session.close()
        
@csrf_exempt
@jwt_required
def delete_event(request, event_id):
    user_id = request.user_payload["user_id"]
    session = SessionLocal()

    try:
        event = session.execute(
            select(events_table).where(events_table.c.event_id == event_id)
        ).first()

        if not event:
            return JsonResponse({"error": "Event not found"}, status=404)

        # only handler can delete
        if event.handler_id != user_id:
            return JsonResponse({"error": "Not allowed"}, status=403)

        session.execute(
            events_table.delete().where(events_table.c.event_id == event_id)
        )
        session.commit()

        return JsonResponse({"success": True, "message": "Event deleted"}, status=200)
    finally:
        session.close()

@csrf_exempt
@jwt_required
def join_event(request):
    print("=== join_event called ===")
    session = SessionLocal()
    try:
        # 1️⃣ Parse JSON
        try:
            data = json.loads(request.body)
            print("Request JSON:", data)
        except Exception as e:
            print("❌ Failed to parse JSON:", e)
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        # 2️⃣ Extract event_id
        event_id = data.get("event_id")
        print("Event ID from request:", event_id)
        if not event_id:
            print("❌ event_id missing in request")
            return JsonResponse({"error": "event_id is required"}, status=400)

        # 3️⃣ Extract user_id from JWT
        try:
            user_id = request.user_payload.get("user_id")
            print("User ID from JWT:", user_id)
        except Exception as e:
            print("❌ Failed to get user_id from JWT:", e)
            return JsonResponse({"error": "Invalid JWT"}, status=403)

        if not user_id:
            print("❌ user_id is None")
            return JsonResponse({"error": "User not authenticated"}, status=403)

        # 4️⃣ Check for duplicate join
        exists = session.execute(
            select(events_participants).where(
                events_participants.c.user_id == user_id,
                events_participants.c.event_id == event_id
            )
        ).first()
        print("Duplicate check result:", exists)

        if exists:
            print("⚠️ User has already joined this event")
            return JsonResponse({"error": "Already joined"}, status=400)

        # 5️⃣ Insert new participation
        print("Inserting new participation for user:", user_id, "event:", event_id)
        session.execute(
            insert(events_participants).values(
                user_id=user_id,
                event_id=event_id
            )
        )
        session.commit()
        print("✅ Insert successful!")

        return JsonResponse({"success": True, "message": "Joined event"}, status=201)

    except Exception as e:
        print("❌ Unexpected error in join_event:", e)
        return JsonResponse({"error": str(e)}, status=500)

    finally:
        print("Closing session")
        session.close()
@csrf_exempt
@jwt_required
def leave_event(request):
    data = json.loads(request.body)
    event_id = data.get("event_id")

    user_id = request.user_payload["user_id"]
    session = SessionLocal()

    try:
        session.execute(
            events_participants.delete().where(
                events_participants.c.user_id == user_id,
                events_participants.c.event_id == event_id
            )
        )
        session.commit()

        return JsonResponse({"success": True, "message": "Left event"}, status=200)
    finally:
        session.close()
@csrf_exempt
def get_global_events(request):
    """
    Public endpoint: Return only events with visibility='global'.
    No authentication required.
    """
    session = SessionLocal()
    try:
        # 1️⃣ Select events with visibility='global' and join with handler name
        stmt = (
            select(
                events_table.c.event_id,
                events_table.c.title,
                events_table.c.description,
                events_table.c.start_datetime,
                events_table.c.end_datetime,
                events_table.c.status,
                events_table.c.handler_id,
                users.c.name.label("handler_name"),
                events_table.c.club_id,
                events_table.c.visibility,
                events_table.c.max_capacity
            )
            .join(users, users.c.user_id == events_table.c.handler_id)
            .where(events_table.c.visibility == "global")
            .order_by(events_table.c.start_datetime)
        )

        events = session.execute(stmt).mappings().all()
        events_list = [dict(e) for e in events]

        # 2️⃣ Add joined users for each event
        for e in events_list:
            joins = session.execute(
                select(events_participants.c.user_id)
                .where(events_participants.c.event_id == e["event_id"])
            ).fetchall()
            e["joined_users"] = [u[0] for u in joins]

        return JsonResponse({"events": events_list}, status=200)

    finally:
        session.close()
@csrf_exempt
@jwt_required
def get_feed_events(request):
    """
    Return a feed of events:
    - All events of the user's club
    - All events from other clubs with visibility='global'
    """
    user_id = request.user_payload.get("user_id")
    club_id = request.user_payload.get("club_id")
    session = SessionLocal()

    try:
        # 1️⃣ Select events with handler name
        stmt = (
            select(
                events_table.c.event_id,
                events_table.c.title,
                events_table.c.description,
                events_table.c.start_datetime,
                events_table.c.end_datetime,
                events_table.c.status,
                events_table.c.handler_id,
                users.c.name.label("handler_name"),
                events_table.c.club_id,
                events_table.c.visibility,
                events_table.c.max_capacity
            )
            .join(users, users.c.user_id == events_table.c.handler_id)
            .where(
                (events_table.c.club_id == club_id) |
                ((events_table.c.club_id != club_id) & (events_table.c.visibility == "global"))
            )
            .order_by(events_table.c.start_datetime)
        )

        events = session.execute(stmt).mappings().all()
        events_list = [dict(e) for e in events]

        # 2️⃣ Add joined users for each event
        for e in events_list:
            joins = session.execute(
                select(events_participants.c.user_id)
                .where(events_participants.c.event_id == e["event_id"])
            ).fetchall()
            e["joined_users"] = [u[0] for u in joins]

            # Optional: add joined flag for current user
            e["joined"] = user_id in e["joined_users"]

        return JsonResponse({"events": events_list}, status=200)
    finally:
        session.close()
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Users.utils import jwt_required
from core.db.base import SessionLocal
from .tables import events_table, events_participants
from Users.tables import users_table as users
from sqlalchemy import select

# @csrf_exempt
# @jwt_required
# def get_club_events(request, club_id):
#     """
#     Returns all events for a specific club along with:
#     - Handler name
#     - List of user_ids who joined
#     - Optionally a 'joined' flag for the current user
#     """
#     session = SessionLocal()
#     try:
#         user_id = request.user_payload.get("user_id")

#         # 1️⃣ Select events for the given club and join with handler name
#         stmt = (
#             select(
#                 events_table.c.event_id,
#                 events_table.c.title,
#                 events_table.c.description,
#                 events_table.c.start_datetime,
#                 events_table.c.end_datetime,
#                 events_table.c.status,
#                 events_table.c.handler_id,
#                 users.c.name.label("handler_name"),
#                 events_table.c.visibility,
#                 events_table.c.max_capacity
#             )
#             .join(users, users.c.user_id == events_table.c.handler_id)
#             .where(events_table.c.club_id == club_id)
#             .order_by(events_table.c.start_datetime)
#         )
#         events = session.execute(stmt).mappings().all()
#         events_list = [dict(e) for e in events]

#         # 2️⃣ Add joined users for each event
#         for e in events_list:
#             joined_rows = session.execute(
#                 select(events_participants.c.user_id)
#                 .where(events_participants.c.event_id == e["event_id"])
#             ).fetchall()
#             joined_user_ids = [u[0] for u in joined_rows]
#             e["joined_users"] = joined_user_ids
#             e["joined"] = user_id in joined_user_ids if user_id else False

#         return JsonResponse({"club_id": club_id, "events": events_list}, status=200)

#     finally:
#         session.close()
