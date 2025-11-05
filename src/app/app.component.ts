import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { filter } from 'rxjs/operators';
import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';
declare let $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('routeAnimations', [
            transition('* => *', [
                // Establecer el estilo inicial para el componente que entra
                query(':enter', [
                    style({ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: 'translateX(-100%)', 
                        opacity: 0 
                    })
                ], { optional: true }),
                // Establecer el estilo inicial para el componente que sale
                query(':leave', [
                    style({ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: 'translateX(0%)', 
                        opacity: 1 
                    })
                ], { optional: true }),
                // Animar ambos componentes simultáneamente
                group([
                    query(':leave', [
                        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', 
                            style({ transform: 'translateX(100%)', opacity: 0 }))
                    ], { optional: true }),
                    query(':enter', [
                        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', 
                            style({ transform: 'translateX(0%)', opacity: 1 }))
                    ], { optional: true })
                ])
            ])
        ])
    ],
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class AppComponent implements OnInit {
    location: any;
    routerSubscription: any;
    showNavbar: boolean = true;
    showFooter: boolean = true;

    constructor(private router: Router) {
    }

    ngOnInit(){
        this.recallJsFuntions();
    }

    recallJsFuntions() {
        // Inicializar la ubicación actual
        this.location = this.router.url;
        
        this.router.events
        .subscribe((event) => {
            if ( event instanceof NavigationStart ) {
                // Actualizar la ubicación al inicio de la navegación para la animación
                // Usar la URL de destino del evento
                this.location = event.url;
            }
        });
        this.routerSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
        .subscribe(event => {
            $.getScript('../assets/js/main.js');
            this.location = this.router.url;
            
            // Ocultar navbar y footer en páginas de login y register
            this.showNavbar = !(this.location === '/login' || this.location === '/register');
            // Ocultar footer en páginas de login, register y app-landing (ruta raíz)
            this.showFooter = !(this.location === '/login' || this.location === '/register' || this.location === '/');
            
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }

    getRouteAnimationState() {
        return this.location ? this.location.split('/')[1] : '';
    }
}