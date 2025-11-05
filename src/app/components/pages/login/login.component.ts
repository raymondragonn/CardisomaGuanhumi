import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Declaración para el objeto global de Google
declare global {
  interface Window {
    handleCredentialResponse: any;
  }
}

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
    // Inicializar Google Sign-In
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn(): void {
    // Definir la función de callback globalmente
    window.handleCredentialResponse = (response: any) => {
      this.handleGoogleLogin(response);
    };

    // Verificar si el script de Google se cargó correctamente
    const checkGoogleLoaded = setInterval(() => {
      if ((window as any).google) {
        clearInterval(checkGoogleLoaded);
        console.log('✅ Google Identity Services cargado correctamente');
      }
    }, 100);

    // Timeout después de 5 segundos
    setTimeout(() => {
      clearInterval(checkGoogleLoaded);
      if (!(window as any).google) {
        console.error('❌ Error: Google Identity Services no se cargó. Verifica la conexión a internet y los orígenes autorizados.');
      }
    }, 5000);
  }

  handleGoogleLogin(response: any): void {
    console.log('Google credential:', response.credential);
    
    // Aquí deberías enviar el token JWT a tu backend
    // El token viene en response.credential
    
    // Simulación de login con Google
    this.isSubmitting = true;
    
    // Decodificar el JWT para obtener información del usuario (solo para desarrollo)
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('Usuario de Google:', payload);
      
      // Aquí harías la petición a tu API
      setTimeout(() => {
        this.isSubmitting = false;
        alert(`¡Bienvenido ${payload.name}!`);
        this.router.navigate(['/']);
      }, 1500);
    } catch (error) {
      console.error('Error al procesar el login de Google:', error);
      this.isSubmitting = false;
      alert('Error al iniciar sesión con Google');
    }
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
