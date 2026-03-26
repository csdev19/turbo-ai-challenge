import pytest
from todos.models import Category


@pytest.mark.django_db
class TestCategoryList:
    URL = "/api/categories/"

    def test_list_categories(self, auth_client, db):
        response = auth_client.get(self.URL)

        assert response.status_code == 200
        assert len(response.data) == 3
        names = [c["name"] for c in response.data]
        assert "Random Thoughts" in names
        assert "School" in names
        assert "Personal" in names
        assert all("note_count" in c for c in response.data)

    def test_list_categories_unauthenticated(self, api_client):
        response = api_client.get(self.URL)

        assert response.status_code == 401

    def test_note_count_is_per_user(self, auth_client, category, user, note):
        """note_count should only count the authenticated user's notes."""
        from django.contrib.auth.models import User
        from todos.models import Note

        other_user = User.objects.create_user("other", "other@test.com", "pass1234")
        Note.objects.create(user=other_user, category=category, title="Other's Note")

        response = auth_client.get(self.URL)

        assert response.status_code == 200
        # Should only count the auth user's note, not the other user's
        cat_data = next(c for c in response.data if c["id"] == category.id)
        assert cat_data["note_count"] == 1
