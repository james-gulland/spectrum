# Generated by Django 4.2 on 2023-04-14 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mixtapes', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mixtape',
            name='end_time',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='mixtape',
            name='genre',
            field=models.CharField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='mixtape',
            name='release_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='mixtape',
            name='start_time',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
