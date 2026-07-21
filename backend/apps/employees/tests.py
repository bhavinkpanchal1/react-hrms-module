from datetime import date

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Employee


class EmployeeApiTests(APITestCase):
    def test_create_direct_employee_generates_code(self):
        response = self.client.post(
            reverse("employee-list"),
            {
                "first_name": "Nisha",
                "last_name": "Verma",
                "email": "nisha@example.com",
                "phone": "9876543210",
                "department": "Human Resources",
                "designation": "HR Executive",
                "work_location": "Ahmedabad",
                "employment_type": Employee.EmploymentType.FULL_TIME,
                "date_of_joining": str(date.today()),
                "annual_salary": 600000,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["employee_code"], "EMP-0001")
        self.assertEqual(response.data["annual_salary"], 600000.0)
