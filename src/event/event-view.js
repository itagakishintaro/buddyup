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

import './event-members-view.js';
import './event-place-view.js';
import './event-agenda-view.js';
import './event-tables-view.js';

class EventView extends PolymerElement {
    static get template() {
      return html `

      <custom-style>
        <style is="custom-style">
          .indent { margin-left: 1em;   }
          .container { margin: 0.2em; }
          .collapse { width:100%; margin: 0.5em 0.3em 0.8em 0.3em;}
          paper-card { margin: 0.2em; }
          paper-card.white { --paper-card-header-color: #fff;  }
          paper-card.white { --paper-card-header-color: #fff;  }
          <!--// 効かない -->
          .title-text.over-image { background-color: #aaa;}

          .buddyup {position:absolute; float: right; margin-left:65%; margin-top:1em; z-index:10;}
          .buddyup-button {float:right; margin-left:2em; margin-right: 2em; background-color:#fff;}
          .buddyup-explain {font-size:8px; color:#fff; margin-top:4em;}

          .cafe-header { @apply --paper-font-headline; margin-bottom:0.5em;}
          .cafe-light { color: var(--paper-grey-600); }
          .cafe-location {
            float: right;
            font-size: 15px;
            vertical-align: middle;
          }
          .invite-code { width: 228px; height: 38px;}
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
            <div class="cafe-header">
              <span id="dateTitle" on-click="openEditDate">{{dateStr}}</span>
              <span id="dateTitleTimeFrom" on-click="openEditDate">{{date.timeFrom}}</span>-
              <span id="dateTitleTimeTo" on-click="openEditDate">{{date.timeTo}}</span>
              <div class="cafe-location cafe-light" on-click="openMapToStation">
                <iron-icon icon="communication:location-on"></iron-icon>
                <span>{{station}}</span>
              </div>
            </div>

            <event-members-view invitedMembers={{invitedMembers}} memberTitle={{memberTitle}}></event-members-view>
            <event-place-view place={{place}} placeComment={{placeComment}} budget={{budget}}></event-place-view>
            <event-agenda-view agenda={{agenda}} catchPhrase={{catchPhrase}}></event-agenda-view>
          </div>

          <event-tables-view tables={{tables}} tableMembers={{tableMembers}} initTables={{initTables}}></event-tables-view>

        <paper-dialog id="adminEditDate">
          <h3 class="adminEditTitle">開催日時</h3>
          <div class="adminEditContent">
            <input type="date" id="adminEditDate1"/>
            <input type="time" id="adminEditDateTimeFrom" min="6:00"/> - <input type="time" id="adminEditDateTimeTo"/>
          </div>
          <paper-button on-click="editDate">更新</paper-button><paper-button on-click="closeEditDate">キャンセル</paper-button>
        </paper-dialog>
        <paper-dialog id="adminEditPlace">
          <h3 class="adminEditTitle">開催場所</h3>
          <div class="adminEditContent">
            概要：<input type="text" id="adminEditPlace1"/><br/>
            説明：<input type="text" id="adminEditPlace2"/><br/>
            URL ：<input type="text" id="adminEditPlace3"/><br/>
            MAP ：<input type="text" id="adminEditPlace4"/><br/>
            最寄駅：<input type="text" id="adminEditPlace5"/><br/>
            予算：<input type="text" id="adminEditPlace6"/><br/>
          </div>
          <paper-button on-click="editPlace">更新</paper-button><paper-button on-click="closeEditPlace">キャンセル</paper-button>
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

      </div>
    `;
    }

    // TODO: 交流のテーブルに参加ボタンをつける（板垣さんのページのやつ）
    // TODO:headingの背景を薄暗くする。

    //////////////////////////////////////////////////////////////////////////////
    //
    // 管理者機能
    //
    //
    canEdit() {
      return this.isKanji() || this.isOpen();
    }
    isKanji() {
      return this.kanji.find(member => { return member === this.user.uid; });
    }
    isOpen() {
      return !this.private;
    }
    noPermission(){
      console.log("you are not kanji");
    }

    openEditDate( e ){
      if(!this.canEdit()) { this.noPermission(); return; }
      this.$.adminEditDate1.value = this.date.date;
      this.$.adminEditDateTimeFrom.value = this.date.timeFrom;
      this.$.adminEditDateTimeTo.value = this.date.timeTo;
      this.$.adminEditDate.open();
    }
    closeEditDate( e ){
      this.$.adminEditDate.close();
    }
    editDate(){
      this.date.date = this.$.adminEditDate1.value;
      this.date.timeFrom = this.$.adminEditDateTimeFrom.value;
      this.date.timeTo = this.$.adminEditDateTimeTo.value;

      this.shadowRoot.querySelector("#dateTitle").innerText = this.$.adminEditDate1.value.split("-").map(t=>Number(t)).join("/");
      this.shadowRoot.querySelector("#dateTitleTimeFrom").innerText = this.$.adminEditDateTimeFrom.value;
      this.shadowRoot.querySelector("#dateTitleTimeTo").innerText = this.$.adminEditDateTimeTo.value;
      firebase.database().ref( `events/${this.eventid}/date/` ).set( this.date );

      this.$.adminEditDate.close();
    }

