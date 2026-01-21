# from django.shortcuts import render

# # Create your views here.
# from django.shortcuts import render, redirect
# from django.http import HttpResponse
# from .db import engine, users
# from sqlalchemy import select
# import hashlib  # for password hashing (optional)

# def login_view(request):
#     if request.method == 'POST':
#         email = request.POST.get('email')
#         password = request.POST.get('password')

#         # Optional: hash the password if stored hashed
#         # password = hashlib.sha256(password.encode()).hexdigest()

#         with engine.connect() as conn:
#             stmt = select(users).where(users.c.email == email, users.c.password == password)
#             result = conn.execute(stmt).first()

#             if result:
#                 return HttpResponse(f"Welcome {result['name']}!")
#             else:
#                 return HttpResponse("Invalid email or password.")

#     return render(request, 'accounts/login.html')

# Users/views.py
from django.http import JsonResponse
from datetime import datetime
from sqlalchemy import insert
from .db import engine, users
from django.views.decorators.csrf import csrf_exempt
from .utils import hash_password
from .jwt import generate_jwt


@csrf_exempt
def register_view(request):

    if request.method == "POST":
      
        import json
        data = json.loads(request.body) 
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")  
        
       
        try:
            with engine.connect() as conn:
                hashed_password = hash_password(password)
                stmt = insert(users).values(
                    name=name,
                    email=email,
                    password= hashed_password ,
                    created_at=datetime.now()
                )
                conn.execute(stmt)
                conn.commit()
            token = generate_jwt(email)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

       
        return JsonResponse({"success": True, "message": "User registered successfully","token":token})
    
  
    return JsonResponse({"success": False, "error": "Invalid request method"}, status=400)


