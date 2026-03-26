import pytest
from django.contrib.auth.models import User


@pytest.mark.django_db
class TestRegister:
    URL = "/api/auth/register/"

    def test_register_success(self, api_client):
        response = api_client.post(self.URL, {
            "email": "newuser@example.com",
            "password": "securepass1",
        })

        assert response.status_code == 201
        assert "tokens" in response.data
        assert "access" in response.data["tokens"]
        assert "refresh" in response.data["tokens"]
        assert response.data["user"]["email"] == "newuser@example.com"
        assert User.objects.filter(email="newuser@example.com").exists()

    def test_register_creates_username_from_email(self, api_client):
        response = api_client.post(self.URL, {
            "email": "john.doe@example.com",
            "password": "securepass1",
        })

        assert response.status_code == 201
        user = User.objects.get(email="john.doe@example.com")
        assert user.username == "john.doe"


@pytest.mark.django_db
class TestLogin:
    URL = "/api/auth/login/"

    def test_login_success(self, api_client, user):
        response = api_client.post(self.URL, {
            "email": "test@example.com",
            "password": "testpass123",
        })

        assert response.status_code == 200
        assert "tokens" in response.data
        assert "access" in response.data["tokens"]
        assert "refresh" in response.data["tokens"]
        assert response.data["user"]["email"] == "test@example.com"


@pytest.mark.django_db
class TestLogout:
    URL = "/api/auth/logout/"

    def test_logout_success(self, auth_client, refresh_token):
        response = auth_client.post(self.URL, {"refresh": refresh_token})

        assert response.status_code == 205


@pytest.mark.django_db
class TestMe:
    URL = "/api/auth/me/"

    def test_me_authenticated(self, auth_client, user):
        response = auth_client.get(self.URL)

        assert response.status_code == 200
        assert response.data["email"] == user.email
        assert response.data["username"] == user.username

    def test_me_unauthenticated(self, api_client):
        response = api_client.get(self.URL)

        assert response.status_code == 401


@pytest.mark.django_db
class TestTokenRefresh:
    URL = "/api/auth/token/refresh/"

    def test_refresh_success(self, api_client, refresh_token):
        response = api_client.post(self.URL, {"refresh": refresh_token})

        assert response.status_code == 200
        assert "access" in response.data
