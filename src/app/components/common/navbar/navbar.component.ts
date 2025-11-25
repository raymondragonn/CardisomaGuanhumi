import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { filter } from 'rxjs/operators';
import { CrearEventoService } from '../../../services/crear-evento.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class NavbarComponent implements OnInit {

    location: any;
    routerSubscription: any;
    isCollapsed: boolean = false;
    isAuthenticated: boolean = false;
    currentUsername: string | null = null;
    userInitials: string = '';

    // Modal de autenticación
    showAuthModal: boolean = false;
    authMode: 'login' | 'register' = 'login';
    isSubmitting: boolean = false;

    // Menú de usuario
    showUserMenu: boolean = false;

    // Formulario de login
    loginForm = {
        username: '',
        password: '',
        rememberMe: false
    };
    showLoginPassword: boolean = false;

    // Formulario de registro
    registerForm = {
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    };
    showRegisterPassword: boolean = false;
    showConfirmPassword: boolean = false;

    constructor(
        private router: Router,
        private authService: CrearEventoService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {
    }

    ngOnInit(){
        this.loadNavbarState();
        this.checkAuthentication();
        this.recallJsFuntions();
        this.loadRememberedUser();
    }

    loadRememberedUser() {
        const rememberedUsername = localStorage.getItem('remembered_username');
        if (rememberedUsername) {
            this.loginForm.username = rememberedUsername;
            this.loginForm.rememberMe = true;
        }
    }

    checkAuthentication() {
        const hasToken = this.authService.isAuthenticated();
        this.currentUsername = this.authService.getCurrentUsername();
        
        // Solo considerar autenticado si hay token Y username
        this.isAuthenticated = hasToken && !!this.currentUsername;
        
        if (this.isAuthenticated && this.currentUsername) {
            this.userInitials = this.getInitials(this.currentUsername);
        } else {
            this.userInitials = '';
        }
    }

    getInitials(username: string): string {
        if (!username) return '';
        const parts = username.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return username.substring(0, 2).toUpperCase();
    }

    // ===== Modal de Autenticación =====
    openAuthModal() {
        this.showAuthModal = true;
        this.authMode = 'login';
        document.body.style.overflow = 'hidden';
    }

    closeAuthModal(event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        this.showAuthModal = false;
        document.body.style.overflow = '';
        this.resetForms();
    }

    resetForms() {
        this.loginForm = {
            username: localStorage.getItem('remembered_username') || '',
            password: '',
            rememberMe: !!localStorage.getItem('remembered_username')
        };
        this.registerForm = {
            name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false
        };
        this.showLoginPassword = false;
        this.showRegisterPassword = false;
        this.showConfirmPassword = false;
        this.isSubmitting = false;
    }

    // ===== Login =====
    onLoginSubmit() {
        if (!this.loginForm.username || !this.loginForm.password) {
            alert('Por favor completa todos los campos');
            return;
        }

        this.isSubmitting = true;

        this.authService.login(this.loginForm.username, this.loginForm.password)
            .subscribe({
                next: (response) => {
                    this.isSubmitting = false;
                    
                    if (response.access_token) {
                        localStorage.setItem('access_token', response.access_token);
                    }
                    
                    if (response.token_type) {
                        localStorage.setItem('token_type', response.token_type);
                    }
                    
                    localStorage.setItem('current_username', this.loginForm.username);
                    
                    if (this.loginForm.rememberMe) {
                        localStorage.setItem('remembered_username', this.loginForm.username);
                    } else {
                        localStorage.removeItem('remembered_username');
                    }
                    
                    this.checkAuthentication();
                    this.closeAuthModal();
                    alert('¡Bienvenido de vuelta al movimiento del Cangrejo Azul!');
                },
                error: (error) => {
                    this.isSubmitting = false;
                    
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

    // ===== Registro =====
    onRegisterSubmit() {
        if (!this.validateRegisterForm()) {
            return;
        }

        this.isSubmitting = true;

        const userData = {
            email: this.registerForm.email,
            username: this.registerForm.username,
            password: this.registerForm.password,
            full_name: this.registerForm.name,
            permiso: 'user'
        };

        this.authService.register(userData)
            .subscribe({
                next: (response) => {
                    this.isSubmitting = false;
                    alert('¡Registro exitoso! Ahora puedes iniciar sesión');
                    this.authMode = 'login';
                    this.loginForm.username = this.registerForm.username;
                    this.registerForm = {
                        name: '',
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        acceptTerms: false
                    };
                },
                error: (error) => {
                    this.isSubmitting = false;
                    
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

    validateRegisterForm(): boolean {
        if (!this.registerForm.name || !this.registerForm.username || 
            !this.registerForm.email || !this.registerForm.password || 
            !this.registerForm.confirmPassword) {
            alert('Por favor completa todos los campos');
            return false;
        }

        if (this.registerForm.username.includes(' ')) {
            alert('El nombre de usuario no puede contener espacios');
            return false;
        }

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
        this.openAuthModal();
    }

    // ===== Menú de Usuario =====
    toggleUserMenu(event?: Event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.showUserMenu = !this.showUserMenu;
        this.cdr.detectChanges();
        
        if (this.showUserMenu) {
            // Cerrar el menú al hacer clic fuera
            setTimeout(() => {
                document.addEventListener('click', this.closeUserMenuOnClickOutside);
            }, 10);
        } else {
            document.removeEventListener('click', this.closeUserMenuOnClickOutside);
        }
    }

    closeUserMenu() {
        this.showUserMenu = false;
        document.removeEventListener('click', this.closeUserMenuOnClickOutside);
        this.cdr.detectChanges();
    }

    closeUserMenuOnClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu-container')) {
            this.ngZone.run(() => {
                this.closeUserMenu();
            });
        }
    }

    handleLogout() {
        this.closeUserMenu();
        this.logout();
    }

    logout() {
        this.authService.logout();
        this.isAuthenticated = false;
        this.currentUsername = null;
        this.userInitials = '';
    }

    loadNavbarState() {
        const savedState = localStorage.getItem('navbarCollapsed');
        if (savedState !== null) {
            this.isCollapsed = savedState === 'true';
        } else {
            // Por defecto, el navbar está desplegado
            this.isCollapsed = false;
            this.saveNavbarState();
        }
    }

    saveNavbarState() {
        localStorage.setItem('navbarCollapsed', this.isCollapsed.toString());
    }

    goHome(event?: Event) {
        if (event) {
            event.preventDefault();
        }
        this.router.navigate(['/']).then(() => {
            window.scrollTo(0, 0);
        });
        // No cerrar el navbar automáticamente, mantener el estado del usuario
    }

    toggleNavbar() {
        this.isCollapsed = !this.isCollapsed;
        this.saveNavbarState();
    }

    closeNavbar() {
        this.isCollapsed = true;
        this.saveNavbarState();
    }

    recallJsFuntions() {
        // Inicializar la ubicación actual inmediatamente
        this.location = this.router.url;
        
        this.routerSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
        .subscribe(event => {
            this.location = this.router.url;
            // Mantener el estado del navbar al cambiar de ruta
            // Recargar el estado desde localStorage para asegurar consistencia
            this.loadNavbarState();
            // Verificar autenticación al cambiar de ruta
            this.checkAuthentication();
        });
    }
    
    // Navbar único para toda la aplicación
    navItems = [
        {
            title: 'Inicio',
            route: 'inicio'
        },
        {
            title: 'Especie',
            route: 'especie'
        },
        {
            title: 'Amenazas',
            route: 'amenazas'
        },
        {
            title: 'Comunidad',
            route: 'comunidad'
        },
        {
            title: 'Eventos',
            route: 'eventos'
        },
        {
            title: 'Recursos',
            route: 'recursos'
        }
    ];

}