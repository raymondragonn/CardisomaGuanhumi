import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-app-funfacts',
    templateUrl: './app-funfacts.component.html',
    styleUrls: ['./app-funfacts.component.scss']
})
export class AppFunfactsComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    funFacts: Content[] = [
        {
            icon: 'las la-user-circle',
            title: '5M',
            subTitle: 'Users'
        },
        {
            icon: 'las la-smile',
            title: '4M',
            subTitle: 'Happy Users'
        },
        {
            icon: 'las la-star',
            title: '1M',
            subTitle: 'Reviews'
        },
        {
            icon: 'las la-cloud-download-alt',
            title: '10M',
            subTitle: 'App Downloads'
        }
    ]

}
class Content {
    icon : string;
    title : string;
    subTitle : string;
}