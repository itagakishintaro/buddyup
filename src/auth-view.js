import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toast/paper-toast.js';

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
            <div id="error" class="error"></div>
            <paper-input id="oldPassword" type="password" always-float-label label="現在のパスワード"></paper-input>
            <paper-input id="newPassword" type="password" always-float-label label="新しいパスワード"></paper-input>
            <paper-input id="comfirmPassword" type="password" always-float-label label="新しいパスワード（確認）"></paper-input>
            <paper-button raised class="on" on-click="update">更新</paper-button>
            <paper-toast id="toast" text="更新しました!"></paper-toast>
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
        this.$.error.textContent = '';
        let user = firebase.auth().currentUser;
        let oldPassword = this.$.oldPassword.value;
        let newPassword = this.$.newPassword.value;
        let comfirmPassword = this.$.comfirmPassword.value;
        this.$.oldPassword.value = '';
        this.$.newPassword.value = '';
        this.$.comfirmPassword.value = '';
        let credential = firebase.auth.EmailAuthProvider.credential( this.user.email, oldPassword );

        if( newPassword !== comfirmPassword ) {
            this.$.error.textContent = '新しいパスワードと新しいパスワード（確認）が異なります。';
            return;
        }
        user.reauthenticateWithCredential( credential ).then( () => {
            user.updatePassword( newPassword ).then( () => {
                this.$.toast.open();
            }).catch( error => {
                this.$.error.textContent = error.message;
            });
        }).catch( error => {
            this.$.error.textContent = error.message;
        });

    }
}

window.customElements.define( 'auth-view', AuthView );
