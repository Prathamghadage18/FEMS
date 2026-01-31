from rest_framework import serializers
from .models import WaterResource

class WaterResourceGETSerializer(serializers.ModelSerializer):
    plot_name = serializers.CharField(source='plot.name', read_only=True)

    class Meta:
        model = WaterResource
        fields = '__all__'

class WaterResourcePOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterResource
        fields = '__all__'
