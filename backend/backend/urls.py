from django.contrib import admin
from django.urls import path,include
from myapi.views import Home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',Home),
    path('myapi/',include('myapi.urls'))
]
