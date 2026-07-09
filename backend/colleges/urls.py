from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CollegeViewSet, CourseViewSet, scholarship_list

router = DefaultRouter()
router.register(r'colleges', CollegeViewSet, basename='college')
router.register(r'courses',  CourseViewSet,  basename='course')

urlpatterns = [
    path('', include(router.urls)),
    path('scholarships/', scholarship_list, name='scholarship-list'),
]
