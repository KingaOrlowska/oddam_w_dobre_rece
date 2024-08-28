from django.shortcuts import render, redirect
from django.http import HttpResponseNotAllowed
from django.db.models import Sum
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from main.models import Institution, Donation, Category

def landing_page(request):
    if request.method == 'GET':
        # Obliczanie liczby oddanych worków
        total_bags = Donation.objects.aggregate(total_bags=Sum('quantity'))['total_bags'] or 0

        # Obliczanie liczby wspartych organizacji
        supported_institutions_count = Institution.objects.filter(donation__isnull=False).distinct().count()

        # Pobieranie instytucji na podstawie typu
        foundations = Institution.objects.filter(type=Institution.FOUNDATION)
        ngos = Institution.objects.filter(type=Institution.NGO)
        local_collections = Institution.objects.filter(type=Institution.LOCAL_COLLECTION)

        # Przekazywanie danych do szablonu
        return render(request, 'index.html', {
            'total_bags': total_bags,
            'supported_institutions_count': supported_institutions_count,
            'foundations': foundations,
            'ngos': ngos,
            'local_collections': local_collections
        })
    else:
        return HttpResponseNotAllowed(['GET'])

def register_view(request):
    if request.method == 'GET':
        return render(request, 'register.html')
    elif request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')

        if password == password2:
            if not User.objects.filter(username=email).exists():
                user = User.objects.create_user(username=email, email=email, password=password)
                login(request, user)
                return redirect('login')
            else:
                return render(request, 'register.html', {'error': 'Użytkownik o podanym adresie email już istnieje.'})
        else:
            return render(request, 'register.html', {'error': 'Hasła nie są takie same.'})
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def login_view(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    elif request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Uwierzytelnianie użytkownika za pomocą emaila
        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return redirect('landing_page')
        else:
            messages.error(request, 'Nieprawidłowy login lub hasło. Proszę spróbować ponownie lub założyć nowe konto.')
            return redirect('register')
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

@login_required(login_url='login')
def add_donation(request):
    if request.method == 'POST':
        return redirect('form_confirmation')

    elif request.method == 'GET':
        # Pobieranie wszystkich kategorii z bazy danych
        categories = Category.objects.all()

        # Filtrowanie instytucji, które mają powiązane kategorie
        institutions = Institution.objects.filter(categories__in=categories).distinct()

        # Utworzenie listy instytucji z kategoriami jako nazwy
        institutions_with_categories = []
        for institution in institutions:
            categories_names = list(institution.categories.values_list('name', flat=True))  # Pobieramy nazwy kategorii
            institutions_with_categories.append({
                'id': institution.id,
                'name': institution.name,
                'description': institution.description,
                'categories': categories_names  # Przekazujemy listę nazw kategorii
            })

        # Renderowanie strony z formularzem
        return render(request, 'form.html', {
            'categories': categories,
            'institutions': institutions_with_categories
        })
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])





def form_confirmation_view(request):
    return render(request, 'form-confirmation.html')

def custom_logout_view(request):
    if request.method == 'POST':
        logout(request)
        return redirect('landing_page')
    else:
        return HttpResponseNotAllowed(['POST'])
