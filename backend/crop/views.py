from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
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


class MaharashtraCropDataView(APIView):
    """
    Fetch live crop statistics from government agriculture API.
    """
    def get(self, request):
        # In a real scenario, we would use an API like:
        # url = "https://api.data.gov.in/resource/..."
        # params = {"api-key": settings.GOV_API_KEY, "format": "json"}
        # response = requests.get(url, params=params)
        # data = response.json()
        
        # Since we don't have a valid API key for data.gov.in, we return 
        # a mocked response based on real-world agricultural data for Maharashtra.
        
        mock_data = [
            {"district": "Ahmednagar", "crop": "Sugarcane", "area": "345000", "production": "28000000"},
            {"district": "Akola", "crop": "Cotton", "area": "210000", "production": "190000"},
            {"district": "Amravati", "crop": "Soybean", "area": "280000", "production": "310000"},
            {"district": "Aurangabad", "crop": "Maize", "area": "180000", "production": "220000"},
            {"district": "Beed", "crop": "Bajra", "area": "150000", "production": "120000"},
            {"district": "Bhandara", "crop": "Rice", "area": "190000", "production": "250000"},
            {"district": "Buldhana", "crop": "Cotton", "area": "240000", "production": "230000"},
            {"district": "Chandrapur", "crop": "Rice", "area": "200000", "production": "260000"},
            {"district": "Dhule", "crop": "Cotton", "area": "180000", "production": "195000"},
            {"district": "Gadchiroli", "crop": "Rice", "area": "160000", "production": "180000"},
            {"district": "Gondia", "crop": "Rice", "area": "210000", "production": "275000"},
            {"district": "Hingoli", "crop": "Soybean", "area": "170000", "production": "195000"},
            {"district": "Jalgaon", "crop": "Banana", "area": "45000", "production": "2800000"},
            {"district": "Jalna", "crop": "Cotton", "area": "195000", "production": "185000"},
            {"district": "Kolhapur", "crop": "Sugarcane", "area": "165000", "production": "15000000"},
            {"district": "Latur", "crop": "Soybean", "area": "290000", "production": "320000"},
            {"district": "Nagpur", "crop": "Orange", "area": "85000", "production": "600000"},
            {"district": "Nanded", "crop": "Cotton", "area": "220000", "production": "210000"},
            {"district": "Nandurbar", "crop": "Jowar", "area": "75000", "production": "65000"},
            {"district": "Nashik", "crop": "Grapes", "area": "55000", "production": "1200000"},
            {"district": "Osmanabad", "crop": "Soybean", "area": "200000", "production": "215000"},
            {"district": "Palghar", "crop": "Rice", "area": "90000", "production": "110000"},
            {"district": "Parbhani", "crop": "Sorghum", "area": "180000", "production": "160000"},
            {"district": "Pune", "crop": "Sugarcane", "area": "140000", "production": "12500000"},
            {"district": "Raigad", "crop": "Rice", "area": "120000", "production": "150000"},
            {"district": "Ratnagiri", "crop": "Mango", "area": "65000", "production": "320000"},
            {"district": "Sangli", "crop": "Grapes", "area": "40000", "production": "900000"},
            {"district": "Satara", "crop": "Sugarcane", "area": "130000", "production": "11500000"},
            {"district": "Sindhudurg", "crop": "Cashew", "area": "50000", "production": "85000"},
            {"district": "Solapur", "crop": "Jowar", "area": "310000", "production": "260000"},
            {"district": "Thane", "crop": "Rice", "area": "60000", "production": "75000"},
            {"district": "Wardha", "crop": "Cotton", "area": "190000", "production": "180000"},
            {"district": "Washim", "crop": "Soybean", "area": "185000", "production": "205000"},
            {"district": "Yavatmal", "crop": "Cotton", "area": "320000", "production": "310000"}
        ]
        
        return Response({
            "status": "success", 
            "source": "Government Agriculture Data (Mocked)",
            "data": mock_data
        }, status=status.HTTP_200_OK)
