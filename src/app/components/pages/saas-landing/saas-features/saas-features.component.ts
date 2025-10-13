import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-saas-features',
    templateUrl: './saas-features.component.html',
    styleUrls: ['./saas-features.component.scss']
})
export class SaasFeaturesComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle: sectionTitleContent[] = [
        {
            title: "Our Amazing Features",
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    singleSaasFeatures: FeaturesContent[] = [
        {
            icon: 'las la-cog',
            title: 'Fast And Optimized',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-shield-alt',
            title: 'Full Security',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-clock',
            title: 'Time Saving',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-check-square',
            title: 'Easily Manage',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-lock',
            title: 'Quick Access',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-hand-pointer',
            title: 'Drag And Drop',
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