import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import handleImage from './util/ImageHandler.js';
import skills from './util/Skills.js';
import './shared-styles.js';
import './loading-view.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';

class SkillView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
          .on {
            margin-bottom: 1em;
          }
        </style>

        <div class="container">
            <paper-button raised class="on" on-click="getMySkills">スキル抽出</paper-button>

            <paper-dialog id="dialog">
                <template is="dom-repeat" items="{{relatedComments}}">
                    <ul>
                        <li>{{item}}</li>
                    </ul>
                </template>
            </paper-dialog>

            <div>
                <template is="dom-repeat" items="{{mySkills}}">
                    <span class="tag" on-click="showComments">{{item}}</span>
                </template>
            </div>
        </div>
        <loading-view display="{{loadingDisplay}}"></loading-view>
        `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.mySkills = [];
        this.comments = {};
        this.relatedComments = [];
        this.loadingDisplay = 'none';
        this.loadSkills();
        this.getCommentsText();
    }

    static get properties() {
        return {
            user: Object
        }
    }

    loadSkills() {
      firebase.database().ref( 'profiles/' + this.user.uid ).once( 'value' ).then( snapshot => {
          console.log( 'profiles/' + this.user.uid, snapshot.val() );
          this.mySkills = snapshot.val().skills;
      } );
    }

    showComments( e ) {
        this.relatedComments = this.comments
            .map( c => c.text.toLowerCase() )
            .filter( text => text.indexOf( e.target.innerText ) >= 0 );
        this.$.dialog.open();
    }

    getMySkills() {
        this.loadingDisplay = 'block';
        this.getCommentsText()
        .then( text => this.callNLPSyntax( text ) )
        .then( tokens => this.extractSkills( tokens ) )
        .then( mySkills => {
          this.mySkills = mySkills;
          console.log('profiles/' + this.user.uid + '/skills');
          firebase.database().ref( 'profiles/' + this.user.uid + '/skills' ).push( mySkills );
        })
        .finally( () => {
          this.loadingDisplay = 'none';
        } );
    }

    getCommentsText() {
        return firebase.database().ref( 'comments/' + this.user.uid ).once( 'value' ).then( snapshot => {
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

    callNLPSyntax( text ) {
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

    extractSkills( tokens ) {
        if( !tokens ){
          return;
        }
        let nouns = tokens
            .filter( v => [ 'NOUN', 'X' ].includes(v.partOfSpeech.tag)  ) // 名詞とその他のみにフィルター
            .map( v => v.lemma ) // 語幹を抽出（英語のときの活用などが原型になる）
            .filter( x => x.length > 1 ) // 1文字を排除
            .filter( (x, i, self) => self.indexOf(x) === i ); // 重複排除
        return nouns.filter( v => skills.includes( v ) );
    }

}

window.customElements.define( 'skill-view', SkillView );
