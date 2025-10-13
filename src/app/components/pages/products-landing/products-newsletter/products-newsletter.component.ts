import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-products-newsletter',
    templateUrl: './products-newsletter.component.html',
    styleUrls: ['./products-newsletter.component.scss']
})
export class ProductsNewsletterComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    newsletterImage: Image[] = [
        {
            img: 'assets/img/newsletter.png'
        }
    ]
    newsletterContent: Content[] = [
        {
            title: 'Subscribe To Our Newsletter',
            paragraph: 'Lorem ipsum dolor sit amet consectetur adipiscing ipsum sLorem ipsuia dolor sit amet, consectetur adipisci velit sed quia non numquam quaerat voluptatem. Uspendisse ultrices gravida.',
            inputPlaceholder: 'Your Email Address',
            buttonText: 'Subscribe Now'
        }
    ]

}
class Image {
    img : string;
}
class Content {
    title : string;
    paragraph : string;
    inputPlaceholder : string;
    buttonText : string;
}