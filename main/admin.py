from django.contrib import admin
from main.models import Institution

@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'description')
    search_fields = ('name', 'type')
