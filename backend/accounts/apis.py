import jwt
import random
from datetime import datetime, timedelta
from django.conf import settings
from portal.base import BaseAPIView
from django.utils import timezone
# Email and OTP services - commented out for development
# from services.email import EmailService
# from services.otpservice import send_otp, otp_verify, resend_otp
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from accounts.models import User
from accounts.serializers import (
    UserRegisterSerailizer,
    UserSerializer,
    UserGetSerializer,
)

SECRET_KEY = settings.SECRET_KEY

class LoginApiView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'message': 'Email and password are required'},
                status=400
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'message': 'Invalid credentials'},
                status=400
            )
        
        # Check password
        if not user.check_password(password):
            return Response(
                {'message': 'Invalid credentials'},
                status=400
            )
        
        # Check if user is active
        if not user.is_active:
            return Response(
                {'message': 'Account is not active. Please verify your account.'},
                status=403
            )
        
        payload = {
            'user_id': str(user.id),
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')  
        
        return Response({
            'full_name': user.full_name,
            'username': user.username,
            'user_id': str(user.id),
            'user_type': user.user_type,
            'phone': user.phone,
            'email': user.email,
            'token': token,
            'message': 'Login successful'
        })


class UserProfileAPIView(APIView):
    """Get and update current user profile"""
    
    def get(self, request):
        user = request.user
        serializer = UserGetSerializer(user)
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user
        serializer = UserGetSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'data': serializer.data
            })
        return Response(serializer.errors, status=400)
    

# OTP Verification API - commented out for development (not using SMS/OTP right now)
# class UserOtpVerificationAPI(APIView):
#     def post(self, request, *args, **kwargs):
#         data = request.data
#
#         if data.get("resend_otp") == "resend_otp":
#             if data.get("phone"):
#                 try:
#                     response = resend_otp(data.get("phone"))
#                     return Response(response)
#                 except Exception as e:
#                     return Response({"msg": "Failed to resend OTP", "error": str(e)}, status=500)
#             return Response({"msg": "phone field required"}, status=400)
#
#         user = User.objects.filter(username=data.get("username")).first()
#         if not (data.get("username") and data.get("phone") and data.get("otp")):
#             return Response(
#                 {"msg": "username, phone, and otp are required"}, status=400
#             )
#
#         if not user:
#             return Response({"msg": "User not found"}, status=404)
#
#         try:
#             response = otp_verify(data.get("phone"), data.get("otp"))
#             if response.get("type") == "success":
#                 user.is_active = True
#                 user.save()
#                 return Response({"msg": "Account verified successfully", "type": "success"})
#         except Exception as e:
#             return Response({"msg": "OTP verification failed", "error": str(e)}, status=400)
#         
#         return Response(response)


class UserRegistrationAPI(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserRegisterSerailizer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            
            # Set user as active immediately for development
            # In production, set is_active=False and require OTP verification
            user.is_active = True
            user.save()

            # Generate token for immediate login after registration
            payload = {
                'user_id': str(user.id),
                'exp': datetime.utcnow() + timedelta(days=7)
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

            data = serializer.data
            data['token'] = token
            data['message'] = 'Registration successful'
            return Response(data, status=201)
        return Response(serializer.errors, status=400)
    


