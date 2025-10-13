import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-saas-funfacts',
    templateUrl: './saas-funfacts.component.html',
    styleUrls: ['./saas-funfacts.component.scss']
})
export class SaasFunfactsComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    funFacts: Content[] = [
        {
            icon: 'las la-smile',
            title: '370',
            subTitle: 'Satisfied Client'
        },
        {
            icon: 'las la-star',
            title: '560',
            subTitle: 'Appreciation'
        },
        {
            icon: 'las la-clock',
            title: '260',
            subTitle: 'Response Time'
        },
        {
            icon: 'las la-database',
            title: '789',
            subTitle: 'Data Entry'
        }
    ]

}
class Content {
    icon : string;
    title : string;
    subTitle : string;
}