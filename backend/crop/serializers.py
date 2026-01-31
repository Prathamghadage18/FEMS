from rest_framework import serializers
from .models import Crop, Fertilizer, Plot, CropPlot, CropFertilizer, Farmer, CropStock, Machinery, Manpower, FarmTask, Resource, MarketPrice

class CropGETSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__'

class CropPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__'


class FertilizerGETSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fertilizer
        fields = '__all__'

class FertilizerPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fertilizer
        fields = '__all__'

class PlotGETSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)

    class Meta:
        model = Plot
        fields = '__all__'

class PlotPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plot
        fields = '__all__'


class CropPlotGETSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    plot_name = serializers.CharField(source='plot.name', read_only=True)

    class Meta:
        model = CropPlot
        fields = '__all__'

class CropPlotPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropPlot
        fields = '__all__'


class CropFertilizerGETSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    fertilizer_name = serializers.CharField(source='fertilizer.name', read_only=True)

    class Meta:
        model = CropFertilizer
        fields = '__all__'

class CropFertilizerPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropFertilizer
        fields = '__all__'


class FarmerGETSerializer(serializers.ModelSerializer):
    crops = CropGETSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = Farmer
        fields = '__all__'

class FarmerPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = '__all__'


# CropStock Serializers
class CropStockGETSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)

    class Meta:
        model = CropStock
        fields = '__all__'

class CropStockPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropStock
        fields = '__all__'


# Machinery Serializers
class MachineryGETSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)

    class Meta:
        model = Machinery
        fields = '__all__'

class MachineryPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machinery
        fields = '__all__'


# Manpower Serializers
class ManpowerGETSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)

    class Meta:
        model = Manpower
        fields = '__all__'

class ManpowerPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manpower
        fields = '__all__'


# FarmTask Serializers
class FarmTaskGETSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)
    plot_name = serializers.CharField(source='plot.name', read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)

    class Meta:
        model = FarmTask
        fields = '__all__'

class FarmTaskPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmTask
        fields = '__all__'


# Resource Serializers
class ResourceGETSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'

class ResourcePOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'


# MarketPrice Serializers
class MarketPriceGETSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.name', read_only=True)

    class Meta:
        model = MarketPrice
        fields = '__all__'

class MarketPricePOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketPrice
        fields = '__all__'
