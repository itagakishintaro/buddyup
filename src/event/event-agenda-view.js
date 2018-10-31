import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';
import '@polymer/paper-dialog/paper-dialog.js';
import common from './event-common.js';

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
              <span class="indent agendaTitle" id="agendaTitle{{index}}" on-click="openEditAgenda">{{item.program}}</span>
            </div>
          </template>
        </iron-collapse>
      </div>

      <paper-dialog id="adminEditCatchPhrase" style="width:80%">
        <div class="adminEditContent">
          参加者:<br/>
          <input type="text" id="adminEditCatchPhrase1"/><br/>
          キャッチフレーズ<br/>
          <textarea type="text" id="adminEditCatchPhrase2" style="width:100%; height:10em;"/></textarea>
        </div>
        <paper-button on-click="editCatchPhrase">更新</paper-button><paper-button on-click="closeEditCatchPhrase">キャンセル</paper-button>
      </paper-dialog>
      <paper-dialog id="adminEditAgenda">
        <h3 class="adminEditTitle">イベント内容</h3>
        <div class="adminEditContent">
          <input type="text" id="adminEditAgendaTime0" style="width:20%;"/><input type="text" id="adminEditAgenda0" style="width:70%;"/><br/>
          <input type="text" id="adminEditAgendaTime1" style="width:20%;"/><input type="text" id="adminEditAgenda1" style="width:70%;"/><br/>
          <input type="text" id="adminEditAgendaTime2" style="width:20%;"/><input type="text" id="adminEditAgenda2" style="width:70%;"/><br/>
          <input type="text" id="adminEditAgendaTime3" style="width:20%;"/><input type="text" id="adminEditAgenda3" style="width:70%;"/><br/>
          <input type="text" id="adminEditAgendaTime4" style="width:20%;"/><input type="text" id="adminEditAgenda4" style="width:70%;"/><br/>
        </div>
        <paper-button on-click="editAgenda">更新</paper-button><paper-button on-click="closeEditAgenda">キャンセル</paper-button>
      </paper-dialog>

      `;
  }

  showAgenda( e ) {
     this.$.expand_agenda.icon = this.$.collapse_agenda.opened ? 'expand-more' : 'expand-less';
     this.$.collapse_agenda.toggle();
  }

  openEditAgenda( e ){
    if(!common.canEdit(this)) { this.noPermission(); return; }
    var agendaLength = this.shadowRoot.querySelectorAll(".agendaTitle").length;
    for(let i = 0; i < agendaLength; i++){
      this.$["adminEditAgenda" + i].value = this.shadowRoot.querySelector("#agendaTitle" + i).innerText;
      this.$["adminEditAgendaTime" + i].value = this.shadowRoot.querySelector("#agendaTime" + i).innerText;
    }
    this.$.adminEditAgenda.open();
  }

}

window.customElements.define( 'event-agenda-view', EventAgendaView );
