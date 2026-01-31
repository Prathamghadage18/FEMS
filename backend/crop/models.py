from django.db import models
from accounts.models import User
import uuid
from portal.base import BaseModel

class Crop(BaseModel):
    name = models.CharField(max_length=128)
    variety = models.CharField(max_length=128, blank=True)
    season = models.CharField(max_length=50, choices=[
        ('KHARIF', 'Kharif (Monsoon)'),
        ('RABI', 'Rabi (Spring)'),
        ('ZAID', 'Zaid (Summer)'),
    ], default='KHARIF')
    description = models.TextField(blank=True, null=True)
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f'{self.name} ({self.variety})'


class Fertilizer(BaseModel):
    name = models.CharField(max_length=128)
    type = models.CharField(
        max_length=50, 
        choices=[('ORGANIC', 'Organic'), ('INORGANIC', 'Inorganic')],
        default='INORGANIC'
    )
    quantity = models.FloatField(help_text="Quantity in kilograms", default=0)
    application_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'{self.name} ({self.type}) - {self.quantity} kg'


class Plot(BaseModel):
    name = models.CharField(max_length=128)
    area = models.FloatField(help_text="Area in acres or hectares")
    soil_type = models.CharField(max_length=50, blank=True, choices=[
        ('CLAY', 'Clay'),
        ('SANDY', 'Sandy'),
        ('LOAMY', 'Loamy'),
        ('SILT', 'Silt'),
        ('PEAT', 'Peat'),
        ('CHALK', 'Chalk'),
    ])
    survey_number = models.CharField(max_length=128, blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    altitude = models.FloatField(blank=True, null=True)
    village = models.CharField(max_length=128, blank=True, null=True)
    ownership = models.CharField(max_length=128, blank=True, null=True)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='plots')

    def __str__(self):
        return f'{self.name} ({self.area} acres)'

    
class CropPlot(BaseModel):
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    plot = models.ForeignKey(Plot, on_delete=models.CASCADE)
    planting_date = models.DateField(null=True, blank=True)
    expected_harvest_date = models.DateField(null=True, blank=True)
    is_mixed_cropping = models.BooleanField(default=False)
    seed_required = models.BooleanField(default=False)
    fertilizer_required = models.BooleanField(default=False)
    manpower_required = models.BooleanField(default=False)

    class Meta:
        unique_together = ('crop', 'plot')  

    def __str__(self):
        return f'{self.crop.name} on {self.plot.name}'
    

class CropFertilizer(BaseModel):
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    fertilizer = models.ForeignKey(Fertilizer, on_delete=models.CASCADE)
    application_rate = models.FloatField(help_text="Rate of application in kg/acre")

    class Meta:
        unique_together = ('crop', 'fertilizer')

    def __str__(self):
        return f'{self.fertilizer.name} used for {self.crop.name}'
    

class Farmer(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  
    crops = models.ManyToManyField(Crop, related_name='farmers', blank=True)

    def __str__(self):
        return self.user.full_name


class CropStock(BaseModel):
    """Track crop stock/inventory"""
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='stocks')
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_stocks')
    quantity_on_hold = models.FloatField(default=0, help_text="Quantity in kg")
    sold_quantity = models.FloatField(default=0, help_text="Quantity in kg")
    expected_harvest_date = models.DateField(null=True, blank=True)
    expected_selling_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f'{self.crop.name} - {self.quantity_on_hold} kg'


class Machinery(BaseModel):
    """Track farm machinery"""
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)
    total_number = models.IntegerField(default=1)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='machinery', null=True, blank=True)

    def __str__(self):
        return f'{self.name} ({self.total_number})'


class Manpower(BaseModel):
    """Track farm workers"""
    name = models.CharField(max_length=128)
    phone = models.CharField(max_length=15, blank=True, null=True)
    position = models.CharField(max_length=50, choices=[
        ('WORKER', 'Worker'),
        ('MANAGER', 'Manager'),
        ('SUPERVISOR', 'Supervisor'),
    ], default='WORKER')
    description = models.TextField(blank=True, null=True)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workers', null=True, blank=True)

    def __str__(self):
        return f'{self.name} ({self.position})'


class FarmTask(BaseModel):
    """Task management for farming activities"""
    TASK_TYPES = [
        ('IRRIGATION', 'Irrigation'),
        ('FERTILIZATION', 'Fertilization'),
        ('PEST_CONTROL', 'Pest Control'),
        ('HARVESTING', 'Harvesting'),
        ('PLANTING', 'Planting'),
        ('WEEDING', 'Weeding'),
        ('SOIL_PREPARATION', 'Soil Preparation'),
        ('OTHER', 'Other'),
    ]
    
    PRIORITY_LEVELS = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    task_type = models.CharField(max_length=20, choices=TASK_TYPES, default='OTHER')
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='MEDIUM')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    plot = models.ForeignKey(Plot, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    crop = models.ForeignKey(Crop, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    
    due_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    estimated_hours = models.FloatField(default=0, help_text="Estimated time in hours")
    actual_hours = models.FloatField(default=0, help_text="Actual time spent in hours")
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return f'{self.title} ({self.task_type}) - {self.status}'


class Resource(BaseModel):
    """Resource Library for articles, guides, and farming resources"""
    RESOURCE_TYPES = [
        ('ARTICLE', 'Article'),
        ('GUIDE', 'Guide'),
        ('VIDEO', 'Video'),
        ('PDF', 'PDF Document'),
        ('INFOGRAPHIC', 'Infographic'),
        ('OTHER', 'Other'),
    ]
    
    CATEGORIES = [
        ('CROP_MANAGEMENT', 'Crop Management'),
        ('PEST_CONTROL', 'Pest Control'),
        ('IRRIGATION', 'Irrigation'),
        ('SOIL_HEALTH', 'Soil Health'),
        ('WEATHER', 'Weather & Climate'),
        ('MARKET', 'Market Information'),
        ('TECHNOLOGY', 'Farm Technology'),
        ('ORGANIC_FARMING', 'Organic Farming'),
        ('LIVESTOCK', 'Livestock'),
        ('GENERAL', 'General'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    content = models.TextField(blank=True, null=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES, default='ARTICLE')
    category = models.CharField(max_length=20, choices=CATEGORIES, default='GENERAL')
    
    external_url = models.URLField(blank=True, null=True)
    thumbnail_url = models.URLField(blank=True, null=True)
    
    author = models.CharField(max_length=128, blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    views_count = models.IntegerField(default=0)
    
    tags = models.CharField(max_length=255, blank=True, null=True, help_text="Comma-separated tags")

    class Meta:
        ordering = ['-is_featured', '-created_on']

    def __str__(self):
        return f'{self.title} ({self.resource_type})'


class MarketPrice(BaseModel):
    """Track market prices for crops"""
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='market_prices')
    market_name = models.CharField(max_length=128)
    location = models.CharField(max_length=255, blank=True, null=True)
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    price_date = models.DateField()
    
    min_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ['-price_date']

    def __str__(self):
        return f'{self.crop.name} at {self.market_name} - ₹{self.price_per_kg}/kg'
