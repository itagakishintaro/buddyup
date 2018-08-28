import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
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

    getFriends() {
      console.log(this.user.uid);
      firebase.database().ref( 'comments/' + this.usr.uid ).once('value').then( snapshot => {
        console.log( snapshot.val() );
        let friends =

        // let friends = Object.keys( snapshot.val() )
        //   .map( v => snapshot.val()[v].members ) // membersオブジェクトの配列を取得
        //   .filter( membersObjects => Object.keys( membersObjects ).includes( this.user.uid ) ) // 自分が含まれるmembersオブジェクトに絞り込み
        //   .map( membersObjects => { // 自分を削除
        //     delete membersObjects[ this.user.uid ];
        //     return membersObjects;
        //   })
        //   .map( membersObjects => Object.keys( membersObjects ).map( uid => { // membersオブジェクトを配列にして、出力を整形
        //       return { uid: uid, displayName: membersObjects[uid].displayName };
        //     })
        //   )
        //   .reduce( ( p, c ) => p.concat( c ) ) // 分割した配列を１つにまとめる
        this.friends = friends;
      });
    }
}

window.customElements.define( 'users-view', UsersView );
