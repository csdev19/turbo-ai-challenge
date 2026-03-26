import pytest
from todos.models import Note


@pytest.mark.django_db
class TestNoteList:
    URL = "/api/notes/"

    def test_list_notes(self, auth_client, note):
        response = auth_client.get(self.URL)

        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["title"] == "Test Note"
        assert response.data[0]["category_name"] == "Random Thoughts"
        assert response.data[0]["category_color"] == "#EF9C66"

    def test_list_notes_filter_by_category(self, auth_client, note, category, user):
        """Filter notes by category query param."""
        from todos.models import Category

        other_cat = Category.objects.create(user=user, name="School", color="#FCDC94")
        Note.objects.create(user=user, category=other_cat, title="School Note")

        response = auth_client.get(f"{self.URL}?category={category.id}")

        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["title"] == "Test Note"

    def test_list_notes_unauthenticated(self, api_client):
        response = api_client.get(self.URL)

        assert response.status_code == 401

    def test_list_only_own_notes(self, auth_client, note):
        """Notes from other users should not appear."""
        from django.contrib.auth.models import User

        other_user = User.objects.create_user("other", "other@test.com", "pass1234")
        Note.objects.create(user=other_user, title="Other's Note")

        response = auth_client.get(self.URL)

        assert response.status_code == 200
        assert len(response.data) == 1


@pytest.mark.django_db
class TestNoteCreate:
    URL = "/api/notes/"

    def test_create_note(self, auth_client, category):
        response = auth_client.post(self.URL, {
            "title": "New Note",
            "content": "Some content",
            "category": category.id,
        })

        assert response.status_code == 201
        assert response.data["title"] == "New Note"
        assert response.data["content"] == "Some content"
        assert response.data["category"] == category.id
        assert Note.objects.filter(title="New Note").exists()

    def test_create_note_without_category(self, auth_client):
        response = auth_client.post(self.URL, {
            "title": "No Category Note",
            "content": "",
        })

        assert response.status_code == 201
        assert response.data["category"] is None

    def test_create_blank_note(self, auth_client):
        """Creating a note with empty title and content should work."""
        response = auth_client.post(self.URL, {
            "title": "",
            "content": "",
        })

        assert response.status_code == 201


@pytest.mark.django_db
class TestNoteDetail:

    def test_get_note(self, auth_client, note):
        url = f"/api/notes/{note.id}/"
        response = auth_client.get(url)

        assert response.status_code == 200
        assert response.data["title"] == "Test Note"
        assert response.data["content"] == "This is test content."

    def test_get_nonexistent_note(self, auth_client):
        response = auth_client.get("/api/notes/9999/")

        assert response.status_code == 404


@pytest.mark.django_db
class TestNoteUpdate:

    def test_update_title(self, auth_client, note):
        url = f"/api/notes/{note.id}/"
        response = auth_client.patch(url, {"title": "Updated Title"})

        assert response.status_code == 200
        assert response.data["title"] == "Updated Title"
        note.refresh_from_db()
        assert note.title == "Updated Title"

    def test_update_content(self, auth_client, note):
        url = f"/api/notes/{note.id}/"
        response = auth_client.patch(url, {"content": "Updated content"})

        assert response.status_code == 200
        assert response.data["content"] == "Updated content"

    def test_update_category(self, auth_client, note, user):
        from todos.models import Category

        new_cat = Category.objects.create(user=user, name="School", color="#FCDC94")
        url = f"/api/notes/{note.id}/"
        response = auth_client.patch(url, {"category": new_cat.id})

        assert response.status_code == 200
        assert response.data["category"] == new_cat.id
        assert response.data["category_name"] == "School"


@pytest.mark.django_db
class TestNoteDelete:

    def test_delete_note(self, auth_client, note):
        url = f"/api/notes/{note.id}/"
        response = auth_client.delete(url)

        assert response.status_code == 204
        assert not Note.objects.filter(id=note.id).exists()

    def test_delete_nonexistent_note(self, auth_client):
        response = auth_client.delete("/api/notes/9999/")

        assert response.status_code == 404
