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

              <button id="join" class="post-btn" data-uid$="{{ item.uid }}" on-click="join">参加</button>
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

    // getMembers
    getMembers() {
        console.log( 'getMembers()' );
        firebase.database().ref( 'parties' ).on( 'value', snapshot => {
            snapshot.forEach( data => {
                let v = data.val();
                v.members = Object.keys( v.members ).map( key => Object.assign( { uid: key }, v.members[ key ] ) ); // Convert members from Object to Array
                this.push( 'parties', Object.assign( { uid: data.key }, v ) );
            } );
        } );
    }

    // join
    join( e ) {
        console.log( 'join()', e.target.dataset.uid );
        this.parties = [];
        firebase.database().ref( `parties/${e.target.dataset.uid}/members` ).push( { uid: this.user.uid, displayName: this.user.displayName, email: this.user.email } );
    }

}

window.customElements.define( 'parties-view', PartiesView );
