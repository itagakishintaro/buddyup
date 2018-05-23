import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class CommentsView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
      #username,
      #text {
          margin: 5px 0px;
      }

      .msg {
          margin: 10px 0;
          padding: 10px;
          width: 400px;
          background-color: #efefef;
      }
      </style>

      <template is="dom-repeat" items="{{comments}}">
        <div class="msg">
          <b id="username">{{item.username}}</b>
          <p id="text">{{item.text}}</p>
        </div>
      </template>
      </div>

    `;
    }

    constructor() {
        super();
        this.comments = [];
    }

    static get properties() {
        return {
            comments: Array
        }
    }

}

window.customElements.define( 'comments-view', CommentsView );
