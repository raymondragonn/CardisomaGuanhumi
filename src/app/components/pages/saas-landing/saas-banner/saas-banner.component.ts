import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-saas-banner',
    templateUrl: './saas-banner.component.html',
    styleUrls: ['./saas-banner.component.scss']
})
export class SaasBannerComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    bannerContent = [
        {
            title: 'Manage Your Business Strategy in One Place',
            paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            buttonText: 'Get Started',
            buttonID: 'contact'
        }
    ];
    bannerImage = [
        {
            img: 'assets/img/saas-banner.jpg'
        }
    ];

}