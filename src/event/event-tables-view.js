import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';
import '@polymer/paper-card/paper-card.js';

class EventTablesView extends PolymerElement {
  static get template() {
    return html `
      <style include="shared-styles">
        .event-table-pre { @apply --layout-vertical; @apply --layout-wrap; width: 95%; margin:auto; }
        .event-table { box-sizing: boarder-box; width:46%; margin:1%; word-wrap: break-word; min-height:8em; }
        .event-table-header { }
        .event-table-title { margin: 0.3em; cursor: pointer;}
        .event-table-edit {  }
        .event-table-joinBtn { padding: 0.3em; float:right; background-color:#aaf; font-size:0.8em; }
        .event-table-member-name {  padding: 0.2em 0em 0.2em 0em; margin: 0em 0.2em 0em 0.2em; }
        .event-table-name-icon {  width:0.8em; height:0.8em; }
      </style>

      <div class="card-actions">
        交流のテーブル <iron-icon id="add_table" icon="icons:add-box" on-click="addTable"></iron-icon>
      </div>
      <div style="@apply --layout-vertical; @apply --layout-wrap; width: 95%; margin:auto;">
        <template is="dom-repeat" items="{{tables}}" as="table">
          <paper-card style="box-sizing: border-box; width:46%; margin:1%; padding:2px; vertical-align: top; min-height:5em;">
            <template is="dom-if" if="{{ !isTableMemberMe(index) }}">
              <paper-button class="event-table-joinBtn" on-click="onJoinTableBtn" data-tableidx$="{{index}}">参加する</paper-button>
            </template>
            <template is="dom-if" if="{{ isTableMemberMe(index) }}">
              <paper-button class="event-table-joinBtn" on-click="onJoinTableBtn" data-tableidx$="{{index}}">退出する</paper-button>
            </template>
            <div class="event-table-title" on-click="editTable" data-tableidx$="{{index}}">
              <span class="event-table-title-text" data-tableidx$="{{index}}">{{table.name}}</span>
              <iron-icon  icon="icons:content-copy" data-tableidx$="{{index}}"></iron-icon>
            </div>

            <template is="dom-repeat" items="{{table.members}}" as="member">
              <paper-button raised class="event-table-member-name">{{member.displayName}}
              <iron-icon class="event-table-name-icon" icon="icons:launch"></iron-icon>
              </paper-button>

            </template>
          </paper-card>
        </template>
      </div>

      <paper-dialog id="event_table_edit">
        <paper-button style="border:1px;" on-click="openTableEditName">名前を変更</paper-button><br/>
        <paper-button style="border:1px;" on-click="openTableEditAddMember">参加者を追加する</paper-button><br/>
        <!--<paper-button>非公開にする</paper-button><br/>-->
        <paper-button style="border:1px; padding-bottom:24px;" on-click="openTableEditDeleteTable">削除する</paper-button><br/>
      </paper-dialog>
      <paper-dialog id="event_table_edit_name" style="padding:1em;">
        テーブルの名前を変更する<br/>
        <input type="text" id="event_table_edit_name_value" style="padding-left: 0em;"/><br/>
        <button on-click="editTableName">変更</button>
      </paper-dialog>
      <paper-dialog id="event_table_add_member">
        <paper-button raised on-click="tableAddMemberToggle" style="float:right;">直接入力</paper-button>
        <h3>参加者を追加する</h3>
        <div id="tableAddmenberDirectInput" style="display:none;">
          <label class="newMemberLabel">ID/名前:</label>
          <input id="newTableMemberName" class="newMemberInput"> </input><br/>
          <paper-button on-click="" raised class="newMemberAddButton">追加</paper-button>
          未実装
        </div>
        <div id="tableAddmenberSelectInput">
          <label class="newMemberLabel">クリックすると追加されます</label>
          <div>
          <template is="dom-repeat" items="{{currentEventMembers}}">
            <paper-button raised on-click="addTableMember" class="addMemberUserBtn" data-member_id$="{{item.profile.id}}">
              {{item.profile.displayName}}
              <template is="dom-if" if="{{ isTableMember(item.profile.id) }}">
                <iron-icon icon="icons:check-circle" class="member-check" data-member_id$="{{item.profile.id}}"></iron-icon>
              </template>
            </paper-button>
          </template>
          </div>
          <div style="float:right;"><paper-button raised on-click="closeAddTableMember">完了</paper-button></div>
        </div>
      </paper-dialog>
      <paper-dialog id="event_table_add_member_delete_confirm">
        <h3>テーブルから<span id="event_table_add_member_delete_confirm_name"></span>さんを削除してよいですか？</h3>
        <div class="indent">
          <paper-button raised on-click="addTableMemberDeleteConfirmYes" id="event_table_add_member_delete_confirm_yes">はい</paper-button>
          <paper-button raised on-click="addTableMemberDeleteConfirmNo">いいえ</paper-button>
        </div>
      </paper-dialog>
      </paper-card>
      <paper-dialog id="event_table_edit_delete">
        <h3><span id="event_table_edit_delete_confirm_name"></span>を削除してよいですか？</h3>
        <div class="indent">
          <paper-button raised on-click="deleteTable" data-tableidx="{{this_table}}">はい</paper-button>
          <paper-button raised on-click="deleteTableCancel">いいえ</paper-button>
        </div>
      </paper-dialog>
    </paper-card>
      `;
  }

