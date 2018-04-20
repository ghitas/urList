API_KEY = "AIzaSyCzVhP6UZ9jZVbbXHPlqwq6O1NBvsowQAE";
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
isAuthorized = true;
currentApiRequest = true;
getInfo: string;
this.getInfo = "https://accounts.google.com/o/oauth2/auth?" +
    "redirect_uri=http://test.tokybook.com:8081/autoplaylist/callback&" +
    "response_type=code&" +
    "client_id=123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com&" +
    "scope=https://www.googleapis.com/auth/youtube&" +
    "approval_prompt=force&" +
    "access_type=offline";
/**
 *  On load, called to load the auth2 library and API client library.
 */
handleClientLoad() {
    var that = this;
    gapi.load('client:auth2', {
        callback: function () {
            // Handle gapi.client initialization.
            that.initClient();
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
initClient() {
    var that = this;
    gapi.client.init({
        apiKey: this.API_KEY,
        discoveryDocs: this.DISCOVERY_DOCS,
        clientId: this.CLIENT_ID,
        scope: this.SCOPES
    }).then(function () {
        that.GoogleAuth = gapi.auth2.getAuthInstance();
        var user = that.GoogleAuth.currentUser.get();
        console.log(user);
        // Listen for sign-in state changes.
        that.GoogleAuth.isSignedIn.listen(that.updateSigninStatus.bind(that));
        // Handle initial sign-in state. (Determine if user is already signed in.)
        document.getElementById("btnMaster").addEventListener("click", that.handleAuthClick.bind(that));
        if (that.GoogleAuth.isSignedIn.get() === true) {
            that.updateSigninStatus(true);
        } else {
            document.getElementById("btnMaster").addEventListener("click", that.GoogleAuth.signIn);
        }
    });
}
handleAuthClick(event) {
    //Sign user in after click on auth button.
    var options = {
        "redirect_uri": "http://localhost:8080/autoplaylist/callback",
        "response_type": "code",
        "client_id": "123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com",
        "scope": "https://www.googleapis.com/auth/youtube",
        "approval_prompt": "force",
        "access_type": "offline"
    };
    this.GoogleAuth.signIn(options);
}
/**
 * Store the request details. Then check to determine whether the user
 * has authorized the application.
 *   - If the user has granted access, make the API request.
 *   - If the user has not granted access, initiate the sign-in flow.
 */
sendAuthorizedApiRequest(requestDetails) {
    this.currentApiRequest = requestDetails;
    if (this.isAuthorized) {
        // Make API request
        this.setSigninStatus();
        // Reset currentApiRequest variable.
        this.currentApiRequest = false;
    } else {
        this.GoogleAuth.signIn();
    }
}

/**
 * Listener called when user completes auth flow. If the currentApiRequest
 * variable is set, then the user was prompted to authorize the application
 * before the request executed. In that case, proceed with that API request.
 */
updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        this.isAuthorized = true;
        if (this.currentApiRequest) {
            this.sendAuthorizedApiRequest(this.currentApiRequest);
        }
    } else {
        this.isAuthorized = false;
    }
}
setSigninStatus() {
    var user = this.GoogleAuth.currentUser.get();
    // this.userNm = user.Zi.
    console.log(user);
    /**
     * get playlist
     */
    var isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner');
    // Toggle button text and displayed statement based on current auth status.
    if (isAuthorized) {
        this.defineRequest();
    }
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
    var name = $("#areaKey").val().split("\n")[0];
    var desc = $("#areaDesc").val();
    let url = "http://test.tokybook.com:8080/youtube/addPlaylist";
    let body = {
        "name": name,
        "privacy": "public",
        "description": desc,
        "authCode": this.autho
    }
    this.servicePlaylist.createPlaylist(url, body).subscribe(
        res => console.log(res),
        err => console.log(err)
    );
}

auth2: any; // The Sign-In object.
googleUser: any; // The current user.
/**
 * Calls startAuth after Sign in V2 finishes setting up.
 */
appStart = function () {
    gapi.load('auth2', this.initSigninV2.bind(this));
};

/**
 * Initializes Signin v2 and sets up listeners.
 */
initSigninV2 = function () {
    this.auth2 = gapi.auth2.init({
        client_id: '123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com',
        scope: 'profile'
    });

    // Listen for sign-in state changes.
    this.auth2.isSignedIn.listen(this.signinChanged.bind(this));

    // Listen for changes to current user.
    this.auth2.currentUser.listen(this.userChanged.bind(this));

    // Add funtion change user to button
    this.GoogleAuth = gapi.auth2.getAuthInstance();
    document.getElementById("account").addEventListener("click", this.GoogleAuth.signIn);

    // Sign in the user if they are currently signed in.
    if (this.auth2.isSignedIn.get() == true) {
        this.auth2.signIn();
    }

    // Start with the current live values.
    this.refreshValues();
};
/**
 * Listener method for sign-out live value.
 *
 * @param {boolean} val the updated signed out state.
 */
signinChanged = function (val) {
    console.log('Signin state changed to ', val);
    // document.getElementById('signed-in-cell').innerText = val;
};

/**
 * Listener method for when the user changes.
 *
 * @param {GoogleUser} user the updated user.
 */
userChanged = function (user) {
    console.log('User now: ', user);
    this.googleUser = user;
    document.getElementById('curr-user-cell').innerText =
        JSON.stringify(user, undefined, 2);
};