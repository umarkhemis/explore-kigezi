
"""Custom permission classes for role-based access."""
from rest_framework.permissions import BasePermission


class IsHost(BasePermission):
    message = 'Only cultural hosts can perform this action.'
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'host')


class IsTourist(BasePermission):
    message = 'Only tourists can perform this action.'
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'tourist')


class IsPlatformAdmin(BasePermission):
    message = 'Only platform administrators can perform this action.'
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
            and (request.user.role == 'admin' or request.user.is_superuser)
        )


class IsHostOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
            and request.user.role in ['host', 'admin']
        )