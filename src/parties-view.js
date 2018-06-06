import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class PartiesView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        #container{
          margin: 1em;
        }
        #party {
          display: flex;
          justify-content: space-between;
        }

        #member{
          margin-left: 1em;
        }

        #join {
          align-self: flex-end;
        }

        #post {
          float: right;
        }

      </style>

      <div id="container">
          <template is="dom-repeat" items="{{parties}}">
            <div id="party">
              <div>
                <div>{{item.date}}</div>
                <div>{{item.name}}@{{item.place}}</div>
                <template is="dom-repeat" items="{{item.members}}" on-dom-change="scroll">
                  <div id="member">
                  {{item.displayName}}
                  </div>
                </template>
              </div>

              <button id="join" class="post-btn">参加する</button>
            </div>
          </template>
          <hr>
          <form class="clearfix">
            <span class="badge">ランチ会の新規登録</span></br>
            <input id="date" type="date">
            <input id="name" type="text" placeholder="ランチ会の名前">
            <input id="place" type="text" placeholder="ランチ会の場所">
            <button id="post" class="post-btn" on-click="post">登録</button>
          </form>
      </div>
    `;
    }

    constructor() {
        super();
        this.parties = [];
        this.getMembers();
    }

    static get properties() {
        return {
            user: Object
        }
    }

    // getMembers
    getMembers() {
        console.log( 'getMembers()' );
        firebase.database().ref( 'parties' ).on( 'value', snapshot => {
            snapshot.forEach( data => {
                this.push( 'parties', data.val() );
                console.log( data.key, data.val(), this.members );
            } );
        } );
    }

    // post
    post() {
        console.log( 'post()', this.user );
        firebase.database().ref( 'parties' ).push( {
            date: this.$.date.value,
            name: this.$.name.value,
            place: this.$.place.value,
            members: [ { uid: this.user.uid, displayName: this.user.displayName, email: this.user.email } ]
        } );
    }

}

window.customElements.define( 'parties-view', PartiesView );
