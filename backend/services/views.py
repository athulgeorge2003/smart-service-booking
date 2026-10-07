
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Service
from .serializers import ServiceSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes


@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser])
def service_list(request):

    # -------------------------
    # GET - Public
    # -------------------------
    if request.method == 'GET':

        if request.user.is_staff:
            services = Service.objects.all().order_by('-created_at')
        else:
            services = Service.objects.filter(
                is_available=True
            ).order_by('-created_at')

        serializer = ServiceSerializer(
            services,
            many=True
        )

        return Response(serializer.data)

    # -------------------------
    # POST - Admin only
    # -------------------------
    if request.method == 'POST':

        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not request.user.is_staff:
            return Response(
                {'error': 'Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ServiceSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'PUT', 'DELETE'])
@parser_classes([MultiPartParser, FormParser])
def service_detail(request, pk):

    try:
        service = Service.objects.get(pk=pk)

    except Service.DoesNotExist:
        return Response(
            {'error': 'Service not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # -------------------------
    # GET - Public
    # -------------------------
    if request.method == 'GET':

        serializer = ServiceSerializer(service)

        return Response(serializer.data)

    # -------------------------
    # PUT / DELETE - Admin only
    # -------------------------
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Authentication required.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not request.user.is_staff:
        return Response(
            {'error': 'Admin access required.'},
            status=status.HTTP_403_FORBIDDEN
        )

    # -------------------------
    # PUT
    # -------------------------
    if request.method == 'PUT':

        serializer = ServiceSerializer(
            service,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # -------------------------
    # DELETE
    # -------------------------
    if request.method == 'DELETE':

        service.delete()

        return Response(
            {
                'message': 'Service deleted successfully.'
            },
            status=status.HTTP_200_OK
        )
