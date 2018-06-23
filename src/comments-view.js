import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class CommentsView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
      .container {
          overflow: scroll;
          margin: 1em;
      }

      .username {
          font-size: .5em;

      }
      .text {
        vertical-align: text-top;
        display:table-cell;
        white-space:pre-wrap;
      }

      .msg {
          margin-bottom: 1em;
          width: 100%;
          display: flex;
      }

      .icon {
          width: 2em;
          height: 2em;
          margin-right: .5em;
      }
      </style>

      <div class="container">
          <template is="dom-repeat" items="{{comments}}" on-dom-change="scroll">
            <div class="msg">
                <div><img src="images/manifest/icon-48x48.png" class="icon"></div>
                <div>
                    <div class="username">{{item.username}}</div>
                    <p class="text">{{item.text}}</p>
                </div>
            </div>
          </template>
          <div id="bottom"></div>
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

    scroll() {
        console.log( 'scroll()' );
        this.$.bottom.scrollIntoView( true );
    }

}

window.customElements.define( 'comments-view', CommentsView );
