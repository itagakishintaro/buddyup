import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import SKILLS from "./util/Skills.js";
import "./shared-styles.js";
import "./loading-view.js";
import "./users/users-buddyup-view.js";
import "./users/buddyup-gimmick.js";
import "./util/user-photo.js";
import "./util/expand-icon.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/iron-collapse/iron-collapse.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";

class UsersView extends PolymerElement {
  static get template() {
    return html`
        <style include="shared-styles">
          .on {
            margin-bottom: 1em;
          }

          .user {
            margin-bottom: .5em;
          }
          .username {
            color: var(--paper-blue-500);
          }

          .skill {
            margin-bottom: 1em;
          }

          .dialog {
            padding-bottom: 2em;
          }
        </style>

        <div class="container">
          <p>名前をタッチするとその人のデータを最新にします。ワードをタッチすると関連するコメントが表示されます。</p>
          <paper-button raised class="on" on-click="getUsers">ユーザー一覧を表示</paper-button>

          <paper-dialog id="dialog" class="dialog">
            <template is="dom-repeat" items="{{relatedComments}}">
              <div>{{item}}</div>
            </template>
          </paper-dialog>

          <comments-dialog comments={{relatedComments}}></comments-dialog>

          <buddyup-gimmick skill={{gimmickSkill}} active={{gimmickActive[gimmickSkill]}}></buddyup-gimmick>

          <!-- 自分 -->
          <div class="user">
            <template is="dom-if" if="{{user.uid}}">
                <user-photo user={{user}}></user-photo>
                <span on-click="showSkills" data-uid$="{{user.uid}}" data-photo$="{{user.photoURL}}" data-name$="{{user.displayName}}" class="username">{{user.displayName}}</span>
                <!-- skills -->
                <div class="skill" data-uid$="{{user.uid}}">
                    <template is="dom-repeat" items="{{ user.skills }}">
                        <span class="tag" on-click="showComments" data-uid$="{{item}}">{{item}}</span>
                    </template>
                </div>
            </template>
          </div>

          <!-- Buddyup候補 -->
          <users-buddyup-view candidates={{candidates}} user={{user}}></users-buddyup-view>

          <hr>
          <div on-click="toggleFriends">
            <span>知り合い<span>
            <expand-icon opened={{friendsOpened}}></expand-icon>
          </div>
          <iron-collapse id="friends">
            <div class="collapse-content">
              <template is="dom-repeat" items="{{friends}}">
                <div class="user">
                  <user-photo user={{item}}></user-photo>
                  <span on-click="showSkills" data-uid$="{{item.uid}}" data-photo$="{{item.photoURL}}" data-name$="{{item.displayName}}" class="username">{{item.displayName}}</span>
                  <!-- skills -->
                  <div class="skill" data-uid$="{{item.uid}}">
                      <template is="dom-repeat" items="{{ item.skills }}">
                          <span class="tag" on-click="showComments">{{item}}</span>
                      </template>
                  </div>
                </div>
              </template>
            </div>
          </iron-collapse>

          <hr>
          <div on-click="toggleOthers">
            <span>その他のユーザー<span>
            <expand-icon opened={{othersOpened}}></expand-icon>
          </div>
          <iron-collapse id="others">
            <div class="collapse-content">
              <template is="dom-repeat" items="{{others}}">
                <div class="user">
                  <user-photo user={{item}}></user-photo>
                  <span on-click="showSkills" data-uid$="{{item.uid}}" data-photo$="{{item.photoURL}}" data-name$="{{item.displayName}}" class="username">{{item.displayName}}</span>
                  <!-- skills -->
                  <div class="skill" data-uid$="{{item.uid}}">
                      <template is="dom-repeat" items="{{ item.skills }}">
                          <span class="tag" on-click="showComments">{{item}}</span>
                      </template>
                  </div>
                </div>
              </template>
            </div>
          </iron-collapse>

          <paper-toast id="toast" text="{{toastText}}"></paper-toast>
        </div>

        <loading-view display="{{loadingDisplay}}"></loading-view>
        `;
  }

  constructor() {
    super();
    this.user = {};
    this.buddyups = {};
    this.friendUIDs = [];
    this.friends = [];
    this.others = [];
    this.loadingDisplay = "none";
    this.target = {};
    this.toastText = "更新しました!";
    this.candidates = [];
    this.gimmickActive = {};
  }

  ready() {
    super.ready();
    this.$.friends.opened = true;
    this.friendsOpened = this.$.friends.opened;
    this.othersOpened = this.$.others.opened;
    this.getUsers();
  }

