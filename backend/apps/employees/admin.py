from django.contrib import admin

from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = [
        "employee_code",
        "first_name",
        "last_name",
        "department",
        "designation",
        "employment_type",
        "date_of_joining",
    ]
    list_filter = ["department", "employment_type"]
    search_fields = ["employee_code", "first_name", "last_name", "email"]
    readonly_fields = ["employee_code", "created_at", "updated_at"]
