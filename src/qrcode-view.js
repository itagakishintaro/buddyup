import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class QrcodeView extends PolymerElement {
    static get template() {
        return html `
        <style include="shared-styles">
            .qrcode {
                text-align: center;
                margin: 1em 0;
            }
        </style>

        <div class="container">
            <h1>QRコード</h1>
            <div class="qrcode">
                <img src="https://chart.apis.google.com/chart?cht=qr&chs=150x150&chl={{origin}}">
            </div>
            <a href="{{origin}}">{{origin}}</a>
        <div>
        `;
    }

    constructor() {
      super();
      this.origin = location.origin
    }

}

window.customElements.define( 'qrcode-view', QrcodeView );