  addTable( e ) {
    var newtableIdx = this.tableMembers.length;
    // 内部データを書き換える
    this.tableMembers[newtableIdx] = { members:[], name: "table" + (newtableIdx + 1)};
    // DBに書き込む
    firebase.database().ref( `events/${this.eventid}/tables/${newtableIdx}` ).set(this.tableMembers[newtableIdx]);
    // 画面と画面用のデータを書き換える
    this.initTables();
  }

  deleteTable( e ){
    // 内部データを書き換える
    this.tableMembers.splice(this.currentTableIdx,1);
    this.tables.splice(this.currentTableIdx,1);
    // DBに書き込む
    firebase.database().ref( `events/${this.eventid}/tables` ).set(this.tableMembers);
    // 画面と画面用のデータを書き換える
    this.initTables();
    this.closeDeleteTableDialog();
  }
  deleteTableCancel( e ){
    this.closeDeleteTableDialog();
  }
  closeDeleteTableDialog(){
    this.$.event_table_edit_delete.close();
    this.$.event_table_edit.close();
  }

  //////   edit  //////////////////////

  editTable( e ) {
    this.currentTableIdx = e.target.dataset.tableidx;
    this.$.event_table_edit.open();

  }
  openTableEditName( e ) {
    this.$.event_table_edit_name_value.value = this.tables[this.currentTableIdx].name;
    this.$.event_table_edit_name.open();
    var obj = this;
    this.$.event_table_edit_name_value.onkeypress = function( e ){
      if(e.keyCode === "undefined" || e.keyCode === 13){
            obj.editTableName(null);
      }
    }
  }
  openTableEditAddMember( e ){
    this.tablePrevMembers = JSON.parse(JSON.stringify(this.tableMembers[this.currentTableIdx].members));
    this.currentEventMembers = JSON.parse(JSON.stringify(this.invitedMembers));
    this.$.event_table_add_member.open();

  }
  openTableEditDeleteTable( e ){
    this.$.event_table_edit_delete_confirm_name.innerText = this.tables[this.currentTableIdx].name;
    this.$.event_table_edit_delete.open();
  }

  editTableName( e ){
    var tableName = this.$.event_table_edit_name_value.value;
    this.tables[this.currentTableIdx].name = tableName;
    this.shadowRoot.querySelector(".event-table-title-text[data-tableidx='" + this.currentTableIdx + "']").innerText = tableName;
    this.$.event_table_edit_name.close();
    this.$.event_table_edit.close();
    firebase.database().ref( `events/${this.eventid}/tables/${this.currentTableIdx}/name` ).set( tableName );
  }

