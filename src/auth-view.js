import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';

class AuthView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
        .on {
            float: right;
            margin-top: 1em;
        }
        </style>

        <div class="container">
            <paper-input id="email" type="email" always-float-label label="email" value="[[user.email]]"></paper-input>
            <paper-input id="password" type="password" always-float-label label="password" value="[[user.password]]"></paper-input>

            <paper-button raised class="on" on-click="update">更新</paper-button>
        </div>
        `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
    }

    static get properties() {
        return {
            user: Object
        }
    }

    update() {
        console.log( 'update()' );
        let user = firebase.auth().currentUser;
        console.log( document.getElementById('email') );
        console.log( this.$.email );
        if( this.$.email.value && this.$.email.value != this.user.email ){
            _updateEmail( user );
        }
    }

    _updateEmail( user ) {
        console.log( '_updateEmail( user )' );
        // user.updateEmail().then( () => {
        //   // Update successful.
        //   console.log('email update');
        // }).catch(function(error) {
        //   // An error happened.
        // });
    }

}

window.customElements.define( 'auth-view', AuthView );
