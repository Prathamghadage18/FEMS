from django.urls import path
from .views import (
    CropAPIView, FertilizerAPIView, PlotAPIView,
    CropPlotAPIView, CropFertilizerAPIView, FarmerAPIView,
    CropStockAPIView, MachineryAPIView, ManpowerAPIView,
    FarmTaskAPIView, ResourceAPIView, MarketPriceAPIView,
)

urlpatterns = [
    # Crops
    path('', CropAPIView.as_view(), name='crop-list'),
    path('<uuid:id>/', CropAPIView.as_view(), name='crop-detail'),
    
    # Fertilizers
    path('fertilizers/', FertilizerAPIView.as_view(), name='fertilizer-list'),
    path('fertilizers/<uuid:id>/', FertilizerAPIView.as_view(), name='fertilizer-detail'),
    
    # Crop-Plots (Crop Planning)
    path('crop-plots/', CropPlotAPIView.as_view(), name='crop-plot-list'),
    path('crop-plots/<uuid:id>/', CropPlotAPIView.as_view(), name='crop-plot-detail'),
    
    # Crop-Fertilizers
    path('crop-fertilizers/', CropFertilizerAPIView.as_view(), name='crop-fertilizer-list'),
    path('crop-fertilizers/<uuid:id>/', CropFertilizerAPIView.as_view(), name='crop-fertilizer-detail'),
    
    # Crop Stocks
    path('stocks/', CropStockAPIView.as_view(), name='crop-stock-list'),
    path('stocks/<uuid:id>/', CropStockAPIView.as_view(), name='crop-stock-detail'),
    
    # Machinery
    path('machinery/', MachineryAPIView.as_view(), name='machinery-list'),
    path('machinery/<uuid:id>/', MachineryAPIView.as_view(), name='machinery-detail'),
    
    # Manpower
    path('manpower/', ManpowerAPIView.as_view(), name='manpower-list'),
    path('manpower/<uuid:id>/', ManpowerAPIView.as_view(), name='manpower-detail'),
    
    # Farm Tasks
    path('tasks/', FarmTaskAPIView.as_view(), name='task-list'),
    path('tasks/<uuid:id>/', FarmTaskAPIView.as_view(), name='task-detail'),
    
    # Resources (Library)
    path('resources/', ResourceAPIView.as_view(), name='resource-list'),
    path('resources/<uuid:id>/', ResourceAPIView.as_view(), name='resource-detail'),
    
    # Market Prices
    path('market-prices/', MarketPriceAPIView.as_view(), name='market-price-list'),
    path('market-prices/<uuid:id>/', MarketPriceAPIView.as_view(), name='market-price-detail'),
]
