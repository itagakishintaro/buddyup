import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';

class CommentPostView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        .custom-container {
            display: flex;
            justify-content: space-between;
            margin-top: .5em;
            background-color: white;
        }

        .text {
            resize: none;
            width: 100%;
            border: thin solid gray;
            /* iphoneでテキスト入力で拡大する問題対策 */
            font-size: 16px;
            margin-left: .5em;
        }

        ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
              color: gray;
              opacity: 1; /* Firefox */
              font-size: 12px;
          }

      </style>

      <div class="custom-container">
        <textarea id="text" class="text" rows="2" placeholder="スキル、得意なこと、印象など"></textarea>
        <paper-button id="post" raised class="on" on-tap="post">投稿</paper-button>
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
        console.log( 'post()', this.$.text.value );
        firebase.database().ref( 'comments/' + this.talker ).push( {
            uid: this.user.uid,
            displayName: this.user.displayName,
            text: this.$.text.value,
            photoURL: this.user.photoURL
        } );
        this.$.text.value = '';
    }

}

window.customElements.define( 'comment-post-view', CommentPostView );
