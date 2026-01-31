from django.db import models
from .base import BaseModel
# Create your models here.

class ContentManagement(BaseModel):
    name=models.CharField(max_length=50)
    description=models.TextField()
    main_content=models.TextField()
    