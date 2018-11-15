import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
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
          .collapse-content {
            background-color: #EEE;
            position: fixed;
            top: 64;
            padding-top: 3em;
            padding-left: 1em;
            padding-bottom: 1em;
            width: 100%;
            z-index: 8;
          }
          .right {
            float: right;
            margin-right: 1em;
          }
        </style>
        <div>
          <div class="profile" on-click="toggleMembersOpened">
            <template is="dom-if" if="{{talkerProfile.photoURL}}">
              <img src="{{talkerProfile.photoURL}}" class="icon">
            </template>
            <template is="dom-if" if="{{!talkerProfile.photoURL}}">
              <img src="images/manifest/icon-48x48.png" class="icon">
            </template>
            <span class="name">{{talkerProfile.displayName}}</span>
            <iron-icon class="right" icon="expand-more"></iron-icon>
          </div>

          <iron-collapse id="collapse">
            <div class="collapse-content">
              <template is="dom-repeat" items="{{members}}">
                <div class="link" data-uid$="{{item.uid}}" on-click="changeTalker">{{item.displayName}}</div>
              </template>
            </div>
          </iron-collapse>

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
        this.profiles = [];
        this.oldCommentsLength = 0;
        this.talkerProfile = { displayName: '', email: '', photo: 'images/manifest/icon-48x48.png' };
    }

    static get properties() {
        return {
            user: Object,
            talker: { type: String, observer: '_talkerChanged' }
        }
    }

    scroll() {
        if ( this.comments.length !== this.oldCommentsLength ) {
            this.$.bottom.scrollIntoView( true );
            setTimeout( () => {
                this.oldCommentsLength = this.comments.length;
            }, 500 );
        }
    }

    toggleMembersOpened() {
      console.log('hello');
      this.$.collapse.toggle();
    }

    changeTalker( e ) {
      this.set('talker', e.target.dataset.uid);
      this.toggleMembersOpened();
    }

    _talkerChanged( newTalker, oldTalker ) {
        console.log( '_talkerChanged', newTalker );
        this.comments = [];
        firebase.database().ref( 'comments/' + newTalker ).off( 'child_added' );

        // get comments to the new talker
        firebase.database().ref( 'profiles' ).once( 'value' ).then( snapshot => {
            this.profiles = snapshot.val();
            firebase.database().ref( 'comments/' + newTalker ).on( 'child_added', snapshot => {
                let comment = snapshot.val();
                let commentKey = snapshot.key;
                if ( this.profiles[ comment.uid ] ) {
                    comment.displayName = this.profiles[ comment.uid ].displayName;
                    comment.photoURL = this.profiles[ comment.uid ].photoURL;
                }
                comment.uid = commentKey;
                this.push( 'comments', comment );
            } );

            // set the new talker's profile
            this.talkerProfile = this.profiles[ newTalker ];
            this._getMembers();
        } );
    }

    _getMembers() {
      firebase.database().ref( 'parties' + this.party ).once( 'value' ).then( snapshot => {
        this.members = Object.keys(snapshot.val().members)
          .filter( key => key !== this.talker ) // 自分を除外
          .map( key => {
            if( !this.profiles[key] ){
              firebase.database().ref( '/profiles/' + key ).once( 'value' ).then( snapshot => {
                console.log(key);
                this.profiles[ key ] = snapshot.val();
              });
            }
            let member = this.profiles[key];
            member.uid = key;
            return member;
          });
        console.log('members', this.members);
      });
    }

}

window.customElements.define( 'chat-view', ChatView );
