import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-collapse/iron-collapse.js';
//import '@polymer/paper-icon-button/paper-icon-button.js';
// paper-icon-buttonは2018/9/12 現在バグってて、iron-collapseと一緒に使えない。
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/communication-icons.js';
import '@polymer/iron-icons/social-icons.js';
// https://www.webcomponents.org/element/PolymerElements/iron-icons/demo/demo/index.html
// icons:add-box  icons:expand-less  icons:expand-more  icons:face
// maps:near-me   maps:person-pin  maps:place  maps:store-mall-directory

import '@polymer/paper-dialog/paper-dialog.js';
// paper-dialogをインポートすると、ブラウザに下記のエラーが出る。でも、使えるから放置しておく。
// Uncaught TypeError: parentResizable._subscribeIronResize is not a function
//     at HTMLElement.assignParentResizable (iron-resizable-behavior.js:110)
//     at HTMLElement._onIronRequestResizeNotifications (iron-resizable-behavior.js:166)
//     at HTMLElement.handler (template-stamp.js:90)
//     at HTMLElement.fire (legacy-element-mixin.js:440)
//     at HTMLElement._findParent (iron-resizable-behavior.js:254)
//     at HTMLElement._requestResizeNotifications (iron-resizable-behavior.js:228)
//     at HTMLElement.attached (iron-resizable-behavior.js:65)
//     at HTMLElement.attached (class.js:261)
//     at HTMLElement.attached (class.js:258)
//     at HTMLElement.attached (class.js:258)

//import '@polymer/paper-input/paper-input.js';
// paper-inputをインポートすると、下記のエラーが出て来て使えない
// Uncaught (in promise) DOMException: Failed to execute 'define' on 'CustomElementRegistry': this name has already been used with this registry
//     at Polymer (http://127.0.0.1:8081/node_modules/@polymer/polymer/lib/legacy/polymer-fn.js:43:18)
//     at http://127.0.0.1:8081/node_modules/@polymer/iron-input/node_modules/@polymer/iron-meta/iron-meta.js:141:1


// TODO: 参加者とかを枠でくくる。　例：下記の一番下のやつ
// https://www.webcomponents.org/element/@polymer/paper-input/demo/demo/index.html


