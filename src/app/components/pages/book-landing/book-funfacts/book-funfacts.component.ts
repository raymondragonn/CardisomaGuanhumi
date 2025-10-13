import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-book-funfacts',
    templateUrl: './book-funfacts.component.html',
    styleUrls: ['./book-funfacts.component.scss']
})
export class BookFunfactsComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    funFacts: Content[] = [
        {
            icon: 'las la-book-open',
            title: '358',
            subTitle: 'Total Pages'
        },
        {
            icon: 'las la-book',
            title: '1M',
            subTitle: 'Copies Sold'
        },
        {
            icon: 'las la-bookmark',
            title: '41,574',
            subTitle: 'Copies Released'
        },
        {
            icon: 'las la-heart',
            title: '55,412',
            subTitle: 'Happy Readers'
        }
    ]

}
class Content {
    icon : string;
    title : string;
    subTitle : string;
}