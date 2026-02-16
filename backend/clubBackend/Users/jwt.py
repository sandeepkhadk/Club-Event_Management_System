import jwt
from datetime import datetime, timedelta
from django.conf import settings

def generate_jwt(email, user_id, global_role, club_id=None, club_role=None):
    """
    Generate JWT including global role and single club role.
    """
    payload = {
        "email": email,
        "user_id": user_id,
        "global_role": global_role,
        "club_id": club_id,      
        "club_role": club_role, 
        "exp": datetime.utcnow() + timedelta(minutes=60),
        "iat": datetime.utcnow(),
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token
