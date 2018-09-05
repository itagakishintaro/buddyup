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
        .time {
          width: 8em;
          display: inline;
        }
        .label {
          font-size: 12px;
          color: var(--paper-grey-600);
        }
      </style>

      <div>
      <h1>ランチ会の新規登録</h1>
          <form class="clearfix">
            <label class="label" for="date">日時</label><input id="date" type="date"></input>
            <input id="timeFrom" class="time" type="time" label="開始時刻"></input>
             ~ <input id="timeTo" class="time" type="time" label="終了時刻"></input><br>
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

    post() {
        console.log( 'post()', this.user );
        let userObj = {};
        userObj[ this.user.uid ] = { displayName: this.user.displayName, email: this.user.email };
        firebase.database().ref( 'parties' ).push( {
            date: this.$.date.value,
            timeFrom: this.$.timeFrom.value,
            timeTo: this.$.timeTo.value,
            name: this.$.name.value,
            place: this.$.place.value,
            members: userObj
        } );
    }

}

window.customElements.define( 'newparty-view', NewpartyView );
