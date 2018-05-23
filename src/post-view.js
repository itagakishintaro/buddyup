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
      #text {
          border: none;
          border-bottom: 1px solid rgba(0,0,0,.12);
          margin-bottom: 1em;
          resize: vertical;
          width: 99%;
      }
      ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: lightgray;
            opacity: 1; /* Firefox */
        }
      </style>

      <div>
        <textarea id="text" type="text" rows="2" placeholder="スキルや得意なことなど、その人の印象を書いてください" class$="{{class}}"></textarea>
        <button id="post" class$="{{class}}" on-click="post">投稿</button>
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
