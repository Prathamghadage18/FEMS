from .apis import *
from django.urls import path
# OTP verification commented out for development
# from .apis import UserOtpVerificationAPI
from .apis import UserProfileAPIView
from crop.views import FarmerAPIView

urlpatterns = [
    path('login/', LoginApiView.as_view()),
    path('register/', UserRegistrationAPI.as_view(), name='user-register'),
    # path('verify-otp/', UserOtpVerificationAPI.as_view()),  # OTP verification disabled
    path('profile/', UserProfileAPIView.as_view(), name='user-profile'),
    path('farmers/', FarmerAPIView.as_view(), name='farmer-list'),
    path('farmers/<uuid:id>/', FarmerAPIView.as_view(), name='farmer-detail'),
]
