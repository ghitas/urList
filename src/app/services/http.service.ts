import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
declare var $: any;

@Injectable()
export class HttpService extends Http {
  public pendingRequests: number = 0;
  public showLoading: boolean = false;

  constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

 request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
      return this.intercept(super.request(url, options));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
      return this.intercept(super.get(url,options));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {   
      return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
      return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
      return this.intercept(super.delete(url, options));
  }
  
  getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
    return options;
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    console.log("In the intercept routine..");
    $("#loading")[0].style.display = "block";
    this.pendingRequests++;
    return observable
      .catch((err, source) => Observable.throw(console.log(err)))
      .do((res: Response) => {
        console.log("Response: " + res);
        this.turnOnModal();
      }, (err: any) => {
        this.turnOffModal();
        console.log("Caught error: " + err);
      })
      .finally(() => {
        console.log("Finally.. delaying, though.")
        var timer = Observable.timer(1000);
        timer.subscribe(t => {
          this.turnOffModal();
        });
      });
    }
  
  private turnOnModal() {
    if (!this.showLoading) {
        this.showLoading = true;
        // $('body').spin("modal", "#FFFFFF", "rgba(51, 51, 51, 0.1)");
        //console.log("Turned on modal");
        $("#loading")[0].style.display = "block";
    }
    this.showLoading = true;
  }
  
  private turnOffModal() {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      if (this.showLoading) {
        // $('body').spin("modal", "#FFFFFF", "rgba(51, 51, 51, 0.1)");
      }
      this.showLoading = false;
    }
    // console.log("Turned off modal");
    $("#loading")[0].style.display = "none";
  }
}