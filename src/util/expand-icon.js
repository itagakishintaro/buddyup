import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";

class ExpandIcon extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles"></style>

      <template is="dom-if" if="{{ !opened }}">
        <iron-icon icon="expand-more"></iron-icon>
      </template>
      <template is="dom-if" if="{{ opened }}">
        <iron-icon icon="expand-less"></iron-icon>
      </template>
    `;
  }
}
window.customElements.define("expand-icon", ExpandIcon);
