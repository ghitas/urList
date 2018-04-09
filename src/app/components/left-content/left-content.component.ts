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
    getInfo: string;
    GoogleAuth: any;

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
        this.getInfo = "https://accounts.google.com/o/oauth2/auth?" +
            "redirect_uri=http://test.tokybook.com:8081/autoplaylist/callback&" +
            "response_type=code&" +
            "client_id=123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com&" +
            "scope=https://www.googleapis.com/auth/youtube&" +
            "approval_prompt=force&" +
            "access_type=offline";
    }
    ngOnInit() {
        this.handleClientLoad();
    }
    // Client ID and API key from the Developer Console
    CLIENT_ID = '123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com';
    // Array of API discovery doc URLs for APIs used by the quickstart
    DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
    // Authorization scopes required by the API. If using multiple scopes,
    // separated them with spaces.
    SCOPES = [
        "https://www.googleapis.com/auth/youtube",
        //Manage your YouTube account
        "https://www.googleapis.com/auth/youtube.force-ssl",
        //Manage your YouTube account
        "https://www.googleapis.com/auth/youtube.readonly",
        //View your YouTube account
        "https://www.googleapis.com/auth/youtube.upload",
        //Manage your YouTube videos
        "https://www.googleapis.com/auth/youtubepartner",
    ].join(" ");

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    handleClientLoad() {
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
            apiKey: 'AIzaSyCzVhP6UZ9jZVbbXHPlqwq6O1NBvsowQAE',
            discoveryDocs: that.DISCOVERY_DOCS,
            clientId: that.CLIENT_ID,
            scope: that.SCOPES
        }).then(function () {
            those.GoogleAuth = gapi.auth2.getAuthInstance();

            // Listen for sign-in state changes.
            those.GoogleAuth.isSignedIn.listen(those.updateSigninStatus);

            // Handle initial sign-in state. (Determine if user is already signed in.)
            those.setSigninStatus();

           // document.getElementById("channel").addEventListener("click", those.handleAuthClick);
        });
    }
    handleAuthClick(event) {
        // Sign user in after click on auth button.
        this.GoogleAuth.signIn();
    }
    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    updateSigninStatus(isSignedIn) {
        this.setSigninStatus();
    }
    setSigninStatus() {
        var user = this.GoogleAuth.currentUser.get();
        var isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner');
        // Toggle button text and displayed statement based on current auth status.
        if (isAuthorized) {
            this.defineRequest();
        }
        this.user = user.w3.ig;
        this.autho = user.Zi.access_token;
    }
    createResource(properties) {
        var resource = {};
        var normalizedProps = properties;
        for (var p in properties) {
            var value = properties[p];
            if (p && p.substr(-2, 2) == '[]') {
                var adjustedName = p.replace('[]', '');
                if (value) {
                    normalizedProps[adjustedName] = value.split(',');
                }
                delete normalizedProps[p];
            }
        }
        for (var p in normalizedProps) {
            // Leave properties that don't have values out of inserted resource.
            if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
                var propArray = p.split('.');
                var ref = resource;
                for (var pa = 0; pa < propArray.length; pa++) {
                    var key = propArray[pa];
                    if (pa == propArray.length - 1) {
                        ref[key] = normalizedProps[p];
                    } else {
                        ref = ref[key] = ref[key] || {};
                    }
                }
            };
        }
        return resource;
    }

    removeEmptyParams(params) {
        for (var p in params) {
            if (!params[p] || params[p] == 'undefined') {
                delete params[p];
            }
        }
        return params;
    }

    executeRequest(request) {
        request.execute(function (response) {
            console.log(response);
        });
    }

    buildApiRequest(requestMethod, path, params, properties) {
        params = this.removeEmptyParams(params);
        var request;
        if (properties) {
            var resource = this.createResource(properties);
            request = gapi.client.request({
                'body': resource,
                'method': requestMethod,
                'path': path,
                'params': params
            });
        } else {
            request = gapi.client.request({
                'method': requestMethod,
                'path': path,
                'params': params
            });
        }
        this.executeRequest(request);
    }

    /***** END BOILERPLATE CODE *****/


    defineRequest() {
        // See full sample for buildApiRequest() code, which is not 
        // specific to a particular API or API method.

        this.buildApiRequest('GET',
            '/youtube/v3/playlists',
            {
                'channelId': 'UC6rVB-_0m1hsn9iEp0YUtng',
                'maxResults': '25',
                'part': 'snippet,contentDetails'
            }, null);

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
