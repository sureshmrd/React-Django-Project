from django.contrib import admin
from .models import Result,Student,Counsellor
# Register your models here.
admin.site.register(Counsellor)
admin.site.register(Student)
admin.site.register(Result)