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
    
    appLandingNavItem = [
        
        {
            id: 'amenazas',
            title: 'Amenazas',
        },
        {
            id: 'Sobre la Especie',
            title: 'Sobre la Especie',
        },
        {
            id: 'accionesComunidades',
            title: 'Acciones y Comunidades',
        },
        {
            id: 'Recursos',
            title: 'Recursos',
        }
    ];
    bookLandingNavItem = [
        {
            id: 'home',
            title: 'Home',
        },
        {
            id: 'features',
            title: 'Features',
        },
        {
            id: 'about',
            title: 'About',
        },
        {
            id: 'feedback',
            title: 'Feedback',
        },
        {
            id: 'pricing',
            title: 'Pricing',
        },
        {
            id: 'author',
            title: 'Author',
        },
        {
            id: 'contact',
            title: 'Contact',
        }
    ];
    saasLandingNavItem = [
        {
            id: 'home',
            title: 'Home',
        },
        {
            id: 'about',
            title: 'About',
        },
        {
            id: 'features',
            title: 'Features',
        },
        {
            id: 'pricing',
            title: 'Pricing',
        },
        {
            id: 'team',
            title: 'Team',
        },
        {
            id: 'feedback',
            title: 'Feedback',
        },
        {
            id: 'contact',
            title: 'Contact',
        }
    ];
    productsLandingNavItem = [
        {
            id: 'home',
            title: 'Home',
        },
        {
            id: 'about',
            title: 'About',
        },
        {
            id: 'features',
            title: 'Features',
        },
        {
            id: 'spec',
            title: 'Spec',
        },
        {
            id: 'products',
            title: 'Products',
        },
        {
            id: 'faq',
            title: 'FAQ',
        },
        {
            id: 'contact',
            title: 'Contact',
        }
    ];

}