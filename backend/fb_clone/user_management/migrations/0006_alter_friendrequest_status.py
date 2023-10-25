# Generated by Django 3.2.22 on 2023-10-25 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0005_alter_friendrequest_accepted_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendrequest',
            name='status',
            field=models.CharField(choices=[('A', 'Accepted'), ('R', 'Rejected'), ('P', 'Pending')], default='P', max_length=255),
        ),
    ]