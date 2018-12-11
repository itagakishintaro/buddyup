import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "../shared-styles.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";

class UsersBuddyupView extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        .icon {
          vertical-align: bottom;
        }

        .favorite {
          color: var(--paper-pink-400);
        }

        .favorite-large {
          --iron-icon-height: 2em;
          --iron-icon-width: 2em;
        }

        .favarite-not-yet {
          color: var(--paper-pink-50);
        }

        .right {
          float: right;
        }

        .candidate-header {
          margin: 1em 0;
        }
      </style>

      <div>
        <template is="dom-if" if="{{ candidates.length }}">
          <hr />
          <div>
            <template
              is="dom-repeat"
              items="{{candidates}}"
              as="candidate"
              indexAs="index"
            >
              <div class="candidate-header">
                <span>「{{ candidate.skill }}」でBuddyup!</span>
                <template
                  is="dom-repeat"
                  items="{{candidate.buddies}}"
                  as="buddy"
                >
                  <template is="dom-if" if="{{ _isMe(buddy.uid) }}">
                    <template is="dom-if" if="{{ buddy.buddyupTime }}">
                      <iron-icon
                        class="favorite favorite-large right"
                        icon="favorite"
                        on-click="unBuddyup"
                        data-skill$="{{ candidate.skill }}"
                        data-index$="{{index}}"
                      ></iron-icon>
                    </template>
                    <template is="dom-if" if="{{ !buddy.buddyupTime }}">
                      <iron-icon
                        class="favorite favorite-large favarite-not-yet right"
                        icon="favorite"
                        on-click="buddyup"
                        data-skill$="{{ candidate.skill }}"
                        data-index$="{{index}}"
                      ></iron-icon>
                    </template>
                  </template>
                </template>
              </div>

              <template
                is="dom-repeat"
                items="{{candidate.buddies}}"
                as="buddy"
              >
                <template is="dom-if" if="{{ !_isMe(buddy.uid) }}">
                  <div>
                    <template is="dom-if" if="{{buddy.photoURL}}">
                      <img src="{{buddy.photoURL}}" class="icon" />
                    </template>
                    <template is="dom-if" if="{{!buddy.photoURL}}">
                      <img src="images/manifest/icon-48x48.png" class="icon" />
                    </template>
                    <span>{{buddy.displayName}}</span>
                    <template is="dom-if" if="{{buddy.buddyupTime}}">
                      <iron-icon class="favorite" icon="favorite"></iron-icon>
                    </template>
                  </div>
                </template>
              </template>
            </template>
          </div>
        </template>
      </div>
    `;
  }

  constructor() {
    super();
    this.candidates = [];
  }

  buddyup(e) {
    let buddyupTime = new Date().toISOString();
    firebase
      .database()
      .ref("buddies/" + e.target.dataset.skill + "/" + this.user.uid)
      .set({ uid: this.user.uid, buddyupTime });
  }

  unBuddyup(e) {
    firebase
      .database()
      .ref("buddies/" + e.target.dataset.skill + "/" + this.user.uid)
      .set(null);
  }

  _isMe(uid) {
    return uid === this.user.uid;
  }
}

window.customElements.define("users-buddyup-view", UsersBuddyupView);
