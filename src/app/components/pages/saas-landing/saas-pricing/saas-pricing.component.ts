import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-saas-pricing',
    templateUrl: './saas-pricing.component.html',
    styleUrls: ['./saas-pricing.component.scss']
})
export class SaasPricingComponent implements OnInit {

    singlePricingBox = [
        {
            title: 'Individual',
            price: '$19',
            priceSubText: 'm',
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Up To 3 Chat Operators"
                },
                {
                    itemIcon: "las la-check",
                    item: "100 ChatBot Triggers"
                },
                {
                    itemIcon: "las la-check",
                    item: "Email Integration"
                },
                {
                    itemIcon: "las la-check",
                    item: "Messenger Integration"
                },
                {
                    itemIcon: "las la-times",
                    item: "Visitor Info"
                },
                {
                    itemIcon: "las la-times",
                    item: "Mobile + Desktop Apps"
                },
                {
                    itemIcon: "las la-times",
                    item: "24/7 Live Chat"
                }
            ],
            buttonText: 'Purchase',
            buttonLink: '#'
        },
        {
            title: 'Small Team',
            price: '$39',
            priceSubText: 'm',
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Up To 3 Chat Operators"
                },
                {
                    itemIcon: "las la-check",
                    item: "100 ChatBot Triggers"
                },
                {
                    itemIcon: "las la-check",
                    item: "Email Integration"
                },
                {
                    itemIcon: "las la-check",
                    item: "Messenger Integration"
                },
                {
                    itemIcon: "las la-check",
                    item: "Visitor Info"
                },
                {
                    itemIcon: "las la-times",
                    item: "Mobile + Desktop Apps"
                },
                {
                    itemIcon: "las la-times",
                    item: "24/7 Live Chat"
                }
            ],
            buttonText: 'Purchase',
            buttonLink: '#'
        },
        {
            title: 'Company',
            price: '$69',
            priceSubText: 'm',
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Up To 3 Chat Operators"
                },
                {
                    itemIcon: "las la-check",
                    item: "100 ChatBot Triggers"
                },
                {
                    itemIcon: "las la-check",
                    item: "Email Integration"
                },
                {
                    itemIcon: "las la-check",
                    item: "Messenger Integration"
                },
                {
                    itemIcon: "las la-check",
                    item: "Visitor Info"
                },
                {
                    itemIcon: "las la-check",
                    item: "Mobile + Desktop Apps"
                },
                {
                    itemIcon: "las la-check",
                    item: "24/7 Live Chat"
                }
            ],
            buttonText: 'Purchase',
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