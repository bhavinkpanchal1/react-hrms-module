from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CandidateViewSet, InterviewViewSet, JobViewSet, OfferViewSet, PipelineView


router = DefaultRouter()
router.register("jobs", JobViewSet, basename="job")
router.register("candidates", CandidateViewSet, basename="candidate")
router.register("interviews", InterviewViewSet, basename="interview")
router.register("offers", OfferViewSet, basename="offer")

urlpatterns = [
    path("pipeline/", PipelineView.as_view(), name="pipeline"),
    path("", include(router.urls)),
]
