/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class MyView1 extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }

        body {
            font-family: 'HelveticaNeue-Light';
        }

        .msg {
            margin: 10px 0;
            padding: 10px;
            width: 400px;
            background-color: #efefef;
        }

        #username,
        #text {
            margin: 5px 0px;
        }

        #post {
            padding: 0.5em 1em;
            background-color: #50b1ff;
            border: none;
            color: #FFF;
        }

        #login {
            padding: 0.5em 1em;
            background-color: #DD4B39;
            border: none;
            color: #FFF;
            cursor: pointer;
        }

        .visible {
            display: block;
        }
        .unvisible{
            display: none;
        }
      </style>

      <div class="card">
        <button id="login" on-click="login" class$="[[loginButton.disabled]]">[[loginButton.text]]</button><br/>
        <input id="text" type="text" placeholder="Message" class$="[[textInput.class]]" value$="[[textInput.value]]"><br/>
        <button id="post" class$="[[postButton.class]]" on-click="post">Post</button><br/>
        <div id="results"></div>
      </div>
    `;
    }

    constructor() {
        super();
        this.username = '';

        this.loginButton = { text: 'Google Login', disabled: '' };
        this.textInput = { value: '', class: 'visible' };
        this.postButton = { class: 'visible' };
    }

    ready() {
        super.ready();
        this.initFirebase();
    }

    // Initialize Firebase
    initFirebase() {
        console.log( 'Initialize Firebase' );
        var config = {
            apiKey: "AIzaSyAGW3s4tqAe8wAZY65hrM6YKpvKHj2dNjM",
            authDomain: "buddyup-204005.firebaseapp.com",
            databaseURL: "https://buddyup-204005.firebaseio.com",
            projectId: "buddyup-204005",
            storageBucket: "buddyup-204005.appspot.com",
            messagingSenderId: "541079223817"
        };
        firebase.initializeApp( config );
    }

    // Function to add a data listener
    startListening() {
        console.log( 'Function to add a data listener' );
        firebase.database().ref( '/' ).on( 'child_added', function( snapshot ) {
            var msg = snapshot.val();
            console.log( 'MESSAGE:', msg );

            // var msgUsernameElement = document.createElement( "b" );
            // msgUsernameElement.textContent = msg.username;
            //
            // var msgTextElement = document.createElement( "p" );
            // msgTextElement.textContent = msg.text;
            //
            // var msgElement = document.createElement( "div" );
            // msgElement.appendChild( msgUsernameElement );
            // msgElement.appendChild( msgTextElement );
            //
            // msgElement.className = "msg";
            // document.getElementById( "results" ).appendChild( msgElement );
        } );
    }

    // login
    login() {
        console.log( 'login' );
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect( provider );
        console.log( '1------------' );
        firebase.auth().getRedirectResult().then( function( result ) {
            console.log( '2------------' );
            if ( result.credential ) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                this.username = user.displayName;
                this.set( 'loginButton.text', 'Logged in as ' + this.username );
                this.set( 'loginButton.disabled', 'true' );
                this.set( 'textInput.class', 'visible' );
                this.set( 'postButton.class', 'visible' );
                // Start listening for data, remove previous calls to this method
                this.startListening();
            }
            // The signed-in user info.
            var user = result.user;
        } ).catch( function( error ) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            console.error( 'ERROR:', error );
        } );
    }

    // post
    post() {
        console.log( this.$.text.value );
        firebase.database().ref( '/' ).push( {
            username: 'this.username',
            text: this.$.text.value
        } );
        this.textInput.value = '';
    }
}

window.customElements.define( 'my-view1', MyView1 );
