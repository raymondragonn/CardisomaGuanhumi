import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-products-users',
    templateUrl: './products-users.component.html',
    styleUrls: ['./products-users.component.scss']
})
export class ProductsUsersComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    usersContent = [
        {
            title: '2M+ People Are Using This Headphone',
            paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.',
            buttonText: 'Buy Now for $19.50',
            buttonLink: '#'
        }
    ];

}