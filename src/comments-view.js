import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-badge/paper-badge.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

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

            .like {
                border : 1px solid var(--paper-blue-grey-200);
                border-radius: .25em;
                padding: .25em .5em;
                width: 4em;
            }

            .like-icon {
                width: 1.5em;
                height: 1.5em;
                color: var(--paper-blue-800);
                vertical-align: middle;
                padding: 0;
            }

            .like-number {
                color: var(--paper-blue-grey-600);
                font-size: .8em;
            }
        </style>

        <div class="container">
            <template is="dom-repeat" items="{{comments}}" on-dom-change="scroll">
                <div class="msg">
                    <div>
                        <img src="{{item.photoURL}}" class="icon">
                    </div>
                    <div>
                        <div class="username">{{item.username}}</div>
                        <p class="text">{{item.text}}</p>
                        <div class="like">
                            <paper-icon-button class="like-icon" icon="thumb-up" data-uid$="{{ item.uid }}" on-click="like"></paper-icon-button>
                            <span class="like-number">999</span>
                        </div>
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

    like( e ) {
        console.log( 'like()', e.target.dataset.uid );
    }

}

window.customElements.define( 'comments-view', CommentsView );
