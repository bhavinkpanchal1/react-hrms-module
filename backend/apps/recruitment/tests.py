from datetime import date, timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.employees.models import Employee

from .models import Candidate, Interview, Job, Offer


class RecruitmentFlowTests(APITestCase):
    def setUp(self):
        self.job = Job.objects.create(
            title="Backend Developer",
            department="Engineering",
            description="Develop Django REST Framework services.",
            experience=3,
            location="Vadodara",
            openings=1,
            status=Job.Status.OPEN,
        )
        candidate_response = self.client.post(
            reverse("candidate-list"),
            {
                "first_name": "Asha",
                "last_name": "Patel",
                "email": "asha@example.com",
                "phone": "9876543210",
                "jobId": self.job.id,
                "source": "Referral",
                "dob": "1995-05-10",
                "address_line1": "Akota",
                "country_id": 1,
                "state_id": 101,
                "city_id": 1001,
                "pincode": "390020",
                "current_salary": 700000,
                "highest_education": "B.Tech",
                "institution": "GTU",
                "graduation_year": 2017,
                "skills": ["Python", "Django"],
                "certifications": [],
            },
            format="json",
        )
        self.assertEqual(candidate_response.status_code, status.HTTP_201_CREATED)
        self.candidate = Candidate.objects.get(pk=candidate_response.data["id"])

    def test_full_recruitment_to_employee_flow(self):
        interview_response = self.client.post(
            reverse("interview-list"),
            {
                "candidateId": self.candidate.id,
                "round": Interview.Round.TECHNICAL,
                "interviewer": "Engineering Manager",
                "scheduled_at": (timezone.now() + timedelta(days=1)).isoformat(),
                "duration_minutes": 60,
                "mode": Interview.Mode.ONLINE,
                "status": Interview.Status.SCHEDULED,
                "result": Interview.Result.PENDING,
                "feedback": "",
            },
            format="json",
        )
        self.assertEqual(interview_response.status_code, status.HTTP_201_CREATED)
        self.candidate.refresh_from_db()
        self.assertEqual(self.candidate.status, Candidate.Status.INTERVIEW)

        offer_response = self.client.post(
            reverse("offer-list"),
            {
                "candidateId": self.candidate.id,
                "offered_salary": 1000000,
                "joining_date": str(date.today() + timedelta(days=30)),
                "expires_at": str(date.today() + timedelta(days=10)),
                "status": Offer.Status.PENDING,
            },
            format="json",
        )
        self.assertEqual(offer_response.status_code, status.HTTP_201_CREATED)
        offer_id = offer_response.data["id"]

        accept_response = self.client.patch(
            reverse("offer-detail", args=[offer_id]),
            {"status": Offer.Status.ACCEPTED},
            format="json",
        )
        self.assertEqual(accept_response.status_code, status.HTTP_200_OK)
        self.candidate.refresh_from_db()
        self.assertEqual(self.candidate.status, Candidate.Status.ONBOARDING)

        employee_response = self.client.post(
            reverse("employee-list"),
            {
                "first_name": self.candidate.first_name,
                "last_name": self.candidate.last_name,
                "email": self.candidate.email,
                "phone": self.candidate.phone,
                "department": self.job.department,
                "designation": self.job.title,
                "work_location": self.job.location,
                "employment_type": Employee.EmploymentType.FULL_TIME,
                "date_of_joining": str(date.today() + timedelta(days=30)),
                "annual_salary": 1000000,
                "source_candidate_id": self.candidate.id,
                "source_offer_id": offer_id,
            },
            format="json",
        )
        self.assertEqual(employee_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(employee_response.data["employee_code"], "EMP-0001")
        self.candidate.refresh_from_db()
        self.assertEqual(self.candidate.status, Candidate.Status.HIRED)
        self.assertTrue(self.candidate.converted_to_employee)

    def test_list_shape_matches_frontend(self):
        response = self.client.get(reverse("candidate-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        candidate = response.data["results"][0]
        self.assertEqual(candidate["jobId"], self.job.id)
        self.assertEqual(candidate["job_title"], self.job.title)

    def test_offer_expiry_cannot_follow_joining_date(self):
        response = self.client.post(
            reverse("offer-list"),
            {
                "candidateId": self.candidate.id,
                "offered_salary": 1000000,
                "joining_date": str(date.today() + timedelta(days=10)),
                "expires_at": str(date.today() + timedelta(days=20)),
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_pipeline_groups_candidates(self):
        response = self.client.get(reverse("pipeline"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total"], 1)
        self.assertTrue(any(stage["status"] == "applied" for stage in response.data["stages"]))
