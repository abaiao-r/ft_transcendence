# Generated by Django 4.1.2 on 2024-05-11 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trans_app', '0013_remove_thread_users_remove_usersetting_elo_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usersetting',
            name='username',
            field=models.CharField(default='', max_length=100),
        ),
    ]
