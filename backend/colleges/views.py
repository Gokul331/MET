from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django_filters.rest_framework import DjangoFilterBackend
from .models import College, Course
from .serializers import (
    CollegeListSerializer, CollegeDetailSerializer,
    CourseSerializer, CourseDetailSerializer,
)

# ── Scholarship static data ───────────────────────────────────────────────────
SCHOLARSHIPS = [
    {
        'id': 1, 'title': 'Merit Scholarship',
        'amount': '₹25,000', 'icon': '🏆', 'color': '#f59e0b',
        'eligibility': 'Students scoring 90%+ in 12th standard',
        'details': [
            'Applicable for Engineering & Medical programs',
            'One-time award at the time of admission',
            'No repayment required',
        ],
    },
    {
        'id': 2, 'title': 'Academic Excellence Award',
        'amount': '₹15,000', 'icon': '🎓', 'color': '#7c3aed',
        'eligibility': 'Students scoring 80%–89% in 12th standard',
        'details': [
            'Available across all courses',
            'Merit-based selection',
            'Awarded at admission time',
        ],
    },
    {
        'id': 3, 'title': 'NEET / JEE Achiever Grant',
        'amount': '₹20,000', 'icon': '💡', 'color': '#2563eb',
        'eligibility': 'Students with NEET / JEE rank under 50,000',
        'details': [
            'For Medical & Engineering aspirants',
            'Rank-based slab system',
            'Stackable with other scholarships',
        ],
    },
    {
        'id': 4, 'title': 'Need-Based Scholarship',
        'amount': 'Up to ₹10,000', 'icon': '🌱', 'color': '#16a34a',
        'eligibility': 'Students from economically weaker sections',
        'details': [
            'Income certificate required',
            'Available for all courses',
            'Renewable annually on performance',
        ],
    },
    {
        'id': 5, 'title': 'Early Bird Offer',
        'amount': '₹5,000', 'icon': '⚡', 'color': '#dc2626',
        'eligibility': 'Complete admission within 7 days of counselling',
        'details': [
            'Limited seats available',
            'First-come, first-served',
            'Available across all colleges',
        ],
    },
    {
        'id': 6, 'title': 'Govt. Category Scholarship',
        'amount': 'As per Govt. norms', 'icon': '🏅', 'color': '#0d9488',
        'eligibility': 'BC / MBC / SC / ST / Minority category students',
        'details': [
            'Government of Tamil Nadu scheme',
            'Full or partial fee waiver possible',
            'We assist with the application process',
        ],
    },
]


class CollegeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = College.objects.filter(is_active=True)
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['location_city', 'location_state', 'college_type', 'accreditation']
    search_fields    = ['college_name', 'short_name', 'location_city', 'courses_offered']
    ordering_fields  = ['college_name', 'established', 'created_at']
    ordering         = ['college_name']
    lookup_field     = 'short_name'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CollegeDetailSerializer
        return CollegeListSerializer


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.filter(is_active=True).select_related('college')
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'degree_type', 'college']
    search_fields    = ['course_name', 'course_code', 'category']
    ordering_fields  = ['course_name', 'category', 'degree_type', 'created_at']
    ordering         = ['category', 'course_name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer


@api_view(['GET'])
def scholarship_list(request):
    """Return static scholarship data."""
    return Response(SCHOLARSHIPS)
