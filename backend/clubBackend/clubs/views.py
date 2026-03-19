from Users.utils import jwt_required
from Users.tables import members
from django.http import JsonResponse
from core.db.base import SessionLocal
from .tables import clubs_table
from Events.tables import events_table
from Users.tables import member_requests, members,users_table
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select, insert,join,text,func
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
        members_map = {}
        for m in club_members:
            club_id = m['club_id']
            user_id = m['user_id']
            members_map.setdefault(club_id, []).append(user_map.get(user_id, "Unknown"))

        # 4️⃣ Fetch event counts per club
        event_counts = session.execute(
            select(events_table.c.club_id, func.count(events_table.c.event_id).label("event_count"))
            .group_by(events_table.c.club_id)
        ).mappings().all()
        event_count_map = {e['club_id']: e['event_count'] for e in event_counts}

        # 5️⃣ Convert clubs → list of dict and attach created_by_name + members + event_count
        clubs_list = []
        for club in clubs:
            club_dict = dict(club)
            club_id = club_dict["club_id"]
            created_by_id = club_dict.get("created_by")
            club_dict["created_by_name"] = user_map.get(created_by_id, "Unknown")
            club_dict["members_names"] = members_map.get(club_id, [])
            club_dict["events_count"] = event_count_map.get(club_id, 0)  # <-- add this
            clubs_list.append(club_dict)

        return JsonResponse({"clubs": clubs_list}, status=200)

    finally:
        session.close()
 
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

@csrf_exempt
@jwt_required
def get_club_members(request, club_id):
    session = SessionLocal()
    try:
        members_sql = """
            SELECT m.user_id, u.name, u.email, m.role, m.club_id
            FROM members m
            JOIN users u ON m.user_id = u.user_id
            WHERE m.club_id = :club_id
        """
        member_results = session.execute(text(members_sql), {"club_id": club_id}).mappings().all()
        all_members = [dict(row) for row in member_results]

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
    

@csrf_exempt
@jwt_required
def announcements_list_create(request, club_id):
    if request.method == "GET":
        session = SessionLocal()
        try:
            rows = session.execute(
                text("""
                    SELECT a.announcement_id, a.message, a.created_at,
                           u.name AS posted_by_name
                    FROM announcements a
                    LEFT JOIN users u ON u.user_id = a.posted_by_id
                    WHERE a.club_id = :club_id
                    ORDER BY a.created_at DESC
                """),
                {"club_id": club_id}
            ).mappings().all()

            announcements = [
                {
                    "id": row["announcement_id"],
                    "message": row["message"],
                    "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                    "posted_by_name": row["posted_by_name"],
                }
                for row in rows
            ]
            return JsonResponse({"announcements": announcements}, status=200)

        except Exception as e:
            print(f"🚨 ANNOUNCEMENTS GET ERROR: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
        finally:
            session.close()

    if request.method == "POST":
        session = SessionLocal()
        try:
            # Only admin of this club can post
            role_row = session.execute(
                text("""
                    SELECT role FROM members
                    WHERE club_id = :club_id AND user_id = :user_id
                """),
                {"club_id": club_id, "user_id": request.user_payload.get("user_id")}
            ).first()

            if not role_row or role_row[0] != "admin":
                return JsonResponse({"error": "Only admins can post announcements."}, status=403)

            body = json.loads(request.body)
            message = body.get("message", "").strip()

            if not message:
                return JsonResponse({"error": "Message cannot be empty."}, status=400)

            result = session.execute(
                text("""
                    INSERT INTO announcements (club_id, posted_by_id, message)
                    VALUES (:club_id, :posted_by_id, :message)
                    RETURNING announcement_id, created_at
                """),
                {
                    "club_id": club_id,
                    "posted_by_id": request.user_payload.get("user_id"),
                    "message": message,
                }
            ).first()

            session.commit()

            name_row = session.execute(
                text("SELECT name FROM users WHERE user_id = :user_id"),
                {"user_id": request.user_payload.get("user_id")}
            ).first()

            return JsonResponse({
                "announcement": {
                    "id": result[0],
                    "message": message,
                    "created_at": result[1].isoformat() if result[1] else None,
                    "posted_by_name": name_row[0] if name_row else "",
                }
            }, status=201)

        except Exception as e:
            print(f"🚨 ANNOUNCEMENTS POST ERROR: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
        finally:
            session.close()

    return JsonResponse({"error": "Method not allowed."}, status=405)

#Announcements
@csrf_exempt
@jwt_required
def announcement_delete(request, club_id, announcement_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "Method not allowed."}, status=405)

    session = SessionLocal()
    try:
        # Only admin of this club can delete
        role_row = session.execute(
            text("""
                SELECT role FROM members
                WHERE club_id = :club_id AND user_id = :user_id
            """),
            {"club_id": club_id, "user_id": request.user_payload.get("user_id")}
        ).first()

        if not role_row or role_row[0] != "admin":
            return JsonResponse({"error": "Only admins can delete announcements."}, status=403)

        session.execute(
            text("""
                DELETE FROM announcements
                WHERE announcement_id = :announcement_id AND club_id = :club_id
            """),
            {"announcement_id": announcement_id, "club_id": club_id}
        )
        session.commit()

        return JsonResponse({"success": True, "message": "Announcement deleted."}, status=200)

    except Exception as e:
        print(f"🚨 ANNOUNCEMENT DELETE ERROR: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
    finally:
        session.close()
