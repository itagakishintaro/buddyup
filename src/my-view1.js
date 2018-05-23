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
        <template is="dom-if" if="{{!username}}">
            <button id="login" on-click="login">Google Login</button><br/>
        </template>
        <template is="dom-if" if="{{username}}">
            <span>Logged in as [[username]]</span>
            <button id="logout" on-click="logout">ログアウト</button><br/>
        </template>
        <input id="text" type="text" placeholder="Message" class$="[[textInput.class]]" value$="[[textInput.value]]"><br/>
        <button id="post" class$="[[postButton.class]]" on-click="post">Post</button><br/>
        <div id="results">
        <template is="dom-repeat" items="{{posts}}">
          <div class="msg">
            <b>{{item.username}}</b>
            <p>{{item.text}}</p>
          </div>
        </template>
        </div>
      </div>
    `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.username = '';
        this.textInput = { value: '', class: 'unvisible' };
        this.postButton = { class: 'unvisible' };
        this.posts = [];
        this.initFirebase();
    }

    ready() {
        console.log( 'ready()' );
        super.ready();
        this.setUserInfo();
    }

    // Initialize Firebase
    initFirebase() {
        console.log( 'initFirebase()' );
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyAGW3s4tqAe8wAZY65hrM6YKpvKHj2dNjM",
            authDomain: "buddyup-204005.firebaseapp.com",
            databaseURL: "https://buddyup-204005.firebaseio.com",
            projectId: "buddyup-204005",
            storageBucket: "buddyup-204005.appspot.com",
            messagingSenderId: "541079223817"
        };
        firebase.initializeApp( config );
        firebase.auth().onAuthStateChanged( user => {
            console.log( 'onAuthStateChanged' );
            this.setUserInfo();
            if ( user ) {
                this.startListening();
            }
        } );
    }

    // set user info and toggle visible/disable
    setUserInfo() {
        console.log( 'setUserInfo()' );
        let user = firebase.auth().currentUser;
        if ( user ) {
            // User is signed in.
            this.username = user.displayName;
            this.set( 'textInput.value', '' );
            this.set( 'textInput.class', 'visible' );
            this.set( 'postButton.class', 'visible' );
        } else {
            // No user is signed in.
            this.username = '';
            this.set( 'textInput.value', '' );
            this.set( 'textInput.class', 'unvisible' );
            this.set( 'postButton.class', 'unvisible' );
        }
    }

    // Function to add a data listener
    startListening() {
        console.log( 'startListening()' );
        firebase.database().ref( '/' ).on( 'child_added', snapshot => {
            this.push( 'posts', snapshot.val() );
        } );
    }

    // login
    login() {
        console.log( 'login()' );
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup( provider ).then( result => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            let token = result.credential.accessToken;
            // The signed-in user info.
            let user = result.user;
        } ).catch( error => {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // The email of the user's account used.
            let email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            let credential = error.credential;
            console.error( 'ERROR:', error );
        } );
    }

    // logout
    logout() {
        console.log( 'logout()' );
        this.set( 'posts', [] );
        firebase.auth().signOut().then( () => {
            // Sign-out successful.
            console.log( 'loged out' );
        } ).catch( error => {
            // An error happened.
            console.error( error );
        } );
    }

    // post
    post() {
        console.log( 'post()' );
        firebase.database().ref( '/' ).push( {
            username: this.username,
            text: this.$.text.value
        } );
        this.textInput.value = '';
    }
}

window.customElements.define( 'my-view1', MyView1 );
