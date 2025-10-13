import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-book-feedback',
    templateUrl: './book-feedback.component.html',
    styleUrls: ['./book-feedback.component.scss']
})
export class BookFeedbackComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle = [
        {
            title: 'Customer Reviews',
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    singleFeedback = [
        {
            paragraph: '“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ghs incididunt ut labore et dolore magna. Quis ipsum suspendisse ultrices gravida.”',
            userImg: 'assets/img/client/1.jpg',
            userName: 'Jonus Nathan',
            userDesignation: 'CEO at Envato'
        },
        {
            paragraph: '“Ipsum lorem dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ghs incididunt ut labore et dolore magna. Quis ipsum suspendisse ultrices gravida.”',
            userImg: 'assets/img/client/2.jpg',
            userName: 'Sadio Finn',
            userDesignation: 'CEO at FlatIcon'
        },
        {
            paragraph: '“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ghs incididunt ut labore et dolore magna. Quis ipsum suspendisse ultrices gravida.”',
            userImg: 'assets/img/client/3.jpg',
            userName: 'Tom Olivar',
            userDesignation: 'CEO at ThemeForest'
        },
        {
            paragraph: '“Ipsum lorem dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ghs incididunt ut labore et dolore magna. Quis ipsum suspendisse ultrices gravida.”',
            userImg: 'assets/img/client/4.jpg',
            userName: 'James Finn',
            userDesignation: 'CEO at GitLab'
        }
    ];

}