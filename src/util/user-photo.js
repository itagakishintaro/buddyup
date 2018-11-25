import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";

class UserPhoto extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        .icon {
          vertical-align: bottom;
        }
      </style>

      <template is="dom-if" if="{{user.photoURL}}">
        <img src="{{user.photoURL}}" class="icon" />
      </template>
      <template is="dom-if" if="{{!user.photoURL}}">
        <img src="images/manifest/icon-48x48.png" class="icon" />
      </template>
    `;
  }
}
window.customElements.define("user-photo", UserPhoto);
