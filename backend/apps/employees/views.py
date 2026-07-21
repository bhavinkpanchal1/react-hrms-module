from rest_framework import viewsets

from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related("source_candidate", "source_offer").all()
    serializer_class = EmployeeSerializer
    search_fields = [
        "employee_code",
        "first_name",
        "last_name",
        "email",
        "department",
        "designation",
    ]
    ordering_fields = ["created_at", "date_of_joining", "first_name", "department"]

    def get_queryset(self):
        queryset = super().get_queryset()
        if department := self.request.query_params.get("department"):
            queryset = queryset.filter(department__iexact=department)
        if employment_type := self.request.query_params.get("employment_type"):
            queryset = queryset.filter(employment_type=employment_type)
        return queryset
