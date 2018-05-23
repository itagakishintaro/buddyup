import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class PostView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
      #post {
          padding: 0.5em 1em;
          background-color: #50b1ff;
          border: none;
          color: #FFF;
      }
      </style>

      <div>
        <input id="text" type="text" placeholder="Message" class$="{{class}}"><br/>
        <button id="post" class$="{{class}}" on-click="post">Post</button>
      </div>

    `;
    }

    constructor() {
        super();
        this.class = 'visible';
    }

    static get properties() {
        return {
            class: String
        }
    }

    // post
    post() {
        console.log( 'post()' );
        firebase.database().ref( '/' ).push( {
            username: this.username,
            text: this.$.text.value
        } );
        this.textInput.value = '';
    }

}

window.customElements.define( 'post-view', PostView );
