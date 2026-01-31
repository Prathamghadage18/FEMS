from django.db import models
from accounts.models import User
from crop.models import Crop
import uuid
from portal.base import BaseModel

    
class WaterResource(BaseModel):
    name = models.CharField(max_length=128)
    resource_type = models.CharField(
        max_length=50, 
        choices=[('WELL', 'Well'), ('CANAL', 'Canal'), ('RIVER', 'River'), ('TUBEWELL', 'Tubewell')],
        default='WELL'
    )
    plot = models.ForeignKey('crop.Plot', on_delete=models.CASCADE, related_name='water_resources')
    availability_status = models.CharField(
        max_length=50, 
        choices=[('AVAILABLE', 'Available'), ('SCARCE', 'Scarce'), ('NOT_AVAILABLE', 'Not Available')],
        default='AVAILABLE'
    )

    def __str__(self):
        return f'{self.name} ({self.resource_type})'
 