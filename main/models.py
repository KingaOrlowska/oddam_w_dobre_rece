from django.db import models
from django.contrib.auth.models import User

class Institution(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name

class Donation(models.Model):
    item = models.CharField(max_length=255)
    quantity = models.IntegerField()
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.item} - {self.quantity}"
