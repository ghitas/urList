import { Directive, ElementRef, Input } from '@angular/core';
import { NgControl } from "@angular/forms";
@Directive({
  selector: '[customPlaceholder]'
})
export class PlaceholderDirective {
  constructor(private el: ElementRef, private control : NgControl) { }
  @Input('customPlaceholder')
    public set defineInputType(pattern: string) {
        this.el.nativeElement.placeholder = pattern;
        setTimeout(() => {
            this.control.control.markAsPristine();
        }, 0);
    }
}