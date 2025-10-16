import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm = {
    email: '',
    password: '',
    rememberMe: false
  };

  showPassword = false;
  isSubmitting = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.validateForm()) {
      this.isSubmitting = true;
      
      // Aquí iría la lógica para autenticar al usuario
      console.log('Formulario de login enviado:', this.loginForm);
      
      // Simulación de login
      setTimeout(() => {
        this.isSubmitting = false;
        alert('¡Bienvenido de vuelta al movimiento del Cangrejo Azul!');
        this.router.navigate(['/']);
      }, 1500);
    }
  }

  validateForm(): boolean {
    if (!this.loginForm.email || !this.loginForm.password) {
      alert('Por favor completa todos los campos');
      return false;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.loginForm.email)) {
      alert('Por favor ingresa un correo electrónico válido');
      return false;
    }

    return true;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  forgotPassword() {
    alert('Funcionalidad de recuperación de contraseña próximamente');
  }

}