class EventView extends PolymerElement {
    static get template() {
      return html `

      <custom-style>
        <style is="custom-style">
          .indent { margin-left: 1em;   }
          .container { margin: 0.2em; }
          .collapse { width:100%; margin: 0.5em 0.3em 0.8em 0.3em;}
          paper-card { margin: 1em; }
          paper-card.white { --paper-card-header-color: #fff;  }
          paper-card.white { --paper-card-header-color: #fff;  }
          <!--// 効かない -->
          .title-text.over-image { background-color: #aaa;}
          .cafe-header { @apply --paper-font-headline; margin-bottom:0.5em;}
          .cafe-light { color: var(--paper-grey-600); }
          .cafe-location {
            float: right;
            font-size: 15px;
            vertical-align: middle;
          }
          .cafe-reserve { color: var(--google-blue-500); }
          .buddyup {position:absolute; float: right; margin-left:76%; margin-top:2em; z-index:10;}
          .buddyup-button {float:right; margin-left:2em; margin-right: 2em; background-color:#fff;}
          .buddyup-explain {font-size:8px; color:#fff; margin-top:4em;}
          .member-check { margin:0em; transform:scale(0.6); color:blue;}
          .member-no-check { margin:0em; transform:scale(0.6); color:#fa0;}
          .addMemberUserBtn { padding: 0.2em 0em 0.2em 0em; margin: 0em 0.2em 0em 0.2em;}
          .addMemberBtn { background-color:#aaf; vertical-align:bottom;}
          .newMemberLabel { margin-left: 1em; padding-left: 0.8em; display:block;}
          .newMemberInput { margin-left: 2em; margin-right: 2em; margin-top:0.1em; font-size:20px;
                            padding: 0.2em}
          .newMemberAddButton { display: block; margin-right: 1em; padding-top: 0.5em; padding-bottom: 0.5em; float: right;}
          .newMemberIronIcon { width:40px; height:40px; vertical-align:middle; margin: 0px 6px 0px 6px;}
          .newMemberFbIcon { width:30px; height:30px; vertical-align:middle; margin: 0px 12px 0px 12px;}
          .newMemberLinkCopy { float: right;}
          .invite-code { width: 228px; height: 38px;}

          .event-view-container { background-color: #ccc; }
          .event-place-link-a { text-decoration: none; color: #000; padding: 0.5em 1em 0.5em 1em;}
          .event-place-link { padding: 0.5em 1em 0.5em 0.5em; margin: 0.3em}
          .event-place-badget {vertical-align:middle; margin: 0.5em; font-size:12px;}

          .event-table-pre { @apply --layout-vertical; @apply --layout-wrap; width: 95%; margin:auto; }
          .event-table { box-sizing: boarder-box; width:46%; margin:1%; word-wrap: break-word; min-height:8em; }
          .event-table-header { }
          .event-table-title { margin: 0.3em; cursor: pointer;}
          .event-table-edit {  }
          .event-table-joinBtn { padding: 0.3em; float:right; background-color:#aaf; font-size:0.8em; }
          .event-table-member-name {  padding: 0.2em 0em 0.2em 0em; margin: 0em 0.2em 0em 0.2em; }
          .event-table-name-icon {  width:0.8em; height:0.8em; }
        </style>
      </custom-style>
      <div class="event-view-container">
        <div class="buddyup">
          <paper-button raised class="buddyup-button" id="buddyup_button" on-click="buddyup">参加する</paper-button>
          <div class="buddyup-explain" id="buddyup_explain">今は参加していません。</div>
        </div>
<!--        <paper-card image="images/donuts.png" heading="{{subject}}" class="white centered"> -->
        <paper-card image="https://scontent-nrt1-1.xx.fbcdn.net/v/t1.0-9/41951333_2257908294284605_8060807024998350848_o.jpg?_nc_cat=0&oh=e103d7dfd00406bafa5406d4b0dbd10f&oe=5C626A90" heading="{{subject}}" class="white centered">
          <div class="card-content">
            <div class="cafe-header">{{date}}
              <div class="cafe-location cafe-light" on-click="openMapToStation">
                <iron-icon icon="communication:location-on"></iron-icon>
                <span>{{station}}</span>
              </div>
            </div>
            <div class="event-members-container container">
              <span><b>参加者</b>　 　　○○な人たち</span>
              <iron-icon id="expand_members" icon="icons:expand-more" on-click="showMembers"></iron-icon>
              <iron-collapse id="collapse_members" class="collapse">
                <div class="indent">
                  <template is="dom-repeat" items="{{invitedMembers}}">
                    <paper-button raised on-click="openUserPage" class="addMemberUserBtn">
                      {{item.profile.displayName}}
                      <template is="dom-if" if="{{ item.isMember }}">
                        <iron-icon icon="icons:check-circle" class="member-check"></iron-icon>
                      </template>
                      <template is="dom-if" if="{{ !item.isMember }}">
                        <iron-icon icon="icons:help" class="member-no-check"></iron-icon>
                      </template>
                    </paper-button>
                  </template>
                  <paper-button raised on-click="addMember" class="addMemberUserBtn addMemberBtn">
                    <iron-icon id="add-member" icon="social:person-add"></iron-icon>追加
                  </paper-button>
                </div>
              </iron-collapse>
              <paper-dialog id="add_member">
                <h2>参加者を追加する</h2><!-- TODO:-->
                <div class="indent">
                  <iron-icon icon="icons:face" on-click="addMemberBuddyUp" class="newMemberIronIcon"></iron-icon>
                  <iron-icon icon="communication:mail-outline" on-click="addMemberMail" class="newMemberIronIcon"></iron-icon>
                  <iron-icon icon="icons:link" on-click="addMemberLink" class="newMemberIronIcon"></iron-icon>                  
                  <!-- <img src="images/fb_icon_325x325.png" class="newMemberFbIcon" on-click="addMemberFB"/>-->
                </div>
              </paper-dialog>
              <paper-dialog id="add_member_buddyup">
                <h2>参加者を追加する</h2><!-- TODO:-->
                  <label class="newMemberLabel">ID/名前:</label>
                  <input id="newMemberName" class="newMemberInput"> </input><br/>
                <paper-button on-click="" raised class="newMemberAddButton">追加</paper-button>
              </paper-dialog>
              <paper-dialog id="add_member_mail">
                <h2>参加者を追加する</h2><!-- TODO:-->
                  <!-- <paper-input label="name" value="{{newMemberName}}"></paper-input> -->
                  <label class="newMemberLabel">名前:</label>
                  <input id="newMemberName" class="newMemberInput"> </input><br/>
                  <!-- <paper-input label="email" value="{{newMemberMail}}"></paper-input> -->
                  <label class="newMemberLabel">メールアドレス：</label>
                  <input id="newMemberMail" class="newMemberInput"> </input><br/>
                <paper-button on-click="" raised class="newMemberAddButton">追加</paper-button>
              </paper-dialog>
              <paper-dialog id="add_member_link">
                <h2>参加者を追加する</h2>
                <div class="newMemberLabel">追加する参加者に下記URLを送信してください。</div>
                <div class="indent">
                  <paper-button raised on-click="addMemberLink_copy" class="newMemberLinkCopy">
                    <iron-icon icon="icons:content-copy"></iron-icon>
                  </paper-button>
                  <textarea id="add_member_link_inviteUrl" class="invite-code">http://buddyup.tokyo/invite/<invite-code></textarea>
                  <div id="add_member_link_copied">&nbsp;</div>
                </div>
              </paper-dialog>
              <paper-dialog id="add_member_facebook">
                <h2>参加者を追加する</h2>
                追加する参加者にFacebookで下記URLを送ってください。
              </paper-dialog>
            </div>


            <div class="event-place-container container">
              <span><b>場所</b>　　　　</span>
              {{place}} 
              <iron-icon id="expand_places" icon="icons:expand-more" on-click="showPlaces"></iron-icon>
              <iron-collapse id="collapse_places" class="collapse">
                <div class="indent">
                  <div id="placeComment">特に待ち合わせ等の伝言はありません。そのままお越しください。</div>
                    <!-- <a href="{{placeUrl}}" class="event-place-link-a">
                      <iron-icon icon="icons:home"></iron-icon>会場の紹介
                    </a>
                    <span on-click="openMapToPlace" class="event-place-link">
                      <iron-icon icon="communication:location-on"></iron-icon>Google Maps
                    </span>
                    -->
                  <paper-button raised on-click="openPlaceUrl" class="event-place-link">
                    <iron-icon icon="icons:home"></iron-icon>会場の紹介
                  </paper-button>
                  <paper-button raised on-click="openMapToPlace" class="event-place-link">
                    <iron-icon icon="communication:location-on"></iron-icon>Google Maps
                  </paper-button>
                  <span class="event-place-badget">予算: {{badget}}</span>
                </div>
              </iron-collapse>
            </div>


            <div class="event-agenda-container container">
              <span><b>アジェンダ</b>　</span>
              <iron-icon id="expand_agenda" icon="icons:expand-more" on-click="showAgenda"></iron-icon>
              <iron-collapse id="collapse_agenda" class="collapse">
                <template is="dom-repeat" items="{{agenda}}">
                  <div class="agenda-content">
                    <span class="indent">{{item.time}}</span>
                    <span class="indent">{{item.program}}</span>
                  </div>  
                </template>
              </iron-collapse>
            </div>
            <p class="cafe-light">
              {{catchPhrase}}
            </p>
          </div>


          <div class="card-actions">
            交流のテーブル <iron-icon id="add_table" icon="icons:add-box" on-click="addTable"></iron-icon>
          </div>
          <div style="@apply --layout-vertical; @apply --layout-wrap; width: 95%; margin:auto;">
            <template is="dom-repeat" items="{{tables}}" as="table">
              <paper-card style="box-sizing: border-box; width:46%; margin:1%; padding:2px; vertical-align: top; min-height:5em;">
                <paper-button class="event-table-joinBtn" on-click="onJoinTableBtn" data-tableidx$="{{index}}">参加する</paper-button>
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
            <h3>テーブル_{{this_table.name}}を削除してよいですか？</h3>
            <div class="indent">
              <paper-button raised on-click="deleteTable" data-tableidx="{{this_table}}">はい</paper-button>
              <paper-button raised on-click="deleteTableCancel">いいえ</paper-button>
            </div>
          </paper-dialog>
        </paper-card>
      </div>
    `;
    }