  static get properties() {
    return { user: Object };
  }

  getUsers() {
    let getProfilesPromise = new Promise((resolve, reject) => {
      this._getProfiles(resolve, reject);
    });

    let getFriendsPromise = new Promise((resolve, reject) => {
      this._getFriends(resolve, reject);
    });

    getProfilesPromise.then(() => {
      getFriendsPromise.then(() => {
        this._getOthers();
        this.setBuddyupCandidates(this.user.skills);
      });
    });
  }

  // Profilesを取得する
  _getProfiles(resolve, reject) {
    firebase
      .database()
      .ref("profiles/")
      .once("value")
      .then(snapshot => {
        this.profiles = snapshot.val();
        resolve();
      });
  }

  // 知り合い(friend)の定義はpartyに一緒に参加した人
  _getFriends(resolve, reject) {
    this.loadingDisplay = "block";
    firebase
      .database()
      .ref("parties/")
      .once("value")
      .then(snapshot => {
        let parties = snapshot.val();
        let friendUIDs = [];
        Object.keys(parties).forEach(key => {
          if (
            parties[key].members &&
            Object.keys(parties[key].members).includes(this.user.uid)
          ) {
            // 自分が含まれているなら
            friendUIDs = friendUIDs.concat(Object.keys(parties[key].members));
          }
        });
        friendUIDs = friendUIDs.filter((x, i, self) => self.indexOf(x) === i); // 重複排除
        friendUIDs = friendUIDs.filter(x => x !== this.user.uid); // 自分を削除

        this.friendUIDs = friendUIDs;
        this.friends = this.friendUIDs.map(key => {
          let v = this.profiles[key];
          v.uid = key;
          return v;
        });
      })
      .finally(() => {
        resolve();
        this.loadingDisplay = "none";
      });
  }

  _getOthers() {
    this.loadingDisplay = "block";
    this.others = Object.keys(this.profiles)
      .filter(key => key !== this.user.uid && !this.friendUIDs.includes(key)) // 自分でも知り合いでもない
      .map(key => {
        let v = this.profiles[key];
        v.uid = key;
        return v;
      });

    this.loadingDisplay = "none";
  }

  showSkills(e) {
    this.skills = [];
    this.target.uid = e.target.dataset.uid;
    this.getSkills();
  }

  showComments(e) {
    this.target.skill = e.target.innerText;

    if (this.target.uid !== e.target.parentNode.dataset.uid) {
      this.target.uid = e.target.parentNode.dataset.uid;

      this._getCommentsText().then(() => {
        this.relatedComments = this.comments
          .map(c => c.text.toLowerCase())
          .filter(text => text.indexOf(this.target.skill) >= 0);
        this.$.dialog.open();
      });
    } else {
      this.relatedComments = this.comments
        .map(c => c.text.toLowerCase())
        .filter(text => text.indexOf(this.target.skill) >= 0);
      this.$.dialog.open();
    }
  }

  getSkills() {
    this.loadingDisplay = "block";
    this._getCommentsText()
      .then(text => this._callNLPSyntax(text))
      .then(tokens => this._extractSkills(tokens))
      .then(skills => {
        if (this.target.uid === this.user.uid) {
          this.user.skills = skills;
          this.notifyPath("user.skills");
        } else if (this.friendUIDs.includes(this.target.uid)) {
          this.friends.forEach((o, i) => {
            if (o.uid === this.target.uid) {
              this.friends[i].skills = skills;
              this.notifyPath("friends." + i + ".skills");
            }
          });
        } else {
          this.others.forEach((o, i) => {
            if (o.uid === this.target.uid) {
              this.others[i].skills = skills;
              this.notifyPath("others." + i + ".skills");
            }
          });
        }
        if (skills) {
          this.toastText = "更新しました！";
          firebase
            .database()
            .ref("profiles/" + this.target.uid + "/skills")
            .set(skills);
          this.setBuddyupCandidates(skills);
        } else {
          this.toastText =
            "現在のワードリストに一致するコメントがみつかりませんでした。";
        }
      })
      .finally(() => {
        this.$.toast.open();
        this.loadingDisplay = "none";
      });
  }

  _getCommentsText() {
    return firebase
      .database()
      .ref("comments/" + this.target.uid)
      .once("value")
      .then(snapshot => {
        if (!snapshot.val()) {
          return;
        }
        this.comments = Object.keys(snapshot.val())
          .map(key => snapshot.val()[key]) // Objectから配列に
          .filter(comment => comment.text); // 空のコメントを削除
        let text = "";
        this.comments.forEach(c => {
          text = text + "\n" + c.text.toLowerCase();
        });
        return text;
      });
  }

