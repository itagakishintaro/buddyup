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
            <paper-button raised class="on" on-click="getWords">スキル抽出</paper-button>

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

    getWords() {
        firebase.database().ref( 'comments/user:' + this.user.uid ).once( 'value' ).then( snapshot => {
            let comments = snapshot.val();
            let text = '';
            Object.keys( comments ).forEach( key => {
                text = text + '\n' + comments[key].text;
            });
            this.callNLPSyntax( text );
        } );
    }

    callNLPSyntax( text ) {
        const url = 'https://us-central1-buddyup-204005.cloudfunctions.net/NLP-syntax';
        let data = { message: text };
        fetch(url, {
            body: JSON.stringify(data),
            method: 'POST'
        }).then( response => {
            return response.json();
        }).then( json => {
            this.getSkills(json[0].tokens);
        });
    }

    getSkills( tokens ) {
        let nouns = tokens
            .filter( v => v.partOfSpeech.tag === 'NOUN' ) // 名詞のみにフィルター
            .map( v => v.lemma.toLowerCase() ) // 語幹を抽出（英語のときの活用などが原型になる）
            .filter( (x, i, self) => self.indexOf(x) === i ); // 重複排除
        this.mySkills = nouns.filter( v => skills.includes( v ) );
    }

}

window.customElements.define( 'skill-view', SkillView );
