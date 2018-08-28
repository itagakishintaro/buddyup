import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class LoadingView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
          .loading {
            position: absolute;
            width: 100%;
            height: 9999px;
            z-index: 9999;
          }

          .loading-img {
            position: fixed;
            top: 25%;
            left: 25%;
          }
        </style>

        <div id="loading" class="loading" style="display: {{display}}">
          <img src="images/loading.svg" class="loading-img">
        </div>
        `;
    }

    constructor() {
        console.log( 'constructor()' );
        super();
    }

    static get properties() {
        return {
            display: String
        }
    }
}

window.customElements.define( 'loading-view', LoadingView );
