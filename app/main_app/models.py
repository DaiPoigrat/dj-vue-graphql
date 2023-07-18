from django.db import models


# Create your models here.
class Market(models.Model):
    name = models.CharField("Name", max_length=50, unique=True)

    def __str__(self):
        return f'||{self.name} {self.id}||'


class WishList(models.Model):
    market = models.ForeignKey(to=Market, on_delete=models.CASCADE, to_field='id')

    name = models.CharField("Item", max_length=50)

    def __str__(self):
        return f'||{self.name} {self.id}||'
