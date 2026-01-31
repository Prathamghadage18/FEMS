
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'phone', 'user_type')

class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'gender', 'is_active', 'full_name', 'phone', 'user_type')

class UserGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'phone', 'user_type', 'gender', 
                  'is_active', 'district', 'region', 'bio', 'registered_on')
        read_only_fields = ('id', 'registered_on', 'is_active')
        
class UserRegisterSerailizer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)
    full_name = serializers.CharField(required=True)
    user_type = serializers.ChoiceField(choices=[('FARMERS', 'FARMERS'), ('SUPPLIER', 'SUPPLIER')], default='FARMERS')

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "phone",
            "password",
            "password2",
            "full_name",
            "user_type",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        
        if (password and password2) and password != password2:
            raise serializers.ValidationError({"password": "Passwords must match."})
        
        if len(password) < 6:
            raise serializers.ValidationError({"password": "Password must be at least 6 characters."})
        
        return attrs

    def save(self):
        user = User(
            username=self.validated_data.get("username") or self.validated_data["email"],
            email=self.validated_data["email"],
            phone=self.validated_data["phone"],
            full_name=self.validated_data["full_name"],
            user_type=self.validated_data.get("user_type", "FARMERS"),
        )
        password = self.validated_data["password"]
        user.set_password(password)
        user.save()
        return user

