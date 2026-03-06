

"""Serializers for accounts app."""
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'bio', 'location', 'is_verified',
            'profile_photo', 'mobile_money_number', 'mobile_money_provider',
            'nationality', 'created_at',
        ]
        read_only_fields = ['id', 'is_verified', 'created_at']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username or obj.email.split('@')[0]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'password', 'password2', 'role', 'phone',
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        email = validated_data['email']
        username = email.split('@')[0]
        # Ensure unique username
        base = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}{counter}"
            counter += 1
        user = User(username=username, **validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user_obj = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid email or password.')
        user = authenticate(username=user_obj.username, password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')
        data['user'] = user
        return data


class HostRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'password', 'password2',
            'phone', 'bio', 'location', 'profile_photo', 'national_id_document',
            'mobile_money_number', 'mobile_money_provider',
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        email = validated_data['email']
        username = email.split('@')[0]
        base = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}{counter}"
            counter += 1
        user = User(username=username, role='host', **validated_data)
        user.set_password(password)
        user.save()
        return user


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'bio', 'location',
            'profile_photo', 'mobile_money_number', 'mobile_money_provider',
            'nationality',
        ]