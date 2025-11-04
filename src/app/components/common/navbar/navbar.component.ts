import { Component, OnInit } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { filter } from 'rxjs/operators';

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

    constructor(private router: Router) {
    }

    ngOnInit(){
        this.loadNavbarState();
        this.recallJsFuntions();
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

    goLogin(){
        this.router.navigate(['/login']);
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
        }
    ];

}