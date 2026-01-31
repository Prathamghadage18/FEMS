from .models import WaterResource
from .serializers import WaterResourceGETSerializer, WaterResourcePOSTSerializer
from portal.base import BaseAPIView 

class WaterResourceAPIView(BaseAPIView):
    model = WaterResource
    lookup='id'
    serializer_class = WaterResourceGETSerializer
    post_serializer = WaterResourcePOSTSerializer
