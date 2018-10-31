import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';
import '@polymer/paper-dialog/paper-dialog.js';

class EventAgendaView extends PolymerElement {
  static get template() {
    return html `
      <style include="shared-styles">
        .indent { margin-left: 1em;   }
        .container { margin: 0.2em; }
        .collapse { width:100%; margin: 0.5em 0.3em 0.8em 0.3em;}
        .cafe-light { color: var(--paper-grey-600); }
      </style>

      <div class="event-agenda-container container">
        <span><b>アジェンダ</b>　</span>
        <iron-icon id="expand_agenda" icon="icons:expand-more" on-click="showAgenda"></iron-icon>
        <iron-collapse id="collapse_agenda" class="collapse">
          <template is="dom-repeat" items="{{agenda}}">
            <div class="agenda-content">
              <span class="indent" id="agendaTime{{index}}" on-click="openEditAgenda">{{item.time}}</span>
              <span class="indent" id="agendaTitle{{index}}" on-click="openEditAgenda">{{item.program}}</span>
            </div>
          </template>
        </iron-collapse>
      </div>
      <p class="cafe-light" on-click="openEditCatchPhrase">
        <span id="catchPhraseTitle">{{catchPhrase}}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </p>

      <paper-dialog id="adminEditCatchPhrase" style="width:80%">
        <div class="adminEditContent">
          参加者:<br/>
          <input type="text" id="adminEditCatchPhrase1"/><br/>
          キャッチフレーズ<br/>
          <textarea type="text" id="adminEditCatchPhrase2" style="width:100%; height:10em;"/></textarea>
        </div>
        <paper-button on-click="editCatchPhrase">更新</paper-button><paper-button on-click="closeEditCatchPhrase">キャンセル</paper-button>
      </paper-dialog>
      `;
  }

  showAgenda( e ) {
     this.$.expand_agenda.icon = this.$.collapse_agenda.opened ? 'expand-more' : 'expand-less';
     this.$.collapse_agenda.toggle();
  }

  openEditAgenda( e ){
    if(!this.canEdit()) { this.noPermission(); return; }
    this.$.adminEditAgenda0.value = this.shadowRoot.querySelector("#agendaTitle0").innerText;
    this.$.adminEditAgenda1.value = this.shadowRoot.querySelector("#agendaTitle1").innerText;
    this.$.adminEditAgenda2.value = this.shadowRoot.querySelector("#agendaTitle2").innerText;
    this.$.adminEditAgenda3.value = this.shadowRoot.querySelector("#agendaTitle3").innerText;
    this.$.adminEditAgenda4.value = this.shadowRoot.querySelector("#agendaTitle4").innerText;
    this.$.adminEditAgendaTime0.value = this.shadowRoot.querySelector("#agendaTime0").innerText;
    this.$.adminEditAgendaTime1.value = this.shadowRoot.querySelector("#agendaTime1").innerText;
    this.$.adminEditAgendaTime2.value = this.shadowRoot.querySelector("#agendaTime2").innerText;
    this.$.adminEditAgendaTime3.value = this.shadowRoot.querySelector("#agendaTime3").innerText;
    this.$.adminEditAgendaTime4.value = this.shadowRoot.querySelector("#agendaTime4").innerText;
    this.$.adminEditAgenda.open();
  }

  openEditCatchPhrase( e ){
    if(!this.canEdit()) { this.noPermission(); return; }
    this.$.adminEditCatchPhrase1.value = this.shadowRoot.querySelector("#memberTitle").innerText;
    this.$.adminEditCatchPhrase2.value = this.shadowRoot.querySelector("#catchPhraseTitle").innerText;
    this.$.adminEditCatchPhrase.open();
  }
  closeEditCatchPhrase( e ){
    this.$.adminEditCatchPhrase.close();
  }
  editCatchPhrase(){
    this.shadowRoot.querySelector("#memberTitle").innerText = this.$.adminEditCatchPhrase1.value;
    this.shadowRoot.querySelector("#catchPhraseTitle").innerText = this.$.adminEditCatchPhrase2.value;
    firebase.database().ref( `events/${this.eventid}/memberTitle` ).set( this.$.adminEditCatchPhrase1.value );
    firebase.database().ref( `events/${this.eventid}/catchPhrase` ).set( this.$.adminEditCatchPhrase2.value );
    this.$.adminEditCatchPhrase.close();
  }

}

window.customElements.define( 'event-agenda-view', EventAgendaView );
