from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TestResult

class TestResultSerializer(serializers.ModelSerializer):    
    class Meta:
        model = TestResult
        fields = ['id', 'name', 'created_at', 'total_tests', 'failed', 'passed', 'raw_logs', 'owner']
        read_only_fields = ['owner']

class RegisterSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        # Проверяем, совпадают ли пароли
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({"password_confirm": "Пароли не совпадают."})
        return data

    def create(self, validated_data):
        # Метод create_user сам захеширует пароль. 
        # Если использовать просто .create(), пароль сохранится текстом и войти не получится.
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user