    // TODO: 交流のテーブルに参加ボタンをつける（板垣さんのページのやつ）
    // TODO:headingの背景を薄暗くする。

    constructor() {
        super();
        this.subject = "飲み会"
        this.date = "2018/9/20 19:00-20:30";
        this.taketime = "30min";
        this.station = "溜池山王駅";
        this.place = "古田屋　溜池山王店";
        this.placeUrl = "https://r.gnavi.co.jp/n5xyt2ts0000/";
        this.badget = "未定"
        this.invitedMembers = [{id:"member1",invited:true},{id:"member2"}]
        this.members = [{id:"member1"}]
        this.agenda = [
          {time: "19:00-19:10", program: "全体説明"}, 
          {time: "19:10-19:30", program: "自己紹介"}, 
          {time: "19:30-20:00", program: "テーマトーク"}, 
          {time: "20:00-20:30", program: "フリートーク"} 
        ]
        this.catchPhrase = "Small plates, salads & sandwiches in an intimate setting with 12 indoor seats plus patio seating."
        this.tables = [{name:"table1",members:[]},{name:"table2",members:[]}];
        // this.tables = [
        //   {id:"tableId1", name:"table1", members:[{id:"member1", displayName:"initName1"},{id:"member2", displayName:"シュリ"}]},
        //   {id:"tableId2", name:"table2", members:[{id:"member3", displayName:"小高"}]},
        //   {id:"tableId3", name:"table3", members:[]}
        // ];

        this.currentTable;
        this.currentEventMembers;

        let getEventPromise = new Promise((resolve1, reject1) => {
          this.getEvent(this, resolve1);
        }).then((snapshot) =>{
          this.initMembers(this, snapshot.invitedMembers);
        })
        window.this = this;
    }

