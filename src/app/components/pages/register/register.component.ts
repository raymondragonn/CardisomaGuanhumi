import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearEventoService } from '../../../services/crear-evento.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerForm = {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;

  constructor(
    private router: Router,
    private authService: CrearEventoService
  ) { }

  ngOnInit(): void {
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.validateForm()) {
      this.isSubmitting = true;
      
      // Preparar los datos para el registro
      const userData = {
        email: this.registerForm.email,
        username: this.registerForm.username,
        password: this.registerForm.password,
        full_name: this.registerForm.name,
        permiso: 'user' // Por defecto todos los nuevos usuarios tienen permiso 'user'
      };

      // Llamar al servicio de registro
      this.authService.register(userData)
        .subscribe({
          next: (response) => {
            console.log('Registro exitoso:', response);
            this.isSubmitting = false;
            
            alert('¡Registro exitoso! Ahora puedes iniciar sesión');
            // Redirigir al login después del registro exitoso
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Error en el registro:', error);
            this.isSubmitting = false;
            
            // Mostrar mensaje de error específico
            if (error.status === 400) {
              const errorMsg = error.error?.detail || 'Datos inválidos';
              alert('Error en el registro: ' + errorMsg);
            } else if (error.status === 409) {
              alert('El usuario o correo electrónico ya existe');
            } else if (error.status === 0) {
              alert('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
            } else {
              alert('Error al registrar usuario: ' + (error.error?.message || 'Error desconocido'));
            }
          }
        });
    }
  }

  validateForm(): boolean {
    if (!this.registerForm.name || !this.registerForm.username || 
        !this.registerForm.email || !this.registerForm.password || 
        !this.registerForm.confirmPassword) {
      alert('Por favor completa todos los campos');
      return false;
    }

    // Validar que el username no tenga espacios
    if (this.registerForm.username.includes(' ')) {
      alert('El nombre de usuario no puede contener espacios');
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerForm.email)) {
      alert('Por favor ingresa un correo electrónico válido');
      return false;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return false;
    }

    if (this.registerForm.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (!this.registerForm.acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return false;
    }

    return true;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

}
