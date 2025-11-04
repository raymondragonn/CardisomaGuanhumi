import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { filter } from 'rxjs/operators';
declare let $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
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
        this.router.events
        .subscribe((event) => {
            if ( event instanceof NavigationStart ) {
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
}