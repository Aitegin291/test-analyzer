from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView

router = DefaultRouter()
router.register(r'reports', views.TestResultViewSet, basename='test-result')

urlpatterns = [
    path('reports/upload/', views.TestUploadView.as_view(), name='test-upload'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]