  _callNLPSyntax(text) {
    if (!text) {
      return;
    }
    const url =
      "https://us-central1-buddyup-204005.cloudfunctions.net/NLP-syntax";
    let data = {
      message: text
    };
    return fetch(url, {
      body: JSON.stringify(data),
      method: "POST"
    })
      .then(response => response.json())
      .then(json => json[0].tokens);
  }

  _extractSkills(tokens) {
    if (!tokens) {
      return;
    }
    let nouns = tokens
      .filter(v => ["NOUN", "X"].includes(v.partOfSpeech.tag)) // 名詞とその他のみにフィルター
      .map(v => v.lemma) // 語幹を抽出（英語のときの活用などが原型になる）
      .filter(x => x.length > 1) // 1文字を排除
      .filter((x, i, self) => self.indexOf(x) === i); // 重複排除
    return nouns.filter(v => SKILLS.includes(v));
  }

  setBuddyupCandidates(skills) {
    let users = []
      .concat(this.friends)
      .concat(this.others)
      .concat(this.user);
    skills.forEach(skill => {
      let sameSkillUsers = users.filter(
        u => u.skills && u.skills.includes(skill)
      );
      if (sameSkillUsers.length >= 3) {
        // 自分を含めて3人になれば候補
        let num = this.candidates.push({ skill, buddies: sameSkillUsers });
        // 誰かがBuddyupしたときの処理
        this._buddyupEventHandler(skill, num - 1);
      }
    });
  }

  _buddyupEventHandler(skill, index) {
    firebase
      .database()
      .ref("buddies/" + skill)
      .on("value", snapshot => {
        let candidateBuddies = this.candidates[index].buddies;
        // Buddyがいないとき
        if (!snapshot.val()) {
          candidateBuddies = candidateBuddies.map((candidate, no) => {
            candidate.buddyupTime = null;
            this.notifyPath("candidates." + index + ".buddies." + no);
            this.notifyPath(
              "candidates." + index + ".buddies." + no + ".buddyupTime"
            );
            return candidate;
          });
          return;
        }
        // このスキルのBuddyのbuddyupTimeを設定
        candidateBuddies = candidateBuddies.map(candidate => {
          candidate.buddyupTime = null;
          return candidate;
        });
        let buddies = Object.keys(snapshot.val()).map(key => {
          let buddy = Object.assign({}, this.profiles[key]); // プロファイルを汚染しないように値渡し
          buddy.uid = key;
          buddy.buddyupTime = snapshot.val()[key].buddyupTime;
          return buddy;
        });

        // このスキルのBuddy候補（target）にBuddyになっている人がいたら、Buddy情報で更新
        let target = this.candidates.filter(v => v.skill === skill)[0];
        target.buddies = target.buddies.map(buddyCandidate => {
          let newBuddy = buddyCandidate;
          // Buddyがいる場合は更新
          buddies.forEach(buddy => {
            if (buddyCandidate.uid === buddy.uid) {
              newBuddy = buddy;
            }
          });
          return newBuddy;
        });

        let newCandidates = this.candidates.map(candidate => {
          // このスキルのBuddy候補を更新
          if (candidate.skill === skill) {
            return target;
          }
          return candidate;
        });

        this.set("candidates", newCandidates);
        candidateBuddies.forEach((v, no) => {
          this.notifyPath("candidates." + index + ".buddies." + no);
          this.notifyPath(
            "candidates." + index + ".buddies." + no + ".buddyupTime"
          );
        });

        console.log(this.candidates);
        let number = this.candidates[index].buddies.filter(candidate => {
          // 60分以内ならOK
          return (
            Date.now() - new Date(candidate.buddyupTime).getTime() < 3600000
          );
        }).length;
        console.log("number", number);
        if (number >= 3) {
          this._openBuddyupGimmick(skill);
        }
      });
  }

  _openBuddyupGimmick(skill) {
    // 連続しておきたときのために、1秒のwaitをとる
    setTimeout(() => {
      this.gimmickSkill = skill;
      this.gimmickActive[skill] = true;
    }, 1000);
  }

  toggleFriends() {
    this.$.friends.toggle();
    this.friendsOpened = this.$.friends.opened;
  }

  toggleOthers() {
    this.$.others.toggle();
    this.othersOpened = this.$.others.opened;
  }
}

window.customElements.define("users-view", UsersView);
