from django.urls import path
from .views import MixtapeListView, MixtapeDetailView

urlpatterns = [
    path('', MixtapeListView.as_view()), # path for this is /api/mixtapes/
    path('<int:pk>/', MixtapeDetailView.as_view()) # path for this is /api/mixtapes/:pk
]
