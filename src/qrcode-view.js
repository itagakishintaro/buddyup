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
                <img src="images/qrcode.png">
            </div>
            <a href="https://buddyup-204005.firebaseapp.com/">https://buddyup-204005.firebaseapp.com/</a>
        <div>
        `;
    }

}

window.customElements.define( 'qrcode-view', QrcodeView );