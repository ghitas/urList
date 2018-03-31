import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'tool-bar',
    templateUrl: './tool-bar.component.html',
    styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent {
    constructor(private router: Router) { }
    btnLoggout(): void {
        localStorage.clear();
        this.router.navigate(["/"]);
    }
}
