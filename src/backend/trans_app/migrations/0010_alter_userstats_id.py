# Generated by Django 4.1.2 on 2024-05-07 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trans_app', '0009_remove_usermatchstats_guest_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userstats',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]