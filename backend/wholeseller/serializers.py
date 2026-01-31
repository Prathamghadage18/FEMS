from rest_framework import serializers
from .models import Wholesaler, WholesalerCrop, SupplyRequest, Transaction, WholesalerInventory, PriceHistory, Crop

# Wholesaler Serializers
class WholesalerGETSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wholesaler
        fields = '__all__'

class WholesalerPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wholesaler
        fields = '__all__'


# WholesalerCrop Serializers
class WholesalerCropGETSerializer(serializers.ModelSerializer):
    wholesaler_name = serializers.CharField(source='wholesaler.name', read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)

    class Meta:
        model = WholesalerCrop
        fields = '__all__'

class WholesalerCropPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = WholesalerCrop
        fields = '__all__'


# SupplyRequest Serializers
class SupplyRequestGETSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.user.full_name', read_only=True)
    wholesaler_name = serializers.CharField(source='wholesaler.name', read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)

    class Meta:
        model = SupplyRequest
        fields = '__all__'

class SupplyRequestPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplyRequest
        fields = '__all__'


# Transaction Serializers
class TransactionGETSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.user.full_name', read_only=True)
    wholesaler_name = serializers.CharField(source='wholesaler.name', read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'

class TransactionPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


# WholesalerInventory Serializers
class WholesalerInventoryGETSerializer(serializers.ModelSerializer):
    wholesaler_name = serializers.CharField(source='wholesaler.name', read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)

    class Meta:
        model = WholesalerInventory
        fields = '__all__'

class WholesalerInventoryPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = WholesalerInventory
        fields = '__all__'


# PriceHistory Serializers
class PriceHistoryGETSerializer(serializers.ModelSerializer):
    wholesaler_name = serializers.CharField(source='wholesaler.name', read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)

    class Meta:
        model = PriceHistory
        fields = '__all__'

class PriceHistoryPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = '__all__'
