from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Application
from .serializers import (
    ApplicationSerializer,
    ApplicationCreateSerializer,
    ApplicationListSerializer,
)


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'course_name', 'college_name']
    search_fields    = ['first_name', 'last_name', 'full_name', 'email', 'mobile', 'application_id', 'college_name']
    ordering_fields  = ['created_at', 'full_name']

    ordering         = ['-created_at']
    http_method_names = ['get', 'post', 'head', 'options']  # read + create only

    def get_serializer_class(self):
        if self.action == 'create':
            return ApplicationCreateSerializer
        if self.action == 'list':
            return ApplicationListSerializer
        return ApplicationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(
            {
                'success': True,
                'message': 'Application submitted successfully! We will contact you shortly.',
                'application_id': instance.application_id,
                'id': instance.id,
                'email': instance.email,
                'full_name': instance.full_name,
            },
            status=status.HTTP_201_CREATED,
        )

    # ── Email-based lookup ──────────────────────────────────────────────
    @action(detail=False, methods=['get'], url_path='by-email')
    def by_email(self, request):
        """
        GET /api/applications/by-email/?email=user@example.com
        Returns all applications for that email address.
        """
        email = request.query_params.get('email', '').strip().lower()
        if not email:
            return Response(
                {'error': 'Please provide an email address.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        apps = Application.objects.filter(email__iexact=email).order_by('-created_at')

        if not apps.exists():
            return Response(
                {
                    'found': False,
                    'count': 0,
                    'results': [],
                    'message': f'No applications found for {email}. Please check the email address.',
                },
                status=status.HTTP_200_OK,
            )

        serializer = ApplicationSerializer(apps, many=True, context={'request': request})
        return Response(
            {
                'found': True,
                'count': apps.count(),
                'email': email,
                'results': serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    # ── PDF Download ────────────────────────────────────────────────────
    @action(detail=True, methods=['get'], url_path='pdf')
    def download_pdf(self, request, pk=None):
        """
        GET /api/applications/{id}/pdf/
        Returns a beautifully formatted PDF of the scholarship application.
        """
        instance = self.get_object()
        
        from django.http import HttpResponse
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="application-{instance.application_id}.pdf"'

        doc = SimpleDocTemplate(
            response, 
            pagesize=letter, 
            rightMargin=40, 
            leftMargin=40, 
            topMargin=40, 
            bottomMargin=40
        )
        story = []
        styles = getSampleStyleSheet()

        # Custom Styles
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontSize=20,
            leading=24,
            textColor=colors.HexColor('#0F172A'),
            spaceAfter=5
        )
        subtitle_style = ParagraphStyle(
            'SubtitleStyle',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#64748B'),
            spaceAfter=20
        )
        section_style = ParagraphStyle(
            'SectionStyle',
            parent=styles['Heading2'],
            fontSize=12,
            leading=16,
            textColor=colors.HexColor('#2563EB'),
            spaceBefore=12,
            spaceAfter=6
        )
        label_style = ParagraphStyle(
            'LabelStyle',
            parent=styles['Normal'],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#475569')
        )
        value_style = ParagraphStyle(
            'ValueStyle',
            parent=styles['Normal'],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#0F172A'),
            fontName='Helvetica-Bold'
        )

        # Header
        story.append(Paragraph("MARI EDUCATIONAL TRUST", title_style))
        story.append(Paragraph(f"Scholarship Application Form — ID: {instance.application_id}", subtitle_style))
        story.append(Spacer(1, 5))

        # Status Table
        status_data = [
            [Paragraph("Application ID:", label_style), Paragraph(instance.application_id, value_style)],
            [Paragraph("Current Status:", label_style), Paragraph(instance.get_status_display(), value_style)],
        ]
        if instance.status == 'rejected' and instance.rejection_reason:
            status_data.append([Paragraph("Rejection Reason:", label_style), Paragraph(instance.rejection_reason, value_style)])
            
        t_status = Table(status_data, colWidths=[150, 350])
        t_status.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('PADDING', (0,0), (-1,-1), 8),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ]))
        story.append(t_status)
        story.append(Spacer(1, 10))

        # Helper function to generate field table
        def make_section_table(title, fields):
            section_story = []
            section_story.append(Paragraph(title, section_style))
            data = []
            for label, val in fields:
                if val is not None and val != '':
                    data.append([Paragraph(label, label_style), Paragraph(str(val), value_style)])
            t = Table(data, colWidths=[180, 320])
            t.setStyle(TableStyle([
                ('PADDING', (0,0), (-1,-1), 5),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor('#F1F5F9')),
            ]))
            section_story.append(t)
            section_story.append(Spacer(1, 10))
            return section_story

        # Bio-data Section
        story.extend(make_section_table("1. Bio-data", [
            ("First Name", instance.first_name),
            ("Last Name", instance.last_name),
            ("Gender", instance.gender),
            ("Date of Birth", instance.dob),
            ("Mobile Number", instance.mobile),
            ("Email Address", instance.email),
            ("Blood Group", instance.blood_group),
            ("Community", instance.community),
            ("Aadhar Number", instance.aadhar_number),
        ]))

        # Parents Section
        story.extend(make_section_table("2. Parent's Details", [
            ("Father's Name", instance.father_name),
            ("Father's Mobile", instance.father_mobile),
            ("Mother's Name", instance.mother_name),
            ("Mother's Mobile", instance.mother_mobile),
        ]))

        # Address Section
        story.extend(make_section_table("3. Address", [
            ("Address Line 1", instance.address_line1),
            ("Address Line 2", instance.address_line2),
            ("City / District", instance.city),
            ("Pincode", instance.pincode),
        ]))

        # Education Section
        diploma_str = f"Yes ({instance.diploma_percentage}%)" if instance.has_diploma else "No"
        ug_str = f"Yes ({instance.ug_percentage}%)" if instance.has_ug else "No"
        story.extend(make_section_table("4. Education Details", [
            ("10th Marks Percentage", f"{instance.tenth_percentage}%" if instance.tenth_percentage else None),
            ("12th Marks Percentage", f"{instance.twelfth_percentage}%" if instance.twelfth_percentage else None),
            ("Has Diploma?", diploma_str),
            ("Has UG Degree?", ug_str),
        ]))

        # Preferences Section
        story.extend(make_section_table("5. Preferences & Reference", [
            ("Preferred College", instance.college_name),
            ("Course Preference", instance.course_name),
            ("Department Name", instance.department_name),
            ("Reference Name", instance.reference_name),
        ]))

        # Build PDF
        doc.build(story)
        return response

