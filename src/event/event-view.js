import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-collapse/iron-collapse.js';
//import '@polymer/paper-icon-button/paper-icon-button.js';
//import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
// paper-icon-buttonは2018/9/12 現在バグってて、iron-collapseと一緒に使えない。
// https://www.webcomponents.org/element/PolymerElements/iron-icons/demo/demo/index.html
// icons:add-box  icons:expand-less  icons:expand-more  icons:face
// maps:near-me   maps:person-pin  maps:place  maps:store-mall-directory

class EventView extends PolymerElement {
    static get template() {
      return html `

      <custom-style>
        <style is="custom-style">
          .indent { margin-left: 1em;   }
          .event-view-container { background-color: #ccc; }
          .event-place-link { text-decoration: none; color: #000;}
          .container { margin: 0.2em; }
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
          .buddyup {position:absolute; float: right; margin-left:80%; margin-top:2em; z-index:10;}
          .buddyup-button {float:right; margin-right: 2em;}
          .buddyup-explain {font-size:8px; color:#fff;}
        </style>
      </custom-style>
      <div class="event-view-container">
        <div class="buddyup">
          <button class="buddyup-button" id="buddyup_button" on-click="buddyup">参加する</button>
          <div class="buddyup-explain" id="buddyup_explain">今は参加していません。</div>
        </div>
<!--        <paper-card image="images/donuts.png" heading="{{subject}}" class="white centered"> -->
        <paper-card image="https://scontent-nrt1-1.xx.fbcdn.net/v/t1.0-9/41951333_2257908294284605_8060807024998350848_o.jpg?_nc_cat=0&oh=e103d7dfd00406bafa5406d4b0dbd10f&oe=5C626A90" heading="{{subject}}" class="white centered">
          <div class="card-content">
            <div class="cafe-header">{{date}}
              <div class="cafe-location cafe-light">
                <!--<iron-icon icon="communication:location-on"></iron-icon>-->
                <span>{{station}}</span>
              </div>
            </div>
            <div class="event-members-container container">
              <span><b>参加者</b>　 　　○○な人たち</span>
              <iron-icon id="expand_members" icon="icons:expand-more" on-click="showMembers"></iron-icon>
              <iron-collapse id="collapse_members" style="width:100%;">
                <div class="indent">
                  <template is="dom-repeat" items="{{invitedMembers}}">
                    {{item.id}}
                    {{item.profile.displayName}}
                    <template is="dom-if" if="{{ item.isMember }}">
                      (参加)
                    </template>
                  </template>
                  <iron-icon id="add-member" icon="icons:add-box" on-click="addMember">追加する</iron-icon>
                </div>
              </iron-collapse>
            </div>
            <div class="event-place-container container">
              <span><b>場所</b>　　　　</span>
              {{place}} 
              <iron-icon id="expand_places" icon="icons:expand-more" on-click="showPlaces"></iron-icon>
              <iron-collapse id="collapse_places" style="width:100%;">
              <a href="{{placeUrl}}" class="event-place-link">
                <iron-icon icon="icons:home"></iron-icon>
              </a>
              </iron-collapse>
            </div>
            <div class="event-agenda-container container">
              <span><b>アジェンダ</b>　</span>
              <iron-icon id="expand_agenda" icon="icons:expand-more" on-click="showAgenda"></iron-icon>
              <iron-collapse id="collapse_agenda" style="width:100%;">
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
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <i class="material-icons dp48">home</i>
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
          firebase.database().ref(`profiles/member1`).on('value', (snapshot) => {
            let profile = snapshot.val();
            member.profile = profile;
            member.displayName = profile.displayName;
            this.push('invitedMembers', member);
            // this.notifyPath('invitedMembers.displayName');
            console.log(member);
            console.log(this.invitedMembers);
          })
//        member.isMember = self.isMember(self, member.id);

      })

    }

    isMember(self,memberId) {
      var isMember = false;
      self.members.forEach(function(member){
        if(member.id == memberId){
          isMember = true;
        }
      });
      return isMember;
    }

    showPlaces( e ) {
       this.$.expand_places.icon = this.$.collapse_places.opened ? 'expand-more' : 'expand-less';
       this.$.collapse_places.toggle();
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