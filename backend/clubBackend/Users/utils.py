from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

import jwt
from django.conf import settings
from django.http import JsonResponse

def jwt_required(view_func):
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return JsonResponse(
                {"error": "Authorization header missing"},
                status=401
            )

        try:
            # Expect: Authorization: Bearer <token>
            token = auth_header.split(" ")[1]

            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=["HS256"]
            )

            # Attach decoded data to request
            request.user_payload = payload

        except jwt.ExpiredSignatureError:
            return JsonResponse(
                {"error": "Token expired"},
                status=401
            )
        except jwt.InvalidTokenError:
            return JsonResponse(
                {"error": "Invalid token"},
                status=401
            )

        return view_func(request, *args, **kwargs)

    return wrapper