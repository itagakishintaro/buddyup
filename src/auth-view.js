import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

class ProfileView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
        .camera {
            position: absolute;
            left: 1em;
            bottom: 0;
        }
        .display {
            display: flex;
            justify-content: space-between;
        }
        .displayName {
            width: 20em;
            margin-left: 1em;
        }
        .file {
          display: none;
        }
        .on {
            float: right;
            margin-top: 1em;
        }
        .photo {
            position: relative;
        }
        </style>

        <div class="container">
            <template is="dom-if" if="{{ user.isPasswordAuth }}">
                <paper-input id="email" type="email" always-float-label label="email" value="{{user.email}}"></paper-input>
                <paper-input id="password" type="password" always-float-label label="password" value="{{user.password}}"></paper-input>
            </template>

            <div class="display">
                <div class="photo">
                    <paper-icon-button icon="camera-enhance" class="camera"></paper-icon-button>
                    <label htmlFor="photoURL">
                        <image src="{{user.photoURL}}">
                        <input id="photoURL" class="file" type="file" accept="image/*" on-click="capture"></input>
                    </label>
                </div>
                <paper-input id="displayName" class="displayName" always-float-label label="表示名" value="{{user.displayName}}"></paper-input>
            </div>

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

window.customElements.define( 'profile-view', ProfileView );
