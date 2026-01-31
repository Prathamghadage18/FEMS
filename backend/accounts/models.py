from uuid import uuid4
from django.db import models
from .managers import MyUserManager
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser 

class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid4)
    username = models.CharField(max_length=128, unique=True, blank=True)
    phone = models.CharField(
        max_length=15,  
        unique=True,
        validators=[RegexValidator(
            regex=r'^[0-9+]*$',
            message="Enter a valid phone number with numbers and '+' only",
        )]
    )   
    ROLES = (
        ('FARMERS', 'FARMERS'),
        ('SUPPLIER', 'SUPPLIER'),
        ('ADMIN', 'ADMIN'),
    )
    full_name = models.CharField(max_length=128)
    user_type = models.CharField(max_length=10, default='FARMERS', choices=ROLES)
    gender = models.CharField(max_length=10, default='MALE', choices=[
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    ])
    email = models.EmailField(max_length=255, unique=True, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    registered_on = models.DateTimeField(auto_now_add=True)
    is_guest = models.BooleanField(default=False)
    
    # Additional profile fields
    district = models.CharField(max_length=128, blank=True, null=True)
    region = models.CharField(max_length=128, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    
    objects = MyUserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ['full_name', 'user_type', 'is_guest', 'phone',]

    class Meta:
        ordering = ['-registered_on']

    def __str__(self):
        return self.full_name or self.username
    
    def save(self, *args, **kwargs):
        if not self.username:
            if self.email:
                self.username = self.email
            else:
                self.username = f"user_{str(self.id)[:8]}"
        return super().save(*args, **kwargs)
    
    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.is_admin

