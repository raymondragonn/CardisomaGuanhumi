import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-app-how-it-works',
    templateUrl: './app-how-it-works.component.html',
    styleUrls: ['./app-how-it-works.component.scss']
})
export class AppHowItWorksComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    videoContent: Content[] = [
        {
            title: 'How it Works?',
            videoLink: 'https://www.youtube.com/watch?v=wKCsprWTN70'
        }
    ]

}
class Content {
    title : string;
    videoLink : string;
}