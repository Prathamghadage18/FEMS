from django.urls import path
from .views import (
    WholesalerAPIView, WholesalerCropAPIView,
    SupplyRequestAPIView, TransactionAPIView, WholesalerInventoryAPIView,
    PriceHistoryAPIView
)
from crop.views import PlotAPIView

urlpatterns = [
    # Plots
    path('plots/', PlotAPIView.as_view(), name='plot-list'),
    path('plots/<uuid:id>/', PlotAPIView.as_view(), name='plot-detail'),

    # Wholesalers
    path('wholesalers/', WholesalerAPIView.as_view(), name='wholesaler-list'),
    path('wholesalers/<uuid:id>/', WholesalerAPIView.as_view(), name='wholesaler-detail'),

    # Wholesaler Crops
    path('wholesaler-crops/', WholesalerCropAPIView.as_view(), name='wholesaler-crop-list'),
    path('wholesaler-crops/<uuid:id>/', WholesalerCropAPIView.as_view(), name='wholesaler-crop-detail'),

    # Supply Requests
    path('supply-requests/', SupplyRequestAPIView.as_view(), name='supply-request-list'),
    path('supply-requests/<uuid:id>/', SupplyRequestAPIView.as_view(), name='supply-request-detail'),

    # Transactions
    path('transactions/', TransactionAPIView.as_view(), name='transaction-list'),
    path('transactions/<uuid:id>/', TransactionAPIView.as_view(), name='transaction-detail'),

    # Wholesaler Inventory
    path('wholesaler-inventories/', WholesalerInventoryAPIView.as_view(), name='wholesaler-inventory-list'),
    path('wholesaler-inventories/<uuid:id>/', WholesalerInventoryAPIView.as_view(), name='wholesaler-inventory-detail'),

    # Price History
    path('price-history/', PriceHistoryAPIView.as_view(), name='price-history-list'),
    path('price-history/<uuid:id>/', PriceHistoryAPIView.as_view(), name='price-history-detail'),
]
