import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './newparty-view.js';

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

      </style>

      <div id="container">
          <template is="dom-repeat" items="{{parties}}">
            <div id="party">
              <div>
                <div>{{item.date}}</div>
                <div>{{item.name}}@{{item.place}}</div>
                <template is="dom-repeat" items="{{ item.members }}" on-dom-change="scroll">
                  <div id="member">
                    <a href="/chat-view/{{item.uid}}">{{item.displayName}}</a>
                  </div>
                </template>
              </div>
              <template is="dom-if" if="{{ item.joined }}">
                <button id="join" class="cancel-btn" data-uid$="{{ item.uid }}" on-click="cancel">キャンセル</button>
              </template>
              <template is="dom-if" if="{{ !item.joined }}">
                <button id="join" class="post-btn" data-uid$="{{ item.uid }}" on-click="join">参加</button>
              </template>
            </div>
          </template>
          <hr>
          <newparty-view user={{user}}></newparty-view>
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

    getMembers() {
        console.log( 'getMembers()' );
        firebase.database().ref( 'parties' ).on( 'value', snapshot => {
            this.parties = [];
            snapshot.forEach( data => {
                let v = data.val();
                if ( v.members ) {
                    v.joined = Object.keys( v.members ).includes( this.user.uid ); // Current user already joined or not
                    v.members = Object.keys( v.members ).map( key => Object.assign( { uid: key }, v.members[ key ] ) ); // Convert members from Object to Array
                }
                this.push( 'parties', Object.assign( { uid: data.key }, v ) );
            } );
        } );
    }

    join( e ) {
        console.log( 'join()', e.target.dataset.uid );
        firebase.database().ref( `parties/${e.target.dataset.uid}/members/${this.user.uid}` ).set( { displayName: this.user.displayName, email: this.user.email } );
    }

    cancel( e ) {
        console.log( 'cancel()', e.target.dataset.uid );
        firebase.database().ref( `parties/${e.target.dataset.uid}/members/${this.user.uid}` ).set( null );
    }

}

window.customElements.define( 'parties-view', PartiesView );
