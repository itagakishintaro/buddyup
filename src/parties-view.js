import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './newparty-view.js';
import './loading-view.js';
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
        .date {
          font-size: 1.1em;
          margin-right: .5em;
        }
      </style>

      <div class="container">
        <template is="dom-repeat" items="{{parties}}">
          <div class="party">
            <div>
              <div>
                <span class="date">{{item.date}}</span><span>{{item.timeFrom}}</span> ~ <span>{{item.timeTo}}</span>
              </div>
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
      <loading-view display="{{loadingDisplay}}"></loading-view>
    `;
    }

    constructor() {
        super();
        this.parties = [];
        firebase.auth().onAuthStateChanged( () => {
          this.getMembers();
        });
    }

    static get properties() {
        return {
            user: Object
        }
    }

    getMembers() {
        console.log( 'getMembers()' );
        this.parties = [];
        firebase.database().ref( 'parties' ).off( 'child_added' );
        firebase.database().ref( 'profiles' ).once( 'value', snapshot => {
          let profiles = snapshot.val();

          firebase.database().ref( 'parties' ).orderByChild( 'date' ).startAt( new Date().toISOString().substring( 0, 10 ) ).on( 'child_added', snapshot => {
              let v = snapshot.val();
              if ( v.members ) {
                  v.joined = Object.keys( v.members ).includes( this.user.uid ); // Current user already joined or not
                  v.members = Object.keys( v.members ).map( key => Object.assign( { uid: key }, profiles[key] ) ); // Convert members from Object to Array
              }
              this.push( 'parties', Object.assign( { uid: snapshot.key }, v ) );
          } );

          this.loadingDisplay = 'none';
        } );
    }

    join( e ) {
        console.log( 'join()', e.target.dataset.uid );
        firebase.database().ref( `parties/${e.target.dataset.uid}/members/${this.user.uid}` ).set( this.user );
        this.getMembers();
    }

    cancel( e ) {
        console.log( 'cancel()', e.target.dataset.uid );
        firebase.database().ref( `parties/${e.target.dataset.uid}/members/${this.user.uid}` ).set( null );
        this.getMembers();
    }

}

window.customElements.define( 'parties-view', PartiesView );
