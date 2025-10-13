import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-saas-discover',
    templateUrl: './saas-discover.component.html',
    styleUrls: ['./saas-discover.component.scss']
})
export class SaasDiscoverComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle: sectionTitleContent[] = [
        {
            title: 'More To Discover',
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    overviewContent = [
        {
            number: '01',
            title: 'Getting Started Page',
            paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Unique Design"
                },
                {
                    itemIcon: "las la-check",
                    item: "Unimited Video Call"
                },
                {
                    itemIcon: "las la-check",
                    item: "Add Favourite contact"
                },
                {
                    itemIcon: "las la-check",
                    item: "Camera Filter"
                },
                {
                    itemIcon: "las la-check",
                    item: "Many Features"
                },
                {
                    itemIcon: "las la-check",
                    item: "Bold Price"
                },
                {
                    itemIcon: "las la-check",
                    item: "Full Responsive"
                }
            ],
            img: 'assets/img/overview/overview1.png'
        },
        {
            number: '02',
            title: 'Outdated Comments Toggling',
            paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Unique Design"
                },
                {
                    itemIcon: "las la-check",
                    item: "Unimited Video Call"
                },
                {
                    itemIcon: "las la-check",
                    item: "Add Favourite contact"
                },
                {
                    itemIcon: "las la-check",
                    item: "Camera Filter"
                },
                {
                    itemIcon: "las la-check",
                    item: "Many Features"
                },
                {
                    itemIcon: "las la-check",
                    item: "Bold Price"
                },
                {
                    itemIcon: "las la-check",
                    item: "Full Responsive"
                }
            ],
            img: 'assets/img/overview/overview2.png'
        },
        {
            number: '03',
            title: 'End Of The Page',
            paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Unique Design"
                },
                {
                    itemIcon: "las la-check",
                    item: "Unimited Video Call"
                },
                {
                    itemIcon: "las la-check",
                    item: "Add Favourite contact"
                },
                {
                    itemIcon: "las la-check",
                    item: "Camera Filter"
                },
                {
                    itemIcon: "las la-check",
                    item: "Many Features"
                },
                {
                    itemIcon: "las la-check",
                    item: "Bold Price"
                },
                {
                    itemIcon: "las la-check",
                    item: "Full Responsive"
                }
            ],
            img: 'assets/img/overview/overview3.png'
        }
    ];

}
class sectionTitleContent {
    title : string;
    paragraphText : string;
}