import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-book-features',
    templateUrl: './book-features.component.html',
    styleUrls: ['./book-features.component.scss']
})
export class BookFeaturesComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle: sectionTitleContent[] = [
        {
            title: "What You'll Learn",
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    singleBookFeatures: FeaturesContent[] = [
        {
            icon: 'las la-chalkboard-teacher',
            title: 'Data Structures',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-chart-line',
            title: 'Analysis of Algorithms',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-desktop',
            title: 'Web Development',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-database',
            title: 'Basic Databases',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-network-wired',
            title: 'Operating Systems',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-laptop-code',
            title: 'Final Thoughts',
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