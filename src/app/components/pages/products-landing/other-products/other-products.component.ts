import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-other-products',
    templateUrl: './other-products.component.html',
    styleUrls: ['./other-products.component.scss']
})
export class OtherProductsComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle = [
        {
            title: 'Our Other Products',
            paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]

    singleProductsBox = [
        {
            detailsLink: 'products-landing',
            img: 'assets/img/headphone-product/image1.jpg',
            title: 'Beyerdynamic',
            oldPrice: '$125',
            newPrice: '$120',
            starRating: [
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                }
            ]
        },
        {
            detailsLink: 'products-landing',
            img: 'assets/img/headphone-product/image2.jpg',
            title: 'Philips',
            oldPrice: '',
            newPrice: '$150',
            starRating: [
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star-half-alt"
                }
            ]
        },
        {
            detailsLink: 'products-landing',
            img: 'assets/img/headphone-product/image3.jpg',
            title: 'Bang & Olufsen',
            oldPrice: '$265',
            newPrice: '$270',
            starRating: [
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star-of-david"
                }
            ]
        },
        {
            detailsLink: 'products-landing',
            img: 'assets/img/headphone-product/image4.jpg',
            title: 'Audio-Technica',
            oldPrice: '',
            newPrice: '$144',
            starRating: [
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star"
                },
                {
                    rating: "las la-star-half-alt"
                },
                {
                    rating: "las la-star-of-david"
                }
            ]
        }
    ]

}