from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView
from .forms import CustomUserCreationForm
from django.shortcuts import render

class CustomLoginView(LoginView):
    template_name = 'login.html'

    def form_valid(self, form):
        # You can add additional logic here if you need to
        return super().form_valid(form)


def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            form = form.save()
            # Add logic to log in the user here, if desired
            return redirect('/api/login')
        else:
            # If the form is not valid, render the form with errors
            return render(request, 'register.html', {'form': form})
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})


def profile_view(request):
    return render(request, 'profile.html', {'user': request.user})