import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class MembersView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
      </style>

      <div id="container">
          <template is="dom-repeat" items="{{members}}" on-dom-change="scroll">
            <div>
            {{item.text}}
            </div>
          </template>
          <div id="bottom"></div>
      </div>
    `;
    }

    constructor() {
        super();
        this.members = [];
        this.getMembers();
    }

    // getMembers
    getMembers() {
        console.log( 'getMembers()' );
        firebase.database().ref( '/' ).on( 'value', snapshot => {
            snapshot.forEach( data => {
                this.push( 'members', data.val() );
                console.log( "The " + data.key + " dinosaur's score is " + data.val() );
            } );
        } );
    }
}

window.customElements.define( 'members-view', MembersView );
