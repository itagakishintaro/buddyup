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
          /* overflow: scroll; */
          /* margin: 1em; */
        }

        .meta-info {
          font-size: .5em;
        }

        .text {
          vertical-align: text-top;
          display:table-cell;
          white-space:pre-wrap;
        }

        .msg {
          width: 100%;
          display: flex;
        }

        .like {
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

        .separater {
          border: .5px solid var(--paper-blue-grey-100);
        }
      </style>

      <div class="container">
        <template is="dom-repeat" items="{{comments}}">
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
              <div class="meta-info">{{item.displayName}} [ {{ _dateFormat(item.datetime) }} ]</div>
              <p class="text">{{item.text}}</p>
                <template is="dom-if" if="{{ _didLike(item.likes) }}">
                  <div id="like" class="like" on-click="cancelLike">
                    <paper-icon-button class="like-icon" icon="thumb-up" data-uid$="{{ item.uid }}"></paper-icon-button>
                    <span class="like-number">{{ _countLikeNumber(item.likes) }}</span>
                　</div>
                </template>
                <template is="dom-if" if="{{ !_didLike(item.likes) }}">
                  <div id="like" class="like" on-click="like">
                    <paper-icon-button class="like-icon like-not-yet" icon="thumb-up" data-uid$="{{ item.uid }}"></paper-icon-button>
                    <span class="like-number">{{ _countLikeNumber(item.likes) }}</span>
              　   </div>
                </template>

            </div>
          </div>
          <hr class="separater">
        </template>
        <div id="bottom"></div>
      </div>
      <loading-view display="{{loadingDisplay}}"></loading-view>
    `;
    }

    constructor() {
      super();
      this.comments = [];
      this.loadingDisplay = 'none';
    }

    static get properties() {
      return {
        comments: Array
      }
    }

    like(e) {
      console.log( 'like()', e.target.dataset.uid );
      firebase.database().ref( `comments/${this.talker}/${e.target.dataset.uid}/likes` ).push( {
          uid: this.user.uid, datetime: new Date().toISOString()
      } );

      this._setLike(e.target.dataset.uid, { uid: this.user.uid, datetime: new Date().toISOString() });
    }

    cancelLike(e) {
      console.log( 'cancelLike()', e.target.dataset.uid );
      let targetComment = this.comments.filter( c => c.uid === e.target.dataset.uid )[0];
      Object.keys(targetComment.likes).forEach( key => {
        if( targetComment.likes[key].uid === this.user.uid ) {
          firebase.database().ref( `comments/${this.talker}/${e.target.dataset.uid}/likes/${key}` ).set(null);
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

    _dateFormat( ISO ) {
      if( !ISO ){
        return;
      }
      console.log(ISO);
      return ISO.substring( 5, 10 ) + ' ' + ISO.substring( 11, 16);
    }

}

window.customElements.define( 'comments-view', CommentsView );
