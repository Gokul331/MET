from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    http_method_names = ['get', 'post', 'head', 'options']  # view list + submit contact message

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                'success': True,
                'message': 'Your contact message has been sent successfully. We will get back to you soon!',
            },
            status=status.HTTP_201_CREATED,
        )
