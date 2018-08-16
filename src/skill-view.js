import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import handleImage from './util/ImageHandler.js';
import './shared-styles.js';

class SkillView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
        </style>

        <div class="container">

        </div>
        `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.callNL();
    }

    static get properties() {
        return {
            user: Object
        }
    }

    callNL() {
        const url = 'https://us-central1-buddyup-204005.cloudfunctions.net/NLP-syntax';
        let data = {
            message: '私はもうJavaなんか嫌い。JavaScriptが好きになったの。'
        }
        fetch(url, {
            body: JSON.stringify(data),
            method: 'POST'
        }).then( response => {
            return response.json();
        }).then( json => {
            console.log(json);
        });
    }


}

window.customElements.define( 'skill-view', SkillView );
