import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-collapse/iron-collapse.js';
//import '@polymer/paper-icon-button/paper-icon-button.js';
// paper-icon-buttonは2018/9/12 現在バグってて、iron-collapseと一緒に使えない。
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/communication-icons.js';
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
                    {{item.profile.displayName}}
                    <template is="dom-if" if="{{ item.isMember }}">
                      <iron-icon icon="icons:check-circle" class="member-check"></iron-icon>
                    </template>
                    <template is="dom-if" if="{{ !item.isMember }}">
                      <iron-icon icon="icons:help" class="member-check"></iron-icon>
                    </template>
                    ,
                  </template>
                  new
                  <iron-icon id="add-member" icon="icons:add-box" on-click="addMember"></iron-icon>
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
              Small plates, salads &amp; sandwiches in an intimate setting with 12 indoor seats plus patio seating.
            </p>
          </div>
          <div class="card-actions">
            <p>交流のテーブル</p>
            <div class="horizontal justified">
              <paper-icon-button icon="icons:event"></paper-icon-button>
              <paper-button>5:30PM</paper-button>
              <paper-button>7:30PM</paper-button>
              <paper-button>9:00PM</paper-button>
            </div>
            <paper-button class="cafe-reserve">Reserve</paper-button>
          </div>
        </paper-card>
      </div>
    `;
    }

    // TODO: 交流のテーブルに参加ボタンをつける（板垣さんのページのやつ）
    // TODO: 交流のテーブルを２段表示にする
    // TODO:headingの背景を薄暗くする。

    constructor() {
        super();
        this.subject = "飲み会"
        this.date = "2018/9/20 19:00-20:30";
        this.taketime = "30min";
        this.station = "溜池山王駅";
        this.place = "古田屋　溜池山王店";
        this.placeUrl = "https://r.gnavi.co.jp/n5xyt2ts0000/";
        // 予算もあるといい
        this.invitedMembers = [{id:"member1",invited:true},{id:"member2"}]
        this.members = [{id:"member1"}]
        // this.agenda = `<div class="event-program" data-program="1"><span>19:00-19:10</span>&nbsp;<span>全体説明</span></div>
        //     <div class="event-program" data-program="2"><span>19:10-19:30</span>&nbsp;<span>自己紹介</span></div>
        //     <div class="event-program" data-program="3"><span>19:30-20:00</span>&nbsp;<span>テーマトーク</span></div>
        //     <div class="event-program" data-program="4"><span>20:00-20:30</span>&nbsp;<span>フリートーク</span></div>
        //     `
        this.agendaSummary = "全体説明、自己紹介、テーマトーク..."
        this.agenda = [
          {time: "19:00-19:10", program: "全体説明"}, 
          {time: "19:10-19:30", program: "自己紹介"}, 
          {time: "19:30-20:00", program: "テーマトーク"}, 
          {time: "20:00-20:30", program: "フリートーク"} 
        ]
        let getEventPromise = new Promise((resolve, reject) => {
          this.getEvent(this, resolve);
        }).then((invitedMembers) =>{
          this.initMembers(this, invitedMembers);          
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
            // 予算もあるといい
            // this.invitedMembers = v.invitedMembers;
            this.members = v.members;
            // this.agenda = v.agenda;
            resolve(v.invitedMembers);
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

    showMembers( e ) {
       this.$.expand_members.icon = this.$.collapse_members.opened ? 'expand-more' : 'expand-less';
       this.$.collapse_members.toggle();
    }
    initMembers(self, invitedMembers) {
      this.invitedMembers = [];
      // console.log('===', this.invitedMembers);
      // setTimeout( () => {
      //   console.log(this.invitedMembers);
      // },10000);
//       self.invitedMembers.forEach((member) => {
// //         firebase.database().ref(`profiles/${member.id}`).once('value',function(snapshot){
//           //TODO: profileを入れたことで、参加者の名前を見えるようにする
//           // 1.profileをthis.profileに転記する
//           // 2.profileの内容をtemplateに書き込む
//          firebase.database().ref(`profiles/member1`).on('value', (snapshot) => {
            
//            let profile = snapshot.val();
//            member.profile = profile;

//            console.log(this.invitedMembers);
//          })
//          member.isMember = self.isMember(self, member.id);
//       })

      invitedMembers.forEach(member => {
          firebase.database().ref(`profiles/${member.id}`).on('value', (snapshot) => {
            let profile = snapshot.val();
            member.profile = profile;
            member.displayName = profile.displayName;
            this.push('invitedMembers', member);
            // this.notifyPath('invitedMembers.displayName');
            console.log(member);
            console.log(this.invitedMembers);
          })
          member.isMember = self.isMember(self, member.id);

      })

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


    showAgenda( e ) {
       this.$.expand_agenda.icon = this.$.collapse_agenda.opened ? 'expand-more' : 'expand-less';
       this.$.collapse_agenda.toggle();
    }


    buddyup ( e ) {
      // TODO: useridの取得方法
      if (userid)
       this.$.buddyup_button.text = "今は参加しています"
       //this.
    }
}

window.customElements.define( 'event-view', EventView );



var imageUrls = [
  "https://scontent-nrt1-1.xx.fbcdn.net/v/t1.0-9/41951333_2257908294284605_8060807024998350848_o.jpg?_nc_cat=0&oh=e103d7dfd00406bafa5406d4b0dbd10f&oe=5C626A90"
]