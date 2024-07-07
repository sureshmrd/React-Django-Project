from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User , on_delete=models.CASCADE)
    forget_password_token = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

class Counsellor(models.Model):
    counId = models.CharField(max_length=12, primary_key=True)
    name = models.CharField(max_length=10)
    phoneNo = models.CharField(max_length=15)
    mail = models.EmailField()

    def __str__(self):
        return self.counId

class Student(models.Model):
    regNo = models.CharField(max_length=10, primary_key=True)
    counId = models.ForeignKey(Counsellor, on_delete=models.CASCADE, related_name='students')
    year = models.IntegerField()
    branch = models.CharField(max_length=100)
    section = models.CharField(max_length=1)
    cgpa = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    activebacklogs = models.IntegerField(default=0)

    def __str__(self):
        return self.regNo

class Result(models.Model):
    regNo = models.CharField(max_length=10)
    subCode = models.CharField(max_length=50)
    subName = models.CharField(max_length=50)
    internals = models.CharField(max_length=10)
    grade = models.CharField(max_length=12)
    credits = models.CharField(max_length=12)
    sem = models.CharField(max_length=5)
    month_year = models.DateField()

    class Meta:
        # Define a composite unique constraint on regNo, subCode, and month_year
        unique_together = (('regNo', 'subCode', 'month_year'),)
    
    def __str__(self):
        return self.regNo
