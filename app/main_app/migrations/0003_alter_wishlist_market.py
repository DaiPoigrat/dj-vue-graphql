# Generated by Django 4.2.3 on 2023-07-18 12:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0002_alter_wishlist_market'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wishlist',
            name='market',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main_app.market'),
        ),
    ]
