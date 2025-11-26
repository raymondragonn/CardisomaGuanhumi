import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearEventoService } from '../../../services/crear-evento.service';

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

  constructor(
    private router: Router,
    private authService: CrearEventoService
  ) { }

  ngOnInit(): void {
    // Componente de login inicializado
    
    // Cargar username guardado si existe
    const rememberedUsername = localStorage.getItem('remembered_username');
    if (rememberedUsername) {
      this.loginForm.email = rememberedUsername;
      this.loginForm.rememberMe = true;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.validateForm()) {
      this.isSubmitting = true;
      
      // Llamar al servicio de autenticación
      this.authService.login(this.loginForm.email, this.loginForm.password)
        .subscribe({
          next: (response) => {
            console.log('Login exitoso:', response);
            
            // Guardar access_token y token_type en localStorage
            if (response.access_token) {
              localStorage.setItem('access_token', response.access_token);
              console.log('Token guardado en localStorage');
            }
            
            if (response.token_type) {
              localStorage.setItem('token_type', response.token_type);
            }
            
            // Guardar el username del usuario siempre (para mostrar en navbar)
            localStorage.setItem('current_username', this.loginForm.email);
            
            // Guardar el username del usuario si "Recordarme" está activado
            if (this.loginForm.rememberMe) {
              localStorage.setItem('remembered_username', this.loginForm.email);
            } else {
              localStorage.removeItem('remembered_username');
            }

            // Obtener información completa del usuario incluyendo el permiso
            this.authService.getCurrentUserInfo()
              .subscribe({
                next: (userInfo) => {
                  console.log('Información del usuario:', userInfo);
                  
                  // Guardar el permiso del usuario
                  if (userInfo.permiso) {
                    localStorage.setItem('user_permiso', userInfo.permiso);
                    console.log('Permiso del usuario guardado:', userInfo.permiso);
                  }
                  
                  this.isSubmitting = false;
                  alert('¡Bienvenido de vuelta al movimiento del Cangrejo Azul!');
                  this.router.navigate(['/']);
                },
                error: (error) => {
                  console.error('Error al obtener información del usuario:', error);
                  this.isSubmitting = false;
                  // Continuar de todas formas, el usuario ya está autenticado
                  alert('¡Bienvenido de vuelta al movimiento del Cangrejo Azul!');
                  this.router.navigate(['/']);
                }
              });
          },
          error: (error) => {
            console.error('Error en el login:', error);
            this.isSubmitting = false;
            
            // Mostrar mensaje de error específico
            if (error.status === 401) {
              alert('Usuario o contraseña incorrectos');
            } else if (error.status === 0) {
              alert('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
            } else {
              alert('Error al iniciar sesión: ' + (error.error?.message || 'Error desconocido'));
            }
          }
        });
    }
  }

  validateForm(): boolean {
    if (!this.loginForm.email || !this.loginForm.password) {
      alert('Por favor completa todos los campos');
      return false;
    }

    // Validar que el username no esté vacío
    if (this.loginForm.email.trim().length === 0) {
      alert('Por favor ingresa un nombre de usuario válido');
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
