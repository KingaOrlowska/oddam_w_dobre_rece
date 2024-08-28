# urls.py

from django.urls import path
from main.views import landing_page, add_donation, login_view, register_view, form_confirmation_view, custom_logout_view
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', landing_page, name='landing_page'),
    path('add-donation/', add_donation, name='add_donation'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', custom_logout_view, name='logout'),
    path('form-confirmation/', form_confirmation_view, name='form_confirmation'),
    # Wzorce URL dla resetowania hasła
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]
