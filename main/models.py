from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Institution(models.Model):
    FOUNDATION = 'fundacja'
    NGO = 'organizacja pozarządowa'
    LOCAL_COLLECTION = 'zbiórka lokalna'

    INSTITUTION_TYPES = [
        (FOUNDATION, 'Fundacja'),
        (NGO, 'Organizacja Pozarządowa'),
        (LOCAL_COLLECTION, 'Zbiórka Lokalna'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(
        max_length=25,
        choices=INSTITUTION_TYPES,
        default=FOUNDATION,
    )
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

    class Meta:
        verbose_name = "Instytucja"
        verbose_name_plural = "Instytucje"

class Donation(models.Model):
    quantity = models.IntegerField()
    categories = models.ManyToManyField('Category')
    institution = models.ForeignKey('Institution', on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    city = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    pick_up_date = models.DateField()
    pick_up_time = models.TimeField()
    pick_up_comment = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    is_picked_up = models.BooleanField(default=False)  # Nowe pole
    created_at = models.DateTimeField(default=timezone.now)  # Nowe pole

    def __str__(self):
        return f"Donation of {self.quantity} bags to {self.institution.name}"



