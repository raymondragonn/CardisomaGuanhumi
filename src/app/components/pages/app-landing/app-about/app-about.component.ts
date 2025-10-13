import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-app-about',
    templateUrl: './app-about.component.html',
    styleUrls: ['./app-about.component.scss']
})
export class AppAboutComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    aboutImage: Image[] = [
        {
            img: 'assets/img/app-about.png'
        }
    ]
    aboutContent = [
        {
            title: 'App Makes Your Life Very Easier',
            paragraphList: [
                {
                    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                },
                {
                    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                }
            ],
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Creative Design"
                },
                {
                    itemIcon: "las la-check",
                    item: "Retina Ready"
                },
                {
                    itemIcon: "las la-check",
                    item: "Modern Design"
                },
                {
                    itemIcon: "las la-check",
                    item: "Digital Marketing & Branding"
                },
                {
                    itemIcon: "las la-check",
                    item: "Unimited Video Call"
                },
                {
                    itemIcon: "las la-check",
                    item: "Add Favourite Contact"
                },
                {
                    itemIcon: "las la-check",
                    item: "Camera Filter"
                }
            ]
        }
    ];

}
class Image {
    img : string;
}