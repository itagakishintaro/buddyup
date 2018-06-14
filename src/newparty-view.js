import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class NewpartyView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        #post {
          float: right;
        }

      </style>

      <div id="container">
          <form class="clearfix">
            <span class="badge">ランチ会の新規登録</span></br>
            <input id="date" type="date">
            <input id="name" type="text" placeholder="ランチ会の名前">
            <input id="place" type="text" placeholder="ランチ会の場所">
            <button id="post" type="button" class="post-btn" on-click="post">登録</button>
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
