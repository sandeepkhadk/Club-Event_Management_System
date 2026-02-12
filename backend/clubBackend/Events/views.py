


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .tables import events_participants
from sqlalchemy import select, insert
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from Users.tables import members

from Users.utils import jwt_required
from core.db.base import SessionLocal
from .tables import events_table
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# @jwt_required
@csrf_exempt
def get_club_events(request, club_id):
    session = SessionLocal()
    try:
        events = session.execute(
            select(events_table)
            .where(events_table.c.club_id == club_id)
            .order_by(events_table.c.start_datetime)
        ).mappings().all()

        events_list = [dict(e) for e in events]  # <--- convert

        return JsonResponse({"events": events_list}, status=200)
    finally:
        session.close()


@csrf_exempt
def get_all_events(request):
    """Return all events as JSON-serializable objects"""
    session = SessionLocal()
    try:
        events = session.execute(
            select(events_table).order_by(events_table.c.start_datetime)
        ).mappings().all()  # This returns RowMapping objects

        # Convert RowMapping to dict
        events_list = [dict(e) for e in events]

        return JsonResponse({"events": events_list}, status=200)
    finally:
        session.close()

@jwt_required
def get_event(request, event_id):
    session = SessionLocal()
    try:
        event = session.execute(
            select(events_table).where(events_table.c.event_id == event_id)
        ).mappings().first()  # RowMapping

        if not event:
            return JsonResponse({"error": "Event not found"}, status=404)

        # Convert RowMapping to dict
        event_dict = dict(event)

        return JsonResponse(event_dict, status=200)
    finally:
        session.close()

# @jwt_required
@csrf_exempt
def create_event(request):
    data = json.loads(request.body)

    club_id = data.get("club_id")
    title = data.get("title")
    description = data.get("description")
    start_datetime = data.get("start_datetime")
    end_datetime = data.get("end_datetime")
    status = data.get("status", "active")
    user_id=data.get("user_id")
    if not club_id or not title or not start_datetime or not end_datetime:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    # user_id = request.user_payload["user_id"]

    session = SessionLocal()

    try:
        # 🔐 user must be a club member to create event
        is_member = session.execute(
            select(members).where(
                members.c.user_id == user_id,
                members.c.club_id == club_id
            )
        ).first()

        if not is_member:
            return JsonResponse({"error": "Only club members can create events"}, status=403)

        session.execute(
            insert(events_table).values(
                club_id=club_id,
                handler_id=user_id,
                title=title,
                description=description,
                start_datetime=start_datetime,
                end_datetime=end_datetime,
                status=status
            )
        )

        session.commit()
        return JsonResponse(
            {"success": True, "message": "Event created successfully"},
            status=201
        )

    finally:
        session.close()

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
@jwt_required
def join_event(request):
    data = json.loads(request.body)
    event_id = data.get("event_id")

    user_id = request.user_payload["user_id"]
    session = SessionLocal()

    try:
        # prevent duplicate join
        exists = session.execute(
            select(events_participants).where(
                events_participants.c.user_id == user_id,
                events_participants.c.event_id == event_id
            )
        ).first()

        if exists:
            return JsonResponse({"error": "Already joined"}, status=400)

        session.execute(
            insert(events_participants).values(
                user_id=user_id,
                event_id=event_id
            )
        )
        session.commit()

        return JsonResponse({"success": True, "message": "Joined event"}, status=201)
    finally:
        session.close()
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
