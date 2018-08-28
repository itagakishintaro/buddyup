import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './loading-view.js';
import '@polymer/paper-button/paper-button.js';

class UsersView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
        </style>

        <div class="container">
          <paper-button raised class="on" on-click="getFriends">知り合い検索</paper-button>
          <template is="dom-repeat" items="{{friends}}">
            <ul>
              <li><a href="/chat-view/{{item.uid}}">{{item.displayName}}</a></li>
            </ul>
          </template>
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

    // 知り合い(friend)の定義は自分にコメントしてくれた人
    getFriends() {
      console.log(this.user.uid);
      this.loadingDisplay = 'block';
      firebase.database().ref( 'comments/' + this.user.uid ).once('value').then( snapshot => {
        let friendUIDs = [];
        let friends = [];
        Object.keys( snapshot.val() ).forEach( key => {
          if( friendUIDs.includes( snapshot.val()[key].uid ) || snapshot.val()[key].uid === this.user.uid ){ // すでに取得済み or 自分なら何もしない
            return;
          }
          friendUIDs.push( snapshot.val()[key].uid );
          friends.push( snapshot.val()[key] );
        });
        this.friends = friends;
      }).finally( () => {
        this.loadingDisplay = 'none';
      } );
    }
}

window.customElements.define( 'users-view', UsersView );
