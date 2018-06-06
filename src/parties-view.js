import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class PartiesView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        #party {
          margin: 1em;
        }

      </style>

      <div id="container">
          <template is="dom-repeat" items="{{parties}}" on-dom-change="scroll">
            <div id="party">
            {{item.date}} {{item.name}} @{{item.place}}
              <template is="dom-repeat" items="{{item.members}}" on-dom-change="scroll">
                <div id="member">
                {{item.displayName}}
                </div>
              </template>
            </div>
          </template>
          <div id="bottom"></div>

          <input id="date" type="date">
          <input id="name" type="text">
          <input id="place" type="text">
          <button id="post" on-click="post">登録</button>
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
            members: [ { uid: this.user.uid, displayName: this.user.displayName, email: this.user.email }, { uid: this.user.uid, displayName: this.user.displayName, email: this.user.email }, { uid: this.user.uid, displayName: this.user.displayName, email: this.user.email }, { uid: this.user.uid, displayName: this.user.displayName, email: this.user.email }, { uid: this.user.uid, displayName: this.user.displayName, email: this.user.email } ]
        } );
    }

}

window.customElements.define( 'parties-view', PartiesView );
