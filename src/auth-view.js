import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class AuthView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
      #login {
          padding: 0.5em 1em;
          background-color: #DD4B39;
          border: none;
          color: #FFF;
          cursor: pointer;
      }
      </style>

      <template is="dom-if" if="{{!username}}">
          <button id="login" on-click="login">Google Login</button><br/>
      </template>
      <template is="dom-if" if="{{username}}">
          <span>Logged in as {{username}}</span>
          <button id="logout" on-click="logout">ログアウト</button><br/>
      </template>

    `;
    }

    constructor() {
        super();
        this.username = '';
    }

    static get properties() {
        return {
            username: String
        }
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

        // firebase.auth().signInWithRedirect( provider );
        // firebase.auth().getRedirectResult().then( function( result ) {
        //     if ( result.credential ) {
        //         // This gives you a Google Access Token. You can use it to access the Google API.
        //         var token = result.credential.accessToken;
        //     }
        //     // The signed-in user info.
        //     var user = result.user;
        // } ).catch( function( error ) {
        //     // Handle Errors here.
        //     var errorCode = error.code;
        //     var errorMessage = error.message;
        //     // The email of the user's account used.
        //     var email = error.email;
        //     // The firebase.auth.AuthCredential type that was used.
        //     var credential = error.credential;
        //     console.error( 'ERROR:', error );
        // } );
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

}

window.customElements.define( 'auth-view', AuthView );
