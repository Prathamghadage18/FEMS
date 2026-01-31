from django.db import models
from crop.models import Crop, Farmer
from portal.base import BaseModel
from decimal import Decimal

class Wholesaler(BaseModel):
    name = models.CharField(max_length=128)
    location = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=15, unique=True)
    storage_capacity = models.FloatField(help_text="Storage capacity in tons")

    def __str__(self):
        return self.name


class WholesalerCrop(BaseModel):
    wholesaler = models.ForeignKey(Wholesaler, on_delete=models.CASCADE, related_name='wholesaler_crops')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='wholesale_offers')
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price per kilogram offered to farmers")
    quantity_available = models.FloatField(help_text="Quantity in kilograms available for sale")

    class Meta:
        unique_together = ('wholesaler', 'crop')

    def __str__(self):
        return f'{self.crop.name} offered by {self.wholesaler.name} at {self.price} per kg'


class SupplyRequest(BaseModel):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='supply_requests')
    wholesaler = models.ForeignKey(Wholesaler, on_delete=models.CASCADE, related_name='supply_requests')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    quantity = models.FloatField(help_text="Quantity requested in kilograms")
    status = models.CharField(
        max_length=20,
        choices=[('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('DECLINED', 'Declined')],
        default='PENDING'
    )
    requested_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Request by {self.farmer.user.full_name} for {self.quantity} kg of {self.crop.name} from {self.wholesaler.name}"


class Transaction(BaseModel):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='transactions')
    wholesaler = models.ForeignKey(Wholesaler, on_delete=models.CASCADE, related_name='transactions')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    quantity = models.FloatField(help_text="Quantity sold in kilograms")
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[('COMPLETED', 'Completed'), ('FAILED', 'Failed')],
        default='COMPLETED'
    )

    def save(self, *args, **kwargs):
        # Calculate total cost if not set
        if not self.total_cost:
            wholesaler_crop = WholesalerCrop.objects.get(wholesaler=self.wholesaler, crop=self.crop)
            self.total_cost = Decimal(self.quantity) * wholesaler_crop.price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} kg of {self.crop.name} sold by {self.farmer.user.full_name} to {self.wholesaler.name} on {self.transaction_date}"


class WholesalerInventory(BaseModel):
    wholesaler = models.ForeignKey(Wholesaler, on_delete=models.CASCADE, related_name='inventory')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='wholesale_inventory')
    stock_level = models.FloatField(help_text="Current stock level in kilograms")
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.stock_level} kg of {self.crop.name} in {self.wholesaler.name}'s inventory"


class PriceHistory(BaseModel):
    wholesaler = models.ForeignKey(Wholesaler, on_delete=models.CASCADE, related_name='price_history')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='price_history')
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price per kilogram")
    effective_date = models.DateField()

    def __str__(self):
        return f"Price for {self.crop.name} at {self.wholesaler.name} on {self.effective_date} was {self.price} per kg"
