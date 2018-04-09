import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { EventService } from '../../services/event.service';
import { PlayListService } from '../../services/playlist.service';
declare var $: any;
declare var gapi: any;

@Component({
    selector: 'left-content',
    templateUrl: './left-content.component.html',
    styleUrls: ['./left-content.component.css']
})
export class LeftContentComponent implements OnInit {
    message: string = '';
    disableCreatePlayListBtn: boolean = false;
    route: string;
    autho: string;
    onProcess: boolean = false;
    urlChanel: string;
    userInfo: string;
    user: string = "unknow";


    constructor(private _eventService: EventService) {
        if (window.location.href.indexOf("code=") > 0) {
            this.autho = window.location.href.split("code=")[1];
            this.autho = this.autho.slice(4, this.autho.length);
            this.autho = "4/" + this.autho;
            this.autho += "#";
            window.history.pushState("", "", "/autoplaylist/callback");
        }
        this.urlChanel = "https://accounts.google.com/o/oauth2/auth?" +
            "redirect_uri=http://localhost:8080/autoplaylist/callback&" +
            "response_type=code&" +
            "client_id=123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com&" +
            "scope=https://www.googleapis.com/auth/youtube&" +
            "approval_prompt=force&" +
            "access_type=offline";
        this.userInfo = "https://accounts.google.com/o/oauth2/auth?" +
            "redirect_uri=http://localhost:8080/autoplaylist/callback&" +
            "response_type=code&" +
            "client_id=123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com&" +
            "scope=https://www.googleapis.com/auth/userinfo.profile&" +
            "approval_prompt=force&" +
            "access_type=offline";
    }
    changeUser(): void {

    }
    authorizeButton: any;
    ngOnInit() {
    }
    // Client ID and API key from the Developer Console
    CLIENT_ID = '123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com';

    // Array of API discovery doc URLs for APIs used by the quickstart
    DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

    // Authorization scopes required by the API. If using multiple scopes,
    // separated them with spaces.
    SCOPES = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner';

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    handleClientLoad(): void {
        var that = this;
        var initClient = this.initClient;
        // gapi.load('client:auth2', initClient(that));
        gapi.load('client:auth2', {
            callback: function () {
                // Handle gapi.client initialization.
                initClient(that);
            },
            onerror: function () {
                // Handle loading error.
                alert('gapi.client failed to load!');
            },
            timeout: 5000, // 5 seconds.
            ontimeout: function () {
                // Handle timeout.
                alert('gapi.client could not load in a timely manner!');
            }
        });
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    initClient(that) {
        var those = that;
        gapi.client.init({
            discoveryDocs: that.DISCOVERY_DOCS,
            clientId: that.CLIENT_ID,
            scope: that.SCOPES
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(that.updateSigninStatus);

            // Handle the initial sign-in state.
            that.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            that.handleAuthClick(those);
        });
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            this.getChannel();
        }
    }

    /**
     *  Sign in the user upon button click.
     */
    handleAuthClick(that) {
        gapi.auth2.getAuthInstance().signIn().then(function (res) {
            console.log(res.w3);
            that.user = res.w3.ig;
            that.autho = res.Zi.access_token;
        });
    }

    /**
     *  Sign out the user upon button click.
     */
    handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    /**
     * Print files.
     */
    getChannel() {
        gapi.client.youtube.channels.list({
            'part': 'snippet,contentDetails,statistics',
            'forUsername': 'anhcanhet777'
        }).then(function (response) {
            console.log(response);
        });
    }
    createList() {
        var that = this;
        this.onProcess = true;
        var name = $("#areaKey").val().split("\n")[0];
        var desc = $("#areaDesc").val();
        var url = "http://test.tokybook.com:8080/youtube/addPlaylist";
        var method = "POST";
        var postData = {
            "name": name,
            "privacy": "public",
            "description": desc,
            "authCode": this.autho
        };
        var xhr = new XMLHttpRequest();
        debugger;
        xhr.open(method, url, true);
        xhr.responseType = 'text';
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = processRequest;
        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
                that.onProcess = false;
            }
        }
        xhr.send(JSON.stringify(postData));
    }

}
