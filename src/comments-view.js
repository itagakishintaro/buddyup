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

        .like-not-yet {
          color: var(--paper-blue-grey-400);
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
              <template is="dom-if" if="{{item.photoURL}}">
                <img src="{{item.photoURL}}" class="icon">
              </template>
              <template is="dom-if" if="{{!item.photoURL}}">
                <img src="images/manifest/icon-48x48.png" class="icon">
              </template>
            </div>
            <div>
              <div class="username">{{item.username}}</div>
              <p class="text">{{item.text}}</p>
              <div class="like">
                <template is="dom-if" if="{{ _didLike(item.likes) }}">
                  <paper-icon-button class="like-icon" icon="thumb-up" data-uid$="{{ item.uid }}" on-click="cancelLike"></paper-icon-button>
                </template>
                <template is="dom-if" if="{{ !_didLike(item.likes) }}">
                  <paper-icon-button class="like-icon like-not-yet" icon="thumb-up" data-uid$="{{ item.uid }}" on-click="like"></paper-icon-button>
                </template>
                <span class="like-number">{{ _countLikeNumber(item.likes) }}</span>
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

    like(e) {
      console.log( 'like()', e.target.dataset.uid );
      firebase.database().ref( `comments/user:${this.talker}/${e.target.dataset.uid}/likes` ).push( {
          uid: this.user.uid, datetime: new Date().toISOString()
      } );

      this._setLike(e.target.dataset.uid, { uid: this.user.uid, datetime: new Date().toISOString() });
    }

    cancelLike(e) {
      console.log( 'cancelLike()', e.target.dataset.uid );

      let targetComment = this.comments.filter( c => c.uid === e.target.dataset.uid )[0];
      Object.keys(targetComment.likes).forEach( key => {
        if( targetComment.likes[key].uid === this.user.uid ) {
          firebase.database().ref( `comments/user:${this.talker}/${e.target.dataset.uid}/likes/${key}` ).set(null);
        }
      });

      this._setLike(e.target.dataset.uid, null);
    }

    _setLike(targetCommentId, like) {
      this.comments.forEach( (c, i) => {
        // do nothing if the comment is not target
        if(c.uid !== targetCommentId){
          return;
        }

        let newLikes = c.likes? c.likes: {};
        if(like){
          newLikes[this.user.uid] = like;
        } else {
          Object.keys(newLikes).forEach( key => {
            // delete like which this user did
            if(newLikes[key].uid === this.user.uid){
              delete newLikes[key];
            }
          });
        }

        this.set(`comments.${i}.likes`, newLikes);
        this.notifyPath(`comments.${i}.likes`);
      } );
    }

    _countLikeNumber(likes) {
      if(!likes) {
        return 0;
      }
      return Object.keys(likes).length;
    }

    _didLike(likes) {
      if(!likes) {
        return false;
      }
      let usersDidLike = Object.keys(likes).map( key => likes[key].uid );
      return usersDidLike.includes( this.user.uid );
    }

}

window.customElements.define( 'comments-view', CommentsView );
