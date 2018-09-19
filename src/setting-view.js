import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import handleImage from './util/ImageHandler.js';
import './shared-styles.js';
import './loading-view.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-toast/paper-toast.js';

class SettingView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
        .camera {
            position: absolute;
            left: 1.5em;
            bottom: 0;
        }
        .display {
            display: flex;
            justify-content: space-between;
        }
        .displayName {
            width: 20em;
            margin-left: 1.5em;
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
        .preview {
            width: 4em;
            height: 4em;
            margin-bottom: .2em;
            object-fit: contain;
        }
        .change {
          border-radius: 1em;
          border: .5px solid var(--paper-blue-grey-100);
          font-size: .8em;
          padding: 1em .8em;
          width: 4em;
        }

        </style>

        <div class="container">
            <div class="display">
                <div class="photo">
                    <image id="icon" class="preview" src="[[user.photoURL]]">
                    <label class="change" htmlFor="file">
                      Change
                      <input id="file" class="file" type="file" accept="image/*" on-change="capture"></input>
                    </label>
                </div>
                <paper-input id="displayName" class="displayName" always-float-label label="表示名" value="[[user.displayName]]"></paper-input>
            </div>

            <paper-button raised class="on" on-click="update">更新</paper-button>
            <paper-toast id="toast" text="更新しました!"></paper-toast>
        </div>
        <loading-view display="{{loadingDisplay}}"></loading-view>
        `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.loadingDisplay = 'none';
    }

    static get properties() {
        return {
            user: Object
        }
    }

    capture() {
        this.loadingDisplay = 'block';
        let file = this.$.file.files[0];
        handleImage( file, 480, dataURL => {
            this.$.icon.src = dataURL;
            this.loadingDisplay = 'none';
        } )
    }

    update() {
        console.log( 'update()' );
        let photoURLPromise = firebase.database().ref( 'profiles/' + this.user.uid + '/photoURL' ).set( this.$.icon.src );
        let displayNamePromise = firebase.database().ref( 'profiles/' + this.user.uid + '/displayName' ).set( this.$.displayName.value );
        let promises = [];

        if( this.$.icon.src && this.$.icon.src !== this.user.photoURL ){
            promises.push(photoURLPromise);
        }
        if( this.$.displayName.value && this.$.displayName.value !== this.user.displayName ){
            promises.push(displayNamePromise);
        }

        Promise.all( promises ).then( v => {
            this.user.displayName = this.$.displayName.value;
            this.$.toast.open();
        });
    }

}

window.customElements.define( 'setting-view', SettingView );
