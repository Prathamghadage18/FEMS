from django.contrib import admin
from .models import Crop, Fertilizer, Plot, CropPlot, CropFertilizer, Farmer, CropStock, Machinery, Manpower, FarmTask, Resource, MarketPrice

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ['name', 'variety', 'season', 'price_per_kg']
    search_fields = ['name', 'variety']
    list_filter = ['season']


@admin.register(Fertilizer)
class FertilizerAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'quantity', 'application_date']
    search_fields = ['name']
    list_filter = ['type', 'application_date']


@admin.register(Plot)
class PlotAdmin(admin.ModelAdmin):
    list_display = ['name', 'area', 'soil_type', 'farmer', 'village']
    search_fields = ['name', 'farmer__username', 'village']
    list_filter = ['soil_type']


@admin.register(CropPlot)
class CropPlotAdmin(admin.ModelAdmin):
    list_display = ['crop', 'plot', 'planting_date', 'expected_harvest_date', 'is_mixed_cropping']
    search_fields = ['crop__name', 'plot__name']
    list_filter = ['is_mixed_cropping', 'seed_required', 'fertilizer_required']


@admin.register(CropFertilizer)
class CropFertilizerAdmin(admin.ModelAdmin):
    list_display = ['crop', 'fertilizer', 'application_rate']
    search_fields = ['crop__name', 'fertilizer__name']


@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ['user', 'get_user_email']
    search_fields = ['user__username', 'user__full_name']
    
    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'Email'


@admin.register(CropStock)
class CropStockAdmin(admin.ModelAdmin):
    list_display = ['crop', 'farmer', 'quantity_on_hold', 'sold_quantity', 'expected_harvest_date']
    search_fields = ['crop__name', 'farmer__username']
    list_filter = ['expected_harvest_date']


@admin.register(Machinery)
class MachineryAdmin(admin.ModelAdmin):
    list_display = ['name', 'total_number', 'farmer']
    search_fields = ['name', 'farmer__username']


@admin.register(Manpower)
class ManpowerAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'phone', 'farmer']
    search_fields = ['name', 'farmer__username']
    list_filter = ['position']


@admin.register(FarmTask)
class FarmTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'task_type', 'priority', 'status', 'farmer', 'due_date']
    search_fields = ['title', 'farmer__username']
    list_filter = ['task_type', 'priority', 'status', 'due_date']


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'resource_type', 'category', 'is_featured', 'views_count']
    search_fields = ['title', 'description']
    list_filter = ['resource_type', 'category', 'is_featured']


@admin.register(MarketPrice)
class MarketPriceAdmin(admin.ModelAdmin):
    list_display = ['crop', 'market_name', 'price_per_kg', 'price_date']
    search_fields = ['crop__name', 'market_name']
    list_filter = ['price_date', 'market_name']
