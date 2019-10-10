import React, { Component } from 'react';
import { UserAgentApplication } from 'msal';
import SearchUserForm from '../components/SearchUserForm';
import { msalConfig } from '../conf';

export default class Connection extends Component {

    constructor() {
        super();
        this.state = {
            showSignIn: true,
            isSignIn: false,
        };

        this.graphConfig = {
            graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
        };

        // create a request object for login or token request calls
        // In scenarios with incremental consent, the request object can be further customized
        this.requestObj = {
            scopes: ["user.read"]
        };

        this.myMSALObj = new UserAgentApplication(msalConfig);
        this.myMSALObj.handleRedirectCallback(this.authRedirectCallBack);

        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.isSignIn = this.isSignIn.bind(this);
        this.acquireTokenPopupAndCallMSGraph = this.acquireTokenPopupAndCallMSGraph.bind(this);
        this.successLogin = this.successLogin.bind(this);
        this.successLogout = this.successLogout.bind(this);
        this.authRedirectCallBack = this.authRedirectCallBack.bind(this);
        this.graphAPICallback = this.graphAPICallback.bind(this);
        this.callMSGraph = this.callMSGraph.bind(this);
        this.callMSGraphWithTokenResponse = this.callMSGraphWithTokenResponse.bind(this);
    }

    signIn() {
        this.myMSALObj.loginPopup(this.requestObj)
            .then(this.successLogin)
            .catch(function (error) {
                //Please check the console for errors
                console.log(error);
            });
    }

    signOut() {
        this.myMSALObj.logout()
            .then(this.successLogout)
            .catch(function (error) {
                //Please check the console for errors
                console.log(error);
            });
    }

    isSignIn(status) {
        this.setState({
            showSignIn: !status,
            isSignIn: status,
        });
    }

    acquireTokenPopupAndCallMSGraph() {
        //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
        this.myMSALObj.acquireTokenSilent(this.requestObj)
            .then(this.callMSGraphWithTokenResponse)
            .catch(function (error) {
                console.log(error);
                // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
                // Call acquireTokenPopup(popup window)
                if (this.requiresInteraction(error.errorCode)) {
                    this.myMSALObj.acquireTokenPopup(this.requestObj).then(function (tokenResponse) {
                        this.callMSGraph(this.graphConfig.graphMeEndpoint, tokenResponse.accessToken, this.graphAPICallback);
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            });
    }

    successLogout(response) {
        this.isSignIn(false);
    }

    successLogin(loginResponse) {
        //Successful login
        this.acquireTokenPopupAndCallMSGraph();
        this.isSignIn(true);
    }

    authRedirectCallBack(error, response) {
        if (error) {
            console.log(error);
        } else {
            if (response.tokenType === "access_token") {
                this.callMSGraph(this.graphConfig.graphMeEndpoint, response.accessToken, this.graphAPICallback);
            } else {
                console.log("token type is:" + response.tokenType);
            }
        }
    }

    graphAPICallback(data) {
        var graphCallback = JSON.stringify(data, null, 2);
        console.info(graphCallback);
    }

    callMSGraphWithTokenResponse(tokenResponse) {
        this.callMSGraph(this.graphConfig.graphMeEndpoint, tokenResponse.accessToken, this.graphAPICallback);
    }

    callMSGraph(theUrl, accessToken, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200)
                callback(JSON.parse(this.responseText));
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xmlHttp.send();
    }

    render() {
        return (
            <div className="container">
                {this.state.showSignIn && <button className="btn btn-primary" type="button" onClick={this.signIn}>Sign In</button>}
                {!this.state.showSignIn && <button className="btn btn-outline-primary ml-2" type="button" onClick={this.signOut}>Sign out</button>}

                {this.state.isSignIn && < SearchUserForm />}
            </div>
        );
    }
}