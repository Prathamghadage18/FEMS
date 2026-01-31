from .models import Wholesaler, WholesalerCrop, SupplyRequest, Transaction, WholesalerInventory, PriceHistory
from .serializers import (
    WholesalerGETSerializer, WholesalerPOSTSerializer,
    WholesalerCropGETSerializer, WholesalerCropPOSTSerializer,
    SupplyRequestGETSerializer, SupplyRequestPOSTSerializer,
    TransactionGETSerializer, TransactionPOSTSerializer,
    WholesalerInventoryGETSerializer, WholesalerInventoryPOSTSerializer,
    PriceHistoryGETSerializer, PriceHistoryPOSTSerializer
)
from portal.base import BaseAPIView

# Wholesaler API View
class WholesalerAPIView(BaseAPIView):
    model = Wholesaler
    lookup = 'id'
    serializer_class = WholesalerGETSerializer
    post_serializer = WholesalerPOSTSerializer


# WholesalerCrop API View
class WholesalerCropAPIView(BaseAPIView):
    model = WholesalerCrop
    lookup = 'id'
    serializer_class = WholesalerCropGETSerializer
    post_serializer = WholesalerCropPOSTSerializer


# SupplyRequest API View
class SupplyRequestAPIView(BaseAPIView):
    model = SupplyRequest
    lookup = 'id'
    serializer_class = SupplyRequestGETSerializer
    post_serializer = SupplyRequestPOSTSerializer


# Transaction API View
class TransactionAPIView(BaseAPIView):
    model = Transaction
    lookup = 'id'
    serializer_class = TransactionGETSerializer
    post_serializer = TransactionPOSTSerializer


# WholesalerInventory API View
class WholesalerInventoryAPIView(BaseAPIView):
    model = WholesalerInventory
    lookup = 'id'
    serializer_class = WholesalerInventoryGETSerializer
    post_serializer = WholesalerInventoryPOSTSerializer


# PriceHistory API View
class PriceHistoryAPIView(BaseAPIView):
    model = PriceHistory
    lookup = 'id'
    serializer_class = PriceHistoryGETSerializer
    post_serializer = PriceHistoryPOSTSerializer
