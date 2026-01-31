from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .apis import getchargedbattery, openEmptySlot


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/get-charged-battery/', getchargedbattery),
    path('api/open-empty-slot/', openEmptySlot),

    path('api/accounts/', include('accounts.urls')),
    path('api/crop/',include('crop.urls')),
    path('api/plot/',include('plot.urls')),
    path('api/wholeseller/',include('wholeseller.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)