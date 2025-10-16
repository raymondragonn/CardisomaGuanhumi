import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;

  constructor(private router: Router) { }

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
      
      // Aquí iría la lógica para registrar al usuario
      console.log('Formulario enviado:', this.registerForm);
      
      // Simulación de registro
      setTimeout(() => {
        this.isSubmitting = false;
        alert('¡Registro exitoso! Bienvenido al movimiento del Cangrejo Azul');
        this.router.navigate(['/']);
      }, 1500);
    }
  }

  validateForm(): boolean {
    if (!this.registerForm.name || !this.registerForm.email || 
        !this.registerForm.password || !this.registerForm.confirmPassword) {
      alert('Por favor completa todos los campos');
      return false;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return false;
    }

    if (this.registerForm.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
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
