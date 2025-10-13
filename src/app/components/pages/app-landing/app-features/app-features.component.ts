import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-app-features',
    templateUrl: './app-features.component.html',
    styleUrls: ['./app-features.component.scss']
})
export class AppFeaturesComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle: sectionTitleContent[] = [
        {
            title: 'App Features',
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    singleAppFeatures: FeaturesContent[] = [
        {
            icon: 'las la-cloud-sun',
            title: 'High Resolution',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-lightbulb',
            title: 'Unique Design',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-desktop',
            title: 'Full Responsive',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-code',
            title: 'Clean Code',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-eye',
            title: 'Retina Ready',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-camera',
            title: 'Unlimited Features',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        }
    ]

}
class sectionTitleContent {
    title : string;
    paragraphText : string;
}
class FeaturesContent {
    icon : string;
    title : string;
    paragraph : string;
}