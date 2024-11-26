from django.urls import path
from .views import HelloWorldView, InsightView

urlpatterns = [
    path('hello/', HelloWorldView.as_view(), name='hello'),
    path('insights/', InsightView.as_view(), name='insights'),
]
