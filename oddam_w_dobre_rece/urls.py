from django.urls import path
from django.contrib import admin
from django.contrib.auth import views as auth_views
from main.views import (
    landing_page,
    add_donation,
    login_view,
    register_view,
    form_confirmation_view,
    custom_logout_view,
    user_profile_view,
    user_donations_view,
    donation_detail_view
)


urlpatterns = [
    path('', landing_page, name='landing_page'),
    path('add-donation/', add_donation, name='add_donation'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', custom_logout_view, name='logout'),
    path('form-confirmation/', form_confirmation_view, name='form_confirmation'),
    path('admin/', admin.site.urls),
    # Wzorce URL dla resetowania hasła
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('user-donations/', user_donations_view, name='user_donations'),
    path('donation/<int:donation_id>/', donation_detail_view, name='donation_detail'),

    path('user-profile/', user_profile_view, name='user_profile'),
]
