from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from api import views as api_views

urlpatterns = [
    path('captcha/', api_views.get_captcha, name="captcha_get"),
    path('token/', api_views.get_tokens_for_user, name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
