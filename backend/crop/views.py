from rest_framework import status
from .models import Crop, Fertilizer, Plot, CropPlot, CropFertilizer, Farmer, CropStock, Machinery, Manpower, FarmTask, Resource, MarketPrice
from .serializers import (
    CropGETSerializer, CropPOSTSerializer,
    FertilizerGETSerializer, FertilizerPOSTSerializer,
    PlotGETSerializer, PlotPOSTSerializer,
    CropPlotGETSerializer, CropPlotPOSTSerializer,
    CropFertilizerGETSerializer, CropFertilizerPOSTSerializer,
    FarmerGETSerializer, FarmerPOSTSerializer,
    CropStockGETSerializer, CropStockPOSTSerializer,
    MachineryGETSerializer, MachineryPOSTSerializer,
    ManpowerGETSerializer, ManpowerPOSTSerializer,
    FarmTaskGETSerializer, FarmTaskPOSTSerializer,
    ResourceGETSerializer, ResourcePOSTSerializer,
    MarketPriceGETSerializer, MarketPricePOSTSerializer,
)
from portal.base import BaseAPIView  

class CropAPIView(BaseAPIView):
    model = Crop
    lookup = 'id'
    serializer_class = CropGETSerializer
    post_serializer = CropPOSTSerializer


class FertilizerAPIView(BaseAPIView):
    model = Fertilizer
    lookup = 'id'
    serializer_class = FertilizerGETSerializer
    post_serializer = FertilizerPOSTSerializer


class PlotAPIView(BaseAPIView):
    model = Plot
    lookup = 'id'
    serializer_class = PlotGETSerializer
    post_serializer = PlotPOSTSerializer


class CropPlotAPIView(BaseAPIView):
    model = CropPlot
    lookup = 'id'
    serializer_class = CropPlotGETSerializer
    post_serializer = CropPlotPOSTSerializer


class CropFertilizerAPIView(BaseAPIView):
    model = CropFertilizer
    lookup = 'id'
    serializer_class = CropFertilizerGETSerializer
    post_serializer = CropFertilizerPOSTSerializer


class FarmerAPIView(BaseAPIView):
    model = Farmer
    lookup = 'id'
    serializer_class = FarmerGETSerializer
    post_serializer = FarmerPOSTSerializer


class CropStockAPIView(BaseAPIView):
    model = CropStock
    lookup = 'id'
    serializer_class = CropStockGETSerializer
    post_serializer = CropStockPOSTSerializer


class MachineryAPIView(BaseAPIView):
    model = Machinery
    lookup = 'id'
    serializer_class = MachineryGETSerializer
    post_serializer = MachineryPOSTSerializer


class ManpowerAPIView(BaseAPIView):
    model = Manpower
    lookup = 'id'
    serializer_class = ManpowerGETSerializer
    post_serializer = ManpowerPOSTSerializer


class FarmTaskAPIView(BaseAPIView):
    model = FarmTask
    lookup = 'id'
    serializer_class = FarmTaskGETSerializer
    post_serializer = FarmTaskPOSTSerializer


class ResourceAPIView(BaseAPIView):
    model = Resource
    lookup = 'id'
    serializer_class = ResourceGETSerializer
    post_serializer = ResourcePOSTSerializer


class MarketPriceAPIView(BaseAPIView):
    model = MarketPrice
    lookup = 'id'
    serializer_class = MarketPriceGETSerializer
    post_serializer = MarketPricePOSTSerializer
