import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-app-pricing',
    templateUrl: './app-pricing.component.html',
    styleUrls: ['./app-pricing.component.scss']
})
export class AppPricingComponent implements OnInit {

    name = 'Angular';
    singlePricingBox = [
        {
            title: 'Basic Plan',
            price: '$9',
            priceSubText: 'm',
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Drag & Drop Builder"
                },
                {
                    itemIcon: "las la-check",
                    item: "Lead Generation & Sales"
                },
                {
                    itemIcon: "las la-check",
                    item: "Boot & Digital Assistants"
                },
                {
                    itemIcon: "las la-check",
                    item: "Customer Service"
                },
                {
                    itemIcon: "las la-times",
                    item: "Up To 1000 Subscribers"
                },
                {
                    itemIcon: "las la-times",
                    item: "Unlimited Broadcasts"
                },
                {
                    itemIcon: "las la-times",
                    item: "Landing Pages & Web Widgets"
                }
            ],
            buttonText: 'Get Started',
            buttonLink: '#'
        },
        {
            title: 'Standard Plan',
            price: '$29',
            priceSubText: 'm',
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Drag & Drop Builder"
                },
                {
                    itemIcon: "las la-check",
                    item: "Lead Generation & Sales"
                },
                {
                    itemIcon: "las la-check",
                    item: "Boot & Digital Assistants"
                },
                {
                    itemIcon: "las la-check",
                    item: "Customer Service"
                },
                {
                    itemIcon: "las la-check",
                    item: "Up To 1000 Subscribers"
                },
                {
                    itemIcon: "las la-times",
                    item: "Unlimited Broadcasts"
                },
                {
                    itemIcon: "las la-times",
                    item: "Landing Pages & Web Widgets"
                }
            ],
            buttonText: 'Get Started',
            buttonLink: '#'
        },
        {
            title: 'Unlimited Plan',
            price: '$39',
            priceSubText: 'm',
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Drag & Drop Builder"
                },
                {
                    itemIcon: "las la-check",
                    item: "Lead Generation & Sales"
                },
                {
                    itemIcon: "las la-check",
                    item: "Boot & Digital Assistants"
                },
                {
                    itemIcon: "las la-check",
                    item: "Customer Service"
                },
                {
                    itemIcon: "las la-check",
                    item: "Up To 1000 Subscribers"
                },
                {
                    itemIcon: "las la-check",
                    item: "Unlimited Broadcasts"
                },
                {
                    itemIcon: "las la-check",
                    item: "Landing Pages & Web Widgets"
                }
            ],
            buttonText: 'Get Started',
            buttonLink: '#'
        }
    ];

    constructor() {}

    ngOnInit() {}

    sectionTitle: sectionTitleContent[] = [
        {
            title: 'Price & Plans',
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]

}
class sectionTitleContent {
    title : string;
    paragraphText : string;
}