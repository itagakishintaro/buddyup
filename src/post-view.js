import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class PostView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
      #container {
          display: flex;
          justify-content: space-between;
          margin: 0 .5em .5em 0;
          background-color: white;
      }

      #post {
          margin-top: .5em;
          background-color: #50b1ff;
          border: none;
          color: #FFF;
          width: 15%;
      }
      #text {
          border: none;
          /*border-bottom: 1px solid rgba(0,0,0,.12);*/
          padding: .5em 1em;
          resize: none;
          width: 85%;
      }
      ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: gray;
            opacity: 1; /* Firefox */
        }
      </style>

      <div id="container">
        <textarea id="text" type="text" rows="3" placeholder="スキルや得意なことなど、その人の印象を書いてください"></textarea>
        <button id="post" on-click="post">投稿</button>
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