    static get properties() {
        return {
            user: Object
        }
    }

    getEvent(self, resolve) {
        console.log( 'getMembers()' );
        this.parties = [];
        firebase.database().ref( 'events/' + this.eventid ).off( 'value' );
        firebase.database().ref( 'events/' + this.eventid ).once( 'value', snapshot => {
            let v = snapshot.val();
            this.subject = v.name;
            this.date = v.date.date + " " + v.date.timeFrom + "-" + v.date.timeTo;
            this.taketime = v.place.taketime;
            this.station = v.place.station;
            this.place = v.place.name;
            this.placeComment = v.place.comment || null;
            this.placeMapUrl = v.place.mapUrl || null;
            this.placeUrl = v.place.url;
            this.badget = "未定";
            this.members = v.members;
            // this.inviteMembersはinitMembersで更新
            // this.tablesはinitMembersで更新
            // メンバーをIDだけを管理するテーブル。こっちがDBと同期するマスター
            this.tableMembers = v.tables;

            // TODO: agendaのロード
            // this.agenda = v.agenda;
            // TODO: キャッチフレーズのロード
            // this.catchPrase = v.catchPrase;
            // this.invitedMembers = v.invitedMembers;
            resolve(v);
        } );
    }

    join( e ) {
        console.log( 'join()', e.target.dataset.uid );
        firebase.database().ref( `parties/${e.target.dataset.uid}/members/${this.user.uid}` ).set( { displayName: this.user.displayName } );
        this.getMembers();
    }

    cancel( e ) {
        console.log( 'cancel()', e.target.dataset.uid );
        firebase.database().ref( `parties/${e.target.dataset.uid}/members/${this.user.uid}` ).set( null );
        this.getMembers();
    }

    openMapToStation( e ){
      window.open("https://maps.google.co.jp/maps?q=" + this.station);
    }


    ///////////////////////////////////////////////////////////////////
    //
    // Members
    //
    //


    showMembers( e ) {
       this.$.expand_members.icon = this.$.collapse_members.opened ? 'expand-more' : 'expand-less';
       this.$.collapse_members.toggle();
    }
    initMembers(self, invitedMembers) {
      this.invitedMembers = [];

      Promise.all(invitedMembers.map(member => {
          return new Promise( resolve => {
            firebase.database().ref(`profiles/${member.id}`).on('value', (snapshot) => {
              let profile = snapshot.val();
              member.profile = profile;
              member.profile.id = member.id;
              member.displayName = profile.displayName;
              member.isMember = self.isMember(self, member.id);
              //this.invitedMembers.push(member);   // こっちだと更新されない
              this.push('invitedMembers', member);  // こっちだと更新される
              resolve();
            })
          })
      })).then( () => {
        this.initTables();
      });

    }
    getProfile(memberId){
      // 自分の時は自分のプロファイルから取る
      if(memberId === this.user.uid){
        var member = {
          displayName : this.user.displayName,
          id: this.user.uid
        }
        return member;
      }
      // 他人の時はinvitedMembersから取る
      var memberObj = this.invitedMembers.find(member => {
         return member.id === memberId;
      });
      return memberObj.profile;
    }

