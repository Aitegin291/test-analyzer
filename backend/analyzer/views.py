import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .models import TestResult
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from .serializers import TestResultSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) 
    serializer_class = RegisterSerializer
    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response(
                {'username': ['Этот логин уже занят']}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {'email': ['Пользователь с такой почтой уже существует']}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.create_user(
                username=username, 
                email=email, 
                password=password
            )
            return Response(
                {'message': 'Пользователь успешно создан'}, 
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'non_field_errors': [str(e)]}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all().order_by('-created_at')
    serializer_class = TestResultSerializer
    permission_classes = [IsAuthenticated]


class TestResultViewSet(viewsets.ModelViewSet):
    serializer_class = TestResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Возвращает отчеты только текущего юзера
        return TestResult.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # При сохранении нового отчета автоматически назначаем владельца
        serializer.save(owner=self.request.user)

class TestUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('file')
        
        if not file:
            return Response({"error": "Файл не найден"}, status=status.HTTP_400_BAD_REQUEST)

        if not file.name.endswith('.json'):
            return Response({"error": "Разрешены только файлы .json"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_file = file.read().decode('utf-8')
            data = json.loads(decoded_file)
            
            if 'tests' not in data:
                return Response({"error": "В JSON отсутствует поле 'tests'"}, status=status.HTTP_400_BAD_REQUEST)

            tests = data.get('tests', [])
            total = len(tests)
            failed = sum(1 for t in tests if t.get('status') == 'failed')
            passed = total - failed
            
            report = TestResult.objects.create(
                owner=request.user,
                name=file.name,
                total_tests=total,
                failed=failed,
                passed=passed,
                raw_logs=data 
            )

            serializer = TestResultSerializer(report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

