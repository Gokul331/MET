from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'colleges':     reverse('college-list',      request=request, format=format),
        'courses':      reverse('course-list',       request=request, format=format),
        'applications': reverse('application-list',  request=request, format=format),
        'contact':      reverse('contact-list',      request=request, format=format),
        'scholarships': reverse('scholarship-list',  request=request, format=format),
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include('colleges.urls')),
    path('api/', include('applications.urls')),
    path('api/', include('contact.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
