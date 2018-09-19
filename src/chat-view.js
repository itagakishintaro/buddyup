import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './comment-post-view.js';
import './comments-view.js';

class ChatView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
          .comments {
              padding-top: 2em;
              /* padding-bottom: 3em; */
          }
          .post {
              background-color: white;
              border-top: 1px solid rgba(0,0,0,.12);
              /* position: fixed;
              bottom: .5em; */
              height: 3.5em;
              width: 100%;
              max-width: 384px;
          }
          .profile {
              background-color: #EEE;
              padding: .25em;
              height: 2em;
              width: 100%;
              position: fixed;
              top: 64;
              z-index: 9;
          }
          .profile .icon {
              vertical-align: bottom;
          }
          .profile .name {
              margin-right: .5em;
          }
        </style>
        <div>
          <div class="profile">
            <template is="dom-if" if="{{talkerProfile.photoURL}}">
              <img src="{{talkerProfile.photoURL}}" class="icon">
            </template>
            <template is="dom-if" if="{{!talkerProfile.photoURL}}">
              <img src="images/manifest/icon-48x48.png" class="icon">
            </template>
            <span class="name">{{talkerProfile.displayName}}</span>
            <span>へのコメント</span>
          </div>
          <div class="comments" on-dom-change="scroll">
            <comments-view user={{user}} talker={{talker}} comments={{comments}}></comments-view>
          </div>
          <div class="post">
            <comment-post-view user={{user}} talker={{talker}}></comment-post-view>
          </div>
          <div id="bottom"></div>
      </div>
    `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.comments = [];
        this.oldCommentsLength = 0;
        this.talkerProfile = { displayName: '板垣真太郎', email: '', photo: 'images/manifest/icon-48x48.png' };
    }

    static get properties() {
        return {
            user: Object,
            talker: { type: String, observer: '_talkerChanged' }
        }
    }

    scroll() {
      if( this.comments.length !== this.oldCommentsLength ){
        this.$.bottom.scrollIntoView( true );
        setTimeout( () => {
          this.oldCommentsLength = this.comments.length;
        }, 500);
      }
    }

    _talkerChanged( newTalker, oldTalker ) {
        console.log( '_talkerChanged', newTalker );
        this.comments = [];
        firebase.database().ref( 'comments/' + newTalker ).off( 'child_added' );

        // get comments to the new talker
        firebase.database().ref( 'profiles' ).once( 'value' ).then( snapshot => {
          let profiles = snapshot.val();
          firebase.database().ref( 'comments/' + newTalker ).on( 'child_added', snapshot => {
            let comment = snapshot.val();
            let commentKey = snapshot.key;
            if( profiles[comment.uid] ){
              comment.displayName = profiles[comment.uid].displayName;
              comment.photoURL = profiles[comment.uid].photoURL;
            }
            comment.uid = commentKey;
            this.push( 'comments', comment );
          } );
        } );

        // get the new talker's profile
        firebase.database().ref( 'profiles/' + newTalker ).once( 'value' ).then( snapshot => {
            this.talkerProfile = snapshot.val();
        } );
    }

}

window.customElements.define( 'chat-view', ChatView );
