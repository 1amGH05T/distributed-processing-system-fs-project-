from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import JobListCreateView, JobDetailView, RegisterView, UserListView, UserDetailView, CheckAdminView

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='auth_register'),
    path('auth/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/check-admin', CheckAdminView.as_view(), name='check-admin'),
    path('jobs', JobListCreateView.as_view(), name='job-list-create'),
    path('jobs/<uuid:pk>', JobDetailView.as_view(), name='job-detail'),
    path('users', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>', UserDetailView.as_view(), name='user-detail'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', TokenObtainPairView.as_view_view(), name='token_obtain_pair'),
]
