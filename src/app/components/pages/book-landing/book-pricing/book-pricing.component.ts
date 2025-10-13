import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-book-pricing',
    templateUrl: './book-pricing.component.html',
    styleUrls: ['./book-pricing.component.scss']
})
export class BookPricingComponent implements OnInit {

    name = 'Angular';
    singlePricingBox = [
        {
            title: 'E-Book',
            price: '$9',
            paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            buttonText: 'Buy Now',
            buttonLink: '#'
        },
        {
            title: 'Bundle',
            price: '$29',
            paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            buttonText: 'Buy Now',
            buttonLink: '#'
        },
        {
            title: 'Handcover',
            price: '$39',
            paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            buttonText: 'Buy Now',
            buttonLink: '#'
        }
    ];

    constructor() {}

    ngOnInit() {}

}