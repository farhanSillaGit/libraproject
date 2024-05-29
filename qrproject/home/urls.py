
from django.urls import path
from . import views
urlpatterns = [

    path('', views.home,name='home'),

    path('index/',views.home,name='home'),
    path('security_patrol/',views.security_patrol,name='security_patrol'),
    path('track_attendance/',views.track_attendance,name='track_attendance'),
    path('formsubmit/',views.form_submission,name='form_submission'),


]