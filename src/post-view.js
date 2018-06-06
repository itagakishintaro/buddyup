import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class PostView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
      #container {
          display: flex;
          /*justify-content: space-between;*/
          margin-bottom: .5em;
          background-color: white;
      }

      #text {
          border: none;
          border-bottom: 1px solid rgba(0,0,0,.12);
          padding: .5em 1em;
          resize: none;
          width: calc(100% - 8em);
      }

      </style>

      <div id="container">
        <textarea id="text" type="text" rows="2" placeholder="スキルや得意なことなど、その人の印象を書いてください"></textarea>
        <button id="post" class="post-btn" on-click="post">投稿</button>
      </div>

    `;
    }

    constructor() {
        super();
    }

    static get properties() {
        return {
            user: Object
        }
    }

    // post
    post() {
        console.log( 'post()', this.$.text.value, this.user.displayName );
        console.log( 'talker', this.talker );
        firebase.database().ref( 'comments/user:' + this.talker ).push( {
            username: this.user.displayName,
            text: this.$.text.value
        } );
        this.$.text.value = '';
    }

}

window.customElements.define( 'post-view', PostView );
