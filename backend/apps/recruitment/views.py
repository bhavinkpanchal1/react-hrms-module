from django.db.models import Count
from django.db.models.deletion import ProtectedError
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Candidate, Interview, Job, Offer
from .serializers import (
    CandidateSerializer,
    InterviewSerializer,
    JobSerializer,
    OfferSerializer,
    PipelineSerializer,
)


class ProtectedDestroyMixin:
    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {"detail": "This record is in use and cannot be deleted."},
                status=status.HTTP_409_CONFLICT,
            )


class JobViewSet(ProtectedDestroyMixin, viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    search_fields = ["title", "department", "description", "location"]
    ordering_fields = ["created_at", "title", "closing_date", "status"]

    def get_queryset(self):
        queryset = super().get_queryset()
        if status_value := self.request.query_params.get("status"):
            queryset = queryset.filter(status=status_value)
        if department := self.request.query_params.get("department"):
            queryset = queryset.filter(department__iexact=department)
        return queryset


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.select_related("job").all()
    serializer_class = CandidateSerializer
    search_fields = ["first_name", "last_name", "email", "phone", "job__title"]
    ordering_fields = ["applied_at", "first_name", "status", "total_experience"]

    def get_queryset(self):
        queryset = super().get_queryset()
        if status_value := self.request.query_params.get("status"):
            queryset = queryset.filter(status=status_value)
        if job_id := self.request.query_params.get("jobId"):
            queryset = queryset.filter(job_id=job_id)
        return queryset


class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.select_related("candidate", "candidate__job").all()
    serializer_class = InterviewSerializer
    search_fields = ["candidate__first_name", "candidate__last_name", "interviewer"]
    ordering_fields = ["scheduled_at", "status", "round"]

    def get_queryset(self):
        queryset = super().get_queryset()
        if candidate_id := self.request.query_params.get("candidateId"):
            queryset = queryset.filter(candidate_id=candidate_id)
        if status_value := self.request.query_params.get("status"):
            queryset = queryset.filter(status=status_value)
        return queryset


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.select_related("candidate", "candidate__job").all()
    serializer_class = OfferSerializer
    search_fields = ["candidate__first_name", "candidate__last_name", "candidate__job__title"]
    ordering_fields = ["issued_at", "joining_date", "offered_salary", "status"]

    def get_queryset(self):
        queryset = super().get_queryset()
        if candidate_id := self.request.query_params.get("candidateId"):
            queryset = queryset.filter(candidate_id=candidate_id)
        if status_value := self.request.query_params.get("status"):
            queryset = queryset.filter(status=status_value)
        return queryset


class PipelineView(APIView):
    serializer_class = PipelineSerializer

    def get(self, request):
        counts = {
            item["status"]: item["count"]
            for item in Candidate.objects.values("status").annotate(count=Count("id"))
        }
        stages = []
        for value, label in Candidate.Status.choices:
            candidates = Candidate.objects.select_related("job").filter(status=value)
            stages.append(
                {
                    "status": value,
                    "label": label,
                    "count": counts.get(value, 0),
                    "candidates": CandidateSerializer(candidates, many=True).data,
                }
            )
        return Response({"total": sum(counts.values()), "stages": stages})
