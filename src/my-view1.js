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
import './auth-view.js';
import './post-view.js';
import './comments-view.js';

class MyView1 extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

        <auth-view username={{username}}></auth-view>
        <post-view class={{postViewClass}}></post-view>
        <comments-view comments={{comments}}></comments-view>

    `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.username = '';
        this.postViewClass = 'visible';
        this.comments = [];
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
            this.set( 'postViewClass', 'visible' );
        } else {
            // No user is signed in.
            this.username = '';
            this.set( 'postViewClass', 'unvisible' );
        }
    }

    // Function to add a data listener
    startListening() {
        console.log( 'startListening()' );
        firebase.database().ref( '/' ).on( 'child_added', snapshot => {
            this.push( 'comments', snapshot.val() );
        } );
    }

}

window.customElements.define( 'my-view1', MyView1 );
