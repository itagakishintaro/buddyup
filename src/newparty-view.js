import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';

class NewpartyView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        .on {
          float: right;
        }

      </style>

      <div id="container">
          <form class="clearfix">
            <span class="badge">ランチ会の新規登録</span></br>
            <paper-input id="date" type="date" label="日付"></paper-input>
            <paper-input id="name" always-float-label label="名前"></paper-input>
            <paper-input id="place" always-float-label label="場所"></paper-input>
            <paper-button id="post" raised class="on" on-click="post">登録</paper-button>
          </form>
      </div>
    `;
    }

    constructor() {
        super();
    }

    static get properties() {
        return {
            user: Object
        }
    }

    // post
    post() {
        console.log( 'post()', this.user );
        let userObj = {};
        userObj[ this.user.uid ] = { displayName: this.user.displayName, email: this.user.email };
        firebase.database().ref( 'parties' ).push( {
            date: this.$.date.value,
            name: this.$.name.value,
            place: this.$.place.value,
            members: userObj
        } );
    }

}

window.customElements.define( 'newparty-view', NewpartyView );
