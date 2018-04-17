import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit, AfterViewInit {
  //@ViewChild('spider') canvasRef: ElementRef;
  // a reference to the canvas element from our template
  @ViewChild(ElementRef, {read: "spiders"}) private canvas: ElementRef;

  // setting a width and height for the canvas
  @Input() public width = 400;
  @Input() public height = 400;

  private cx: CanvasRenderingContext2D; 
  
  
  constructor(private router: Router, private user: EventService) {
  }
  
  ngAfterViewInit(): void {
    // get the context
    const canvasEl: any = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    // set the width and height
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    // set some default properties about the line
    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    
    // we'll implement this method to start capturing mouse events
    //this.captureEvents(canvasEl);
  }
  ngOnInit() {
    
  }

  loginUser(e) {
    e.preventDefault();
    var username = e.target.elements[0].value;
    var password = e.target.elements[1].value;
    this.user.setUserLoggedIn(username, password);
  }
}
