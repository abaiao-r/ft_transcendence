# Generated by Django 4.1.2 on 2024-05-06 16:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trans_app', '0005_userstats'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userstats',
            name='form',
        ),
    ]
