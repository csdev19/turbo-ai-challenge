import pytest
from todos.models import Category


@pytest.mark.django_db
class TestCategoryList:
    URL = "/api/categories/"

    def test_list_categories(self, auth_client, category):
        response = auth_client.get(self.URL)

        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["name"] == "Random Thoughts"
        assert response.data[0]["color"] == "#EF9C66"
        assert "note_count" in response.data[0]

    def test_list_categories_unauthenticated(self, api_client):
        response = api_client.get(self.URL)

        assert response.status_code == 401

    def test_list_only_own_categories(self, auth_client, category, user):
        """Categories from other users should not appear."""
        from django.contrib.auth.models import User

        other_user = User.objects.create_user("other", "other@test.com", "pass1234")
        Category.objects.create(user=other_user, name="Other's Category")

        response = auth_client.get(self.URL)

        assert response.status_code == 200
        assert len(response.data) == 1


@pytest.mark.django_db
class TestCategoryCreate:
    URL = "/api/categories/"

    def test_create_category(self, auth_client):
        response = auth_client.post(self.URL, {
            "name": "School",
            "color": "#FCDC94",
        })

        assert response.status_code == 201
        assert response.data["name"] == "School"
        assert response.data["color"] == "#FCDC94"
        assert Category.objects.filter(name="School").exists()


@pytest.mark.django_db
class TestCategoryDelete:

    def test_delete_category(self, auth_client, category):
        url = f"/api/categories/{category.id}/"
        response = auth_client.delete(url)

        assert response.status_code == 204
        assert not Category.objects.filter(id=category.id).exists()

    def test_delete_nonexistent_category(self, auth_client):
        response = auth_client.delete("/api/categories/9999/")

        assert response.status_code == 404
