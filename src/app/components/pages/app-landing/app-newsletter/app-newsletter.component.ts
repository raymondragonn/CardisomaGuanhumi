import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-app-newsletter',
    templateUrl: './app-newsletter.component.html',
    styleUrls: ['./app-newsletter.component.scss']
})
export class AppNewsletterComponent implements OnInit {

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