from django.db import models

class SolvedCaptcha(models.Model):
    challenge = models.CharField(max_length=256, unique=True, db_index=True)
