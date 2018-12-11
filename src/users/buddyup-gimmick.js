import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "../shared-styles.js";
import "@polymer/paper-dialog/paper-dialog.js";

class BuddyupGimmick extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles"></style>

      <paper-dialog id="dialog">
        <div>{{skill}}でBuddyup!しました</div>
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
}

window.customElements.define("buddyup-gimmick", BuddyupGimmick);
