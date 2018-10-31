import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';
import common from './event-common.js';

class EventMembersView extends PolymerElement {
  static get template() {
    return html `
      <style include="shared-styles">
        .indent { margin-left: 1em;   }
        .container { margin: 0.2em; }
        .collapse { width:100%; margin: 0.5em 0.3em 0.8em 0.3em;}
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
      </style>

      <div class="event-members-container container">
        <div>
          <span on-click="openEditCatchPhrase"><b>参加者</b>　 　　</span>
          <span id="memberTitle" on-click="openEditCatchPhrase">{{memberTitle}}</span>
          <!--  style="overflow-wrap:word-break; white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%" -->
          <iron-icon id="expand_members" icon="icons:expand-more" on-click="showMembers"></iron-icon>
        </div>
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
      `;
  }

  constructor() {
    super();
  }

  ready() {
    super.ready();
  }


  static get properties() {
      return {
          user: Object,
          //invitedMembers: Array
      }
  }


  showMembers( e ) {
     this.$.expand_members.icon = this.$.collapse_members.opened ? 'expand-more' : 'expand-less';
     this.$.collapse_members.toggle();
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


}

window.customElements.define( 'event-members-view', EventMembersView );
