import { Component, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public modal: object = {
        title: "Thông báo",
        body: "Nội dung"
    }
    constructor(
        private translate: TranslateService
    ) {
        translate.setDefaultLang('vn');
    }
    ngOnInit() { }
}
