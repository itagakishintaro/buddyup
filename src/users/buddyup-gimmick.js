import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "../shared-styles.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-button/paper-button.js";

class BuddyupGimmick extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        .action {
          text-align: center;
        }
      </style>

      <paper-dialog id="dialog">
        <div>{{skill}}でBuddyup!しました</div>
        <div class="action">
          <paper-button raised on-click="ok">OK</paper-button>
        </div>
      </paper-dialog>
    `;
  }

  constructor() {
    super();
  }

  static get properties() {
    return {
      active: {
        type: Boolean,
        observer: "_activeChanged"
      }
    };
  }

  _activeChanged(newValue, oldValue) {
    if (newValue && this.skill) {
      this.$.dialog.open();
    }
  }

  ok() {
    this.$.dialog.close();
    new Audio("/media/buddyup.mp3").play();
  }
}

window.customElements.define("buddyup-gimmick", BuddyupGimmick);
