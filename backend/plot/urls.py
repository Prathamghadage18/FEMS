from django.urls import path
from .views import WaterResourceAPIView
from crop.views import PlotAPIView

urlpatterns = [
    path('water-resources/', WaterResourceAPIView.as_view(), name='water-resource-list'),
    path('water-resources/<uuid:id>/', WaterResourceAPIView.as_view(), name='water-resource-detail'),
    
    path('plots/', PlotAPIView.as_view(), name='plot-list'),
    path('plots/<uuid:id>/', PlotAPIView.as_view(), name='plot-detail'),
]
