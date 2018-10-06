import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import SKILLS from './util/Skills.js';
import './shared-styles.js';
import './loading-view.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-toast/paper-toast.js';

class UsersView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
          .on {
            margin-bottom: 1em;
          }

          .user {
            margin-bottom: .5em;
          }
          .username {
            color: var(--paper-blue-500);
          }

          .skill {
            margin-bottom: 1em;
          }

          .icon {
            vertical-align: bottom;
          }
        </style>

        <div class="container">
          <p>名前をタッチするとその人のスキルを最新に更新します。スキルをタッチすると関連するコメントが表示されます。</p>
          <paper-button raised class="on" on-click="getUsers">ユーザー一覧を表示</paper-button>

          <paper-dialog id="dialog">
              <template is="dom-repeat" items="{{relatedComments}}">
                  <ul>
                      <li>{{item}}</li>
                  </ul>
              </template>
          </paper-dialog>

          <!-- target user -->
          <div class="user">
            <template is="dom-if" if="{{target.photoURL}}">
              <img src="{{target.photoURL}}" class="icon">
            </template>
            <span>{{target.displayName}}</span>
          </div>

          <hr>

          <p>自分</p>
          <div class="user">
            <template is="dom-if" if="{{user.uid}}">
                <template is="dom-if" if="{{user.photoURL}}">
                  <img src="{{user.photoURL}}" class="icon">
                </template>
                <template is="dom-if" if="{{!user.photoURL}}">
                  <img src="images/manifest/icon-48x48.png" class="icon">
                </template>
                <span on-click="showSkills" data-uid$="{{user.uid}}" data-photo$="{{user.photoURL}}" data-name$="{{user.displayName}}" class="username">{{user.displayName}}</span>
                <!-- skills -->
                <div class="skill" data-uid$="{{user.uid}}">
                    <template is="dom-repeat" items="{{ user.skills }}">
                        <span class="tag" on-click="showComments" data-uid$="{{item}}">{{item}}</span>
                    </template>
                </div>
            </template>
          </div>

          <p>知り合い</p>
          <template is="dom-repeat" items="{{friends}}">
            <div class="user">
              <template is="dom-if" if="{{item.photoURL}}">
                <img src="{{item.photoURL}}" class="icon">
              </template>
              <template is="dom-if" if="{{!item.photoURL}}">
                <img src="images/manifest/icon-48x48.png" class="icon">
              </template>
              <span on-click="showSkills" data-uid$="{{item.uid}}" data-photo$="{{item.photoURL}}" data-name$="{{item.displayName}}" class="username">{{item.displayName}}</span>
              <!-- skills -->
              <div class="skill" data-uid$="{{item.uid}}">
                  <template is="dom-repeat" items="{{ item.skills }}">
                      <span class="tag" on-click="showComments">{{item}}</span>
                  </template>
              </div>
            </div>
          </template>

          <p>その他のユーザー</p>
          <template is="dom-repeat" items="{{others}}">
            <div class="user">
              <template is="dom-if" if="{{item.photoURL}}">
                <img src="{{item.photoURL}}" class="icon">
              </template>
              <template is="dom-if" if="{{!item.photoURL}}">
                <img src="images/manifest/icon-48x48.png" class="icon">
              </template>
              <span on-click="showSkills" data-uid$="{{item.uid}}" data-photo$="{{item.photoURL}}" data-name$="{{item.displayName}}" class="username">{{item.displayName}}</span>
              <!-- skills -->
              <div class="skill" data-uid$="{{item.uid}}">
                  <template is="dom-repeat" items="{{ item.skills }}">
                      <span class="tag" on-click="showComments">{{item}}</span>
                  </template>
              </div>
            </div>
          </template>

          <paper-toast id="toast" text="{{toastText}}"></paper-toast>
        </div>

        <loading-view display="{{loadingDisplay}}"></loading-view>
        `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.user = {};
        this.friendUIDs = [];
        this.friends = [];
        this.others = [];
        this.loadingDisplay = 'none';
        this.target = {};
        this.toastText = "更新しました!";
    }

    static get properties() {
        return {
            user: Object
        }
    }

    getUsers() {
        let getFriendsPromise = new Promise( ( resolve, reject ) => {
            this._getFriends( resolve, reject );
        } );
        getFriendsPromise.then( () => {
            this._getOthers();
        } );
    }

    // 知り合い(friend)の定義はpartyに一緒に参加した人
    _getFriends( resolve, reject ) {
        this.loadingDisplay = 'block';
        firebase.database().ref( 'profiles/' ).once( 'value' ).then( snapshot => {
            this.profiles = snapshot.val();

            firebase.database().ref( 'parties/' ).once( 'value' )
                .then( snapshot => {
                    console.log( 'parties', snapshot.val() );
                    let parties = snapshot.val();
                    let friendUIDs = [];
                    Object.keys( parties ).forEach( key => {
                        if ( parties[ key ].members && Object.keys( parties[ key ].members ).includes( this.user.uid ) ) { // 自分が含まれているなら
                            friendUIDs = friendUIDs.concat( Object.keys( parties[ key ].members ) );
                        }
                    } );
                    friendUIDs = friendUIDs.filter( ( x, i, self ) => self.indexOf( x ) === i ); // 重複排除
                    friendUIDs = friendUIDs.filter( x => x !== this.user.uid ); // 自分を削除

                    this.friendUIDs = friendUIDs;
                    this.friends = this.friendUIDs.map( key => {
                        let v = this.profiles[ key ];
                        v.uid = key;
                        return v;
                    } );
                } ).finally( () => {
                    resolve();
                    this.loadingDisplay = 'none';
                } );
        } );
    }

    _getOthers() {
        this.loadingDisplay = 'block';
        // firebase.database().ref( 'profiles/' ).once('value').then( snapshot => {
        this.others = Object.keys( this.profiles )
            .filter( key => key !== this.user.uid && !this.friendUIDs.includes( key ) ) // 自分でも知り合いでもない
            .map( key => {
                let v = this.profiles[ key ];
                v.uid = key;
                return v;
            } );

        this.loadingDisplay = 'none';
        // });
    }

    showSkills( e ) {
        this.skills = [];
        this.target.uid = e.target.dataset.uid;
        this.getSkills();
    }

    showComments( e ) {
        this.target.skill = e.target.innerText;

        if ( this.target.uid !== e.target.parentNode.dataset.uid ) {
            this.target.uid = e.target.parentNode.dataset.uid;

            this._getCommentsText().then( () => {
                this.relatedComments = this.comments
                    .map( c => c.text.toLowerCase() )
                    .filter( text => text.indexOf( this.target.skill ) >= 0 );
                this.$.dialog.open();
            } );
        } else {
            this.relatedComments = this.comments
                .map( c => c.text.toLowerCase() )
                .filter( text => text.indexOf( this.target.skill ) >= 0 );
            this.$.dialog.open();
        }
    }

    getSkills() {
        this.loadingDisplay = 'block';
        this._getCommentsText()
            .then( text => this._callNLPSyntax( text ) )
            .then( tokens => this._extractSkills( tokens ) )
            .then( skills => {
                if ( this.target.uid === this.user.uid ) {
                    this.user.skills = skills;
                    this.notifyPath( 'user.skills' );
                } else if ( this.friendUIDs.includes( this.target.uid ) ) {
                    this.friends.forEach( ( o, i ) => {
                        if ( o.uid === this.target.uid ) {
                            this.friends[ i ].skills = skills;
                            this.notifyPath( 'friends.' + i + '.skills' );
                        }
                    } );
                } else {
                    this.others.forEach( ( o, i ) => {
                        if ( o.uid === this.target.uid ) {
                            this.others[ i ].skills = skills;
                            this.notifyPath( 'others.' + i + '.skills' );
                        }
                    } );
                }
                if ( skills ) {
                    this.toastText = "更新しました！"
                    firebase.database().ref( 'profiles/' + this.target.uid + '/skills' ).set( skills );
                } else {
                    this.toastText = "現在のスキルリストに一致するコメントがみつかりませんでした。"
                }
            } )
            .finally( () => {
                this.$.toast.open();
                this.loadingDisplay = 'none';
            } );
    }

    _getCommentsText() {
        return firebase.database().ref( 'comments/' + this.target.uid ).once( 'value' ).then( snapshot => {
            if ( !snapshot.val() ) {
                return;
            }
            this.comments = Object.keys( snapshot.val() )
                .map( key => snapshot.val()[ key ] ) // Objectから配列に
                .filter( comment => comment.text ); // 空のコメントを削除
            let text = '';
            this.comments.forEach( c => {
                text = text + '\n' + c.text.toLowerCase();
            } );
            console.log( this.comments );
            return text;
        } );
    }

    _callNLPSyntax( text ) {
        if ( !text ) {
            return;
        }
        const url = 'https://us-central1-buddyup-204005.cloudfunctions.net/NLP-syntax';
        let data = { message: text };
        return fetch( url, {
                body: JSON.stringify( data ),
                method: 'POST'
            } )
            .then( response => response.json() )
            .then( json => json[ 0 ].tokens );
    }

    _extractSkills( tokens ) {
        if ( !tokens ) {
            return;
        }
        let nouns = tokens
            .filter( v => [ 'NOUN', 'X' ].includes( v.partOfSpeech.tag ) ) // 名詞とその他のみにフィルター
            .map( v => v.lemma ) // 語幹を抽出（英語のときの活用などが原型になる）
            .filter( x => x.length > 1 ) // 1文字を排除
            .filter( ( x, i, self ) => self.indexOf( x ) === i ); // 重複排除
        return nouns.filter( v => SKILLS.includes( v ) );
    }

}

window.customElements.define( 'users-view', UsersView );