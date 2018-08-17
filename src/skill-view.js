import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import handleImage from './util/ImageHandler.js';
import './shared-styles.js';
import '@polymer/paper-button/paper-button.js';
import skills from './util/Skills.js';

class SkillView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
        </style>

        <div class="container">
            <paper-button raised class="on" on-click="getMySkills">スキル抽出</paper-button>

            <template is="dom-repeat" items="{{mySkills}}">
                <ul>
                    <li>{{item}}</li>
                </ul>
            </template>
        </div>
        `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.mySkills = [];
    }

    static get properties() {
        return {
            user: Object
        }
    }

    getMySkills() {
        this.getCommentsText()
        .then( text => this.callNLPSyntax( text ) )
        .then( tokens => this.extractSkills( tokens ) )
        .then( mySkills => { this.mySkills = mySkills; } );
    }

    getCommentsText() {
        return firebase.database().ref( 'comments/user:' + this.user.uid ).once( 'value' ).then( snapshot => {
            let comments = snapshot.val();
            let text = '';
            Object.keys( comments ).forEach( key => {
                text = text + '\n' + comments[key].text;
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
            .filter( v => v.partOfSpeech.tag === 'NOUN' ) // 名詞のみにフィルター
            .map( v => v.lemma.toLowerCase() ) // 語幹を抽出（英語のときの活用などが原型になる）
            .filter( (x, i, self) => self.indexOf(x) === i ); // 重複排除
        return nouns.filter( v => skills.includes( v ) );
    }

}

window.customElements.define( 'skill-view', SkillView );
