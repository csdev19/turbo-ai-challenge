from django.db.models import Count
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Note
from .serializers import CategorySerializer, NoteSerializer


class CategoryListCreateView(APIView):
    def get(self, request):
        categories = Category.objects.filter(user=request.user).annotate(note_count=Count('notes'))
        return Response(CategorySerializer(categories, many=True).data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CategoryDetailView(APIView):
    def _get(self, request, pk):
        try:
            return Category.objects.get(pk=pk, user=request.user)
        except Category.DoesNotExist:
            return None

    def delete(self, request, pk):
        cat = self._get(request, pk)
        if not cat:
            return Response(status=status.HTTP_404_NOT_FOUND)
        cat.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NoteListCreateView(APIView):
    def get(self, request):
        notes = Note.objects.filter(user=request.user).select_related('category')
        category_id = request.query_params.get('category')
        if category_id:
            notes = notes.filter(category_id=category_id)
        return Response(NoteSerializer(notes, many=True).data)

    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NoteDetailView(APIView):
    def _get(self, request, pk):
        try:
            return Note.objects.get(pk=pk, user=request.user)
        except Note.DoesNotExist:
            return None

    def get(self, request, pk):
        note = self._get(request, pk)
        if not note:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(NoteSerializer(note).data)

    def patch(self, request, pk):
        note = self._get(request, pk)
        if not note:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = NoteSerializer(note, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        note = self._get(request, pk)
        if not note:
            return Response(status=status.HTTP_404_NOT_FOUND)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
