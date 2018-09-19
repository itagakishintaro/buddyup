import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import SKILLS from './util/Skills.js';
import './shared-styles.js';
import './loading-view.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';

class UsersView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
          .on {
            margin-bottom: 1em;
          }

          .user {
            color: var(--paper-blue-500);
          }

          .skill {
            margin-bottom: 1em;
          }
        </style>

        <div class="container">
          <p>知り合い（自分にコメントをくれた人）が表示されます。</p>
          <p>名前をタッチするとその人のスキルが表示され、そのスキルをタッチすると関連するコメントが表示されます。</p>
          <paper-button raised class="on" on-click="getFriends">更新</paper-button>

          <paper-dialog id="dialog">
              <template is="dom-repeat" items="{{relatedComments}}">
                  <ul>
                      <li>{{item}}</li>
                  </ul>
              </template>
          </paper-dialog>
          <div class="skill">
              <template is="dom-repeat" items="{{skills}}">
                  <span class="tag" on-click="showComments">{{item}}</span>
              </template>
          </div>

          <template is="dom-repeat" items="{{friends}}">
            <div on-click="showSkills" data-uid$="{{item.uid}}" class="user">{{item.displayName}}</div>
          </template>
        </div>
        <loading-view display="{{loadingDisplay}}"></loading-view>
        `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.skills = [];
        this.getFriends();
        this.loadingDisplay = 'none';
    }

    static get properties() {
        return {
            user: Object
        }
    }

    // 知り合い(friend)の定義は自分にコメントしてくれた人
    getFriends() {
      console.log(this.user.uid);
      this.loadingDisplay = 'block';
      firebase.database().ref( 'comments/' + this.user.uid ).once('value').then( snapshot => {
        if( !snapshot.val() ){
          return;
        }
        let friendUIDs = [];
        let friends = [];
        Object.keys( snapshot.val() ).forEach( key => {
          if( friendUIDs.includes( snapshot.val()[key].uid ) || snapshot.val()[key].uid === this.user.uid ){ // すでに取得済み or 自分なら何もしない
            return;
          }
          friendUIDs.push( snapshot.val()[key].uid );
          friends.push( snapshot.val()[key] );
        });
        this.friends = friends;
      }).finally( () => {
        this.loadingDisplay = 'none';
      } );
    }

    showSkills( e ){
      this.skills = [];
      this.targetUID = e.target.dataset.uid
      this.getSkills();
    }

    showComments( e ) {
        this.relatedComments = this.comments
            .map( c => c.text.toLowerCase() )
            .filter( text => text.indexOf( e.target.innerText ) >= 0 );
        this.$.dialog.open();
    }

    getSkills() {
        this.loadingDisplay = 'block';
        this._getCommentsText()
        .then( text => this._callNLPSyntax( text ) )
        .then( tokens => this._extractSkills( tokens ) )
        .then( skills => {
          this.skills = skills;
          firebase.database().ref( 'profiles/' + this.targetUID + '/skills' ).push( skills );
        })
        .finally( () => {
          this.loadingDisplay = 'none';
        } );
    }

    _getCommentsText() {
        return firebase.database().ref( 'comments/' + this.targetUID ).once( 'value' ).then( snapshot => {
            if( !snapshot.val() ){
              return;
            }
            this.comments = Object.keys( snapshot.val() )
              .map( key => snapshot.val()[key] ) // Objectから配列に経間
              .filter( comment => comment.text ); // 空のコメントを削除
            let text = '';
            this.comments.forEach( c => {
                text = text + '\n' + c.text.toLowerCase();
            });
            return text;
        } );
    }

    _callNLPSyntax( text ) {
        if( !text ){
          return;
        }
        const url = 'https://us-central1-buddyup-204005.cloudfunctions.net/NLP-syntax';
        let data = { message: text };
        return fetch(url, {
            body: JSON.stringify(data),
            method: 'POST'
        })
        .then( response => response.json() )
        .then( json => json[0].tokens );
    }

    _extractSkills( tokens ) {
        if( !tokens ){
          return;
        }
        let nouns = tokens
            .filter( v => [ 'NOUN', 'X' ].includes(v.partOfSpeech.tag)  ) // 名詞とその他のみにフィルター
            .map( v => v.lemma ) // 語幹を抽出（英語のときの活用などが原型になる）
            .filter( x => x.length > 1 ) // 1文字を排除
            .filter( (x, i, self) => self.indexOf(x) === i ); // 重複排除
        return nouns.filter( v => SKILLS.includes( v ) );
    }
}

window.customElements.define( 'users-view', UsersView );
