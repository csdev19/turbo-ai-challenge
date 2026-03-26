from rest_framework import serializers

from .models import Category, Note


class CategorySerializer(serializers.ModelSerializer):
    note_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'note_count']
        read_only_fields = ['id']


class NoteSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, default=None)
    category_color = serializers.CharField(source='category.color', read_only=True, default=None)

    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'category', 'category_name', 'category_color', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
