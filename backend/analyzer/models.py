from django.conf import settings
from django.db import models
from django.contrib.auth.models import User

class TestResult(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_results')
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    total_tests = models.IntegerField()
    passed = models.IntegerField()
    failed = models.IntegerField()
    raw_logs = models.JSONField(null=True, blank=True) 

    def __underline__str__(self):
        return f"{self.name} - {self.owner.username}"
    def __str__(self):
        return self.name

class TestError(models.Model):
    report = models.ForeignKey(TestResult, related_name='errors', on_delete=models.CASCADE)
    test_name = models.CharField(max_length=255)
    error_message = models.TextField()
    stack_trace = models.TextField(blank=True)
    category = models.CharField(max_length=100) # Например: Timeout, Assertion, Network

class Report(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='reports',
        null=True, # Временно, чтобы не сломать базу при миграции
        blank=True
    )
    name = models.CharField(max_length=255)
    success = models.IntegerField()
    failed = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner.username} - {self.name}"