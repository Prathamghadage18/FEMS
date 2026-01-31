from django.contrib import admin
from .models import Wholesaler, WholesalerCrop, SupplyRequest, Transaction, WholesalerInventory, PriceHistory


class WholesalerCropInline(admin.TabularInline):
    model = WholesalerCrop
    extra = 1

@admin.register(Wholesaler)
class WholesalerAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'contact_number', 'storage_capacity')
    search_fields = ('name', 'location', 'contact_number')
    list_filter = ('location',)
    inlines = [WholesalerCropInline]


@admin.register(WholesalerCrop)
class WholesalerCropAdmin(admin.ModelAdmin):
    list_display = ('wholesaler', 'crop', 'price', 'quantity_available')
    list_filter = ('wholesaler', 'crop')
    search_fields = ('wholesaler__name', 'crop__name')


@admin.register(SupplyRequest)
class SupplyRequestAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'wholesaler', 'crop', 'quantity', 'status', 'requested_date')
    list_filter = ('status', 'requested_date', 'wholesaler')
    search_fields = ('farmer__user__full_name', 'wholesaler__name', 'crop__name')
    ordering = ('-requested_date',)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'wholesaler', 'crop', 'quantity', 'total_cost', 'transaction_date', 'status')
    list_filter = ('status', 'transaction_date', 'wholesaler')
    search_fields = ('farmer__user__full_name', 'wholesaler__name', 'crop__name')
    ordering = ('-transaction_date',)


@admin.register(WholesalerInventory)
class WholesalerInventoryAdmin(admin.ModelAdmin):
    list_display = ('wholesaler', 'crop', 'stock_level', 'last_updated')
    list_filter = ('wholesaler', 'crop')
    search_fields = ('wholesaler__name', 'crop__name')


@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ('wholesaler', 'crop', 'price', 'effective_date')
    list_filter = ('effective_date', 'wholesaler')
    search_fields = ('wholesaler__name', 'crop__name')
    ordering = ('-effective_date',)
