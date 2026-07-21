from django.contrib import admin

from .models import Candidate, Interview, Job, Offer


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ["title", "department", "location", "openings", "status", "closing_date"]
    list_filter = ["status", "department"]
    search_fields = ["title", "department", "location"]


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "email", "job", "status", "applied_at"]
    list_filter = ["status", "job__department"]
    search_fields = ["first_name", "last_name", "email", "phone"]
    autocomplete_fields = ["job"]


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ["candidate", "round", "interviewer", "scheduled_at", "status", "result"]
    list_filter = ["status", "result", "round", "mode"]
    search_fields = ["candidate__first_name", "candidate__last_name", "interviewer"]


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ["candidate", "offered_salary", "joining_date", "status", "issued_at"]
    list_filter = ["status"]
    search_fields = ["candidate__first_name", "candidate__last_name", "candidate__email"]
