import jwt
from datetime import datetime, timedelta
from django.conf import settings

def generate_jwt(email,role):
    payload = {
        "email": email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=60),
        "iat": datetime.utcnow(),
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token
