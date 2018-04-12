import { Component, ElementRef } from '@angular/core';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public modal: object = {
        title: "Annouce",
        body: "Nội dung"
    }
    constructor() {
    }

    ngOnInit() { }
    showModal() {
    }
}
