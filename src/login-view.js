import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class LoginView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
      #login {
          padding: 0.5em 1em;
          margin: 1em 5em 1em 1em;
          background-color: #DD4B39;
          border: none;
          color: #FFF;
          cursor: pointer;
          width: calc(100% - 2em) ;
      }

      </style>
      <button id="login" on-click="login">Googleでログイン</button>

    `;
    }

    static get properties() {
        return {
            user: Object
        }
    }

    // login
    login() {
        console.log( 'login()' );
        let provider = new firebase.auth.GoogleAuthProvider();
        // signInWithPopup or signInWithRedirect
        firebase.auth().signInWithRedirect( provider );

        // firebase.auth().signInWithPopup( provider ).then( result => {
        //     // This gives you a Google Access Token. You can use it to access the Google API.
        //     let token = result.credential.accessToken;
        //     // The signed-in user info.
        //     let user = result.user;
        //     console.log( 'logined', user );
        //     location.href = '/chat-view/';
        // } ).catch( error => {
        //     // Handle Errors here.
        //     let errorCode = error.code;
        //     let errorMessage = error.message;
        //     // The email of the user's account used.
        //     let email = error.email;
        //     // The firebase.auth.AuthCredential type that was used.
        //     let credential = error.credential;
        //     console.error( 'ERROR:', error );
        // } );

        // firebase.auth().getRedirectResult().then( result => {
        //     if ( result.credential ) {
        //         // This gives you a Google Access Token. You can use it to access the Google API.
        //         var token = result.credential.accessToken;
        //     }
        //     // The signed-in user info.
        //     this.user = result.user;
        //     console.log( 'redirect' );
        //     location.href = '/parties-view/';
        // } ).catch( error => {
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

}

window.customElements.define( 'login-view', LoginView );
