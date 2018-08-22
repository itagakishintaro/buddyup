import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import handleImage from './util/ImageHandler.js';
import skills from './util/Skills.js';
import './shared-styles.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';

class SkillView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
          .on {
            margin-bottom: 1em;
          }

          .tag {
              border-radius: 10%;
              border: 1px solid var(--paper-blue-grey-200);
              color: var(--paper-blue-900);
              display: inline-block;
              margin-top: .4em;
              margin-right: .2em;
              padding: 0 .5em
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
        `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.mySkills = [];
        this.comments = {};
        this.relatedComments = [];
    }

    static get properties() {
        return {
            user: Object
        }
    }

    showComments( e ) {
        this.relatedComments = Object.keys( this.comments )
            .map( key => this.comments[key].text.toLowerCase() )
            .filter( v => v.indexOf( e.target.innerText ) >= 0 );
        this.$.dialog.open();
    }

    getMySkills() {
        this.getCommentsText()
        .then( text => this.callNLPSyntax( text ) )
        .then( tokens => this.extractSkills( tokens ) )
        .then( mySkills => { this.mySkills = mySkills; } );
    }

    getCommentsText() {
        return firebase.database().ref( 'comments/user:' + this.user.uid ).once( 'value' ).then( snapshot => {
            this.comments = snapshot.val();
            let text = '';
            Object.keys( this.comments ).forEach( key => {
                text = text + '\n' + this.comments[key].text.toLowerCase();
            });
            return text;
        } );
    }

    callNLPSyntax( text ) {
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
        let nouns = tokens
            .filter( v => [ 'NOUN', 'X' ].includes(v.partOfSpeech.tag)  ) // 名詞とその他のみにフィルター
            .map( v => v.lemma ) // 語幹を抽出（英語のときの活用などが原型になる）
            .filter( x => x.length > 1 ) // 1文字を排除
            .filter( (x, i, self) => self.indexOf(x) === i ); // 重複排除
        return nouns.filter( v => skills.includes( v ) );
    }

}

window.customElements.define( 'skill-view', SkillView );