    closeEditPlace( e ){
      this.$.adminEditPlace.close();
    }
    editPlace(){
      this.place = this.$.adminEditPlace1.value;
      this.placeComment = this.$.adminEditPlace2.value;
      this.placeUrl = this.$.adminEditPlace3.value;
      this.placeMapUrl = this.$.adminEditPlace4.value;
      this.station = this.$.adminEditPlace5.value;
      this.badget = this.$.adminEditPlace6.value;
      firebase.database().ref( `events/${this.eventid}/place/name` ).set( this.place );
      firebase.database().ref( `events/${this.eventid}/place/comment` ).set( this.placeComment );
      firebase.database().ref( `events/${this.eventid}/place/url` ).set( this.placeUrl );
      firebase.database().ref( `events/${this.eventid}/place/mapUrl` ).set( this.placeMapUrl );
      firebase.database().ref( `events/${this.eventid}/place/station` ).set( this.station );
      firebase.database().ref( `events/${this.eventid}/place/badget` ).set( this.badget );
      // TODO: お店の予約関係の話

      this.$.adminEditPlace.close();
    }

    closeEditAgenda( e ){
      this.$.adminEditAgenda.close();
    }
    editAgenda(){
      this.$.adminEditAgenda.close();

    }






    ///////////////////////////////////////////////////////////////////////////////
    //
    // 初期化
    //
    //



    constructor() {
        super();
        if(this.eventid == "new") {
          this.createPage();
          return;
        }
        this.kanji = [];
        this.subject = "飲み会";
        this.date = { date: this.get2WeekAfterDate(new Date()), timeFrom: "19:00", timeTo: "20:30"};
        this.taketime = "30min";
        this.station = "○○駅";
        this.place = "お店の名前";
        this.placeComment = "場所に入るための方法などを記載。無ければ、「特に待ち合わせ等の伝言はありません。そのままお越しください。」";
        this.placeUrl = "https://r.gnavi.co.jp/n5xyt2ts0000/";
        this.badget = "未定"
        this.memberTitle = "○○な人たち";
        this.invitedMembers = [{id:"member1",invited:true},{id:"member2"}];
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

    get2WeekAfterDate() {
      var dt = new Date();
      dt.setDate(dt.getDate() + 14)
      var y = dt.getFullYear();
      var m = ("00" + (dt.getMonth()+1)).slice(-2);
      var d = ("00" + dt.getDate()).slice(-2);
      var result = y + "-" + m + "-" + d;
      return result;
    }

    getEvent(self, resolve) {
        console.log( 'getMembers()' );
        this.parties = [];
        firebase.database().ref( 'events/' + this.eventid ).off( 'value' );
        firebase.database().ref( 'events/' + this.eventid ).once( 'value', snapshot => {
            let v = snapshot.val();
            this.kanji = v.kanji;
            this.subject = v.name;
            this.catchPhrase = v.catchPhrase;
            this.date = v.date;
            this.dateStr = v.date.date.split("-").map(t=>Number(t)).join("/");
            this.taketime = v.place.taketime;
            this.station = v.place.station;
            this.place = v.place.name;
            this.placeComment = v.place.comment || null;
            this.placeMapUrl = v.place.mapUrl || null;
            this.placeUrl = v.place.url;
            this.badget = "未定";
            this.memberTitle = v.memberTitle;
            this.members = v.members;
            // this.inviteMembersはinitMembersで更新
            // this.tablesはinitMembersで更新
            // メンバーをIDだけを管理するテーブル。こっちがDBと同期するマスター
            this.tableMembers = v.tables;

            // TODO: agendaのロード
            // this.agenda = v.agenda;
            resolve(v);
        } );
    }


    createPage ( e ) {
      this.kanji = [user.uid];
      this.subject = "飲み会";
      this.date =  { date: this.get2WeekAfterDate(new Date()), timeFrom: "19:00", timeTo: "20:30"};
      this.taketime = "30min";
      this.station = "○○駅";
      this.place = "お店の名前などを記載";
      this.placeComment = "場所に入るための方法などを記載。無ければ、お店のアピールなどをお書きください";
      this.placeUrl = "https://r.gnavi.co.jp/n5xyt2ts0000/";
      this.badget = "未定"
      this.memberTitle = "○○な人たち（中で追加してください）";
      this.invitedMembers = [];
      this.members = [{id:user.uid}]
      this.agenda = [
        {time: "19:00-19:10", program: "全体説明"},
        {time: "19:10-19:30", program: "自己紹介"},
        {time: "19:30-20:00", program: "テーマトーク"},
        {time: "20:00-20:30", program: "フリートーク"}
      ]
      this.catchPhrase = "この会にみんなを引き付けるためのキャッチフレーズをお書きください"
      this.tables = [{name:"table1",members:[]},{name:"table2",members:[]}];
      this.currentTable;
      this.currentEventMembers;

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

    isMember(self,memberId) {
      var isMember = false;
      var members = Object.keys(self.members).map( key => self.members[key] );
      members.forEach(function(member){
        if(member == memberId){
          isMember = true;
        }
      });
      return isMember;
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
      if(!memberObj){
        return {};
      }
      return memberObj.profile;
    }

    ///////////////////////////////////////////////////////////////////
    //
    //  Places
    //
    //





    ////////////////////////////////////////////////////////////////////
    //
    //  Agendas
    //
    //








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

      // テーブルへ退出か参加か、タイミング問題が起きるので対処
      for(let i=0; i<this.tableMembers.length; i++){
        let table = this.tableMembers[i];
        let shadowObj = this.shadowRoot.querySelector(".event-table-joinBtn[data-tableidx='" + i + "']");
        if(shadowObj){
          if(table.members.indexOf(this.user.uid) >= 0){ shadowObj.innerText = "退出する";}
          else { shadowObj.innerText = "参加する"; }
        }
      }

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
