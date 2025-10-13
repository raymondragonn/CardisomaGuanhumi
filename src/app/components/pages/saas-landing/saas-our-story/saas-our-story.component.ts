import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-saas-our-story',
    templateUrl: './saas-our-story.component.html',
    styleUrls: ['./saas-our-story.component.scss']
})
export class SaasOurStoryComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    videoContent: Content[] = [
        {
            title: 'Watch Our Story',
            videoLink: 'https://www.youtube.com/watch?v=wKCsprWTN70'
        }
    ]

}
class Content {
    title : string;
    videoLink : string;
}