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
                <template is="dom-repeat" items="{{item.members}}" on-dom-change="scroll">
                  <div id="member">
                    <a href="/chat-view/{{item.uid}}">{{item.displayName}}</a>
                  </div>
                </template>
              </div>

              <button id="join" class="post-btn">参加する</button>
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
                this.push( 'parties', data.val() );
                console.log( data.key, data.val(), this.members );
            } );
        } );
    }

}

window.customElements.define( 'parties-view', PartiesView );
