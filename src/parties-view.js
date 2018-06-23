import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './newparty-view.js';
import '@polymer/paper-button/paper-button.js';

class PartiesView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        .party {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1em;
        }

        .indent {
          margin-left: 1em;
        }

        .on, .off {
          align-self: flex-end;
          height: 2em;
        }

      </style>

      <div class="container">
          <template is="dom-repeat" items="{{parties}}">
            <div class="party">
              <div>
                <div>{{item.date}}</div>
                <div class="indent">{{item.name}}@{{item.place}}</div>
                <template is="dom-repeat" items="{{ item.members }}" on-dom-change="scroll">
                  <div class="indent">
                    <a href="/chat-view/{{item.uid}}">{{item.displayName}}</a>
                  </div>
                </template>
              </div>
              <template is="dom-if" if="{{ item.joined }}">
                <paper-button id="cancel" raised class="off" data-uid$="{{ item.uid }}" on-click="cancel">cancel</paper-button>
              </template>
              <template is="dom-if" if="{{ !item.joined }}">
                <paper-button id="join" raised class="on" data-uid$="{{ item.uid }}" on-click="join">参加</paper-button>
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
