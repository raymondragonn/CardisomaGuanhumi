import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-app-feedback',
    templateUrl: './app-feedback.component.html',
    styleUrls: ['./app-feedback.component.scss']
})
export class AppFeedbackComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle: sectionTitleContent[] = [
        {
            title: 'User Feedback',
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    singleFeedbackItem: Content[] = [
        {
            feedbackText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium sihs doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.',
            userImg: 'assets/img/team/team1.jpg',
            userName: 'David Luis',
            userDesignation: 'Founder & CEO'
        },
        {
            feedbackText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium sihs doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.',
            userImg: 'assets/img/team/team3.jpg',
            userName: 'Steven Smith',
            userDesignation: 'Developer'
        },
        {
            feedbackText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium sihs doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.',
            userImg: 'assets/img/team/team2.jpg',
            userName: 'Sarah Lucy',
            userDesignation: 'Designer'
        },
        {
            feedbackText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium sihs doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.',
            userImg: 'assets/img/team/team4.jpg',
            userName: 'James Anderson',
            userDesignation: 'Manager'
        }
    ]

}
class sectionTitleContent {
    title : string;
    paragraphText : string;
}
class Content {
    feedbackText : string;
    userImg : string;
    userName : string;
    userDesignation : string;
}