    isMember(self,memberId) {
      var isMember = false;
      self.members.forEach(function(member){
        if(member == memberId){
          isMember = true;
        }
      });
      return isMember;
    }

    addMember( e ) {
      this.$.add_member.open();
    }
    addMemberBuddyUp ( e ){
      this.$.add_member.close();      
      this.$.add_member_buddyup.open();      
    }
    addMemberMail ( e ){
      this.$.add_member.close();      
      this.$.add_member_mail.open();      
    }
    addMemberLink ( e ){
      this.$.add_member.close();
      // TODO:リアルなinviteCodeを用意する
      this.$.add_member_link_inviteUrl.innerText = "http://buddyup.tokyo/invite/<invite-code>";
      this.$.add_member_link.open();
      setTimeout(() => {
        this.$.add_member_link_inviteUrl.select();
      },1200);
    }
    addMemberLink_copy ( e ){
      // TODO:リアルなinviteCodeを用意する
      this.$.add_member_link_inviteUrl.innerText = "http://buddyup.tokyo/invite/<invite-code>";
      this.$.add_member_link_inviteUrl.select();
      document.execCommand('copy');
      this.$.add_member_link_copied.innerText = "　";
      setTimeout(() => {
        this.$.add_member_link_copied.innerText = "- コピーされました";
      },600);
    }


    ///////////////////////////////////////////////////////////////////
    //
    //  Places
    //
    //


    showPlaces( e ) {
       this.$.expand_places.icon = this.$.collapse_places.opened ? 'expand-more' : 'expand-less';
       this.$.collapse_places.toggle();
    }
    openPlaceUrl( e ){
      if(this.placeUrl){
        window.open(this.placeUrl);                
      }
    }
    openMapToPlace( e ){
      if(this.placeMapUrl){
        window.open(this.placeMapUrl);
      } else {
        window.open("https://maps.google.co.jp/maps?q=" + this.place);        
      }
    }


    ////////////////////////////////////////////////////////////////////
    //
    //  Agendas
    //
    //


    showAgenda( e ) {
       this.$.expand_agenda.icon = this.$.collapse_agenda.opened ? 'expand-more' : 'expand-less';
       this.$.collapse_agenda.toggle();
    }





    ///////////////////////////////////////////////////////////////////////////
    //
    //  Tables
    //
    //

    initTables(){
      // invitedMembersに保存されたプロファイルをtablesにも展開する
      for(let i=0; i<this.tableMembers.length; i++){
        let table = this.tableMembers[i];
        if(!table.members){ table.members = [];} 
        if(!table.name){ table.name = "table" + (i+1);}
        if(!this.tables[i]){ this.tables[i] = {};}
        this.tables[i].members = [];
        for(let j=0;j<table.members.length;j++){
          this.tables[i].members.push(this.getProfile(table.members[j]));
        }
        this.tables[i].name = this.tableMembers[i].name;
      }
      var tables = JSON.parse(JSON.stringify(this.tables));
      this.tables = tables;

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
        this.shadowRoot.querySelector(".event-table-joinBtn[data-tableidx='" + tableidx + "']").innerText = "退出する";
      } else {
        this.leaveTable(e.target.dataset.tableidx, this.user.uid);
        this.shadowRoot.querySelector(".event-table-joinBtn[data-tableidx='" + tableidx + "']").innerText = "参加する";
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


    ///////////////////////////////////////////////////////////////////////////
    //
    //  edit
    //
    //
    buddyup ( e ) {
      // TODO: useridの取得方法
      if (this.user.uid)
       this.$.buddyup_button.text = "今は参加しています"
       //this.
    }
}

window.customElements.define( 'event-view', EventView );



var imageUrls = [
  "https://scontent-nrt1-1.xx.fbcdn.net/v/t1.0-9/41951333_2257908294284605_8060807024998350848_o.jpg?_nc_cat=0&oh=e103d7dfd00406bafa5406d4b0dbd10f&oe=5C626A90"
]