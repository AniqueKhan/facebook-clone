# Generated by Django 3.2.22 on 2023-10-25 06:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0004_auto_20231025_1107'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendrequest',
            name='accepted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]