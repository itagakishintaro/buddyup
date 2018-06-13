/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './post-view.js';
import './comments-view.js';

class ChatView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
          #container{
          }
          #comments {
              padding-bottom: 3.5em;
          }
        #post{
            background-color: white;
            border-top: 1px solid rgba(0,0,0,.12);
            height: 3.5em;
            position: fixed;
            bottom: 0;
            width: 100%;
            max-width: 384px;
        }
      </style>
      <div id="container">
        <div id="comments">
            <comments-view comments={{comments}}></comments-view>
        </div>
        <div id="post">
            <post-view user={{user}} talker={{talker}}></post-view>
        </div>
        <div id="bottom"></div>
      </div>

    `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.comments = [];
        // this.startListening( this.talker );
    }

    static get properties() {
        return {
            user: Object,
            talker: { type: String, observer: '_talkerChanged' }
        }
    }

    _talkerChanged( newValue, oldValue ) {
        console.log( '_talkerChanged', newValue );
        this.comments = [];
        this.startListening( newValue );
    }

    // Function to add a data listener
    startListening( talker ) {
        console.log( 'startListening()', talker );
        firebase.database().ref( 'comments/user:' + talker ).on( 'child_added', snapshot => {
            this.push( 'comments', snapshot.val() );
        } );
    }

}

window.customElements.define( 'chat-view', ChatView );
