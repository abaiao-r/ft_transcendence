# Generated by Django 4.1.2 on 2024-03-20 19:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0008_remove_match_loser_match_player3_match_player3_score_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usersetting',
            name='type_of_2fa',
            field=models.CharField(blank=True, default='none', max_length=30, null=True),
        ),
    ]
