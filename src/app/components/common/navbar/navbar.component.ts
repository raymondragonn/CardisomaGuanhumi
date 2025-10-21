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
    isCollapsed: boolean = true;

    constructor(private router: Router) {
    }

    ngOnInit(){
        this.recallJsFuntions();
    }

    goLogin(){
        this.router.navigate(['/login']);
    }

    toggleNavbar() {
        this.isCollapsed = !this.isCollapsed;
    }

    closeNavbar() {
        this.isCollapsed = true;
    }

    recallJsFuntions() {
        // Inicializar la ubicación actual inmediatamente
        this.location = this.router.url;
        
        this.routerSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
        .subscribe(event => {
            this.location = this.router.url;
        });
    }
    
    // Navbar único para toda la aplicación
    navItems = [
        {
            title: 'Amenazas',
            route: 'amenazas'
        },
        {
            title: 'Sobre la Especie',
            route: 'sobre-la-especie'
        },
        {
            title: 'Comunidad y Acciones',
            route: 'comunidad-y-acciones'
        },
        {
            title: 'Recursos',
            route: 'recursos'
        }
    ];

}