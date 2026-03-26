import os

import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from todos.models import Category, Note

# Force SQLite for tests — never hit Neon
os.environ["DATABASE_URL"] = "sqlite:///test_db.sqlite3"


@pytest.fixture
def user(db):
    return User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="testpass123",
    )


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(user):
    """APIClient pre-authenticated with a valid JWT."""
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


@pytest.fixture
def refresh_token(user):
    """A valid refresh token for the test user."""
    return str(RefreshToken.for_user(user))


@pytest.fixture
def category(db):
    """Global category — seeded by migration, get or create."""
    cat, _ = Category.objects.get_or_create(
        name="Random Thoughts",
        defaults={"color": "#EF9C66"},
    )
    return cat


@pytest.fixture
def note(user, category):
    return Note.objects.create(
        user=user,
        category=category,
        title="Test Note",
        content="This is test content.",
    )
