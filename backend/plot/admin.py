from django.contrib import admin
from .models import WaterResource

@admin.register(WaterResource)
class WaterResourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'resource_type', 'plot', 'availability_status']
    search_fields = ['name', 'plot__name']
    list_filter = ['resource_type', 'availability_status']