  addTableMember( e ){
    let memberId = e.target.dataset.member_id;

    if(this.isTableMember(memberId)){
      // 既にメンバーなら削除する
      // 元から参加していた人は確認ダイアログが開く  // TODO
      if(this.tablePrevMembers.indexOf(memberId) >= 0) {
        this.$.event_table_add_member_delete_confirm_yes.dataset.member_id = memberId;
        this.$.event_table_add_member_delete_confirm_name.innerText = this.getProfile(memberId).displayName;
        this.$.event_table_add_member_delete_confirm.open();
        return;
      }
      this.leaveTable(this.currentTableIdx, memberId);
      this.currentEventMembers = JSON.parse(JSON.stringify(this.currentEventMembers));
    } else {
      // メンバー外なら追加する
      this.joinTable(this.currentTableIdx, memberId);
      this.currentEventMembers = JSON.parse(JSON.stringify(this.currentEventMembers));
    }
  }
  addTableMemberDeleteConfirmYes( e ){
    let memberId = e.target.dataset.member_id;
    this.leaveTable(this.currentTableIdx, memberId);
    this.currentEventMembers = JSON.parse(JSON.stringify(this.currentEventMembers));
    this.$.event_table_add_member_delete_confirm.close();
  }
  addTableMemberDeleteConfirmNo( e ){
    this.$.event_table_add_member_delete_confirm.close();
  }

  closeAddTableMember ( e ){
    this.$.event_table_add_member.close();
    this.$.event_table_edit.close();
  }
  //////   join  //////////////////////
  onJoinTableBtn( e ){
    if(e.target.innerText == "参加する"){
      this.joinTable(e.target.dataset.tableidx, this.user.uid);
      this.shadowRoot.querySelector(".event-table-joinBtn[data-tableidx='" + e.target.dataset.tableidx + "']").innerText = "退出する";
    } else {
      this.leaveTable(e.target.dataset.tableidx, this.user.uid);
      this.shadowRoot.querySelector(".event-table-joinBtn[data-tableidx='" + e.target.dataset.tableidx + "']").innerText = "参加する";
    }
    // TODO: 他の端末の人にも参加退出が伝播するようにすること
  }

  joinTable(tableidx, memberId){
    // 内部データを書き換える
    this.tableMembers[tableidx].members.push(memberId);
    this.tables[tableidx].members.push(this.getProfile(memberId));
    // 画面を変更する -- テーブル内の名前
    var tables = JSON.parse(JSON.stringify(this.tables));
    this.tables = tables;
    // DBにjoinを書き込む
    firebase.database().ref( `events/${this.eventid}/tables/${tableidx}/members` ).set(this.tableMembers[tableidx].members);
  }

  leaveTable(tableidx, memberId){
    // 内部データを書き換える
    var memberIdx = this.tableMembers[tableidx].members.indexOf(memberId);
    this.tableMembers[tableidx].members.splice(memberIdx,1);
    this.tables[tableidx].members.splice(memberIdx,1);
    // 画面を変更する -- テーブル内の名前
    var tables = JSON.parse(JSON.stringify(this.tables));
    this.tables = tables;
    // DBにjoinを書き込む
    firebase.database().ref( `events/${this.eventid}/tables/${tableidx}/members` ).set(this.tableMembers[tableidx].members);
  }

  isTableMember(memberId) {
    return this.currentTableIdx && this.tableMembers && (this.tableMembers[this.currentTableIdx].members.indexOf(memberId) >=0);
  }
  isTableMemberMe(tableidx){
    if(!this.tableMembers) return false;
    return (this.tableMembers[tableidx].members.indexOf(this.user.uid) >= 0);
  }

}

window.customElements.define( 'event-tables-view', EventTablesView );
